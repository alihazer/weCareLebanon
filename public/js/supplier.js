if (window.location.pathname=="/suppliers/add") {
    document.getElementById('addsup').addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!name || !phone || !address) {
            document.getElementById('messagesaddsup').style.display = 'flex';
            const warningText = document.getElementById('messagesup');
            warningText.textContent = 'All fields are required!';
            return;
        }
        else if (name.length<3) {
            document.getElementById('messagesaddsup').style.display = 'flex';
            const warningText = document.getElementById('messagesup');
            warningText.textContent = 'name must be at least 3 digits';
            return;
        }
        else if (phone.length!=8) {
            document.getElementById('messagesaddsup').style.display = 'flex';
            const warningText = document.getElementById('messagesup');
            warningText.textContent = 'phone must be 8 digits';
            return;
        }
        else if (address.length<6) {
            document.getElementById('messagesaddsup').style.display = 'flex';
            const warningText = document.getElementById('messagesup');
            warningText.textContent = 'address must be at least 6 characters';
            return;
        }

        try {
            const response = await fetch('/api/suppliers/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, phone, address }),
            });

            const result = await response.json();

            if (response.ok) {
                document.getElementById('messagesaddsup').style.display = 'flex';
                const warningText = document.getElementById('messagesup');
                warningText.textContent = result.message;
                document.getElementById('name').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('address').value = '';

            } else {
                document.getElementById('messagesaddsup').style.display = 'flex';
                const warningText = document.getElementById('messagesup');
                warningText.textContent = result.error.message;
            }
        } catch (error) {
            alert('An error occurred while adding the supplier.');
        }
    });
}

// get all suppliers
async function Suppliers() {

    try {
        const response = await fetch('/api/suppliers');
        const suppliers = await response.json();
        const productsContainer = document.querySelector('.products');
        productsContainer.innerHTML = '';

        suppliers.data.forEach(supplier => {
            const row = document.createElement('div');
            row.classList.add('rows');

            row.innerHTML = `
                <p class="columns">${supplier.name}</p>
                <p class="columns" >${supplier.phone}</p>
                <p class="columns">${supplier.address}</p>
                <div class="actions">
                    <a href="/suppliers/edit/${supplier._id}" class="edits">
                        <img src="/images/edit.png" class="edit" alt="edit">
                    </a>
                    <img src="/images/delete.png" class="delete" alt="delete" onclick="confirmDelete('${supplier._id}')" />
                </div>
            `;

            productsContainer.appendChild(row);
        });

    } catch (error) {
        console.error('Error loading suppliers:', error);
        alert('Failed to load suppliers.');
    }
};
if (window.location.pathname=="/suppliers"){
    Suppliers();

    // delete a supplier
    let deleteId = null; 
    function confirmDelete(id) {
        deleteId = id; 
        document.getElementById('customAlert').style.display = 'flex';
    }
    function handleYes() {
        if (deleteId !== null) {
            deletesupplier(deleteId);
            deleteId = null;
        }
        document.getElementById('customAlert').style.display = 'none';
    }
    function handleNo() {
        deleteId = null; 
        document.getElementById('customAlert').style.display = 'none';
    }
    async function deletesupplier(id) {
            try {
                const response = await fetch(`/api/suppliers/delete/${id}`, { method: 'DELETE' });
                const result = await response.json();
                
                if (result.message=="Supplier deleted successfully") {
                    Suppliers();
                } else {
                    alert('Failed to delete supplier');
                }
            } catch (error) {
                console.error('Error deleting category:', error);
            }
    }

}



async function getSupplier() {
    try {
        const urlPath = window.location.pathname;
        const segments = urlPath.split('/');
        const supid = segments[segments.length - 1]; 

        const response = await fetch(`/api/suppliers/${supid}`);
        const sup = await response.json();

        if (sup && sup.data) {
            const nameInput = document.getElementById('name');
            nameInput.value = sup.data.name; 

            const phone = document.getElementById('phone');
            phone.value = sup.data.phone;    

            const address = document.getElementById('address');
            address.value = sup.data.address; 
        } else {
            console.error('supplier not found');
        }
    } catch (error) {
        console.error('Error fetching the supplier:', error);
    }
}
// edit supplier
if (window.location.pathname.startsWith("/suppliers/edit")) {
    getSupplier();
    document.getElementById('editsup').addEventListener('submit', async function (e) {
        e.preventDefault(); 
    
        const urlPath = window.location.pathname;
        const segments = urlPath.split('/');
        const supid = segments[segments.length - 1]; 
    
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
    
        if (!name || !phone || !address) {
            document.getElementById('messagesaddsup').style.display = 'flex';
            const warningText = document.getElementById('messagesup');
            warningText.textContent = 'All fields are required!';
            return;
        }
        else if (name.length<3) {
            document.getElementById('messagesaddsup').style.display = 'flex';
            const warningText = document.getElementById('messagesup');
            warningText.textContent = 'name must be at least 3 digits';
            return;
        }
        else if (phone.length!=8) {
            document.getElementById('messagesaddsup').style.display = 'flex';
            const warningText = document.getElementById('messagesup');
            warningText.textContent = 'phone must be 8 digits';
            return;
        }
        else if (address.length<6) {
            document.getElementById('messagesaddsup').style.display = 'flex';
            const warningText = document.getElementById('messagesup');
            warningText.textContent = 'address must be at least 6 characters';
            return;
        }

        try {
            const response = await fetch(`/api/suppliers/edit/${supid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name , phone, address }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                document.getElementById('messagesaddsup').style.display = 'flex';
                const warningText = document.getElementById('messagesup');
                warningText.textContent = result.message;
            } else {
                document.getElementById('messagesaddsup').style.display = 'flex';
                const warningText = document.getElementById('messagesup');
                warningText.textContent = result.error.message;
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    });
}




// add alerts
function handlesupok() {
    document.getElementById('messagesaddsup').style.display = 'none';
}