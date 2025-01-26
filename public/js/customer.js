// add a customer
if (window.location.pathname=="/customers/add") {

    document.getElementById('addcustomer').addEventListener('submit', async function (e) {
        e.preventDefault();
        document.getElementById('addcus').disabled = true;

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!name || !phone || !address) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('messagecus');
            warningText.textContent = 'All fields are required!';
            return;
        }
        else if (name.length<3) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('messagecus');
            warningText.textContent = 'name must be at least 3 digits';
            return;
        }
        else if (phone.length!=8) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('messagecus');
            warningText.textContent = 'phone must be 8 digits';
            return;
        }
        else if (address.length<6) {
            document.querySelector('.catcontainer').style.display = 'flex';
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
                document.querySelector('.catcontainer').style.display = 'flex';
                const warningText = document.getElementById('messagecus');
                warningText.textContent = result.message;
                document.getElementById('name').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('address').value = '';

            } else {
                document.querySelector('.catcontainer').style.display = 'flex';
                const warningText = document.getElementById('messagecus');
                warningText.textContent = result.message;
            }
        } catch (error) {
            alert('An error occurred while adding the supplier.');
        }
    });
}

// get all customers
async function Customers() {
        document.querySelector(".products").style.display="none";
        document.querySelector(".loading").style.display="block"
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
                    <a href="/customers/view/${customer._id}" class="edits">
                        <img src="/images/view.png" class="edit" alt="view">
                    </a>
                    <a href="/customers/edit/${customer._id}" class="edits">
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
    finally{
        document.querySelector(".loading").style.display="none";
        document.querySelector(".products").style.display="block";
    }
};
if (window.location.pathname=="/customers"){
    Customers();

    // delete a customer
    let deleteId = null; 
    function confirmDelete(id) {
        deleteId = id; 
        document.getElementById('customAlert').style.display = 'flex';
    }
    function handleYes() {
        if (deleteId !== null) {
            deletecustomer(deleteId);
            deleteId = null;
        }
        document.getElementById('customAlert').style.display = 'none';
    }
    function handleNo() {
        deleteId = null; 
        document.getElementById('customAlert').style.display = 'none';
    }
    async function deletecustomer(id) {
            try {
                const response = await fetch(`/api/customers/delete/${id}`, { method: 'DELETE' });
                const result = await response.json();
                
                if (result.message=="Customer deleted successfully") {
                    Customers();
                } else {
                    alert('Failed to delete customer');
                }
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
    }

}


// get a customer
async function getCustomer() {
        document.getElementById("editcustomer").style.display="none";
        document.querySelector(".loading").style.display="block"
    try {
        const urlPath = window.location.pathname;
        const segments = urlPath.split('/');
        const cusid = segments[segments.length - 1]; 

        const response = await fetch(`/api/customers/${cusid}`);
        const customer = await response.json();
        
        if (customer && customer.data) {
            const nameInput = document.getElementById('name');
            nameInput.value = customer.data.name; 

            const phone = document.getElementById('phone');
            phone.value = customer.data.phone;    

            const address = document.getElementById('address');
            address.value = customer.data.address; 
        } else {
            console.error('supplier not found');
        }
    } catch (error) {
        console.error('Error fetching the supplier:', error);
    }
    finally{
        document.querySelector(".loading").style.display="none"
        document.getElementById("editcustomer").style.display="flex";
    }
}
// edit supplier
if (window.location.pathname.startsWith("/customers/edit")) {
    getCustomer();

    document.getElementById('editcustomer').addEventListener('submit', async function (e) {
        e.preventDefault(); 
        document.getElementById('updatecus').disabled = true;

        const urlPath = window.location.pathname;
        const segments = urlPath.split('/');
        const cusid = segments[segments.length - 1]; 
    
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
    

        if (!name || !phone || !address) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('messagecus');
            warningText.textContent = 'All fields are required!';
            return;
        }
        else if (name.length<3) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('messagecus');
            warningText.textContent = 'name must be at least 3 digits';
            return;
        }
        else if (phone.length!=8) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('messagecus');
            warningText.textContent = 'phone must be 8 digits';
            return;
        }
        else if (address.length<6) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('messagecus');
            warningText.textContent = 'address must be at least 6 characters';
            return;
        }

        try {
            const response = await fetch(`/api/customers/edit/${cusid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name , phone, address }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                document.querySelector('.catcontainer').style.display = 'flex';
                const warningText = document.getElementById('messagecus');
                warningText.textContent = result.message;
            } else {
                document.querySelector('.catcontainer').style.display = 'flex';
                const warningText = document.getElementById('messagecus');
                warningText.textContent = result.message;
            }
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    });
}


async function getAcustomer() {
    document.querySelector(".containerAproducts").style.display="none";
    document.querySelector(".loading").style.display="block"
    try {
        const urlPath = window.location.pathname;
        const segments = urlPath.split('/');
        const cusid = segments[segments.length - 1]; 

        const response = await fetch(`/api/customers/${cusid}`);
        const customer = await response.json();

        if (customer && customer.data) {
        const productsContainer = document.getElementById('getcustomers');
        productsContainer.innerHTML = '';

                const row = document.createElement('div');
                row.classList.add('headrow');

                row.innerHTML = `
                    <p class="columns">${customer.data.name}</p>
                    <p class="columns" >${customer.data.phone}</p>
                    <p class="columns">${customer.data.address}</p>
                `;

                productsContainer.appendChild(row);
        }

    } catch (error) {
        console.error('Error loading customer:', error);
        alert('Failed to load customer.');
    }
    finally{
        document.querySelector(".loading").style.display="none"
        document.querySelector(".containerAproducts").style.display="block";
    }
};


async function getinvoicesbyCus() {
    document.querySelector('.NhaveProSup').style.display="none"; 
    document.querySelector('.invCustomer').style.display="none"; 
    document.querySelector(".loading").style.display="block"
    try {
        let fromdate=document.getElementById("fromdateCus").value? `&startDate=${document.getElementById("fromdateCus").value}`:'';
        let todate=document.getElementById("todatecus").value? `&endDate=${document.getElementById("todatecus").value}`:'';


        const urlPath = window.location.pathname;
        const segments = urlPath.split('/');
        const cusid = segments[segments.length - 1]; 
    
        const response = await fetch(`/api/invoice/customer/${cusid}?${fromdate}${todate}`);
        const invoice = await response.json();
        
    if (invoice.data.length === 0) {
        document.querySelector(".loading").style.display="none"
        document.querySelector('.NhaveProSup').style.display="block"; 
    } else {
        const invContainer = document.querySelector('.getinvoices');
        invContainer.innerHTML = '';

        invoice.data.forEach(inv => {
            const createdAt = new Date(inv.createdAt); 
        
            const formattedDate = createdAt.toLocaleString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            });            
        
            const invsElement = document.createElement('div');
            invsElement.className = 'infoinvcus';
            invsElement.innerHTML = `
                <p class="columns">${formattedDate}</p>
                <p class="columns">${inv.invoiceNumber}</p>
                <p class="columns">${inv.discount}%</p>
                <p class="columns">${inv.total}$</p>
                <p class="columns">${inv.profit}$</p>
                <div class="columns"><p class="showProductsBtn">Show Products</p></div>
            `;
        
            invContainer.appendChild(invsElement);
        

            const showProductsBtn = invsElement.querySelector('.showProductsBtn');
            showProductsBtn.addEventListener('click', () => {
                document.querySelector(".proAninv").style.display = "flex";
        
                const productsContainer = document.querySelector('.getinvpro');
                productsContainer.innerHTML = ''; 
                inv.products.forEach(product => {
                    const productElement = document.createElement('div');
                    productElement.className = 'infoproinvcus';
                    productElement.innerHTML = `
                        <p class="columns">${product.productId.name}</p>
                        <p class="columns">${product.price}$</p>
                        <p class="columns">${product.quantity}</p>
                    `;
                    productsContainer.appendChild(productElement);
                });
            });
        });
        
        document.querySelector(".loading").style.display="none"
        document.querySelector('.NhaveProSup').style.display="none"; 
        document.querySelector('.invCustomer').style.display="block"; 
    }
    } catch (error) {
        console.error('Error fetching invoices:', error);
    }

};
if (window.location.pathname.startsWith("/customers/view/")) {
    getAcustomer()
    getinvoicesbyCus();
    document.getElementById('fromdateCus').addEventListener('change', () => {
        getinvoicesbyCus()
    });
    document.getElementById('todatecus').addEventListener('change', () => {
        getinvoicesbyCus()
    });
    document.querySelector('.closeinvpro').addEventListener('click', () => {
        document.querySelector(".proAninv").style.display = "none";
    });
}





// add alerts
function handlecusok() {
    document.querySelector('.catcontainer').style.display = 'none';
    document.getElementById('addcus').disabled = false;

}
function handleeditcusok() {
    document.querySelector('.catcontainer').style.display = 'none';
    document.getElementById('updatecus').disabled = false;

}