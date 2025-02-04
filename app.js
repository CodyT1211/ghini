// Handle form submission
document.getElementById('tribute-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload

    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    if (name && message) {
        const tributeList = document.getElementById('tribute-list');
        const newTribute = document.createElement('div');
        newTribute.classList.add('tribute');
        newTribute.innerHTML = `<strong>${name}</strong><p>${message}</p>`;
        
        tributeList.appendChild(newTribute);

        // Clear form after submission
        document.getElementById('name').value = '';
        document.getElementById('message').value = '';
    } else {
        alert('Please enter both name and message!');
    }
});
// Select the form and tribute list
const form = document.getElementById('tribute-form');
const tributeList = document.getElementById('tribute-list');

// Event listener for form submission
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page refresh

    // Get name and message from the form
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    // Create a new div to display the tribute
    const tributeDiv = document.createElement('div');
    tributeDiv.classList.add('tribute');

    // Create HTML content for the tribute
    tributeDiv.innerHTML = `
        <h3>${name}</h3>
        <p>${message}</p>
    `;

    // Append the new tribute to the list
    tributeList.appendChild(tributeDiv);

    // Clear the form after submission
    form.reset();
});
// Select the biography content element
const bioContent = document.getElementById('bio-content');

// Check if there’s saved biography content in localStorage
if (localStorage.getItem('biography')) {
    bioContent.innerHTML = localStorage.getItem('biography');
}

// Save the biography content when it changes
bioContent.addEventListener('input', function() {
    localStorage.setItem('biography', bioContent.innerHTML);
});
const tributeForm = document.getElementById('tribute-form');

tributeForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const tributeTitle = document.getElementById('tribute-title').value;
  const tributeText = document.getElementById('tribute-text').value;
  const authorName = document.getElementById('author-name').value;

  // Save tribute to Firestore
  db.collection('tributes').add({
    tributeTitle: tributeTitle,
    tributeText: tributeText,
    authorName: authorName,
    datePosted: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Tribute submitted!");
    tributeForm.reset();
  }).catch((error) => {
    console.error("Error submitting tribute: ", error);
  });
});
// Reference to Firestore database
const db = firebase.firestore();

// Get biography data
const bioRef = db.collection('biographies').doc('john-doe'); // or use auto-generated ID

bioRef.get().then((doc) => {
  if (doc.exists) {
    // Display biography text on the page
    const bioText = doc.data().bioText;
    document.getElementById('bio-text').innerHTML = bioText;
  } else {
    console.log("No such document!");
  }
});

const bioRef = db.collection('biographies').doc('john-doe'); // or auto-generated ID

// Update bioText field
bioRef.set({
  bioText: "Updated biography text here!"
}, { merge: true }) // merge to avoid overwriting other fields
.then(() => {
  console.log("Biography updated!");
})
.catch((error) => {
  console.error("Error updating biography: ", error);
});
