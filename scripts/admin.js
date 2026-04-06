// scripts/admin.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Protect admin page
export function protectAdminPage() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Not logged in, redirect to login page
      window.location.href = "admin.html";
    }
  });
}

// Admin login form
export function initAdminLogin() {
  const loginBtn = document.getElementById("adminLoginBtn");
  if (!loginBtn) return;

  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  });
}

// Admin logout
export function initAdminLogout() {
  const logoutBtn = document.getElementById("btnLogout");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "admin.html";
  });
}
