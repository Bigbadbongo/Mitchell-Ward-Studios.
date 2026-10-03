import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, setDoc, increment } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { Browser } from "@capacitor/browser";
import { db, functions } from "../firebase";
import { useUI } from "./UIContext";
import { useAuth } from "./AuthContext";

interface CartContextType {
  basket: any[];
  setBasket: React.Dispatch<React.SetStateAction<any[]>>;
  basketSubtotal: number;
  basketShipping: number;
  handleAddToBasket: (
    selectedArtwork: any,
    photoPrices: any,
    photoSize: string,
    shippingConfig: any,
    chosenFrame: string,
    includeDigitalCopy?: boolean
  ) => void;
  removeFromBasket: (cartId: number) => void;
  handleCheckout: (checkoutData?: any) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { setIsBasketOpen, triggerToast } = useUI();
  const { userName, userEmail, userAddress } = useAuth();

  const [basket, setBasket] = useState<any[]>(() => {
    const saved = localStorage.getItem("studio_basket");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("studio_basket", JSON.stringify(basket));
  }, [basket]);

  const handleAddToBasket = (
    selectedArtwork: any,
    photoPrices: any,
    photoSize: string,
    shippingConfig: any,
    chosenFrame: string,
    includeDigitalCopy: boolean = false
  ) => {
    if (!selectedArtwork) return;

    const isDigitalStandalone = photoSize === "Digital Download";
    const basePrice = selectedArtwork.category === "Photography" ? photoPrices[photoSize] : selectedArtwork.price;
    const activeSize = selectedArtwork.category === "Photography" ? photoSize : selectedArtwork.size;
    
    // Add-on price (if buying a print and adding the digital file)
    const addonPrice = includeDigitalCopy ? 10 : 0;
    const finalPrice = basePrice + addonPrice;

    let shippingCost = 0;
    if (isDigitalStandalone) {
      shippingCost = 0;
    } else if (selectedArtwork.category === "Photography") {
      shippingCost = shippingConfig.photographyFlatRate || 5.95; 
    } else {
      // ... paintings logic
      let maxDim = 50;
      try {
        const sizeStr = String(selectedArtwork.size || "").toLowerCase().replace(/\s+/g, '');
        const matches = [...sizeStr.matchAll(/([\d.]+)/g)];
        if (matches.length > 0) {
           const nums = matches.map(m => parseFloat(m[0]));
           maxDim = Math.max(...nums);
           if (sizeStr.includes('m') && !sizeStr.includes('cm') && !sizeStr.includes('mm')) {
             maxDim = maxDim * 100;
           }
        }
      } catch (err) {}
      
      const smallMax = shippingConfig.small?.maxSize || 50;
      const mediumMax = shippingConfig.medium?.maxSize || 100;
      const largeMax = shippingConfig.large?.maxSize || 150;

      if (maxDim <= smallMax) shippingCost = shippingConfig.small?.price || 15;
      else if (maxDim <= mediumMax) shippingCost = shippingConfig.medium?.price || 35;
      else if (maxDim <= largeMax) shippingCost = shippingConfig.large?.price || 75;
      else shippingCost = shippingConfig.oversized?.price || 150;
    }

    setBasket([...basket, {
      ...selectedArtwork,
      price: finalPrice,
      size: activeSize,
      frame: chosenFrame,
      cartId: Date.now(),
      shippingCost,
      includeDigitalCopy: includeDigitalCopy || isDigitalStandalone
    }]);
    setIsBasketOpen(true);
  };

  const removeFromBasket = (cartId: number) => {
    setBasket(basket.filter(item => item.cartId !== cartId));
  };

  const basketSubtotal = basket.reduce((sum, item) => sum + item.price, 0);
  const basketShipping = basket.reduce((sum, item) => sum + (item.shippingCost || 0), 0);

  const generateOrderId = () => {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `MWS-${yyyy}${mm}${dd}-${randomChars}`;
  };

  const handleCheckout = async (checkoutData: any = null) => {
    if (basket.length === 0) return;
    
    const finalName = checkoutData?.name || userName || "Guest";
    const finalEmail = checkoutData?.email || userEmail || "No Email Provided";
    const finalAddress = checkoutData?.address || userAddress || "No Address Provided";

    const orderId = generateOrderId();
    const customerProfileId = finalEmail !== "No Email Provided" ? finalEmail.toLowerCase() : `guest_${Date.now()}`;

    const orderData = {
      orderId,
      customerProfileId,
      customerName: finalName,
      customerEmail: finalEmail,
      customerAddress: finalAddress,
      items: basket.map(item => ({
        id: item.id,
        title: item.title,
        size: item.size,
        price: item.price,
        shipping: item.shippingCost,
        category: item.category,
        includeDigitalCopy: item.includeDigitalCopy || false
      })),
      subtotal: basketSubtotal,
      shipping: basketShipping,
      total: basketSubtotal + basketShipping,
      date: new Date().toISOString(),
      status: "pending"
    };

    try {
      await setDoc(doc(db, "orders", orderId), orderData);
      
      // Update global sales ledger collection
      await setDoc(doc(db, "sales_ledger", orderId), {
        orderId,
        customerProfileId,
        totalAmount: basketSubtotal + basketShipping,
        date: orderData.date,
        status: "pending",
        itemCount: basket.length
      });
      
      if (finalEmail !== "No Email Provided") {
        await setDoc(doc(db, "customers", finalEmail.toLowerCase()), {
          name: finalName,
          email: finalEmail.toLowerCase(),
          address: finalAddress,
          lastOrderDate: new Date().toISOString(),
          totalSpend: increment(basketSubtotal + basketShipping)
        }, { merge: true });
        
        if (checkoutData?.subscribe) {
          await setDoc(doc(db, "newsletter", finalEmail.toLowerCase()), {
            email: finalEmail.toLowerCase(),
            subscribedAt: new Date().toISOString()
          }, { merge: true });
        }
      }

      triggerToast("Redirecting to Secure Checkout...");
      
      const createCheckout = httpsCallable(functions, 'createStripeCheckoutSession');
      const result = await createCheckout({
        orderId,
        customerName: finalName,
        customerEmail: finalEmail,
        customerAddress: finalAddress,
        basket: basket,
        basketSubtotal,
        basketShipping
      });

      const { url } = result.data as any;
      if (url) {
        if (typeof window !== 'undefined' && (window as any).Capacitor) {
          await Browser.open({ url });
        } else {
          window.location.href = url;
        }
      }
      
    } catch (err) {
      console.error("Checkout failed:", err);
      triggerToast("Checkout failed. Please try again.");
    }
  };

  return (
    <CartContext.Provider value={{
      basket, setBasket,
      basketSubtotal, basketShipping,
      handleAddToBasket, removeFromBasket, handleCheckout
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
