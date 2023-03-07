import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSTLF7xN9DmBPl3Md3YcxebXoY23wkwww",
  authDomain: "messenger-bb43a.firebaseapp.com",
  projectId: "messenger-bb43a",
  storageBucket: "messenger-bb43a.appspot.com",
  messagingSenderId: "931228831813",
  appId: "1:931228831813:web:b8b5472aacc6697984d32c",
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();

