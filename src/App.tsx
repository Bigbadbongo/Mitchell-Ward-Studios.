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
import AdminCollectionsView from "./components/AdminCollectionsView";
import AdminClientsView from "./components/AdminClientsView";
import AdminOrdersView from "./components/AdminOrdersView";
import MainMenuView from "./components/MainMenuView";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

export default function App() {
  const engine = useStudioEngine();
  const [isReturnsModalOpen, setIsReturnsModalOpen] = useState(false);

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
              openUploadModal={engine.openUploadModal}
              currentActiveFolderList={engine.currentActiveFolderList}
              setSelectedSubCategory={engine.setSelectedSubCategory}
              setMenuState={engine.setMenuState}
            />
          )}

          {engine.menuState === "admin_list" && (
            <AdminArtworkListView 
              adminListToRender={engine.adminListToRender}
              setAdminSelectedArt={engine.setAdminSelectedArt}
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
              currentActiveFolderList={engine.currentActiveFolderList}
              activeCategory={engine.activeCategory}
              getCollectionCover={engine.getCollectionCover}
              setSelectedSubCategory={engine.setSelectedSubCategory}
              setMenuState={engine.setMenuState}
              handleSurpriseMe={engine.handleSurpriseMe}
              isCurating={engine.isCurating}
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
          uploadTitle={engine.uploadTitle} setUploadTitle={engine.setUploadTitle} uploadCatName={engine.uploadCatName}
          setUploadCatName={engine.setUploadCatName} paintCats={engine.paintCats} photoCats={engine.photoCats}
          uploadWidth={engine.uploadWidth} setUploadWidth={engine.setUploadWidth} uploadHeight={engine.uploadHeight}
          setUploadHeight={engine.setUploadHeight} uploadUnit={engine.uploadUnit} setUploadUnit={engine.setUploadUnit}
          uploadPrice={engine.uploadPrice} setUploadPrice={engine.setUploadPrice}
          uploadDesc={engine.uploadDesc} setUploadDesc={engine.setUploadDesc} handleFileChange={engine.handleFileChange}
          handlePrintFileChange={engine.handlePrintFileChange} handleSecondaryFileChange={engine.handleSecondaryFileChange}
          uploadingToCloud={engine.uploadingToCloud} handlePublishUpload={engine.handlePublishUpload}
        />

        <StudioPanelDrawer 
          isStudioPanelOpen={engine.isStudioPanelOpen}
          setIsStudioPanelOpen={engine.setIsStudioPanelOpen}
          studioBio={engine.studioBio}
          studioEmail={engine.studioEmail}
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
          saveStudioInfo={engine.saveStudioInfo}
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