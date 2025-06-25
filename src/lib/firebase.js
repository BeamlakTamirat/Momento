import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "",
  authDomain: "momento-f3e55.firebaseapp.com",
  projectId: "momento-f3e55",
  storageBucket: "momento-f3e55.firebasestorage.app",
  messagingSenderId: "1047702294432",
  appId: "1:1047702294432:web:ecc972614646720a811ec5"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);




