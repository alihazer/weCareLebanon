document.getElementById('addCat').addEventListener('submit', async function (e) {
    e.preventDefault(); 

    const name = document.getElementById('name').value;

    if (!name) {
        alert('Please enter a name');
        return;
    }
    else if (name.length < 3) {
        alert('Name must be at least 3 characters');
        return;
    } 
        const response = await fetch('/api/categories/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });

        const result = await response.json();
        console.log(result);
        if (response.ok) {
            alert(result.message);
            document.getElementById('name').value = '';
        } else {
            alert(result.message);
        }
});