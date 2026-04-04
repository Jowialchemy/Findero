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

let allItems = []; // store items for search/filter

// ================= LOAD ITEMS =================
async function loadItems(){
  const tbody = document.querySelector("#itemsTable tbody");
  tbody.innerHTML = '';

  const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  allItems = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  renderItems(allItems);
}

// ================= RENDER ITEMS =================
function renderItems(items){
  const tbody = document.querySelector("#itemsTable tbody");
  tbody.innerHTML = '';

  items.forEach(data => {
    const tr = document.createElement("tr");

    // ID
    const idTd = document.createElement("td");
    idTd.innerText = data.id;

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
      await updateDoc(doc(db, "items", data.id), { status: newStatus });
      loadItems(); // reload table
    });
    statusTd.appendChild(btn);

    tr.append(idTd, typeTd, nameTd, descTd, locTd, dateTd, imgTd, statusTd);
    tbody.appendChild(tr);
  });
}

// ================= SEARCH FILTER =================
const searchBox = document.getElementById("searchBox");
if(searchBox){
  searchBox.addEventListener("input", (e)=>{
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allItems.filter(item =>
      (item.itemName && item.itemName.toLowerCase().includes(searchTerm)) ||
      (item.type && item.type.toLowerCase().includes(searchTerm)) ||
      (item.location && item.location.toLowerCase().includes(searchTerm)) ||
      (item.status && item.status.toLowerCase().includes(searchTerm))
    );
    renderItems(filtered);
  });
}

// Initial load
loadItems();
