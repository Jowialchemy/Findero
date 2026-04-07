// scripts/admin.js
import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if(!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    // Firebase Auth login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Redirect to admin dashboard after successful login
    window.location.href = 'admin-dashboard.html';
  } catch(error) {
    console.error(error);
    alert("Login failed: " + error.message);
  }
});
