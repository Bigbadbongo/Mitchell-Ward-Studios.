import React, { useState } from "react";
import useStudioEngine from "./components/useStudioEngine";

import ShoppingBasketDrawer from "./components/ShoppingBasketDrawer";
import UploadArtworkDrawer from "./components/UploadArtworkDrawer";
import ArtworkDetailView from "./components/ArtworkDetailView";
import PhotographyDetailView from "./components/PhotographyDetailView";
import StudioPanelDrawer from "./components/StudioPanelDrawer";
import AccountDrawer from "./components/AccountDrawer";
import AdminItemManager from "./components/AdminItemManager";
import AdminSettingsDrawer from "./components/AdminSettingsDrawer";
import AdminAuthPrompt from "./components/AdminAuthPrompt";
import ReturnsPolicyModal from "./components/ReturnsPolicyModal";
import ArtworkGridView from "./components/ArtworkGridView";
import AdminArtworkListView from "./components/AdminArtworkListView";
import CollectionsView from "./components/CollectionsView";
import SubCollectionsView from "./components/SubCollectionsView";
import AdminCollectionsView from "./components/AdminCollectionsView";
import AdminSubCollectionsView from "./components/AdminSubCollectionsView";
import AdminClientsView from "./components/AdminClientsView";
import AdminOrdersView from "./components/AdminOrdersView";
import MainMenuView from "./components/MainMenuView";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import { useUI } from "./context/UIContext";
import { useSwipeBack } from "./hooks/useSwipeBack";

export default function App() {
  const engine = useStudioEngine();
  const { handleBack, menuState } = useUI();
  const [isReturnsModalOpen, setIsReturnsModalOpen] = useState(false);

  // Determine if any drawer/overlay is currently active
  const isAnyDrawerOpen = Boolean(
    engine.isUploading ||
    engine.isBasketOpen ||
    engine.isAccountOpen ||
    engine.isStudioPanelOpen ||
    engine.isAdminSettingsOpen ||
    engine.showPinPrompt ||
    engine.adminSelectedArt ||
    isReturnsModalOpen
  );

  // Touch swipe gesture: swiping right from the left edge triggers back navigation, matching the top back button
  useSwipeBack({
    onBack: handleBack,
    enabled: menuState !== "main" && !isAnyDrawerOpen
  });

  return (
    <div className="fixed inset-0 bg-[#F0ECE1] flex items-center justify-center font-sans text-slate-800 overflow-hidden overscroll-none">
      <div className="w-full h-full max-h-[100dvh] bg-[#F0ECE1] flex flex-col relative overflow-hidden overscroll-none">
        
        <AppHeader />

        <main className="flex-1 overflow-y-auto px-6 py-6 flex flex-col bg-[#F0ECE1]">          
          
          <MainMenuView 
            menuState={engine.menuState}
            setActiveCategory={engine.setActiveCategory}
            setMenuState={engine.setMenuState}
            setIsStudioPanelOpen={engine.setIsStudioPanelOpen}
            setIsAdminSettingsOpen={engine.setIsAdminSettingsOpen} 
            isAdmin={engine.isAdmin}
          />

          {engine.menuState === "admin_collections" && (
            <AdminCollectionsView 
              activeCategory={engine.activeCategory}
              activeCollections={engine.activeCollections}
              inventory={engine.inventory}
              openUploadModal={engine.openUploadModal}
              setSelectedMainCollection={engine.setSelectedMainCollection}
              setSelectedSubCategory={engine.setSelectedSubCategory}
              setMenuState={engine.setMenuState}
              setIsAdminSettingsOpen={engine.setIsAdminSettingsOpen}
            />
          )}

          {engine.menuState === "admin_subcollections" && (
            <AdminSubCollectionsView 
              selectedMainCollection={engine.selectedMainCollection}
              activeSubGalleries={engine.activeSubGalleries}
              setSelectedSubCategory={engine.setSelectedSubCategory}
              setMenuState={engine.setMenuState}
            />
          )}

          {engine.menuState === "admin_list" && (
            <AdminArtworkListView 
              adminListToRender={engine.adminListToRender}
              setAdminSelectedArt={engine.setAdminSelectedArt}
              selectedMainCollection={engine.selectedMainCollection}
              selectedSubCategory={engine.selectedSubCategory}
              setMenuState={engine.setMenuState}
            />
          )}

          {engine.menuState === "clients" && (
            <AdminClientsView setMenuState={engine.setMenuState} />
          )}

          {engine.menuState === "orders" && (
            <AdminOrdersView setMenuState={engine.setMenuState} />
          )}

          {engine.menuState === "collections" && (
            <CollectionsView 
              activeCollections={engine.activeCollections}
              activeCategory={engine.activeCategory}
              getMainCollectionCover={engine.getMainCollectionCover}
              setSelectedMainCollection={engine.setSelectedMainCollection}
              setMenuState={engine.setMenuState}
              handleSurpriseMe={engine.handleSurpriseMe}
              isCurating={engine.isCurating}
            />
          )}

          {engine.menuState === "subcollections" && (
            <SubCollectionsView 
              activeSubGalleries={engine.activeSubGalleries}
              selectedMainCollection={engine.selectedMainCollection}
              activeCategory={engine.activeCategory}
              getSubGalleryCover={engine.getSubGalleryCover}
              setSelectedSubCategory={engine.setSelectedSubCategory}
              setMenuState={engine.setMenuState}
              handleSurpriseMe={engine.handleSurpriseMe}
              isCurating={engine.isCurating}
              inventory={engine.inventory}
            />
          )}

          {engine.menuState === "list" && (
            <ArtworkGridView 
              filteredArtworks={engine.filteredArtworks}
              setSelectedArtwork={engine.setSelectedArtwork}
              setPhotoSize={engine.setPhotoSize}
              setMenuState={engine.setMenuState}
              photoPrices={engine.photoPrices}
              photoSize={engine.photoSize}
              isLoading={engine.isLoading}
            />
          )}

          {engine.menuState === "detail" && (
            engine.selectedArtwork?.category === "Photography" ? (
              <PhotographyDetailView 
                selectedArtwork={engine.selectedArtwork}
                chosenFrame={engine.chosenFrame}
                setChosenFrame={engine.setChosenFrame}
                photoSize={engine.photoSize}
                setPhotoSize={engine.setPhotoSize}
                photoPrices={engine.photoPrices}
                handleSmartShare={engine.handleSmartShare}
                handleAddToBasket={engine.handleAddToBasket}
                curationNotes={engine.curationNotes}
              />
            ) : (
              <ArtworkDetailView 
                selectedArtwork={engine.selectedArtwork}
                chosenFrame={engine.chosenFrame}
                setChosenFrame={engine.setChosenFrame}
                photoSize={engine.photoSize}
                setPhotoSize={engine.setPhotoSize}
                photoPrices={engine.photoPrices}
                handleSmartShare={engine.handleSmartShare}
                handleAddToBasket={engine.handleAddToBasket}
                curationNotes={engine.curationNotes}
              />
            )
          )}

        </main>

        <AppFooter />

        <ShoppingBasketDrawer 
          isBasketOpen={engine.isBasketOpen} 
          setIsBasketOpen={engine.setIsBasketOpen} 
          basket={engine.basket} 
          basketSubtotal={engine.basketSubtotal} 
          basketShipping={engine.basketShipping}
          removeFromBasket={engine.removeFromBasket}
          handleCheckout={engine.handleCheckout}
          setIsReturnsModalOpen={setIsReturnsModalOpen}
        />
        
        <UploadArtworkDrawer
          isUploading={engine.isUploading} setIsUploading={engine.setIsUploading} uploadType={engine.uploadType}
          uploadTitle={engine.uploadTitle} setUploadTitle={engine.setUploadTitle} 
          uploadMainCollection={engine.uploadMainCollection} setUploadMainCollection={engine.setUploadMainCollection}
          uploadCatName={engine.uploadCatName} setUploadCatName={engine.setUploadCatName} 
          paintingsCollections={engine.paintingsCollections} photographyCollections={engine.photographyCollections}
          paintCats={engine.paintCats} photoCats={engine.photoCats}
          uploadWidth={engine.uploadWidth} setUploadWidth={engine.setUploadWidth} uploadHeight={engine.uploadHeight}
          setUploadHeight={engine.setUploadHeight} uploadUnit={engine.uploadUnit} setUploadUnit={engine.setUploadUnit}
          uploadPrice={engine.uploadPrice} setUploadPrice={engine.setUploadPrice}
          uploadDesc={engine.uploadDesc} setUploadDesc={engine.setUploadDesc} handleFileChange={engine.handleFileChange}
          handlePrintFileChange={engine.handlePrintFileChange} handleSecondaryFileChange={engine.handleSecondaryFileChange}
          uploadingToCloud={engine.uploadingToCloud} handlePublishUpload={engine.handlePublishUpload}
          handleAddMainCollection={engine.handleAddMainCollection} handleAddSubGallery={engine.handleAddSubGallery}
        />

        <StudioPanelDrawer 
          isStudioPanelOpen={engine.isStudioPanelOpen}
          setIsStudioPanelOpen={engine.setIsStudioPanelOpen}
          studioBio={engine.studioBio}
          studioEmail={engine.studioEmail}
          studioInstagram={engine.studioInstagram}
          studioWebsite={engine.studioWebsite}
        />

        <AccountDrawer 
          isAccountOpen={engine.isAccountOpen}
          setIsAccountOpen={engine.setIsAccountOpen}
          userName={engine.userName}
          userEmail={engine.userEmail}
          userAddress={engine.userAddress}
          saveUserProfile={engine.saveUserProfile}
          deleteUserProfile={engine.deleteUserProfile}
          setIsReturnsModalOpen={setIsReturnsModalOpen}
        />

        <AdminItemManager 
          adminSelectedArt={engine.adminSelectedArt}
          setAdminSelectedArt={engine.setAdminSelectedArt}
          paintingsCollections={engine.paintingsCollections}
          photographyCollections={engine.photographyCollections}
          paintCats={engine.paintCats}
          photoCats={engine.photoCats}
          moveArtworkLocation={engine.moveArtworkLocation}
          toggleStatus={engine.toggleStatus}
          deleteArtwork={engine.deleteArtwork}
        />

        <AdminSettingsDrawer 
          isAdminSettingsOpen={engine.isAdminSettingsOpen}
          setIsAdminSettingsOpen={engine.setIsAdminSettingsOpen}
          studioBio={engine.studioBio}
          setStudioBio={engine.setStudioBio}
          studioEmail={engine.studioEmail}
          setStudioEmail={engine.setStudioEmail}
          studioInstagram={engine.studioInstagram}
          setStudioInstagram={engine.setStudioInstagram}
          studioWebsite={engine.studioWebsite}
          setStudioWebsite={engine.setStudioWebsite}
          saveStudioInfo={engine.saveStudioInfo}
          paintingsCollections={engine.paintingsCollections}
          photographyCollections={engine.photographyCollections}
          handleAddMainCollection={engine.handleAddMainCollection}
          handleRenameMainCollection={engine.handleRenameMainCollection}
          handleDeleteMainCollection={engine.handleDeleteMainCollection}
          handleAddSubGallery={engine.handleAddSubGallery}
          handleRenameSubGallery={engine.handleRenameSubGallery}
          handleDeleteSubGallery={engine.handleDeleteSubGallery}
          inventory={engine.inventory}
          paintCats={engine.paintCats}
          photoCats={engine.photoCats}
          editFolder={engine.editFolder}
          setEditFolder={engine.setEditFolder}
          handleSaveRename={engine.handleSaveRename}
          newFolders={engine.newFolders}
          setNewFolders={engine.setNewFolders}
          handleAddCollectionInline={engine.handleAddCollectionInline}
          handleDeleteCollection={engine.handleDeleteCollection}
          photoPrices={engine.photoPrices}
          localPrices={engine.localPrices}
          setLocalPrices={engine.setLocalPrices}
          handlePriceUpdate={engine.handlePriceUpdate}
          shippingConfig={engine.shippingConfig}
          setShippingConfig={engine.setShippingConfig}
          handleShippingUpdate={engine.handleShippingUpdate}
          customersList={engine.customersList}
          adminSignOut={engine.adminSignOut}
        />

        <AdminAuthPrompt 
          showPinPrompt={engine.showPinPrompt} 
          setShowPinPrompt={engine.setShowPinPrompt}
          authError={engine.authError}
          authEmail={engine.authEmail}
          setAuthEmail={engine.setAuthEmail}
          authPassword={engine.authPassword}
          setAuthPassword={engine.setAuthPassword}
          adminSignIn={engine.adminSignIn}
          adminBiometricLogin={engine.adminBiometricLogin}
        />

        <ReturnsPolicyModal 
          isOpen={isReturnsModalOpen}
          onClose={() => setIsReturnsModalOpen(false)}
        />

        {/* Custom Premium Toast Overlay */}
        {engine.toastMessage && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[100] bg-slate-950/90 text-stone-100 text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-full shadow-lg border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {engine.toastMessage}
          </div>
        )}

      </div>
    </div>
  );
}