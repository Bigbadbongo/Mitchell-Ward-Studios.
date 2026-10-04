import { useState, useEffect } from "react";
import { Share } from "@capacitor/share";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";
import { moveArtworkLocationService, toggleArtworkStatusService, deleteArtworkService } from "../services/firebase/inventoryService";
import { 
  updateCategoryListService, 
  batchUpdateArtworkSubcategoryService, 
  updateStudioInfoService, 
  updatePhotoPricesService, 
  updateShippingConfigService,
  saveTwoTierCollectionsService,
  batchUpdateArtworksService
} from "../services/firebase/settingsService";
import { uploadArtworkService } from "../services/firebase/uploadService";
import { MainCollection } from "../types";

export default function useStudioEngine() {
  const [editFolder, setEditFolder] = useState<any>(null); 
  const [newFolders, setNewFolders] = useState({ Paintings: "", Photography: "" });

  const {
    menuState, setMenuState,
    isBasketOpen, setIsBasketOpen,
    isAccountOpen, setIsAccountOpen,
    isStudioPanelOpen, setIsStudioPanelOpen,
    isAdminSettingsOpen, setIsAdminSettingsOpen,
    showPinPrompt, setShowPinPrompt,
    clickCount, setClickCount,
    toastMessage, triggerToast,
    activeCategory, setActiveCategory,
    selectedMainCollection, setSelectedMainCollection,
    selectedSubCategory, setSelectedSubCategory
  } = useUI();

  const {
    isAdmin, setIsAdmin,
    authEmail, setAuthEmail,
    authPassword, setAuthPassword,
    authError, setAuthError,
    userName, setUserName,
    userEmail, setUserEmail,
    userAddress, setUserAddress,
    adminSignIn, adminBiometricLogin, adminSignOut,
    saveUserProfile, deleteUserProfile
  } = useAuth();


  const {
    inventory, setInventory,
    paintingsCollections, setPaintingsCollections,
    photographyCollections, setPhotographyCollections,
    activeCollections,
    activeSubGalleries,
    paintCats, setPaintCats,
    photoCats, setPhotoCats,
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
  } = useInventory();
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [chosenFrame, setChosenFrame] = useState("None");
  const {
    basket, setBasket,
    basketSubtotal, basketShipping,
    removeFromBasket, handleCheckout,
    handleAddToBasket: cartHandleAddToBasket
  } = useCart();
  const [photoSize, setPhotoSize] = useState("A3 Print");

  // Removed local UI state for drawers (handled by UIContext)
  const [adminSelectedArt, setAdminSelectedArt] = useState(null);
  const [isCurating, setIsCurating] = useState(false);
  const [curationNotes, setCurationNotes] = useState<string | null>(null);

  const handleSelectArtwork = (art: any) => {
    setCurationNotes(null);
    setSelectedArtwork(art);
  };

  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState("Paintings");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadPrice, setUploadPrice] = useState("");
  const [uploadMainCollection, setUploadMainCollection] = useState("");
  const [uploadCatName, setUploadCatName] = useState("");
  const [uploadWidth, setUploadWidth] = useState("");
  const [uploadHeight, setUploadHeight] = useState("");
  const [uploadUnit, setUploadUnit] = useState("cm");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPrintFile, setSelectedPrintFile] = useState(null);
  const [selectedSecondaryFile, setSelectedSecondaryFile] = useState(null);
  const [uploadingToCloud, setUploadingToCloud] = useState(false);


  // 1. Handle Stripe Checkout Return Query Parameters (?checkout=success / ?checkout=cancelled)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const checkoutStatus = urlParams.get("checkout");
    if (checkoutStatus === "success") {
      const orderId = urlParams.get("order_id");
      setBasket([]);
      localStorage.removeItem("studio_basket");
      triggerToast(orderId ? `Order #${orderId} confirmed! Thank you.` : "Order successfully placed! Thank you.");
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (checkoutStatus === "cancelled") {
      triggerToast("Checkout was cancelled.");
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  // 2. Handle Smart Share Artwork Deep Links (?art=ID)
  useEffect(() => {
    if (typeof window === "undefined" || inventory.length === 0) return;
    const urlParams = new URLSearchParams(window.location.search);
    const artId = urlParams.get("art");
    if (artId) {
      const targetArt = inventory.find(a => a.id === artId);
      if (targetArt) {
        setSelectedArtwork(targetArt);
        setMenuState("detail");
        if (targetArt.category === "Photography") setPhotoSize("A3 Print");
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, [inventory]);

  // --- DYNAMIC TWO-TIER COLLECTION OPERATIONS ---

  const handleAddMainCollection = async (category: "Paintings" | "Photography", name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const currentList = category === "Paintings" ? paintingsCollections : photographyCollections;
    if (currentList.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      alert(`A collection named "${trimmed}" already exists.`);
      return;
    }
    const newCol: MainCollection = {
      id: `col_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: trimmed,
      subGalleries: []
    };
    const updatedList = [...currentList, newCol];
    if (category === "Paintings") {
      setPaintingsCollections(updatedList);
    } else {
      setPhotographyCollections(updatedList);
    }
    await saveTwoTierCollectionsService(category, updatedList);
    triggerToast(`Created collection "${trimmed}"`);
  };

  const handleRenameMainCollection = async (
    category: "Paintings" | "Photography",
    collectionId: string,
    oldName: string,
    newName: string
  ) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;
    const currentList = category === "Paintings" ? paintingsCollections : photographyCollections;
    if (currentList.some(c => c.id !== collectionId && c.name.toLowerCase() === trimmed.toLowerCase())) {
      alert(`A collection named "${trimmed}" already exists.`);
      return;
    }

    const updatedList = currentList.map(c => c.id === collectionId ? { ...c, name: trimmed } : c);
    if (category === "Paintings") {
      setPaintingsCollections(updatedList);
    } else {
      setPhotographyCollections(updatedList);
    }

    await saveTwoTierCollectionsService(category, updatedList);

    const affectedArts = inventory.filter(art => art.category === category && art.mainCollection === oldName);
    if (affectedArts.length > 0) {
      await batchUpdateArtworksService(affectedArts.map(art => ({ id: art.id, changes: { mainCollection: trimmed } })));
    }
    triggerToast(`Renamed collection to "${trimmed}"`);
  };

  const handleDeleteMainCollection = async (
    category: "Paintings" | "Photography",
    collectionId: string,
    name: string
  ) => {
    if (!window.confirm(`Delete collection "${name}" and all its sub-galleries?\n\nNote: Artworks inside will NOT be deleted, but will become "Unassigned".`)) {
      return;
    }
    const currentList = category === "Paintings" ? paintingsCollections : photographyCollections;
    const updatedList = currentList.filter(c => c.id !== collectionId);
    if (category === "Paintings") {
      setPaintingsCollections(updatedList);
    } else {
      setPhotographyCollections(updatedList);
    }

    await saveTwoTierCollectionsService(category, updatedList);

    const affectedArts = inventory.filter(art => art.category === category && art.mainCollection === name);
    if (affectedArts.length > 0) {
      await batchUpdateArtworksService(affectedArts.map(art => ({
        id: art.id,
        changes: { mainCollection: "Unassigned", subcategory: "Unassigned" }
      })));
    }
    triggerToast(`Deleted collection "${name}"`);
  };

  const handleAddSubGallery = async (
    category: "Paintings" | "Photography",
    collectionId: string,
    subName: string
  ) => {
    const trimmed = subName.trim();
    if (!trimmed) return;
    const currentList = category === "Paintings" ? paintingsCollections : photographyCollections;
    const targetCol = currentList.find(c => c.id === collectionId);
    if (!targetCol) return;

    if (targetCol.subGalleries.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      alert(`A sub-gallery named "${trimmed}" already exists in ${targetCol.name}.`);
      return;
    }

    const updatedList = currentList.map(c => {
      if (c.id !== collectionId) return c;
      return {
        ...c,
        subGalleries: [
          ...c.subGalleries,
          { id: `sub_${Date.now()}_${Math.random().toString(36).substring(7)}`, name: trimmed }
        ]
      };
    });

    if (category === "Paintings") {
      setPaintingsCollections(updatedList);
    } else {
      setPhotographyCollections(updatedList);
    }

    await saveTwoTierCollectionsService(category, updatedList);
    triggerToast(`Added sub-gallery "${trimmed}"`);
  };

  const handleRenameSubGallery = async (
    category: "Paintings" | "Photography",
    collectionId: string,
    subId: string,
    oldSubName: string,
    newSubName: string
  ) => {
    const trimmed = newSubName.trim();
    if (!trimmed || trimmed === oldSubName) return;
    const currentList = category === "Paintings" ? paintingsCollections : photographyCollections;
    const targetCol = currentList.find(c => c.id === collectionId);
    if (!targetCol) return;

    if (targetCol.subGalleries.some(s => s.id !== subId && s.name.toLowerCase() === trimmed.toLowerCase())) {
      alert(`A sub-gallery named "${trimmed}" already exists in ${targetCol.name}.`);
      return;
    }

    const updatedList = currentList.map(c => {
      if (c.id !== collectionId) return c;
      return {
        ...c,
        subGalleries: c.subGalleries.map(s => s.id === subId ? { ...s, name: trimmed } : s)
      };
    });

    if (category === "Paintings") {
      setPaintingsCollections(updatedList);
    } else {
      setPhotographyCollections(updatedList);
    }

    await saveTwoTierCollectionsService(category, updatedList);

    const affectedArts = inventory.filter(art => 
      art.category === category && 
      (art.mainCollection === targetCol.name || !art.mainCollection) && 
      art.subcategory === oldSubName
    );
    if (affectedArts.length > 0) {
      await batchUpdateArtworksService(affectedArts.map(art => ({
        id: art.id,
        changes: { subcategory: trimmed }
      })));
    }
    triggerToast(`Renamed sub-gallery to "${trimmed}"`);
  };

  const handleDeleteSubGallery = async (
    category: "Paintings" | "Photography",
    collectionId: string,
    subId: string,
    subName: string
  ) => {
    if (!window.confirm(`Delete sub-gallery "${subName}"?\n\nNote: Artworks inside will NOT be deleted, but will become "Unassigned".`)) {
      return;
    }
    const currentList = category === "Paintings" ? paintingsCollections : photographyCollections;
    const targetCol = currentList.find(c => c.id === collectionId);
    if (!targetCol) return;

    const updatedList = currentList.map(c => {
      if (c.id !== collectionId) return c;
      return {
        ...c,
        subGalleries: c.subGalleries.filter(s => s.id !== subId)
      };
    });

    if (category === "Paintings") {
      setPaintingsCollections(updatedList);
    } else {
      setPhotographyCollections(updatedList);
    }

    await saveTwoTierCollectionsService(category, updatedList);

    const affectedArts = inventory.filter(art => 
      art.category === category && 
      art.subcategory === subName
    );
    if (affectedArts.length > 0) {
      await batchUpdateArtworksService(affectedArts.map(art => ({
        id: art.id,
        changes: { subcategory: "Unassigned" }
      })));
    }
    triggerToast(`Deleted sub-gallery "${subName}"`);
  };

  // Backward compatibility handlers
  const handleSaveRename = async () => {
    if (!editFolder || !editFolder.newName.trim() || editFolder.newName === editFolder.oldName) {
      setEditFolder(null);
      return;
    }
    const isPaint = editFolder.catType === "Paintings";
    const currentList = isPaint ? paintCats : photoCats;
    const updatedList = currentList.map(c => c === editFolder.oldName ? editFolder.newName.trim() : c);
    
    if (isPaint) setPaintCats(updatedList); else setPhotoCats(updatedList);
    
    const catToSave = editFolder.catType;
    const oldNameToSave = editFolder.oldName;
    const newNameToSave = editFolder.newName.trim();
    
    setEditFolder(null);
    
    await updateCategoryListService(isPaint, updatedList);
    
    const artworksToMove = inventory.filter(art => art.category === catToSave && art.subcategory === oldNameToSave);
    await batchUpdateArtworkSubcategoryService(artworksToMove, newNameToSave);
  };

  const handleAddCollectionInline = async (category: string) => {
    const newName = (newFolders as any)[category];
    if (!newName || newName.trim() === "") return;
    await handleAddMainCollection(category as "Paintings" | "Photography", newName.trim());
    setNewFolders({ ...newFolders, [category]: "" });
  };

  const handleDeleteCollection = async (category: string, name: string) => {
    const currentList = category === "Paintings" ? paintingsCollections : photographyCollections;
    const targetCol = currentList.find(c => c.name === name);
    if (targetCol) {
      await handleDeleteMainCollection(category as "Paintings" | "Photography", targetCol.id, name);
    } else {
      if (window.confirm("Delete folder \"" + name + "\"? \n\nNote: Artworks inside will NOT be deleted, but will become \"Unassigned\".")) {
        const isPaint = category === "Paintings";
        const flatList = isPaint ? paintCats : photoCats;
        const updatedList = flatList.filter(c => c !== name);
        if (isPaint) setPaintCats(updatedList); else setPhotoCats(updatedList);
        await updateCategoryListService(isPaint, updatedList);
      }
    }
  };

  const saveStudioInfo = async () => {
    await updateStudioInfoService(studioBio, studioEmail, studioInstagram, studioWebsite);
  };

  const handlePriceUpdate = async (updatedPrices: any) => {
    try {
      await updatePhotoPricesService(updatedPrices);
      triggerToast("Prices updated");
    } catch (err) {
      console.error(err);
    }
  };

  const handleShippingUpdate = async (updatedConfig: any) => {
    try {
      setShippingConfig(updatedConfig);
      await updateShippingConfigService(updatedConfig);
      triggerToast("Shipping rules updated");
    } catch (err) {
      console.error(err);
    }
  };

  const moveArtworkLocation = async (artworkId: string, newCollection: string, newSubcategory: string) => {
    await moveArtworkLocationService(artworkId, newCollection, newSubcategory);
    if (adminSelectedArt && adminSelectedArt.id === artworkId) {
      setAdminSelectedArt({ ...adminSelectedArt, mainCollection: newCollection, subcategory: newSubcategory });
    }
    triggerToast(`Moved artwork to ${newCollection} / ${newSubcategory}`);
  };

  const toggleStatus = async (id, type) => {
    const currentItem = inventory.find(item => item.id === id);
    if (!currentItem) return;

    await toggleArtworkStatusService(id, type, currentItem.isSold, currentItem.isVaulted);

    if (type === 'sold') {
      if (selectedArtwork?.id === id) setSelectedArtwork({ ...selectedArtwork, isSold: !selectedArtwork.isSold });
      if (adminSelectedArt?.id === id) setAdminSelectedArt({ ...adminSelectedArt, isSold: !adminSelectedArt.isSold });
    } else if (type === 'vault') {
      if (adminSelectedArt?.id === id) setAdminSelectedArt({ ...adminSelectedArt, isVaulted: !adminSelectedArt.isVaulted });
    }
  };

  const deleteArtwork = async (id) => {
    if (window.confirm("Are you sure? This will permanently delete this artwork from your database.")) {
      await deleteArtworkService(id);
      setAdminSelectedArt(null);
    }
  };

  const handleAddToBasket = (includeDigitalCopy: boolean = false) => {
    cartHandleAddToBasket(selectedArtwork, photoPrices, photoSize, shippingConfig, chosenFrame, includeDigitalCopy);
  };

  const handleSmartShare = async () => {
    const publicUrl = "https://mitchell-ward-studios.firebaseapp.com";
    const shareUrl = selectedArtwork ? `${publicUrl}?art=${selectedArtwork.id}` : publicUrl;
    
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const shareResult = await Share.canShare();
        if (shareResult.value) {
          await Share.share({
            title: selectedArtwork?.title || "Studio Canvas",
            text: `Check out this artwork by Mitchell Ward!`,
            url: shareUrl,
            dialogTitle: 'Share Artwork'
          });
          return;
        }
      }
    } catch (err) {
      console.log("Capacitor Share check error, falling back:", err);
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedArtwork?.title || "Studio Canvas",
          text: "Check out this artwork by Mitchell Ward!",
          url: shareUrl
        });
        return;
      } catch (err) {
        console.log("Web Share cancelled/failed:", err);
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      triggerToast("Link copied to clipboard!");
      alert("Link copied to clipboard!\n\n" + shareUrl);
    } catch (err) {
      console.log("Clipboard write failed:", err);
      prompt("Copy this link to share:", shareUrl);
    }
  };

  const handleSurpriseMe = async (category: string) => {
    setIsCurating(true);
    setCurationNotes(null);

    const availableArt = inventory.filter(art => {
      if (art.category !== category) return false;
      if (category === "Paintings" && art.isSold) return false;
      if (category === "Photography" && art.isVaulted) return false;
      return true;
    });

    if (availableArt.length === 0) {
      alert("No active artwork available in this category.");
      setIsCurating(false);
      return;
    }

    try {
      const response = await fetch("/api/curate-artwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: "inspirational gallery highlight",
          stylePreference: category,
          catalog: availableArt.map(art => ({
            id: art.id,
            title: art.title || "Untitled",
            artist: art.artist || "Mitchell Ward",
            description: art.description || "",
            medium: art.medium || (category === "Paintings" ? "Acrylic Canvas" : "Archival Print"),
            category: art.category,
            style: art.subcategory || art.style || "Studio"
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        if ((data.status === "success" || data.status === "fallback") && data.selectedId) {
          const chosenArt = availableArt.find(a => a.id === data.selectedId) || availableArt[0];
          setSelectedArtwork(chosenArt);
          setChosenFrame(data.framePreference || "Oak");
          setSelectedSubCategory(null);
          if (chosenArt.category === "Photography") setPhotoSize("A3 Print");
          if (data.curationNotes) setCurationNotes(data.curationNotes);
          setMenuState("detail");
          setIsCurating(false);
          return;
        }
      }
    } catch (err) {
      console.warn("AI Curation endpoint error, falling back to local curation:", err);
    }

    // Local fallback curation if endpoint is unreachable or errors
    const randomArt = availableArt[Math.floor(Math.random() * availableArt.length)];
    setSelectedArtwork(randomArt);
    setChosenFrame("Oak");
    setSelectedSubCategory(null);
    if (randomArt.category === "Photography") setPhotoSize("A3 Print");
    setCurationNotes(`Curated to anchor and elevate your space. This striking piece, "${randomArt.title}", harmonizes bold studio composition with refined texture.`);
    setMenuState("detail");
    setIsCurating(false);
  };

  const openUploadModal = (category: string, preferredCollection?: string, preferredSub?: string) => { 
    setUploadType(category); 
    const cols = category === "Paintings" ? paintingsCollections : photographyCollections;
    const defaultCol = preferredCollection || cols[0]?.name || (category === "Paintings" ? "Studio Pieces" : "India");
    const foundColObj = cols.find(c => c.name === defaultCol) || cols[0];
    const defaultSub = preferredSub || foundColObj?.subGalleries[0]?.name || (category === "Paintings" ? "Mini Canvases" : "General");
    setUploadMainCollection(defaultCol);
    setUploadCatName(defaultSub); 
    setIsUploading(true); 
  };  
  
  const handleFileChange = (e: any) => { if (e.target.files[0]) setSelectedFile(e.target.files[0]); };
  const handlePrintFileChange = (e: any) => { if (e.target.files[0]) setSelectedPrintFile(e.target.files[0]); };
  const handleSecondaryFileChange = (e: any) => { if (e.target.files[0]) setSelectedSecondaryFile(e.target.files[0]); };

  const handlePublishUpload = async () => {
    if (!selectedFile) {
      alert("Please select an artwork display image before publishing.");
      return;
    }
    if (!uploadTitle.trim()) {
      alert("Please provide a title for the artwork.");
      return;
    }
    if (uploadType === "Paintings" && (!uploadPrice || Number(uploadPrice) <= 0)) {
      alert("Please specify a valid price for the painting.");
      return;
    }

    try {
      setUploadingToCloud(true);
      await uploadArtworkService({
        selectedFile,
        selectedPrintFile,
        selectedSecondaryFile,
        uploadType,
        uploadWidth,
        uploadHeight,
        uploadUnit,
        uploadTitle,
        uploadDesc,
        uploadPrice,
        uploadMainCollection: uploadMainCollection || (uploadType === "Paintings" ? "Studio Pieces" : "Studio Selections"),
        uploadCatName: uploadCatName || "General"
      });
      setIsUploading(false); 
      setUploadTitle(""); 
      setUploadDesc(""); 
      setUploadPrice(""); 
      setUploadWidth(""); 
      setUploadHeight(""); 
      setSelectedFile(null); 
      setSelectedPrintFile(null); 
      setSelectedSecondaryFile(null);
      triggerToast("Artwork published successfully!");
    } catch (err: any) { alert("Error uploading item: " + err.message); } 
    finally { setUploadingToCloud(false); }
  };

  const getMainCollectionCover = (category: string, collectionName: string) => {
    const list = category === "Paintings" ? paintingsCollections : photographyCollections;
    const col = list.find(c => c.name === collectionName);
    const subNames = col ? col.subGalleries.map(s => s.name) : [];

    const artInCol = inventory.filter(art => {
      if (art.category !== category || art.isVaulted) return false;
      return art.mainCollection === collectionName || subNames.includes(art.subcategory);
    });
    if (artInCol.length > 0) return artInCol[artInCol.length - 1].thumbnailSrc || artInCol[artInCol.length - 1].src;
    return "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80";
  };

  const getSubGalleryCover = (category: string, collectionName: string, subcatName: string) => {
    const artInSub = inventory.filter(art => {
      if (art.category !== category || art.isVaulted) return false;
      if (collectionName && art.mainCollection && art.mainCollection !== collectionName) return false;
      return art.subcategory === subcatName;
    });
    if (artInSub.length > 0) return artInSub[artInSub.length - 1].thumbnailSrc || artInSub[artInSub.length - 1].src;
    return "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80";
  };

  const getCollectionCover = (category: string, subcatName: string) => {
    const artInFolder = inventory.filter(art => art.category === category && art.subcategory === subcatName && !art.isVaulted);
    if (artInFolder.length > 0) return artInFolder[artInFolder.length - 1].thumbnailSrc || artInFolder[artInFolder.length - 1].src;
    return "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=300&q=80";
  };

  return {
    inventory, setInventory,
    paintingsCollections, setPaintingsCollections,
    photographyCollections, setPhotographyCollections,
    activeCollections,
    activeSubGalleries,
    paintCats, setPaintCats,
    photoCats, setPhotoCats,
    photoPrices, setPhotoPrices,
    localPrices, setLocalPrices,
    editFolder, setEditFolder,
    newFolders, setNewFolders,
    studioBio, setStudioBio,
    studioEmail, setStudioEmail,
    studioInstagram, setStudioInstagram,
    studioWebsite, setStudioWebsite,
    menuState, setMenuState,
    activeCategory, setActiveCategory,
    selectedMainCollection, setSelectedMainCollection,
    selectedSubCategory, setSelectedSubCategory,
    selectedArtwork, setSelectedArtwork: handleSelectArtwork,
    chosenFrame, setChosenFrame,
    basket, setBasket,
    isBasketOpen, setIsBasketOpen,
    isAccountOpen, setIsAccountOpen,
    isStudioPanelOpen, setIsStudioPanelOpen,
    isAdminSettingsOpen, setIsAdminSettingsOpen,
    adminSelectedArt, setAdminSelectedArt,
    isCurating, setIsCurating,
    curationNotes, setCurationNotes,
    photoSize, setPhotoSize,
    clickCount, setClickCount,
    isAdmin, setIsAdmin,
    showPinPrompt, setShowPinPrompt,
    authError, setAuthError,
    authEmail, setAuthEmail,
    authPassword, setAuthPassword,
    adminSignIn, adminBiometricLogin, adminSignOut,
    isUploading, setIsUploading,
    uploadType, setUploadType,
    uploadTitle, setUploadTitle,
    uploadDesc, setUploadDesc,
    uploadPrice, setUploadPrice,
    uploadMainCollection, setUploadMainCollection,
    uploadCatName, setUploadCatName,
    uploadWidth, setUploadWidth,
    uploadHeight, setUploadHeight,
    uploadUnit, setUploadUnit,
    selectedFile, setSelectedFile,
    selectedPrintFile, setSelectedPrintFile,
    handlePrintFileChange,
    selectedSecondaryFile, setSelectedSecondaryFile,
    handleSecondaryFileChange,
    userName, setUserName,
    userEmail, setUserEmail,
    userAddress, setUserAddress,
    saveUserProfile, deleteUserProfile,
    uploadingToCloud, setUploadingToCloud,
    currentActiveFolderList,
    filteredArtworks,
    adminFilteredArtworks,
    adminListToRender,
    basketSubtotal,
    handleSaveRename,
    handleAddCollectionInline,
    handleDeleteCollection,
    handleAddMainCollection,
    handleRenameMainCollection,
    handleDeleteMainCollection,
    handleAddSubGallery,
    handleRenameSubGallery,
    handleDeleteSubGallery,
    getMainCollectionCover,
    getSubGalleryCover,
    saveStudioInfo,
    handlePriceUpdate,
    handleShippingUpdate,
    moveArtworkLocation,
    toggleStatus,
    deleteArtwork,
    customersList,
    handleAddToBasket,
    handleSmartShare,
    handleSurpriseMe,
    openUploadModal,
    handleFileChange,
    handlePublishUpload,
    getCollectionCover,
    removeFromBasket,
    handleCheckout,
    toastMessage,
    triggerToast,
    basketShipping,
    shippingConfig,
    setShippingConfig,
    isLoading
  };
}