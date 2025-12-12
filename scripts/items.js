// items.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export function initSearchPage() {
  const input = document.getElementById("searchInput");
  const resultsBox = document.getElementById("results");
  const status = document.getElementById("status");

  let allItems = [];

  // Load items from Firestore
  async function loadItems() {
    status.textContent = "Loading items...";
    try {
      const lostSnap = await getDocs(collection(db, "lostItems"));
      const foundSnap = await getDocs(collection(db, "foundItems"));

      const lostItems = lostSnap.docs.map(d => ({ id: d.id, type: "lost", ...d.data() }));
      const foundItems = foundSnap.docs.map(d => ({ id: d.id, type: "found", ...d.data() }));

      allItems = [...lostItems, ...foundItems];

      status.textContent = `Loaded ${allItems.length} items`;
      renderResults(allItems);
    } catch (err) {
      console.error("Error loading items", err);
      status.textContent = "❌ Error loading items. Please refresh.";
    }
  }

  // Filter based on search query
  function searchItems(query) {
    query = query.toLowerCase().trim();

    if (!query) return allItems;

    return allItems.filter(item => {
      return (
        item.name?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.date?.toLowerCase().includes(query) ||
        item.trackingId?.toLowerCase().includes(query)
      );
    });
  }

  // Render items to the page
  function renderResults(list) {
    resultsBox.innerHTML = "";

    if (list.length === 0) {
      resultsBox.innerHTML = `
        <div class="empty-state">
          No items match your search.
        </div>
      `;
      return;
    }

    list.forEach(item => {
      const card = document.createElement("div");
      card.className = "item-card";

      card.innerHTML = `
        <div class="tag ${item.type === 'found' ? 'found' : 'lost'}">
          ${item.type.toUpperCase()}
        </div>
        <div class="item-name">${item.name || "Unnamed Item"}</div>
        <div class="item-details">${item.description || "No description"}</div>
        <div class="item-location">📍 ${item.location || "Unknown location"}</div>
        <div class="item-date">📅 ${item.date || "Unknown date"}</div>
        <div class="item-track">🔖 ${item.trackingId || "No tracking ID"}</div>
      `;

      resultsBox.appendChild(card);
    });
  }

  // Live search listener
  input.addEventListener("input", () => {
    const query = input.value;
    const filtered = searchItems(query);
    renderResults(filtered);
  });

  // Load all items on page load
  loadItems();
}
