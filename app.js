// Initialize Firebase and Firestore
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Select the form and tribute list
const form = document.getElementById('tribute-form');
const tributeList = document.getElementById('tribute-list');

// Handle form submission
form.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent page reload

  // Get name and message from the form
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;

  if (name && message) {
    // Add tribute to the page immediately
    const tributeDiv = document.createElement('div');
    tributeDiv.classList.add('tribute');
    tributeDiv.innerHTML = `<h3>${name}</h3><p>${message}</p>`;
    tributeList.appendChild(tributeDiv);

    // Save tribute to Firestore
    db.collection('tributes').add({
      authorName: name,
      tributeText: message,
      datePosted: firebase.firestore.FieldValue.serverTimestamp(), // Automatically adds timestamp
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
  db.collection('tributes').orderBy('datePosted', 'desc').get().then((querySnapshot) => {
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
const bioRef = db.collection('biography').doc('Mq6aZovOKcG6Nw1QnBM'); // Use the exact document ID from your screenshot

bioRef.get().then((doc) => {
  if (doc.exists) {
    // Display biography text from Firestore
    const bioText = doc.data().Biography; // Match the field name in Firestore
    bioContent.innerHTML = bioText;
  } else {
    console.log("No such document!");
  }
}).catch((error) => {
  console.error("Error fetching biography: ", error);
});

// Save biography updates to Firestore when content changes
bioContent.addEventListener('input', function () {
  bioRef.set({
    Biography: bioContent.innerHTML
  }, { merge: true }) // Merge to avoid overwriting other fields
    .then(() => {
      console.log("Biography updated!");
    }).catch((error) => {
      console.error("Error updating biography: ", error);
    });
});
