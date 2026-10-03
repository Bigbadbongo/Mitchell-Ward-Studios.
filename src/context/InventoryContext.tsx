import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useUI } from "./UIContext";

const FALLBACK_ARTWORKS: any[] = [];

interface InventoryContextType {
  inventory: any[];
  setInventory: React.Dispatch<React.SetStateAction<any[]>>;
  paintCats: string[];
  setPaintCats: React.Dispatch<React.SetStateAction<string[]>>;
  photoCats: string[];
  setPhotoCats: React.Dispatch<React.SetStateAction<string[]>>;
  photoPrices: any;
  setPhotoPrices: React.Dispatch<React.SetStateAction<any>>;
  localPrices: any;
  setLocalPrices: React.Dispatch<React.SetStateAction<any>>;
  studioBio: string;
  setStudioBio: React.Dispatch<React.SetStateAction<string>>;
  studioEmail: string;
  setStudioEmail: React.Dispatch<React.SetStateAction<string>>;
  shippingConfig: any;
  setShippingConfig: React.Dispatch<React.SetStateAction<any>>;
  customersList: any[];
  setCustomersList: React.Dispatch<React.SetStateAction<any[]>>;
  currentActiveFolderList: string[];
  filteredArtworks: any[];
  adminFilteredArtworks: any[];
  adminListToRender: any[];
  isLoading: boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const { activeCategory, selectedSubCategory } = useUI();

  const [inventory, setInventory] = useState(FALLBACK_ARTWORKS);
  const [paintCats, setPaintCats] = useState(["Mini Canvases", "Studio Pieces", "Statement Pieces"]);
  const [photoCats, setPhotoCats] = useState(["Nature & Landscapes", "Urban & Culture", "Studio Selections"]);
  const [photoPrices, setPhotoPrices] = useState({ "A4 Print": 30, "A3 Print": 45, "A2 Print": 55, "A1 Print": 85, "Digital Download": 15 });
  
  const [localPrices, setLocalPrices] = useState(photoPrices);

  const [studioBio, setStudioBio] = useState("Welcome to my digital gallery. I specialise in dynamic, high-energy acrylic canvases and curated archival photography. Every piece is handled and shipped directly from my studio to ensure absolute quality.");
  const [studioEmail, setStudioEmail] = useState("mitchellwardstudios@gmail.com");

  const [shippingConfig, setShippingConfig] = useState({
    small: { maxSize: 50, price: 15 },
    medium: { maxSize: 100, price: 35 },
    large: { maxSize: 150, price: 75 },
    oversized: { price: 150 },
    photographyFlatRate: 5.95
  });
  
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let artLoaded = false;
    let settingsLoaded = false;

    const checkLoading = () => {
      if (artLoaded && settingsLoaded) setIsLoading(false);
    };

    const unsubscribeArt = onSnapshot(collection(db, "artworks"), (snapshot) => {
      const artList = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        let subcatName = data.subcategory;
        if (typeof data.catIndex === "number" || !subcatName) {
          const idx = Number(data.catIndex) || 0;
          subcatName = data.category === "Photography" ? photoCats[idx] : paintCats[idx];
        }
        return { 
          id: docSnap.id, ...data, subcategory: subcatName, isSold: data.isSold || false, isVaulted: data.isVaulted || false
        };
      });
      if (artList.length > 0) setInventory(artList);
      
      if (!artLoaded) {
        artLoaded = true;
        checkLoading();
      }
    });

    const unsubscribeCustomers = onSnapshot(collection(db, "customers"), (snapshot) => {
      const customers = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setCustomersList(customers);
    });

    const unsubscribeSettings = onSnapshot(doc(db, "settings", "studio_config"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.paintCats) setPaintCats(data.paintCats);
        if (data.photoCats) setPhotoCats(data.photoCats);
        if (data.photoPrices) {
          setPhotoPrices(data.photoPrices);
          setLocalPrices(data.photoPrices);
        }
        if (data.bio) setStudioBio(data.bio);
        if (data.email) setStudioEmail(data.email);
        if (data.shippingConfig) setShippingConfig(data.shippingConfig);
      }
      
      if (!settingsLoaded) {
        settingsLoaded = true;
        checkLoading();
      }
    });

    return () => { unsubscribeArt(); unsubscribeSettings(); unsubscribeCustomers(); };
  }, []);

  const currentActiveFolderList = activeCategory === "Paintings" ? paintCats : photoCats;

  const filteredArtworks = useMemo(() => {
    return inventory.filter(art => art.category === activeCategory && art.subcategory === selectedSubCategory && (art.category === "Paintings" || !art.isVaulted));
  }, [inventory, activeCategory, selectedSubCategory]);

  const adminFilteredArtworks = useMemo(() => {
    return inventory.filter(art => art.category === activeCategory && art.subcategory === selectedSubCategory);
  }, [inventory, activeCategory, selectedSubCategory]);

  const adminListToRender = useMemo(() => {
    if (selectedSubCategory === "Unassigned") {
      return inventory.filter(art => art.category === activeCategory && !currentActiveFolderList.includes(art.subcategory));
    }
    return adminFilteredArtworks;
  }, [inventory, activeCategory, selectedSubCategory, currentActiveFolderList, adminFilteredArtworks]);

  return (
    <InventoryContext.Provider value={{
      inventory, setInventory,
      paintCats, setPaintCats,
      photoCats, setPhotoCats,
      photoPrices, setPhotoPrices,
      localPrices, setLocalPrices,
      studioBio, setStudioBio,
      studioEmail, setStudioEmail,
      shippingConfig, setShippingConfig,
      customersList, setCustomersList,
      currentActiveFolderList,
      filteredArtworks,
      adminFilteredArtworks,
      adminListToRender,
      isLoading
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
