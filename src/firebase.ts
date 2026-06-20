import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCredential } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

const firebaseConfig = {
  apiKey: "AIzaSyDBrcxxRu3PMk_2NM8XEqC9GBtLrHrcBns",
  authDomain: "mitchell-ward-studios.firebaseapp.com",
  projectId: "mitchell-ward-studios",
  storageBucket: "mitchell-ward-studios.firebasestorage.app",
  messagingSenderId: "326050299607",
  appId: "1:326050299607:web:f224f72dda3408ad6dba92",
  measurementId: "G-NEVRM86S0X"
};

export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
export const storage = getStorage(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, "us-central1");
export const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  if (Capacitor.isNativePlatform()) {
    const result = await FirebaseAuthentication.signInWithGoogle();
    if (result.credential?.idToken) {
      const credential = GoogleAuthProvider.credential(result.credential.idToken);
      return signInWithCredential(auth, credential);
    }
    throw new Error("No credential returned from native Google Sign-In");
  } else {
    return signInWithPopup(auth, googleProvider);
  }
};
