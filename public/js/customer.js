if (window.location.pathname=="/customers/add") {
    document.getElementById('addcustomer').addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!name || !phone || !address) {
            document.getElementById('messagesaddcus').style.display = 'flex';
            const warningText = document.getElementById('messagecus');
            warningText.textContent = 'All fields are required!';
            return;
        }
        else if (name.length<3) {
            document.getElementById('messagesaddcus').style.display = 'flex';
            const warningText = document.getElementById('messagecus');
            warningText.textContent = 'name must be at least 3 digits';
            return;
        }
        else if (phone.length!=8) {
            document.getElementById('messagesaddcus').style.display = 'flex';
            const warningText = document.getElementById('messagecus');
            warningText.textContent = 'phone must be 8 digits';
            return;
        }
        else if (address.length<6) {
            document.getElementById('messagesaddcus').style.display = 'flex';
            const warningText = document.getElementById('messagecus');
            warningText.textContent = 'address must be at least 6 characters';
            return;
        }

        try {
            const response = await fetch('/api/customers/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, phone, address }),
            });

            const result = await response.json();

            
            if (response.ok) {
                document.getElementById('messagesaddcus').style.display = 'flex';
                const warningText = document.getElementById('messagecus');
                warningText.textContent = result.message;
                document.getElementById('name').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('address').value = '';

            } else {
                document.getElementById('messagesaddcus').style.display = 'flex';
                const warningText = document.getElementById('messagecus');
                warningText.textContent = result.error.message;
            }
        } catch (error) {
            alert('An error occurred while adding the supplier.');
        }
    });
}


async function Customers() {

    try {
        const response = await fetch('/api/customers');
        const customers = await response.json();
        const customerscontainer = document.getElementById('getcustomers');
        customerscontainer.innerHTML = '';

        customers.data.forEach(customer => {
            const row = document.createElement('div');
            row.classList.add('rows');

            row.innerHTML = `
                <p class="columns">${customer.name}</p>
                <p class="columns" >${customer.phone}</p>
                <p class="columns">${customer.address}</p>
                <div class="actions">
                    <a href="/suppliers/edit/${customer._id}" class="edits">
                        <img src="/images/edit.png" class="edit" alt="edit">
                    </a>
                    <img src="/images/delete.png" class="delete" alt="delete" onclick="confirmDelete('${customer._id}')" />
                </div>
            `;

            customerscontainer.appendChild(row);
        });

    } catch (error) {
        console.error('Error loading customers:', error);
        alert('Failed to load customers.');
    }
};
if (window.location.pathname=="/customers"){
    Customers();

    // delete a supplier
    // let deleteId = null; 
    function confirmDelete(id) {
        deleteId = id; 
        // document.getElementById('customAlert').style.display = 'flex';
    }
    // function handleYes() {
    //     if (deleteId !== null) {
    //         deletesupplier(deleteId);
    //         deleteId = null;
    //     }
    //     document.getElementById('customAlert').style.display = 'none';
    // }
    // function handleNo() {
    //     deleteId = null; 
    //     document.getElementById('customAlert').style.display = 'none';
    // }
    // async function deletesupplier(id) {
    //         try {
    //             const response = await fetch(`/api/suppliers/delete/${id}`, { method: 'DELETE' });
    //             const result = await response.json();
                
    //             if (result.message=="Supplier deleted successfully") {
    //                 Suppliers();
    //             } else {
    //                 alert('Failed to delete supplier');
    //             }
    //         } catch (error) {
    //             console.error('Error deleting category:', error);
    //         }
    // }

}




// add alerts
function handlesupok() {
    document.getElementById('messagesaddcus').style.display = 'none';
}