async function submitSauce() {
    const input = document.getElementById('sauceInput').value;

    if (!input) {
        alert('Please enter a sauce!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/sauces', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sauce: input }),
        });

        if (response.ok) {
            alert('Your sauce has been submitted!');
            redirectToSaucesPage();
        } else {
            alert('Failed to submit your sauce. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

async function redirectToSaucesPage() {
    window.location.href = 'sauces.html';
}

async function fetchSaucesWithCounts() {
    try {
        const response = await fetch('http://localhost:3000/api/sauces-with-counts');
        if (response.ok) {
            const sauces = await response.json();
            const listContainer = document.getElementById('saucesList');
            listContainer.innerHTML = '';

            sauces.forEach(sauce => {
                const listItem = document.createElement('li');
                listItem.textContent = `${sauce._id}: ${sauce.count}`;
                listContainer.appendChild(listItem);
            });
        } else {
            console.error('Failed to fetch sauces with counts');
        }
    } catch (error) {
        console.error('Error fetching sauces with counts:', error);
    }
}