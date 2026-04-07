// scripts/admin.js
import { auth } from './firebase.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ✅ CHANGE THIS TO YOUR ADMIN EMAIL
const ADMIN_EMAIL = "jowialchemystudios@gmail.com";

// 🔐 LOGIN FUNCTION
const loginBtn = document.getElementById('loginBtn');

if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      // ✅ CHECK IF ADMIN
      if (userCred.user.email === ADMIN_EMAIL) {
        window.location.href = "admin-dashboard.html"; // ✅ ADMIN PAGE
      } else {
        window.location.href = "dashboard.html"; // normal users
      }

    } catch (err) {
      alert("Login failed: " + err.message);
    }
  });
}

// 🔐 PROTECT ADMIN PAGE
export function protectAdminPage() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "admin.html";
    } else if (user.email !== ADMIN_EMAIL) {
      alert("Access denied");
      window.location.href = "dashboard.html";
    }
  });
}

// 🚪 LOGOUT
export function initAdminLogout() {
  const btn = document.getElementById("btnLogout");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "admin.html";
  });
}
