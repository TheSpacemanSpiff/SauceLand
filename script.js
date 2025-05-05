const sauces = [
    { name: "Mayonnaise", category: "Dip", country: "France" },
    { name: "Bolognese", category: "Dish", country: "Italy" },
    // Add 98 more sauces here...
];

async function populateSauceList() {
    const sauceList = document.getElementById('sauceList');
    sauceList.innerHTML = ''; // Clear existing options

    try {
        const response = await fetch('sauces.json');
        if (response.ok) {
            const sauces = await response.json();
            sauces.forEach(sauce => {
                const option = document.createElement('option');
                option.value = sauce.name; // Only show the name of the sauce
                sauceList.appendChild(option);
            });
        } else {
            console.error('Failed to fetch sauces.json');
        }
    } catch (error) {
        console.error('Error fetching sauces.json:', error);
    }
}

// Call the function to populate the datalist on page load
populateSauceList();

async function submitSauce() {
    const input = document.getElementById('sauceInput').value;

    // Check if the input matches a valid sauce from the list
    const isValidSauce = Array.from(document.getElementById('sauceList').options)
        .some(option => option.value === input);

    if (!isValidSauce) {
        alert('Please select a valid sauce from the list!');
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