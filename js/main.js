// Findero Firestore posting script
import { db } from './firebase.js'; // make sure firebase.js is correctly imported
import { collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Function to load items into a container
async function loadItems(containerId, type = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = 'Loading…';
  
  try {
    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const items = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (!type || data.type === type) items.push({ id: doc.id, ...data });
    });
    
    if (!items.length) {
      container.innerHTML = '<p class="muted">No items yet.</p>';
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="item card">
        <strong>${item.title}</strong>
        <p class="muted">${item.description || ''}</p>
        <small>${new Date(item.createdAt.seconds * 1000).toLocaleString()}</small>
      </div>
    `).join('');

  } catch (err) {
    container.innerHTML = '<p class="muted">Could not load items.</p>';
    console.error(err);
  }
}

// Form submission for posting items
const postForm = document.getElementById('postForm');
if (postForm) {
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const type = document.getElementById('type')?.value || 'found'; // default type
    
    try {
      await addDoc(collection(db, 'items'), {
        title,
        description,
        type,
        createdAt: new Date()
      });
      alert('Item posted successfully!');
      postForm.reset();
      loadItems('itemsList'); // refresh the dashboard list
    } catch (err) {
      alert('Could not post item: ' + err.message);
      console.error(err);
    }
  });
}

// Load dashboard items on page load
document.addEventListener('DOMContentLoaded', () => {
  loadItems('itemsList'); // main dashboard
  loadItems('foundList', 'found'); // found page
  loadItems('lostList', 'lost');   // lost page
});
