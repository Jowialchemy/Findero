// Search page wiring — self-contained and robust
export function initSearchPage(){
  protectPage(true);

  const input = document.getElementById('searchInput');
  const results = document.getElementById('results');
  const status = document.getElementById('status');

  if(!input || !results) return;

  let allItems = []; // merged array of found + lost

  async function loadItemsDirect(){
    try {
      status.textContent = "Loading items...";
      // Query foundItems
      const foundQ = query(collection(db, 'foundItems'), orderBy('createdAt', 'desc'));
      const lostQ  = query(collection(db, 'lostItems'),  orderBy('createdAt', 'desc'));

      const [foundSnap, lostSnap] = await Promise.all([getDocs(foundQ), getDocs(lostQ)]);

      const foundItems = foundSnap.docs.map(d => ({ ...d.data(), _id: d.id, type: 'found' }));
      const lostItems  = lostSnap.docs.map(d => ({ ...d.data(), _id: d.id, type: 'lost' }));

      allItems = [...foundItems, ...lostItems];

      status.textContent = `${allItems.length} items loaded.`;
      renderList(allItems);
    } catch(err){
      console.error('loadItemsDirect error', err);
      status.textContent = "Error loading items: " + (err.message || err);
      results.innerHTML = `<div class="error" style="grid-column:1/-1;text-align:center">Unable to load items. Please try again.</div>`;
    }
  }

  function renderList(list){
    results.innerHTML = "";

    if(!Array.isArray(list) || list.length === 0){
      results.innerHTML = `<div class="small" style="grid-column:1/-1;text-align:center;color:#666">No items match your search.</div>`;
      return;
    }

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = "card card-item";

      const thumb = item.imageUrl ? esc(item.imageUrl) : 'assets/placeholder.png';

      card.innerHTML = `
        <div style="display:flex;gap:12px;align-items:flex-start">
          <img src="${thumb}" class="thumb" alt="thumb" onerror="this.style.display='none'"/>
          <div style="flex:1">
            <div style="font-weight:700;font-size:15px">${esc(item.itemName || 'Unnamed')}</div>
            <div class="small" style="margin-top:6px">Type: <strong>${item.type === 'found' ? 'Found' : 'Lost'}</strong></div>
            <div class="small">Location: ${esc(item.locationFound || item.lostLocation || '-')}</div>
            <div class="small">Date: ${esc(item.dateFound || item.lostDate || '-')}</div>
            <div class="small" style="margin-top:6px">ID: <strong>${esc(item.trackingId || item._id || '')}</strong></div>
            ${item.description ? `<div style="margin-top:8px">${esc(item.description)}</div>` : ''}
          </div>
        </div>
      `;
      results.appendChild(card);
    });
  }

  function applyFilter(){
    const q = input.value.trim().toLowerCase();
    if(!q) {
      renderList(allItems);
      return;
    }

    // simple but effective: check key fields
    const filtered = allItems.filter(it => {
      const fields = [
        it.itemName,
        it.description,
        it.locationFound,
        it.lostLocation,
        it.trackingId,
        it.dateFound,
        it.lostDate
      ].filter(Boolean).map(s => String(s).toLowerCase());

      return fields.join(' ').includes(q);
    });

    renderList(filtered);
  }

  input.addEventListener('input', applyFilter);

  // initial load
  loadItemsDirect();
                 }
