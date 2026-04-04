// scripts/admin.js

import { app } from "./firebase.js";
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore(app);

// ================= PROTECT ADMIN PAGE =================
onAuthStateChanged(auth, user => {
  if(!user){
    window.location.href = "login.html";
  }
});

// ================= LOGOUT BUTTON =================
const btnLogout = document.getElementById('btnLogout');
if(btnLogout){
  btnLogout.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'login.html';
  });
}

// ================= LOAD ITEMS =================
async function loadItems(){
  const tbody = document.querySelector("#itemsTable tbody");
  tbody.innerHTML = '';

  const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const tr = document.createElement("tr");

    // ID
    const idTd = document.createElement("td");
    idTd.innerText = docSnap.id;

    // Type
    const typeTd = document.createElement("td");
    typeTd.innerText = data.type;

    // Name
    const nameTd = document.createElement("td");
    nameTd.innerText = data.itemName || "-";

    // Description
    const descTd = document.createElement("td");
    descTd.innerText = data.description || "-";

    // Location
    const locTd = document.createElement("td");
    locTd.innerText = data.location || "-";

    // Date
    const dateTd = document.createElement("td");
    dateTd.innerText = data.date || "-";

    // Image
    const imgTd = document.createElement("td");
    if(data.image){
      const imgEl = document.createElement("img");
      imgEl.src = data.image;
      imgTd.appendChild(imgEl);
    } else {
      imgTd.innerText = "-";
    }

    // Status + Button
    const statusTd = document.createElement("td");
    const btn = document.createElement("button");
    btn.innerText = data.status || "Pending";
    btn.className = `status-btn ${data.status || "Pending"}`;
    btn.addEventListener("click", async () => {
      const newStatus = (data.status === "Pending") ? "Claimed" : "Pending";
      await updateDoc(doc(db, "items", docSnap.id), { status: newStatus });
      loadItems(); // reload table
    });
    statusTd.appendChild(btn);

    // Append all columns
    tr.append(idTd, typeTd, nameTd, descTd, locTd, dateTd, imgTd, statusTd);
    tbody.appendChild(tr);
  });
}

// Initial load
loadItems();
