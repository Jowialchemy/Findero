// Import Firebase
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Target table
const tableBody = document.getElementById("adminTable");

// 🔥 LOAD ITEMS FROM FIRESTORE
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
                ? `<img src="${data.imageUrl}" width="50" height="50" style="border-radius:6px;" />`
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
    tableBody.innerHTML = "<tr><td colspan='6'>Error loading items</td></tr>";
  }
}

// ✅ VERIFY
window.verifyItem = async function (id) {
  try {
    await updateDoc(doc(db, "items", id), {
      status: "verified"
    });

    alert("Verified!");
    loadItems();

  } catch (error) {
    console.error(error);
    alert("Error verifying item");
  }
};

// ❌ DELETE
window.deleteItem = async function (id) {
  const confirmDelete = confirm("Delete this item?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "items", id));
    alert("Deleted!");
    loadItems();

  } catch (error) {
    console.error(error);
    alert("Error deleting item");
  }
};

// 🔁 LOAD ON START
loadItems();

// 🔓 OPTIONAL LOGOUT
window.logout = function () {
  alert("Logged out");
  window.location.href = "index.html";
};
