import { useState, useEffect } from "react";
import { Share } from "@capacitor/share";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";
import { moveArtworkLocationService, toggleArtworkStatusService, deleteArtworkService } from "../services/firebase/inventoryService";
import { updateCategoryListService, batchUpdateArtworkSubcategoryService, updateStudioInfoService, updatePhotoPricesService, updateShippingConfigService } from "../services/firebase/settingsService";
import { uploadArtworkService } from "../services/firebase/uploadService";

export default function useStudioEngine() {
  const [editFolder, setEditFolder] = useState(null); 
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

  // Removed local toast state (handled by UIContext)
  
  // Removed local admin auth functions (handled by AuthContext)


  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState("Paintings");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadPrice, setUploadPrice] = useState("");
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

  const handleAddCollectionInline = async (category) => {
    const newName = newFolders[category];
    if (!newName || newName.trim() === "") return;
    
    const isPaint = category === "Paintings";
    const currentList = isPaint ? paintCats : photoCats;
    if (currentList.includes(newName.trim())) { alert("A folder with this name already exists."); return; }
    
    const updatedList = [...currentList, newName.trim()];
    
    if (isPaint) setPaintCats(updatedList); else setPhotoCats(updatedList);
    setNewFolders({ ...newFolders, [category]: "" });
    
    await updateCategoryListService(isPaint, updatedList);
  };

  const handleDeleteCollection = async (category, name) => {
    if (window.confirm("Delete folder \"" + name + "\"? \n\nNote: Artworks inside will NOT be deleted, but will become \"Unassigned\".")) {
      const isPaint = category === "Paintings";
      const currentList = isPaint ? paintCats : photoCats;
      const updatedList = currentList.filter(c => c !== name);
      
      if (isPaint) setPaintCats(updatedList); else setPhotoCats(updatedList);
      
      await updateCategoryListService(isPaint, updatedList);
    }
  };

  const saveStudioInfo = async () => {
    await updateStudioInfoService(studioBio, studioEmail);
  };

  const handlePriceUpdate = async (updatedPrices) => {
    try {
      await updatePhotoPricesService(updatedPrices);
      triggerToast("Prices updated");
    } catch (err) {
      console.error(err);
    }
  };

  const handleShippingUpdate = async (updatedConfig) => {
    try {
      setShippingConfig(updatedConfig);
      await updateShippingConfigService(updatedConfig);
      triggerToast("Shipping rules updated");
    } catch (err) {
      console.error(err);
    }
  };

  const moveArtworkLocation = async (artworkId, newSubcategory) => {
    await moveArtworkLocationService(artworkId, newSubcategory);
    if (adminSelectedArt) setAdminSelectedArt({ ...adminSelectedArt, subcategory: newSubcategory });
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

  const openUploadModal = (category) => { 
    setUploadType(category); 
    const defaultFolder = category === "Paintings" ? (paintCats[0] || "Unassigned") : (photoCats[0] || "Unassigned");
    setUploadCatName(defaultFolder); 
    setIsUploading(true); 
  };  
  
  const handleFileChange = (e) => { if (e.target.files[0]) setSelectedFile(e.target.files[0]); };
  const handlePrintFileChange = (e) => { if (e.target.files[0]) setSelectedPrintFile(e.target.files[0]); };
  const handleSecondaryFileChange = (e) => { if (e.target.files[0]) setSelectedSecondaryFile(e.target.files[0]); };

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
        uploadCatName
      });
      setIsUploading(false); setUploadTitle(""); setUploadDesc(""); setUploadPrice(""); setUploadWidth(""); setUploadHeight(""); setSelectedFile(null); setSelectedPrintFile(null); setSelectedSecondaryFile(null);
      triggerToast("Artwork published successfully!");
    } catch (err: any) { alert("Error uploading item: " + err.message); } 
    finally { setUploadingToCloud(false); }
  };

  const getCollectionCover = (category, subcatName) => {
    const artInFolder = inventory.filter(art => art.category === category && art.subcategory === subcatName && !art.isVaulted);
    if (artInFolder.length > 0) return artInFolder[artInFolder.length - 1].src;
    return "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=300&q=80";
  };

  return {
    inventory, setInventory, paintCats, setPaintCats, photoCats, setPhotoCats, photoPrices, setPhotoPrices,
    localPrices, setLocalPrices, editFolder, setEditFolder, newFolders, setNewFolders,
    studioBio, setStudioBio, studioEmail, setStudioEmail, menuState, setMenuState, activeCategory, setActiveCategory,
    selectedSubCategory, setSelectedSubCategory, selectedArtwork, setSelectedArtwork: handleSelectArtwork, chosenFrame, setChosenFrame, basket, setBasket,
    isBasketOpen, setIsBasketOpen, isAccountOpen, setIsAccountOpen, isStudioPanelOpen, setIsStudioPanelOpen,
    isAdminSettingsOpen, setIsAdminSettingsOpen, adminSelectedArt, setAdminSelectedArt, isCurating, setIsCurating, curationNotes, setCurationNotes, photoSize, setPhotoSize,
    clickCount, setClickCount, isAdmin, setIsAdmin, showPinPrompt, setShowPinPrompt, authError, setAuthError, authEmail, setAuthEmail, authPassword, setAuthPassword, adminSignIn, adminBiometricLogin, adminSignOut, isUploading, setIsUploading, uploadType, setUploadType,
    uploadTitle, setUploadTitle, uploadDesc, setUploadDesc, uploadPrice, setUploadPrice, uploadCatName, setUploadCatName,
    uploadWidth, setUploadWidth, uploadHeight, setUploadHeight, uploadUnit, setUploadUnit, selectedFile, setSelectedFile,
    selectedPrintFile, setSelectedPrintFile, handlePrintFileChange,
    selectedSecondaryFile, setSelectedSecondaryFile, handleSecondaryFileChange,
    userName, setUserName, userEmail, setUserEmail, userAddress, setUserAddress, saveUserProfile, deleteUserProfile,
    uploadingToCloud, setUploadingToCloud, currentActiveFolderList, filteredArtworks, adminFilteredArtworks,
    adminListToRender, basketSubtotal, handleSaveRename, handleAddCollectionInline,
    handleDeleteCollection, saveStudioInfo, handlePriceUpdate, handleShippingUpdate, moveArtworkLocation, toggleStatus, deleteArtwork,
    customersList, handleAddToBasket, handleSmartShare, handleSurpriseMe, openUploadModal, handleFileChange,
    handlePublishUpload, getCollectionCover, removeFromBasket, handleCheckout,
    toastMessage, triggerToast, basketShipping, shippingConfig, setShippingConfig, isLoading
  };
}