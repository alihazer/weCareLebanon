

const text = document.querySelector('#text');
const btn = document.querySelector('#addTextQuotationBtn');


btn.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check if the text input is empty
    if (text.value.trim() === '') {
        document.querySelector('.catcontainer').style.display = 'flex';
        const warningText = document.getElementById('message');
        warningText.textContent = 'Please enter a quotation';
        return;
    }

    try {
        // // Hide the main content and show the loader
        // document.getElementById('mainDiv').style.display = 'none';
        // document.querySelector('.loading').style.display = 'flex';

        // Send the text to the backend
        const res = await fetch('/api/products/quotation/create-text-quotation', {
            method: 'POST',
            body: JSON.stringify({ text: text.value }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await res.json();

        if (data.success) {
            // Decode the base64 string to binary data
            const binaryData = atob(data.pdf);
            const bytes = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
                bytes[i] = binaryData.charCodeAt(i);
            }

            // Create a Blob from the binary data
            const blob = new Blob([bytes], { type: 'application/pdf' });

            // Create a temporary link to trigger the download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = data.filename || 'quotation.pdf'; // Use the filename from the response
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } else {
            console.error('Failed to create quotation:', data.error);
            alert('Failed to create quotation.');
        }
    } catch (error) {
        console.error('Error creating quotation:', error);
        alert('Failed to create quotation.');
    } finally {
        // // Show the main content and hide the loader
        // document.getElementById('mainDiv').style.display = 'block';
        // document.querySelector('.loading').style.display = 'none';
    }
});

function handleokquot() {
    document.querySelector('.catcontainer').style.display = 'none';
}