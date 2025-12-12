// Search page wiring (live client-side search using fetchAllItems)
export function initSearchPage() {

  const input = document.getElementById('searchInput');
  const results = document.getElementById('results');
  const status = document.getElementById('status');

  if (!input || !results) return;

  let allItems = [];

  async function loadItems() {
    try {
      status.innerText = "Loading items...";

      // fetch object: { foundItems: [], lostItems: [] }
      const data = await fetchAllItems();

      // merge into one array
      allItems = [
        ...data.foundItems.map(i => ({ ...i, type: "found" })),
        ...data.lostItems.map(i => ({ ...i, type: "lost" }))
      ];

      status.innerText = `${allItems.length} items loaded.`;

      renderList(allItems);

    } catch (err) {
      status.innerText = "Error loading items: " + err.message;
    }
  }

  function renderList(list) {
    results.innerHTML = "";

    if (!list.length) {
      results.innerHTML = `
        <div class="error" style="grid-column:1/-1;text-align:center">
          No items found.
        </div>`;
      return;
    }

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = "card card-item";

      card.innerHTML = `
        <div style="display:flex;gap:12px;">
          <img class="thumb" src="${esc(item.imageUrl || '')}" alt="">
          <div>
            <div style="font-weight:700">${esc(item.itemName)}</div>
            <div class="small">Type: ${item.type === 'found' ? 'Found' : 'Lost'}</div>
            <div class="small">Location: ${esc(item.locationFound || item.lostLocation || "-")}</div>
            <div class="small">Date: ${esc(item.dateFound || item.lostDate || "-")}</div>
            <div class="small">ID: ${esc(item.trackingId)}</div>
          </div>
        </div>
      `;

      results.appendChild(card);
    });
  }

  function applyFilter() {
    const q = input.value.trim().toLowerCase();
    if (!q) return renderList(allItems);

    const filtered = allItems.filter(item =>
      JSON.stringify(item).toLowerCase().includes(q)
    );

    renderList(filtered);
  }

  input.addEventListener('input', applyFilter);

  loadItems();
}
