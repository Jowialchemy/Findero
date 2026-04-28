// Import Firebase
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Reference to table body
const tableBody = document.getElementById("adminTable");

// 🔥 LOAD ALL ITEMS AUTOMATICALLY
async function loadItems() {
  tableBody.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";

  try {
    const querySnapshot = await getDocs(collection(db, "items"));

    if (querySnapshot.empty) {
      tableBody.innerHTML = "<tr><td colspan='6'>No items found</td></tr>";
      return;
    }

    tableBody.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      const row = `
        <tr>
          <td>${data.name || "N/A"}</td>
          <td>${data.location || "N/A"}</td>
          <td>${data.status || "pending"}</td>

          <td>
            ${
              data.imageUrl
                ? `<img src="${data.imageUrl}" width="50" height="50" style="object-fit:cover;border-radius:5px;" />`
                : "No Image"
            }
          </td>

          <td>
            <button onclick="verifyItem('${id}')">Verify</button>
          </td>

          <td>
            <button onclick="deleteItem('${id}')">Delete</button>
          </td>
        </tr>
      `;

      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error(error);
    tableBody.innerHTML =
      "<tr><td colspan='6'>Error loading items</td></tr>";
  }
}

// ✅ VERIFY ITEM
window.verifyItem = async function (id) {
  try {
    const itemRef = doc(db, "items", id);

    await updateDoc(itemRef, {
      status: "verified"
    });

    alert("Item verified!");
    loadItems(); // refresh without reload
  } catch (error) {
    console.error(error);
    alert("Verification failed");
  }
};

// ❌ DELETE ITEM
window.deleteItem = async function (id) {
  const confirmDelete = confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "items", id));
    alert("Item deleted!");
    loadItems();
  } catch (error) {
    console.error(error);
    alert("Delete failed");
  }
};

// 🔁 INITIAL LOAD
loadItems();
