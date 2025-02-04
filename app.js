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
