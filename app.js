import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc, onSnapshot, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ======= Tribute Section ======= //
const form = document.getElementById('tribute-form');
const tributeContainer = document.getElementById('tribute-container');

// Real-time listener for tributes
onSnapshot(query(collection(db, 'tributes'), orderBy('timestamp', 'desc')), (snapshot) => {
  tributeContainer.innerHTML = ''; // Clear existing tributes
  snapshot.forEach(doc => {
    const tribute = doc.data();
    const tributeDiv = document.createElement('div');
    tributeDiv.classList.add('tribute');
    tributeDiv.innerHTML = `
      <h3>${tribute.tributeTitle}</h3>
      <p>${tribute.tributeText}</p>
      <p>- By: ${tribute.authorName}</p>
      <small>Posted on: ${tribute.timestamp?.toDate().toLocaleString()}</small>
    `;
    tributeContainer.appendChild(tributeDiv);
  });
});

// Form submission
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = document.getElementById('tribute-title').value;
  const message = document.getElementById('tribute-text').value;
  const author = document.getElementById('author-name').value;

  if (title && message && author) {
    try {
      await addDoc(collection(db, 'tributes'), {
        tributeTitle: title,
        tributeText: message,
        authorName: author,
        timestamp: serverTimestamp(),
      });
      alert('Tribute submitted successfully!');
      form.reset();
    } catch (error) {
      console.error('Error adding tribute:', error);
    }
  } else {
    alert('Please fill out all fields.');
  }
});

// ======= Biography Section ======= //
const bioContent = document.getElementById('bio-content');
const bioRef = doc(db, 'biographies', 'john-doe');

// Real-time listener for biography
onSnapshot(bioRef, (doc) => {
  if (doc.exists()) {
    bioContent.innerHTML = doc.data().bioText || 'Click here to edit the biography.';
  } else {
    console.log('Biography document does not exist.');
  }
});

// Save biography updates on input
bioContent.addEventListener('input', async () => {
  try {
    await setDoc(bioRef, { bioText: bioContent.innerHTML }, { merge: true });
    console.log('Biography updated!');
  } catch (error) {
    console.error('Error updating biography:', error);
  }
});
