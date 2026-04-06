// scripts/admin.js
import { auth } from './firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Redirect logged-in admins directly to dashboard
onAuthStateChanged(auth, user => {
  if(user){
    window.location.href = 'admin-dashboard.html'; // make sure you have this page
  }
});

const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if(!email || !password){ 
    alert("Please enter both email and password."); 
    return; 
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'admin-dashboard.html'; // redirect to admin dashboard
  } catch(err){
    alert("Login failed: " + err.message);
  }
});
