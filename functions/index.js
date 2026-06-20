const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.createStripeCheckoutSession = functions.https.onCall(async (request) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  try {
    // In firebase-functions v2, the payload is inside request.data
    const data = request.data || {};
    const { orderId, customerName, customerEmail, customerAddress, basket, basketSubtotal, basketShipping } = data;

    // Verify basket is not empty
    if (!basket || basket.length === 0) {
      throw new functions.https.HttpsError('invalid-argument', 'Basket is empty.');
    }

    // Map basket to Stripe line items
    const lineItems = basket.map(item => {
      // Create a description that includes size and frame details
      const description = [
        item.category,
        item.size,
        item.chosenFrame && item.chosenFrame !== 'None' ? `Frame: ${item.chosenFrame}` : null
      ].filter(Boolean).join(' | ');

      return {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.title,
            description: description,
            images: item.src ? [item.src] : [],
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects amounts in pennies (integers)
        },
        quantity: 1,
      };
    });

    // Add shipping as a separate line item if applicable
    if (basketShipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Flat Rate Shipping',
            description: 'Delivery to your address',
          },
          unit_amount: Math.round(basketShipping * 100),
        },
        quantity: 1,
      });
    }

    // Determine success and cancel URLs based on the origin
    const appUrl = "https://mitchellwardstudios.com";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'link'], // 'link' supports Apple Pay/Google Pay via Stripe
      customer_email: customerEmail !== "No Email Provided" ? customerEmail : undefined,
      line_items: lineItems,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA', 'AU', 'FR', 'DE', 'IE', 'NZ'],
      },
      billing_address_collection: 'required',
      success_url: `${appUrl}/?checkout=success&order_id=${orderId}`,
      cancel_url: `${appUrl}/?checkout=cancelled`,
      metadata: {
        orderId: orderId,
        customerName: customerName,
        customerAddress: customerAddress,
      }
    });

    // We do NOT mark the order as paid here. We wait for the webhook to confirm payment.
    return { url: session.url, sessionId: session.id };
  } catch (error) {
    console.error("Stripe Session Creation Error:", error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Webhook to listen for successful payments
exports.stripeWebhookHandler = functions.https.onRequest(async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    if (orderId) {
      try {
        // Mark the order as paid in Firestore
        const orderRef = db.collection('orders').doc(orderId);
        const orderDoc = await orderRef.get();

        if (orderDoc.exists) {
          const customerDetails = session.customer_details;
          let formattedAddress = "No Address Provided";
          let customerName = "Guest";
          let customerEmail = "No Email Provided";

          if (customerDetails) {
            customerName = customerDetails.name || "Guest";
            customerEmail = customerDetails.email || "No Email Provided";
            
            if (customerDetails.address) {
              const { line1, line2, city, state, postal_code, country } = customerDetails.address;
              formattedAddress = [line1, line2, city, state, postal_code, country].filter(Boolean).join(", ");
            }
          }

          // Update the order with real customer data from Stripe
          await orderRef.update({ 
            status: 'paid',
            stripeSessionId: session.id,
            paidAt: admin.firestore.FieldValue.serverTimestamp(),
            customerName: customerName,
            customerEmail: customerEmail,
            customerAddress: formattedAddress
          });

          // Update or create the customer record
          if (customerEmail !== "No Email Provided") {
            const orderData = orderDoc.data();
            const orderTotal = orderData.total || 0;
            
            const customerRef = db.collection('customers').doc(customerEmail.toLowerCase());
            await customerRef.set({
              name: customerName,
              email: customerEmail.toLowerCase(),
              address: formattedAddress,
              lastOrderDate: admin.firestore.FieldValue.serverTimestamp(),
              totalSpend: admin.firestore.FieldValue.increment(orderTotal)
            }, { merge: true });
          }

          // Also update the artwork statuses to sold
          const orderData = orderDoc.data();
          if (orderData.items) {
            for (const item of orderData.items) {
              if (item.category !== "Photography") {
                const artRef = db.collection('artworks').doc(item.id);
                await artRef.update({ isSold: true });
              }
            }
          }
          console.log(`Successfully processed payment for order: ${orderId}`);
        }
      } catch (error) {
        console.error("Error updating database after webhook:", error);
      }
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({received: true});
});
