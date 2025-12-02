// scripts/items.js
import { auth, onAuthStateChanged, addFoundItem, addLostItem, fetchAllItems, getItemById, esc } from "./firebase.js";

export function protectPage(redirectIfNot=true){
  onAuthStateChanged(auth, user => {
    if(!user && redirectIfNot) window.location.href = 'login.html';
  });
}

// Found page wiring
export function initFoundPage(){
  protectPage(true);
  const form = document.getElementById('foundForm');
  const err = document.getElementById('foundError');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    err.innerText = '';
    const name = form.querySelector('#itemName').value.trim();
    const location = form.querySelector('#locationFound').value.trim();
    const date = form.querySelector('#dateFound').value;
    const desc = form.querySelector('#description').value.trim();
    const file = form.querySelector('#imageUpload').files[0] || null;
    if(!name || !location || !date){ err.innerText = 'Please fill required fields.'; return; }
    try {
      const id = await addFoundItem({ itemName:name, locationFound:location, dateFound:date, description:desc, createdBy: auth.currentUser?.uid||null }, file);
      alert('Item submitted! Tracking ID: ' + id);
      form.reset();
    } catch(err2){
      err.innerText = err2.message;
    }
  });
}

// Lost page wiring
export function initLostPage(){
  protectPage(true);
  const form = document.getElementById('lostForm');
  const err = document.getElementById('lostError');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    err.innerText = '';
    const name = form.querySelector('#lostName').value.trim();
    const location = form.querySelector('#lostLocation').value.trim();
    const date = form.querySelector('#lostDate').value;
    const desc = form.querySelector('#lostDesc').value.trim();
    const file = form.querySelector('#lostImage').files[0] || null;
    if(!name || !location || !date){ err.innerText = 'Please fill required fields.'; return; }
    try {
      const id = await addLostItem({ itemName:name, lostLocation:location, lostDate:date, description:desc, createdBy: auth.currentUser?.uid||null }, file);
      alert('Item submitted! Tracking ID: ' + id);
      form.reset();
    } catch(err2){
      err.innerText = err2.message;
    }
  });
}

// Track page wiring
export function initTrackPage(){
  protectPage(true);
  const btn = document.getElementById('btnTrack');
  const out = document.getElementById('trackOutput');
  if(!btn) return;
  btn.addEventListener('click', async ()=> {
    out.innerHTML = '';
    const id = document.getElementById('trackingId').value.trim();
    if(!id){ out.innerHTML = `<div class="error">Enter Tracking ID</div>`; return; }
    try {
      const found = await getItemById('foundItems', id);
      if(found){ out.innerHTML = renderItem(found, 'Found Item'); return; }
      const lost = await getItemById('lostItems', id);
      if(lost){ out.innerHTML = renderItem(lost, 'Lost Item'); return; }
      out.innerHTML = `<div class="error">No item found with Tracking ID ${esc(id)}</div>`;
    } catch(err){ out.innerHTML = `<div class="error">${err.message}</div>`; }
  });
}

function renderItem(item, label){
  return `<div class="card">
    <div style="font-weight:700;font-size:18px">${esc(item.itemName)}</div>
    <div style="color:#555">Type: ${esc(label)}</div>
    <div style="margin-top:8px">Location: <strong>${esc(item.locationFound||item.lostLocation||'-')}</strong></div>
    <div>Date: <strong>${esc(item.dateFound||item.lostDate||'-')}</strong></div>
    <div style="margin-top:8px">Description: ${esc(item.description||'')}</div>
    ${item.imageUrl?`<img src="${esc(item.imageUrl)}" style="max-width:200px;margin-top:8px;border-radius:8px">`:''}
    <div style="margin-top:8px">Tracking ID: <strong>${esc(item.trackingId)}</strong></div>
  </div>`;
}

// Search page wiring (live client-side search using fetchAllItems)
export function init
