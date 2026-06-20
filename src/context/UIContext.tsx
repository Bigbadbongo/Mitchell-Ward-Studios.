import React, { createContext, useContext, useState, ReactNode } from 'react';
import { auth } from '../firebase';
import { ADMIN_WHITELIST } from '../config';

interface UIContextType {
  menuState: string;
  setMenuState: (state: string) => void;
  isBasketOpen: boolean;
  setIsBasketOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  isStudioPanelOpen: boolean;
  setIsStudioPanelOpen: (open: boolean) => void;
  isAdminSettingsOpen: boolean;
  setIsAdminSettingsOpen: (open: boolean) => void;
  showPinPrompt: boolean;
  setShowPinPrompt: (show: boolean) => void;
  isReturnsModalOpen: boolean;
  setIsReturnsModalOpen: (open: boolean) => void;
  clickCount: number;
  setClickCount: React.Dispatch<React.SetStateAction<number>>;
  toastMessage: string | null;
  triggerToast: (msg: string) => NodeJS.Timeout;
  activeCategory: string | null;
  setActiveCategory: (cat: string | null) => void;
  selectedSubCategory: string | null;
  setSelectedSubCategory: (sub: string | null) => void;
  handleBack: () => void;
  handleTitleClick: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [menuState, setMenuState] = useState("main");
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isStudioPanelOpen, setIsStudioPanelOpen] = useState(false);
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [isReturnsModalOpen, setIsReturnsModalOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<string | null>(null); 
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    const id = setTimeout(() => setToastMessage(null), 3000);
    return id;
  };

  const handleBack = () => {
    if (menuState === 'admin') { 
      setMenuState('main'); 
    }
    else if (menuState === 'clients') setMenuState('admin');
    else if (menuState === 'admin_collections') setMenuState('admin');
    else if (menuState === 'admin_list') setMenuState('admin_collections');
    else if (menuState === 'detail') {
      if (!selectedSubCategory) setMenuState('collections');
      else setMenuState('list');
    } 
    else if (menuState === 'list') setMenuState('collections');
    else if (menuState === 'collections') {
      setMenuState('main'); setActiveCategory(null); setSelectedSubCategory(null);
    }
  };

  const handleTitleClick = () => {
    const isAdmin = auth.currentUser && ADMIN_WHITELIST.includes(auth.currentUser.email?.toLowerCase() || "");

    if (menuState !== "main" && menuState !== "admin") {
      setMenuState(isAdmin ? "admin" : "main");
      setActiveCategory(null);
      setSelectedSubCategory(null);
      return;
    }
    
    if (isAdmin) {
      setMenuState(menuState === "admin" ? "main" : "admin");
      return;
    }

    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setShowPinPrompt(true);
        return 0;
      }
      return newCount;
    });
  };

  return (
    <UIContext.Provider value={{
      menuState, setMenuState,
      isBasketOpen, setIsBasketOpen,
      isAccountOpen, setIsAccountOpen,
      isStudioPanelOpen, setIsStudioPanelOpen,
      isAdminSettingsOpen, setIsAdminSettingsOpen,
      showPinPrompt, setShowPinPrompt,
      isReturnsModalOpen, setIsReturnsModalOpen,
      clickCount, setClickCount,
      toastMessage, triggerToast,
      activeCategory, setActiveCategory,
      selectedSubCategory, setSelectedSubCategory,
      handleBack, handleTitleClick
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
