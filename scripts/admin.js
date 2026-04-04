// admin.js

const ADMIN_EMAIL = "jowialchemystudios@gmail.com";

const loginBtn = document.getElementById("login-btn");
const email = document.getElementById("email");
const password = document.getElementById("password");
const error = document.getElementById("login-error");

const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");

loginBtn.onclick = () => {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .then((userCred) => {
      if (userCred.user.email !== ADMIN_EMAIL) {
        error.innerText = "Not authorized";
        auth.signOut();
        return;
      }

      loginSection.style.display = "none";
      dashboardSection.style.display = "block";
      loadItems();
    })
    .catch(err => error.innerText = err.message);
};

// LOAD ITEMS
function loadItems() {
  db.collection("items").onSnapshot(snapshot => {
    const table = document.getElementById("tbody");
    table.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();

      table.innerHTML += `
        <tr>
          <td>${data.type}</td>
          <td>${data.description}</td>
          <td><img src="${data.image}" width="80"></td>
          <td>${data.status || "Pending"}</td>
          <td>
            <button onclick="markFound('${doc.id}')">Found</button>
            <button onclick="deleteItem('${doc.id}')">Delete</button>
          </td>
        </tr>
      `;
    });
  });
}

function markFound(id){
  db.collection("items").doc(id).update({status:"Found"});
}

function deleteItem(id){
  db.collection("items").doc(id).delete();
}
