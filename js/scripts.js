// -------------------------------
// FIREBASE CONFIG (UPDATE THIS)
// -------------------------------
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// -------------------------------
// INITIALIZE FIREBASE
// -------------------------------
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// -------------------------------
// AUTH: CREATE ACCOUNT
// -------------------------------
function createAccount(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

// -------------------------------
// AUTH: LOGIN
// -------------------------------
function loginUser(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

// -------------------------------
// AUTH: LOGOUT
// -------------------------------
function logoutUser() {
  return auth.signOut();
}

// -------------------------------
// REDIRECT USER IF LOGGED OUT
// (For pages that require login)
// -------------------------------
function protectPage() {
  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
}

// -------------------------------
// REDIRECT USER IF LOGGED IN
// (For login / signup pages)
// -------------------------------
function blockLoggedInUser() {
  auth.onAuthStateChanged(user => {
    if (user) {
      window.location.href = "dashboard.html";
    }
  });
}

// -------------------------------
// SAVE LOST ITEM TO DATABASE
// -------------------------------
function saveLostItem(data) {
  return db.collection("lost_items").add(data);
}

// -------------------------------
// FETCH LOST ITEMS
// -------------------------------
function getLostItems() {
  return db.collection("lost_items").get();
