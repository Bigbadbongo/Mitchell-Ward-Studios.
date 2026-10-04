import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useUI } from "./UIContext";
import { MainCollection, SubGallery } from "../types";

const FALLBACK_ARTWORKS: any[] = [];

export const DEFAULT_PAINTINGS_COLLECTIONS: MainCollection[] = [
  {
    id: "col-paintings-studio",
    name: "Studio Pieces",
    subGalleries: [
      { id: "sub-p-mini", name: "Mini Canvases" },
      { id: "sub-p-studio", name: "Studio Pieces" },
      { id: "sub-p-statement", name: "Statement Pieces" }
    ]
  }
];

export const DEFAULT_PHOTOGRAPHY_COLLECTIONS: MainCollection[] = [
  {
    id: "col-photo-india",
    name: "India",
    subGalleries: [
      { id: "sub-ph-mumbai", name: "Mumbai" },
      { id: "sub-ph-cochin", name: "Cochin" }
    ]
  },
  {
    id: "col-photo-uk",
    name: "UK",
    subGalleries: [
      { id: "sub-ph-landscapes", name: "Nature & Landscapes" },
      { id: "sub-ph-culture", name: "Urban & Culture" }
    ]
  },
  {
    id: "col-photo-studio",
    name: "Studio Pieces",
    subGalleries: [
      { id: "sub-ph-curated", name: "Studio Selections" }
    ]
  }
];

function normalizeRawCollections(
  raw: any,
  legacyFlatList?: string[],
  fallbackDefault?: MainCollection[]
): MainCollection[] {
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((item: any, idx: number) => {
      const colId = item.id || `col_${idx}_${Date.now()}`;
      const colName = typeof item === "string" ? item : (item.name || `Collection ${idx + 1}`);
      const rawSubs = Array.isArray(item.subGalleries) ? item.subGalleries : [];
      const subGalleries: SubGallery[] = rawSubs.map((sub: any, sIdx: number) => {
        if (typeof sub === "string") {
          return { id: `sub_${sIdx}_${sub.toLowerCase().replace(/\s+/g, "_")}`, name: sub };
        }
        return {
          id: sub.id || `sub_${sIdx}_${Date.now()}`,
          name: sub.name || `Sub-Gallery ${sIdx + 1}`
        };
      });
      return { id: colId, name: colName, subGalleries };
    });
  }

  if (Array.isArray(legacyFlatList) && legacyFlatList.length > 0) {
    return [
      {
        id: "col_default_legacy",
        name: "Studio Pieces",
        subGalleries: legacyFlatList.map((name, sIdx) => ({
          id: `sub_${sIdx}_${name.toLowerCase().replace(/\s+/g, "_")}`,
          name
        }))
      }
    ];
  }

  return fallbackDefault || [];
}

interface InventoryContextType {
  inventory: any[];
  setInventory: React.Dispatch<React.SetStateAction<any[]>>;
  paintingsCollections: MainCollection[];
  setPaintingsCollections: React.Dispatch<React.SetStateAction<MainCollection[]>>;
  photographyCollections: MainCollection[];
  setPhotographyCollections: React.Dispatch<React.SetStateAction<MainCollection[]>>;
  activeCollections: MainCollection[];
  activeSubGalleries: SubGallery[];
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
  studioInstagram: string;
  setStudioInstagram: React.Dispatch<React.SetStateAction<string>>;
  studioWebsite: string;
  setStudioWebsite: React.Dispatch<React.SetStateAction<string>>;
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
  const { activeCategory, selectedMainCollection, selectedSubCategory } = useUI();

  const [inventory, setInventory] = useState(FALLBACK_ARTWORKS);
  const [paintingsCollections, setPaintingsCollections] = useState<MainCollection[]>(DEFAULT_PAINTINGS_COLLECTIONS);
  const [photographyCollections, setPhotographyCollections] = useState<MainCollection[]>(DEFAULT_PHOTOGRAPHY_COLLECTIONS);

  // Backward compatibility legacy array state
  const [legacyPaintCats, setLegacyPaintCats] = useState<string[]>(["Mini Canvases", "Studio Pieces", "Statement Pieces"]);
  const [legacyPhotoCats, setLegacyPhotoCats] = useState<string[]>(["Nature & Landscapes", "Urban & Culture", "Studio Selections"]);

  const [photoPrices, setPhotoPrices] = useState({ "A4 Print": 30, "A3 Print": 45, "A2 Print": 55, "A1 Print": 85, "Digital Download": 15 });
  const [localPrices, setLocalPrices] = useState(photoPrices);

  const [studioBio, setStudioBio] = useState("Welcome to my digital gallery. I specialise in dynamic, high-energy acrylic canvases and curated archival photography. Every piece is handled and shipped directly from my studio to ensure absolute quality.");
  const [studioEmail, setStudioEmail] = useState("mitchellwardstudios@gmail.com");
  const [studioInstagram, setStudioInstagram] = useState("");
  const [studioWebsite, setStudioWebsite] = useState("");

  const [shippingConfig, setShippingConfig] = useState({
    small: { maxSize: 50, price: 15 },
    medium: { maxSize: 100, price: 35 },
    large: { maxSize: 150, price: 75 },
    oversized: { price: 150 },
    photographyFlatRate: 5.95
  });
  
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Derive flat sub-gallery names for backwards compatibility
  const paintCats = useMemo(() => {
    const list = Array.from(new Set(paintingsCollections.flatMap(c => c.subGalleries.map(s => s.name))));
    return list.length > 0 ? list : legacyPaintCats;
  }, [paintingsCollections, legacyPaintCats]);

  const photoCats = useMemo(() => {
    const list = Array.from(new Set(photographyCollections.flatMap(c => c.subGalleries.map(s => s.name))));
    return list.length > 0 ? list : legacyPhotoCats;
  }, [photographyCollections, legacyPhotoCats]);

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
        let mainColName = data.mainCollection;

        if (typeof data.catIndex === "number" || !subcatName) {
          const idx = Number(data.catIndex) || 0;
          subcatName = data.category === "Photography" ? (photoCats[idx] || "General") : (paintCats[idx] || "General");
        }

        // If mainCollection is not stored explicitly, find which top collection contains this subcategory
        if (!mainColName) {
          const searchCols = data.category === "Photography" ? photographyCollections : paintingsCollections;
          const matched = searchCols.find(c => c.subGalleries.some(s => s.name === subcatName));
          mainColName = matched ? matched.name : (searchCols[0]?.name || "Studio Pieces");
        }

        return { 
          id: docSnap.id, 
          ...data, 
          mainCollection: mainColName,
          subcategory: subcatName, 
          isSold: data.isSold || false, 
          isVaulted: data.isVaulted || false
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
        if (data.paintingsCollections) {
          setPaintingsCollections(normalizeRawCollections(data.paintingsCollections, data.paintCats, DEFAULT_PAINTINGS_COLLECTIONS));
        } else if (data.paintCats) {
          setPaintingsCollections(normalizeRawCollections(null, data.paintCats, DEFAULT_PAINTINGS_COLLECTIONS));
        }

        if (data.photographyCollections) {
          setPhotographyCollections(normalizeRawCollections(data.photographyCollections, data.photoCats, DEFAULT_PHOTOGRAPHY_COLLECTIONS));
        } else if (data.photoCats) {
          setPhotographyCollections(normalizeRawCollections(null, data.photoCats, DEFAULT_PHOTOGRAPHY_COLLECTIONS));
        }

        if (data.paintCats) setLegacyPaintCats(data.paintCats);
        if (data.photoCats) setLegacyPhotoCats(data.photoCats);

        if (data.photoPrices) {
          setPhotoPrices(data.photoPrices);
          setLocalPrices(data.photoPrices);
        }
        if (data.bio) setStudioBio(data.bio);
        if (data.email) setStudioEmail(data.email);
        if (data.instagram) setStudioInstagram(data.instagram);
        if (data.website) setStudioWebsite(data.website);
        if (data.shippingConfig) setShippingConfig(data.shippingConfig);
      }
      
      if (!settingsLoaded) {
        settingsLoaded = true;
        checkLoading();
      }
    });

    return () => { unsubscribeArt(); unsubscribeSettings(); unsubscribeCustomers(); };
  }, [paintCats, photoCats]);

  const activeCollections = useMemo(() => {
    return activeCategory === "Paintings" ? paintingsCollections : photographyCollections;
  }, [activeCategory, paintingsCollections, photographyCollections]);

  const activeSubGalleries = useMemo(() => {
    if (!selectedMainCollection) return [];
    const col = activeCollections.find(c => c.name === selectedMainCollection);
    return col ? col.subGalleries : [];
  }, [activeCollections, selectedMainCollection]);

  const currentActiveFolderList = activeCategory === "Paintings" ? paintCats : photoCats;

  const filteredArtworks = useMemo(() => {
    return inventory.filter(art => {
      if (art.category !== activeCategory) return false;
      if (art.category === "Photography" && art.isVaulted) return false;

      if (selectedMainCollection) {
        const matchesCol = art.mainCollection === selectedMainCollection;
        // Also check if art's subcategory is in selected main collection
        const colObj = activeCollections.find(c => c.name === selectedMainCollection);
        const subInCol = colObj?.subGalleries.some(s => s.name === art.subcategory);
        if (!matchesCol && !subInCol) return false;
      }

      if (selectedSubCategory) {
        if (art.subcategory !== selectedSubCategory) return false;
      }

      return true;
    });
  }, [inventory, activeCategory, selectedMainCollection, selectedSubCategory, activeCollections]);

  const adminFilteredArtworks = useMemo(() => {
    return inventory.filter(art => {
      if (art.category !== activeCategory) return false;
      if (selectedMainCollection) {
        const matchesCol = art.mainCollection === selectedMainCollection;
        const colObj = activeCollections.find(c => c.name === selectedMainCollection);
        const subInCol = colObj?.subGalleries.some(s => s.name === art.subcategory);
        if (!matchesCol && !subInCol) return false;
      }
      if (selectedSubCategory) {
        if (art.subcategory !== selectedSubCategory) return false;
      }
      return true;
    });
  }, [inventory, activeCategory, selectedMainCollection, selectedSubCategory, activeCollections]);

  const adminListToRender = useMemo(() => {
    if (selectedSubCategory === "Unassigned") {
      const allKnownSubs = new Set(activeCollections.flatMap(c => c.subGalleries.map(s => s.name)));
      return inventory.filter(art => {
        if (art.category !== activeCategory) return false;
        return (
          !art.mainCollection ||
          art.mainCollection === "Unassigned" ||
          !art.subcategory ||
          art.subcategory === "Unassigned" ||
          !allKnownSubs.has(art.subcategory)
        );
      });
    }
    return adminFilteredArtworks;
  }, [inventory, activeCategory, selectedSubCategory, activeCollections, adminFilteredArtworks]);

  return (
    <InventoryContext.Provider value={{
      inventory, setInventory,
      paintingsCollections, setPaintingsCollections,
      photographyCollections, setPhotographyCollections,
      activeCollections,
      activeSubGalleries,
      paintCats, setPaintCats: setLegacyPaintCats,
      photoCats, setPhotoCats: setLegacyPhotoCats,
      photoPrices, setPhotoPrices,
      localPrices, setLocalPrices,
      studioBio, setStudioBio,
      studioEmail, setStudioEmail,
      studioInstagram, setStudioInstagram,
      studioWebsite, setStudioWebsite,
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
