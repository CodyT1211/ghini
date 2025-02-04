// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, orderBy, serverTimestamp } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaNoI9o436jdnO7m6t6yBJIecxrsRp0GE",
  authDomain: "ghini-pop.firebaseapp.com",
  databaseURL: "https://ghini-pop-default-rtdb.firebaseio.com",
  projectId: "ghini-pop",
  storageBucket: "ghini-pop.firebasestorage.app",
  messagingSenderId: "937988505380",
  appId: "1:937988505380:web:4407062a111c65f9fffdb1",
  measurementId: "G-1LZS2QD2Y9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

// Select the form and tribute list
const form = document.getElementById('tribute-form');
const tributeList = document.getElementById('tribute-container');

// Handle form submission
form.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent page reload

  // Get name and message from the form
  const name = document.getElementById('author-name').value;
  const message = document.getElementById('tribute-text').value;

  if (name && message) {
    // Add tribute to the page immediately
    const tributeDiv = document.createElement('div');
    tributeDiv.classList.add('tribute');
    tributeDiv.innerHTML = `<h3>${name}</h3><p>${message}</p>`;
    tributeList.appendChild(tributeDiv);

    // Save tribute to Firestore
    addDoc(collection(db, 'tributes'), {
      authorName: name,
      tributeText: message,
      datePosted: serverTimestamp(), // Automatically adds timestamp
    }).then(() => {
      console.log('Tribute saved to Firestore');
    }).catch((error) => {
      console.error("Error saving tribute: ", error);
    });

    // Clear the form
    form.reset();
  } else {
    alert('Please enter both name and message!');
  }
});

// Load tributes from Firestore when the page loads
window.addEventListener('load', function () {
  getDocs(collection(db, 'tributes'), orderBy('datePosted', 'desc'))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const tribute = doc.data();
        const tributeDiv = document.createElement('div');
        tributeDiv.classList.add('tribute');
        tributeDiv.innerHTML = `
          <h3>${tribute.tributeTitle || 'Untitled Tribute'}</h3>
          <p><strong>${tribute.authorName || 'Anonymous'}</strong></p>
          <p>${tribute.tributeText || ''}</p>
          <p><small>${tribute.datePosted ? tribute.datePosted.toDate().toLocaleString() : ''}</small></p>
        `;
        tributeList.appendChild(tributeDiv);
      });
    }).catch((error) => {
      console.error("Error fetching tributes: ", error);
    });
});

// Biography logic
const bioContent = document.getElementById('bio-content');

// Check if there’s saved biography content in Firestore
const bioRef = doc(db, 'biography', 'Mq6aZovOKcG65Nw1QnBM'); // Use the correct document ID

getDoc(bioRef).then((docSnapshot) => {
  if (docSnapshot.exists()) {
    // Display biography text from Firestore
    const bioText = docSnapshot.data().Biography; // Match the field name in Firestore
    bioContent.innerHTML = bioText;
  } else {
    console.log("No such document!");
  }
}).catch((error) => {
  console.error("Error fetching biography: ", error);
});

// Save biography updates to Firestore when content changes
bioContent.addEventListener('input', function () {
  setDoc(bioRef, {
    Biography: bioContent.innerHTML
  }, { merge: true }) // Merge to avoid overwriting other fields
    .then(() => {
      console.log("Biography updated!");
    }).catch((error) => {
      console.error("Error updating biography: ", error);
    });
});
