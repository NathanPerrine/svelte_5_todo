// Import the functions you need from the SDKs you need
import { deleteApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIz2Z9wIj8DGhrglObbUnqjVVINq0xqjQ",
  authDomain: "svelte-5-todos.firebaseapp.com",
  projectId: "svelte-5-todos",
  storageBucket: "svelte-5-todos.appspot.com",
  messagingSenderId: "352995895155",
  appId: "1:352995895155:web:0260cd5ac1a7953e36c706"
};

// Initialize Firebase
let app: FirebaseApp
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
  deleteApp(app);
  app = initializeApp(firebaseConfig)
}

export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});
