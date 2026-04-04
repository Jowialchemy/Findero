// scripts/auth.js

import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ================= LOGIN =================
export function initLogin(){
  const loginBtn = document.getElementById('loginBtn');
  if(!loginBtn) return;

  // If already logged in → go to dashboard
  onAuthStateChanged(auth, user => {
    if(user){
      window.location.href = "dashboard.html";
    }
  });

  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if(!email || !password){
      alert("Please enter email and password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch(err){
      alert("Login failed: " + err.message);
    }
  });
}

// ================= SIGNUP =================
export function initSignup(){
  const signupBtn = document.getElementById('signupBtn');
  if(!signupBtn) return;

  // If already logged in → go to dashboard
  onAuthStateChanged(auth, user => {
    if(user){
      window.location.href = "dashboard.html";
    }
  });

  signupBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if(!email || !password){
      alert("Please enter email and password");
      return;
    }

    if(password.length < 6){
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch(err){
      alert("Signup failed: " + err.message);
    }
  });
}

// ================= LOGOUT =================
export function initLogoutButton(){
  const btn = document.getElementById('btnLogout');
  if(!btn) return;

  btn.addEventListener('click', async () => {
    try {
      await firebaseSignOut(auth);
      window.location.href = "login.html";
    } catch(err){
      alert("Logout failed: " + err.message);
    }
  });
}
