import { auth } from './firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Protect pages
export function protectPage(redirect = false){
  onAuthStateChanged(auth, user => {
    if(!user && redirect) window.location.href = 'login.html';
  });
}

// Login
export async function signIn(email, password){
  return await signInWithEmailAndPassword(auth, email, password);
}

// Signup
export async function signUp(email, password){
  return await createUserWithEmailAndPassword(auth, email, password);
}

// Logout
export async function signOutUser(){
  await signOut(auth);
}
