import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { NativeBiometric } from "@capgo/capacitor-native-biometric";
import { auth, db } from "../firebase";
import { useUI } from "./UIContext";

import { ADMIN_WHITELIST } from "../config";

interface AuthContextType {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  authEmail: string;
  setAuthEmail: (val: string) => void;
  authPassword: string;
  setAuthPassword: (val: string) => void;
  authError: string;
  setAuthError: (val: string) => void;
  userName: string;
  setUserName: (val: string) => void;
  userEmail: string;
  setUserEmail: (val: string) => void;
  userAddress: string;
  setUserAddress: (val: string) => void;
  adminSignIn: () => Promise<void>;
  adminBiometricLogin: () => Promise<void>;
  adminSignOut: () => Promise<void>;
  saveUserProfile: (name: string, email: string, address?: string) => Promise<void>;
  deleteUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setMenuState, setShowPinPrompt, setIsStudioPanelOpen, setIsAdminSettingsOpen, triggerToast } = useUI();

  const [isAdmin, setIsAdmin] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [userName, setUserName] = useState(() => localStorage.getItem("user_name") || "");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("user_email") || "");
  const [userAddress, setUserAddress] = useState(() => localStorage.getItem("user_address") || "");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && ADMIN_WHITELIST.includes(user.email?.toLowerCase() || "")) {
        setIsAdmin(true);
        setMenuState("admin");
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribeAuth();
  }, [setMenuState]);

  const adminSignIn = async () => {
    if (!authEmail || !authPassword) {
      setAuthError("Please enter email and password.");
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, authEmail, authPassword);
      if (ADMIN_WHITELIST.includes(result.user.email?.toLowerCase() || "")) {
        setIsAdmin(true);
        setMenuState("admin");
        setShowPinPrompt(false);
        
        try {
          await NativeBiometric.setCredentials({
            username: authEmail,
            password: authPassword,
            server: "studio.mitchellward"
          });
        } catch (e) { console.warn("Biometric save failed", e); }

        setAuthError("");
        setAuthEmail("");
        setAuthPassword("");
        triggerToast("Admin Authenticated");
      } else {
        await signOut(auth);
        setAuthError("Unauthorized email address.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setAuthError("Invalid email or password.");
      } else {
        setAuthError("Authentication failed. Please try again.");
      }
    }
  };

  const adminBiometricLogin = async () => {
    try {
      const result = await NativeBiometric.isAvailable();
      if (!result.isAvailable) {
        setAuthError("Biometrics not available on this device.");
        return;
      }
      
      const credentials = await NativeBiometric.getCredentials({
        server: "studio.mitchellward"
      });
      
      if (!credentials || !credentials.username || !credentials.password) {
        setAuthError("No secure credentials found. Please log in with password once.");
        return;
      }

      const authResult = await signInWithEmailAndPassword(auth, credentials.username, credentials.password);
      if (ADMIN_WHITELIST.includes(authResult.user.email?.toLowerCase() || "")) {
        setIsAdmin(true);
        setMenuState("admin");
        setShowPinPrompt(false);
        setAuthError("");
        triggerToast("Unlocked via Biometrics");
      } else {
        await signOut(auth);
        setAuthError("Unauthorized email address.");
      }
    } catch (err) {
      console.error(err);
      setAuthError("Biometric authentication failed.");
    }
  };

  const adminSignOut = async () => {
    await signOut(auth);
    setIsAdmin(false);
    setMenuState("main");
    setIsStudioPanelOpen(false);
    setIsAdminSettingsOpen(false);
    triggerToast("Logged out successfully.");
  };

  const saveUserProfile = async (name: string, email: string, address?: string) => {
    const finalAddress = address !== undefined ? address : userAddress;
    
    setUserName(name);
    setUserEmail(email);
    setUserAddress(finalAddress);
    
    localStorage.setItem("user_name", name);
    localStorage.setItem("user_email", email);
    if (finalAddress) {
      localStorage.setItem("user_address", finalAddress);
    }

    if (email) {
      try {
        await setDoc(doc(db, "customers", email.toLowerCase()), {
          name,
          email,
          address: finalAddress,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Failed to save customer profile to Firebase:", err);
      }
    }
  };

  const deleteUserProfile = async () => {
    if (userEmail) {
      try {
        await deleteDoc(doc(db, "customers", userEmail.toLowerCase()));
      } catch (err) {
        console.error("Failed to delete customer profile from Firebase:", err);
      }
    }
    setUserName("");
    setUserEmail("");
    setUserAddress("");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_address");
    triggerToast("Personal data deleted.");
  };

  return (
    <AuthContext.Provider value={{
      isAdmin, setIsAdmin,
      authEmail, setAuthEmail,
      authPassword, setAuthPassword,
      authError, setAuthError,
      userName, setUserName,
      userEmail, setUserEmail,
      userAddress, setUserAddress,
      adminSignIn, adminBiometricLogin, adminSignOut,
      saveUserProfile, deleteUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
