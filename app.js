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
      name: name,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Automatically adds timestamp
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
  db.collection('tributes').orderBy('timestamp', 'desc').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const tribute = doc.data();

      // Create and display the tribute
      const tributeDiv = document.createElement('div');
      tributeDiv.classList.add('tribute');
      tributeDiv.innerHTML = `
        <h3>${tribute.name}</h3>
        <p>${tribute.message}</p>
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
const bioRef = db.collection('biographies').doc('john-doe'); // Use the appropriate document ID or auto-generated ID

bioRef.get().then((doc) => {
  if (doc.exists) {
    // Display biography text from Firestore
    const bioText = doc.data().bioText;
    bioContent.innerHTML = bioText;
  } else {
    console.log("No such document!");
  }
});

// Save biography updates to Firestore when content changes
bioContent.addEventListener('input', function () {
  bioRef.set({
    bioText: bioContent.innerHTML
  }, { merge: true }) // Merge to avoid overwriting other fields
    .then(() => {
      console.log("Biography updated!");
    }).catch((error) => {
      console.error("Error updating biography: ", error);
    });
});
