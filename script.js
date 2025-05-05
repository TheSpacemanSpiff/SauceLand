// Populate sauce list from JSON for autocomplete
async function populateSauceList() {
    const sauceList = document.getElementById('sauceList');
    if (!sauceList) return; // Exit if not on the submission page
    
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

// Submit new sauce
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

// Redirect to results page
async function redirectToSaucesPage() {
    window.location.href = 'sauces.html';
}

// Table population logic for sauces.html
document.addEventListener('DOMContentLoaded', () => {
    // Call populateSauceList if we're on the submission page
    if (document.getElementById('sauceList')) {
        populateSauceList();
    }
    
    // Call populateSaucesTable if we're on the results page
    if (document.getElementById('saucesTableBody')) {
        async function populateSaucesTable() {
            try {
                // Fetch sauce counts from database
                const countResponse = await fetch('http://localhost:3000/api/sauces-with-counts');
                // Fetch sauce metadata from JSON file
                const metadataResponse = await fetch('sauces.json');
                
                if (countResponse.ok && metadataResponse.ok) {
                    const sauceCounts = await countResponse.json();
                    const sauceMetadata = await metadataResponse.json();
                    
                    // Create a map for exact sauce names and their metadata
                    const metadataMap = {};
                    // Create a map for case-insensitive lookup
                    const lowercaseMap = {};
                    
                    sauceMetadata.forEach(sauce => {
                        // Store the canonical name and metadata
                        metadataMap[sauce.name] = sauce;
                        // Store lowercase version for matching
                        const lowerName = sauce.name.toLowerCase();
                        lowercaseMap[lowerName] = sauce;
                        // Also store version without "sauce" suffix
                        const nameWithoutSauce = lowerName.replace(/\s+sauce$/, '');
                        if (nameWithoutSauce !== lowerName) {
                            lowercaseMap[nameWithoutSauce] = sauce;
                        }
                    });
                    
                    const tableBody = document.getElementById('saucesTableBody');
                    tableBody.innerHTML = '';

                    // Process database results
                    sauceCounts.forEach(sauceCount => {
                        const dbNameLower = sauceCount._id;
                        
                        // Find the matching metadata using case-insensitive comparison
                        const metadata = lowercaseMap[dbNameLower];
                        
                        if (metadata) {
                            const row = document.createElement('tr');
                            
                            // Vote count
                            const voteCell = document.createElement('td');
                            voteCell.textContent = sauceCount.count;
                            row.appendChild(voteCell);
                            
                            // Sauce name (using proper case from JSON)
                            const sauceCell = document.createElement('td');
                            sauceCell.textContent = metadata.name;
                            row.appendChild(sauceCell);
                            
                            // Country
                            const countryCell = document.createElement('td');
                            countryCell.textContent = metadata.country;
                            row.appendChild(countryCell);
                            
                            // Category
                            const categoryCell = document.createElement('td');
                            categoryCell.textContent = metadata.category;
                            row.appendChild(categoryCell);
                            
                            tableBody.appendChild(row);
                        }
                    });
                } else {
                    console.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        
        populateSaucesTable();
    }
});