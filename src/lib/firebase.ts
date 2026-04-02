import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLObj18lzCO4miz6cdW1EOHUNnbHQED9U",
  authDomain: "issueglobe.firebaseapp.com",
  projectId: "issueglobe",
  storageBucket: "issueglobe.firebasestorage.app",
  messagingSenderId: "54830964841",
  appId: "1:54830964841:web:abeadb3bbaeac07b6142f8",
  measurementId: "G-C6D6ME59JT",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
