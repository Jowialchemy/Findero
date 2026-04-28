// Firebase v10 modular imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// 🔥 YOUR FIREBASE CONFIG (FIXED STORAGE BUCKET)
const firebaseConfig = {
  apiKey: "AIzaSyDL_BRheLzGxDJ-6XbjitZw8HFmUzQwgaI",
  authDomain: "findero-39098.firebaseapp.com",
  projectId: "findero-39098",

  // ✅ FIXED (VERY IMPORTANT)
  storageBucket: "findero-39098.firebasestorage.app",

  messagingSenderId: "796711693094",
  appId: "1:796711693094:web:616efe1fd7291759d02fe7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export everything
export { app, auth, db, storage };
