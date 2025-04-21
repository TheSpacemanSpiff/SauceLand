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
        } else {
            alert('Failed to submit your sauce. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}