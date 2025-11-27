const auth = firebase.auth();
const db = firebase.firestore();

// Login
const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    auth.signInWithEmailAndPassword(email,password)
      .then(()=>window.location.href='dashboard.html')
      .catch(err=>alert(err.message));
  });
}

// Sign Up
const signupForm = document.getElementById('signupForm');
if(signupForm){
  signupForm.addEventListener('submit', e=>{
    e.preventDefault();
    const email=signupForm.email.value;
    const password=signupForm.password.value;
    const name=signupForm.name.value;
    auth.createUserWithEmailAndPassword(email,password)
      .then(user=>db.collection('users').doc(user.user.uid).set({name,email}))
      .then(()=>window.location.href='dashboard.html')
      .catch(err=>alert(err.message));
  });
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn){
  logoutBtn.addEventListener('click', ()=>auth.signOut().then(()=>window.location.href='index.html'));
}

// Dashboard - fetch items
const itemsContainer = document.getElementById('itemsContainer');
if(itemsContainer){
  db.collection('items').onSnapshot(snapshot=>{
    itemsContainer.innerHTML='';
    snapshot.forEach(doc=>{
      const item = doc.data();
      const div = document.createElement('div');
      div.className='item-card';
      div.innerHTML=`<h3>${item.name} (${item.type})</h3><p>${item.desc}</p><p><strong>Location:</strong> ${item.location}</p>`;
      itemsContainer.appendChild(div);
    });
  });
}

// Submit Lost/Found items
const lostForm=document.getElementById('lostForm');
const foundForm=document.getElementById('foundForm');
if(lostForm){
  lostForm.addEventListener('submit',e=>{
    e.preventDefault();
    db.collection('items').add({
      name: lostForm.itemName.value,
      desc: lostForm.itemDesc.value,
      location: lostForm.location.value,
      type: 'Lost',
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      uid: auth.currentUser.uid
    }).then(()=>alert('Item submitted!'));
  });
}
if(foundForm){
  foundForm.addEventListener('submit',e=>{
    e.preventDefault();
    db.collection('items').add({
      name: foundForm.itemName.value,
      desc: foundForm.itemDesc.value,
      location: foundForm.location.value,
      type: 'Found',
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      uid: auth.currentUser.uid
    }).then(()=>alert('Item submitted!'));
  });
}
