// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "findero-39098.firebaseapp.com",
  projectId: "findero-39098",
  storageBucket: "findero-39098.appspot.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ===== Admin Credentials (example) =====
// You can create real admin in Firebase Auth, or check email here
const ADMIN_EMAIL = "admin@findero.com";

// ===== Elements =====
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");
const reportsTableBody = document.querySelector("#reports-table tbody");

// ===== Login =====
loginBtn.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      if(user.email !== ADMIN_EMAIL){
        loginError.textContent = "Not authorized as admin!";
        auth.signOut();
      } else {
        loginSection.style.display = "none";
        dashboardSection.style.display = "block";
        loadReports();
      }
    })
    .catch(error => {
      loginError.textContent = error.message;
    });
});

// ===== Logout =====
logoutBtn.addEventListener("click", () => {
  auth.signOut();
  dashboardSection.style.display = "none";
  loginSection.style.display = "block";
});

// ===== Load Reports =====
function loadReports() {
  db.collection("items").orderBy("date", "desc").onSnapshot(snapshot => {
    reportsTableBody.innerHTML = ""; // clear table
    snapshot.forEach(doc => {
      const data = doc.data();
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${doc.id}</td>
        <td>${data.userEmail || "Unknown"}</td>
        <td>${data.type}</td>
        <td>${data.description}</td>
        <td><img src="${data.image}" width="100"></td>
        <td>${data.status || "Pending"}</td>
        <td>
          <button onclick="updateStatus('${doc.id}','Found')">Mark Found</button>
          <button onclick="deleteReport('${doc.id}')">Delete</button>
        </td>
      `;
      reportsTableBody.appendChild(tr);
    });
  });
}

// ===== Update Status =====
function updateStatus(id, status) {
  db.collection("items").doc(id).update({status: status})
    .then(() => alert("Status updated!"))
    .catch(err => alert(err.message));
}

// ===== Delete Report =====
function deleteReport(id) {
  if(confirm("Are you sure you want to delete this report?")){
    db.collection("items").doc(id).delete()
      .then(() => alert("Deleted!"))
      .catch(err => alert(err.message));
  }
}
