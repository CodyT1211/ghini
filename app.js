// Handle form submission for local tribute list (page-based)
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

// Firebase tribute submission
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
