// Firebase v10 modular imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ✅ YOUR CONFIG (UNCHANGED)
const firebaseConfig = {
  apiKey: "AIzaSyDL_BRheLzGxDJ-6XbjitZw8HFmUzQwgaI",
  authDomain: "findero-39098.firebaseapp.com",
  projectId: "findero-39098",
  storageBucket: "findero-39098.appspot.com", // ✅ correct
  messagingSenderId: "796711693094",
  appId: "1:796711693094:web:616efe1fd7291759d02fe7"
};

// ✅ INITIALIZE APP
const app = initializeApp(firebaseConfig);

// ✅ SERVICES
const auth = getAuth(app);
const db = getFirestore(app);

// 🔥 IMPORTANT FIX (forces correct bucket usage)
const storage = getStorage(app, "gs://findero-39098.appspot.com");

// ✅ EXPORT
export { app, auth, db, storage };
