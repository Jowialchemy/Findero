// scripts/firebase.js
// Modular Firebase v9 setup + helper functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

/* ----------------- Firebase config (your project) ----------------- */
const firebaseConfig = {
  apiKey: "AIzaSyDL_BRheLzGxDJ-6XbjitZw8HFmUzQwgaI",
  authDomain: "findero-39098.firebaseapp.com",
  projectId: "findero-39098",
  storageBucket: "findero-39098.appspot.com",
  messagingSenderId: "796711693094",
  appId: "1:796711693094:web:616efe1fd7291759d02fe7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/* ----------------- Exports ----------------- */
export { auth, db, storage, onAuthStateChanged };

/* ----------------- Auth helper wrappers ----------------- */
export async function signIn(email, password){ return signInWithEmailAndPassword(auth, email, password); }
export async function signUp(email, password){ return createUserWithEmailAndPassword(auth, email, password); }
export async function signOut(){ return firebaseSignOut(auth); }

/* ----------------- Storage helper ----------------- */
export async function uploadFile(path, file){
  const ref = storageRef(storage, path);
  await uploadBytes(ref, file);
  return await getDownloadURL(ref);
}

/* ----------------- Firestore helpers ----------------- */
/**
 * addFoundItem({itemName, locationFound, dateFound, description, createdBy}, file?)
 * returns trackingId
 */
export async function addFoundItem(data, file){
  // use a generated doc id for stable tracking ID
  const docRef = doc(collection(db, 'foundItems'));
  const trackingId = docRef.id;
  const payload = {
    ...data,
    trackingId,
    createdAt: serverTimestamp()
  };
  if(file){
    const url = await uploadFile(`foundItems/${trackingId}/${file.name}`, file);
    payload.imageUrl = url;
  }
  await setDoc(docRef, payload);
  return trackingId;
}

export async function addLostItem(data, file){
  const docRef = doc(collection(db, 'lostItems'));
  const trackingId = docRef.id;
  const payload = {
    ...data,
    trackingId,
    createdAt: serverTimestamp()
  };
  if(file){
    const url = await uploadFile(`lostItems/${trackingId}/${file.name}`, file);
    payload.imageUrl = url;
  }
  await setDoc(docRef, payload);
  return trackingId;
}

export async function getItemById(collectionName, id){
  const d = await getDoc(doc(db, collectionName, id));
  return d.exists() ? d.data() : null;
}

/**
 * Fetch all found and lost items (small helper for search)
 * Returns {foundItems:[], lostItems:[]}
 */
export async function fetchAllItems(){
  const foundQ = query(collection(db, 'foundItems'), orderBy('createdAt','desc'));
  const lostQ = query(collection(db, 'lostItems'), orderBy('createdAt','desc'));
  const [foundSnap, lostSnap] = await Promise.all([getDocs(foundQ), getDocs(lostQ)]);
  const foundItems = foundSnap.docs.map(d => ({...d.data(), _id:d.id}));
  const lostItems = lostSnap.docs.map(d => ({...d.data(), _id:d.id}));
  return { foundItems, lostItems };
}

/* ----------------- small utility ----------------- */
export function esc(s){ if(s===null||s===undefined) return ""; return String(s) }
