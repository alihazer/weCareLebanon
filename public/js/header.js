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
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' ,
                'Accept': 'application/json',
            },

        });
        const result = await response.json();
        if (response.ok) {
            window.location.href = '/login';
        } else {
            alert('Failed to logout');
        }
    } catch (error) {
        console.error('Error logging out:', error);
        alert('An error occurred while logging out');
    }
});

