// ----------------- Firebase Initialization -----------------

// Import compat SDKs (already loaded via script tags in HTML)
const firebaseConfig = {
  apiKey: "AIzaSyDL_BRheLzGxDJ-6XbjitZw8HFmUzQwgaI",
  authDomain: "findero-39098.firebaseapp.com",
  projectId: "findero-39098",
  storageBucket: "findero-39098.appspot.com",
  messagingSenderId: "796711693094",
  appId: "1:796711693094:web:616efe1fd7291759d02fe7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ----------------- Auth Helpers -----------------

// Redirect to login if not authenticated
function protectPage() {
  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
}

// Logout function
function logout() {
  auth.signOut()
    .then(() => window.location.href = "login.html")
    .catch(err => console.error("Logout error:", err));
}

// ----------------- Firestore Helpers -----------------

/**
 * Get a document from a collection
 * @param {string} collection - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<Object|null>} - Document data or null if not found
 */
async function getDoc(collection, docId) {
  try {
    const docSnap = await db.collection(collection).doc(docId).get();
    return docSnap.exists ? docSnap.data() : null;
  } catch (err) {
    console.error(`Error fetching ${collection}/${docId}:`, err);
    return null;
  }
}

/**
 * Add a document to a collection
 * @param {string} collection - Collection name
 * @param {Object} data - Document data
 * @returns {Promise<string>} - Document ID
 */
async function addDoc(collection, data) {
  try {
    const docRef = await db.collection(collection).add(data);
    return docRef.id;
  } catch (err) {
    console.error(`Error adding to ${collection}:`, err);
    throw err;
  }
}

// ----------------- Storage Helpers -----------------

/**
 * Upload a file to Firebase Storage
 * @param {File} file - File to upload
 * @param {string} path - Path in storage (e.g., 'images/item123.jpg')
 * @returns {Promise<string>} - Download URL
 */
async function uploadFile(file, path) {
  try {
    const ref = storage.ref(path);
    await ref.put(file);
    const url = await ref.getDownloadURL();
    return url;
  } catch (err) {
    console.error("Storage upload error:", err);
    throw err;
  }
}

// ----------------- Utilities -----------------

// Escape HTML for safe display
function esc(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
