// scripts/auth.js
import { auth, onAuthStateChanged, signIn, signUp, signOut } from "./firebase.js";

// initLogin attaches listeners only if login form present
export function initLogin(){
  const loginBtn = document.getElementById('loginBtn');
  const toggle = document.getElementById('togglePass');

  if(!loginBtn) return;

  // redirect if already logged in
  onAuthStateChanged(auth, user => {
    if(user) window.location.href = 'dashboard.html';
  });

  // toggle password
  if(toggle){
    toggle.addEventListener('change', ()=> {
      const p = document.getElementById('password');
      if(p) p.type = toggle.checked ? 'text' : 'password';
    });
  }

  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if(!email || !password){ alert('Please enter email and password.'); return; }
    try {
      await signIn(email, password);
      window.location.href = 'dashboard.html';
    } catch(err){ alert('Login failed: ' + err.message); }
  });
}

export function initSignup(){
  const signupBtn = document.getElementById('signupBtn');
  const toggle = document.getElementById('togglePass');
  if(!signupBtn) return;

  onAuthStateChanged(auth, user => {
    if(user) window.location.href = 'dashboard.html';
  });

  if(toggle){
    toggle.addEventListener('change', ()=> {
      const p = document.getElementById('password');
      if(p) p.type = toggle.checked ? 'text' : 'password';
    });
  }

  signupBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if(!email || !password){ alert('Please enter email and password.'); return; }
    try {
      await signUp(email, password);
      window.location.href = 'dashboard.html';
    } catch(err){ alert('Signup failed: ' + err.message); }
  });
}

// Logout button wiring (any page)
export function initLogoutButton(){
  const el = document.getElementById('btnLogout');
  if(!el) return;
  el.addEventListener('click', async ()=> {
    await signOut();
    window.location.href = 'login.html';
  });
        }
