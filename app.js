// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, serverTimestamp, orderBy, query } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaNoI9o436jdnO7m6t6yBJIecxrsRp0GE",
  authDomain: "ghini-pop.firebaseapp.com",
  databaseURL: "https://ghini-pop-default-rtdb.firebaseio.com",
  projectId: "ghini-pop",
  storageBucket: "ghini-pop.appspot.com",
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
form.addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent page reload

  // Get values from the form
  const title = document.getElementById('tribute-title').value;
  const name = document.getElementById('author-name').value;
  const message = document.getElementById('tribute-text').value;

  if (title && name && message) {
    console.log("Preparing to save tribute...");

    try {
      // Add tribute to Firestore
      await addDoc(collection(db, 'tributes'), {
        tributeTitle: title,
        authorName: name,
        tributeText: message,
        datePosted: serverTimestamp()
      });
      console.log("Tribute saved successfully!");
      form.reset();
      loadTributes(); // Refresh tributes after successful submission
    } catch (error) {
      console.error("Error saving tribute: ", error);
    }
  } else {
    alert('Please fill out all fields!');
  }
});

// Load tributes from Firestore
async function loadTributes() {
  tributeList.innerHTML = ''; // Clear existing tributes
  try {
    const querySnapshot = await getDocs(query(collection(db, 'tributes'), orderBy('datePosted', 'desc')));
    if (querySnapshot.empty) {
      tributeList.innerHTML = '<p>No tributes yet. Be the first to leave one!</p>';
    } else {
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
    }
  } catch (error) {
    console.error("Error fetching tributes: ", error);
  }
}

// Load tributes when the page loads
window.addEventListener('load', loadTributes);

// Biography logic
const bioContent = document.getElementById('bio-content');
const bioRef = doc(db, 'biography', 'Mq6aZovOKcG65Nw1QnBM');

// Fetch biography content from Firestore
async function loadBiography() {
  try {
    const docSnapshot = await getDoc(bioRef);
    if (docSnapshot.exists()) {
      console.log("Biography Document:", docSnapshot.data());
      const bioText = docSnapshot.data().Biography || "Biography not found in Firestore.";
      bioContent.innerHTML = bioText;
    } else {
      console.log("No such document in biography collection!");
    }
  } catch (error) {
    console.error("Error fetching biography: ", error);
  }
}

loadBiography();

// Save biography updates to Firestore (with debounce to reduce writes)
let debounceTimeout;
bioContent.addEventListener('input', function () {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    try {
      await setDoc(bioRef, { Biography: bioContent.innerHTML }, { merge: true });
      console.log("Biography updated!");
    } catch (error) {
      console.error("Error updating biography: ", error);
    }
  }, 500); // Wait 500ms before saving
});
// Image Upload to Imgur
document.getElementById('upload-button').addEventListener('click', async () => {
  const fileInput = document.getElementById('file-input');
  const status = document.getElementById('upload-status');
  const uploadedImageDiv = document.getElementById('uploaded-image');

  if (fileInput.files.length === 0) {
    status.textContent = "Please select an image to upload.";
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('image', file);

  status.textContent = "Uploading...";

  try {
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: 'Client-ID 6febd7ab930d37a'
      },
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      status.textContent = "Upload successful!";
      uploadedImageDiv.innerHTML = `<img src="${result.data.link}" alt="Uploaded Image" style="max-width: 100%;">`;
    } else {
      status.textContent = "Upload failed. Please try again.";
    }
  } catch (error) {
    status.textContent = "An error occurred. Please try again.";
    console.error(error);
  }
});
