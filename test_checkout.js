import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyDBrcxxRu3PMk_2NM8XEqC9GBtLrHrcBns",
  authDomain: "mitchell-ward-studios.firebaseapp.com",
  projectId: "mitchell-ward-studios",
  storageBucket: "mitchell-ward-studios.firebasestorage.app",
  messagingSenderId: "326050299607",
  appId: "1:326050299607:web:bb8885cda9ba3b9ca3c93d",
  measurementId: "G-FMWQ8THT76"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app, 'us-central1');
const createCheckout = httpsCallable(functions, 'createStripeCheckoutSession');

async function test() {
  try {
    const res = await createCheckout({
      orderId: "test-order-1",
      customerName: "Guest",
      customerEmail: "No Email Provided",
      customerAddress: "Test Address",
      basket: [{
        id: "test",
        title: "Test Art",
        price: 100,
        category: "Paintings",
        size: "Medium"
      }],
      basketSubtotal: 100,
      basketShipping: 0
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
