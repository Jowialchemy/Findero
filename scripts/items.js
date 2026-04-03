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

const db = getFirestore(app);
const storage = getStorage(app);

export function initLostPage() {
  const form = document.getElementById("lostForm");
  const errorDiv = document.getElementById("lostError");

  if (!form) return;

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
      // 🔥 Upload image if selected
      if (file) {
        const storageRef = ref(
          storage,
          "lost_items/" + Date.now() + "_" + file.name
        );

        await uploadBytes(storageRef, file);

        imageUrl = await getDownloadURL(storageRef);
      }

      // 🔥 Save to Firestore (MATCHES YOUR SEARCH PAGE)
      await addDoc(collection(db, "lostItems"), {
        itemName: name,
        lostLocation: location,
        lostDate: date,
        description: desc,
        imageUrl: imageUrl,
        createdAt: new Date()
      });

      alert("✅ Lost item reported successfully!");
      form.reset();

    } catch (error) {
      console.error(error);
      errorDiv.style.display = "block";
      errorDiv.innerText = error.message;
    }
  });
}
