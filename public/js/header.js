// pages
document.querySelector('.menuIcon').addEventListener('click', () => {
    document.querySelector('.menuContainer').style.left='0';
});
document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('.menuContainer').style.left = '-170%';
});
document.querySelector('.closeContainer').addEventListener('click', () => {
    document.querySelector('.menuContainer').style.left = '-170%';
});


// invoices
document.querySelector('.invoiceIcon').addEventListener('click', () => {
    document.querySelector('.invoiceContainer').style.right='0';
});
document.querySelector('.closeinvoice').addEventListener('click', () => {
    document.querySelector('.invoiceContainer').style.right = '-100%';
});
document.querySelector('.Xclose').addEventListener('click', () => {
    document.querySelector('.invoiceContainer').style.right = '-100%';
});


// get costomers
async function customerOrder() {
    
    try {
        const response = await fetch('/api/customers');
        const result = await response.json();
        const cusSelect = document.getElementById('chooseCus');

        if (response.ok) {
            const customers = result.data;
            
            customers.forEach(cus => {
                const option = document.createElement('option');
                option.value = cus._id; 
                option.textContent = cus.name;
                cusSelect.appendChild(option);
            });
        } else {
            alert('Failed to load customers.');
        }
    } catch (error) {
        console.error('Error loading customers:', error);
        alert('An error occurred while loading customers.');
    }
}
customerOrder();


document.getElementById('logoutButton').addEventListener('click', async () => {
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    window.location.href="/login"
});

