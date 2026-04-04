// scripts/items.js

import { app } from "./firebase.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const db = getFirestore(app);
const storage = getStorage(app);

// ================= PROTECT PAGE =================
// Redirects to login if not logged in
export function protectPage(requireLogin = true){
  if(!requireLogin) return;

  onAuthStateChanged(auth, user => {
    if(!user){
      window.location.href = "login.html";
    }
  });
}

// ================= LOST PAGE =================
export function initLostPage() {
  const form = document.getElementById("lostForm");
  const errorDiv = document.getElementById("lostError");
  if(!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.style.display = "none";

    const name = document.getElementById("lostName").value;
    const location = document.getElementById("lostLocation").value;
    const date = document.getElementById("lostDate").value;
    const desc = document.getElementById("lostDesc").value;
    const file = document.getElementById("lostImage").files[0];

    let imageUrl = "";

    try {
      if(file){
        const storageRef = ref(storage, "items/" + Date.now() + "_" + file.name);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "items"), {
        type: "lost",
        itemName: name,
        location: location,
        date: date,
        description: desc,
        image: imageUrl,
        status: "Pending",
        createdAt: new Date()
      });

      alert("✅ Lost item reported successfully!");
      form.reset();
    } catch(error){
      console.error(error);
      errorDiv.style.display = "block";
      errorDiv.innerText = error.message;
    }
  });
}

// ================= FOUND PAGE =================
export function initFoundPage() {
  const form = document.getElementById("foundForm");
  const errorDiv = document.getElementById("foundError");
  if(!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.style.display = "none";

    const name = document.getElementById("foundName").value;
    const location = document.getElementById("foundLocation").value;
    const date = document.getElementById("foundDate").value;
    const desc = document.getElementById("foundDesc").value;
    const file = document.getElementById("foundImage").files[0];

    let imageUrl = "";

    try {
      if(file){
        const storageRef = ref(storage, "items/" + Date.now() + "_" + file.name);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "items"), {
        type: "found",
        itemName: name,
        location: location,
        date: date,
        description: desc,
        image: imageUrl,
        status: "Pending",
        createdAt: new Date()
      });

      alert("✅ Found item reported successfully!");
      form.reset();
    } catch(error){
      console.error(error);
      errorDiv.style.display = "block";
      errorDiv.innerText = error.message;
    }
  });
}
