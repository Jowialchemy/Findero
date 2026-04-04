import { db, storage } from './firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function protectPage(redirect = false){
  onAuthStateChanged(auth, user => {
    if(!user && redirect) window.location.href = 'login.html';
  });
}

export async function submitItem(type, formId){
  const form = document.getElementById(formId);
  const file = form.querySelector('input[type="file"]').files[0];
  const desc = form.querySelector('input[name="desc"]').value;

  let url = "";
  if(file){
    const storageRef = ref(storage, "images/" + Date.now() + "_" + file.name);
    await uploadBytes(storageRef, file);
    url = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, "items"), {
    type,
    description: desc,
    image: url,
    status: "Pending",
    date: new Date()
  });

  alert("✅ Uploaded successfully!");
  form.reset();
}
