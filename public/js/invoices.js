async function getallinvoices() {
    document.querySelector('.containerAproducts').style.display="none"; 
    document.querySelector(".loading").style.display="block"
    try {
    
        const response = await fetch(`/api/invoice/all`);
        const invoice = await response.json();

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
                <p class="columns">${inv.total ? inv.total.toFixed(2) : '0.00'}$</p>
                <p class="columns">${inv.profit ? inv.profit.toFixed(2) : '0.00'}$</p>
                <div class="columns"><p class="showProductsBtn">Show Products</p><br><a style="text-decoration: none" href="/api/invoice/invoice/${inv._id}" target=_blank class="showProductsBtn">Download</a></div>
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
        document.querySelector('.containerAproducts').style.display="block"; 
    
    } catch (error) {
        console.error('Error fetching invoices:', error);
    }

};

if (window.location.pathname=="/invoices") {
    getallinvoices()

    document.querySelector('.closeinvpro').addEventListener('click', () => {
        document.querySelector(".proAninv").style.display = "none";
    });
}

if(window.location.pathname=="/refund-invoice"){
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
    const form = document.getElementById('refundInvoice');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const invoice_nb = formData.get('invoice_nb');
        const customAlert = document.getElementById('customAlert');
        customAlert.style.display = 'flex';
    });


}
const handleYesRefund = async () => {
    const form = document.getElementById('refundInvoice');
    const formData = new FormData(form);
    const loading = document.getElementById('loading');
    const invoice_nb = formData.get('invoice_nb');
    const customAlert = document.getElementById('customAlert');
    const message = document.getElementById('message');
    const container = document.querySelector('.refundcontainer');
    loading.style.display = 'flex';
    customAlert.style.display = 'none';

    const response = await fetch('/api/invoice/refund-invoice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoice_nb }),
    });
    const data = await response.json();
    if (response.ok) {
        document.getElementById('customAlert').style.display = 'none';
        const input = document.getElementById('invoice_nb');
        container.style.display = 'flex';
        console.log(container);
        loading.style.display = 'none';
        message.innerText = data.message;
        input.value = '';
    }
    else {
        loading.style.display = 'none';
        document.querySelector('.refundcontainer').style.display = 'flex';
        message.innerText = data.message;
    }
};

const handleNoRefund = () => {
    document.getElementById('customAlert').style.display = 'none';
};

const handleOkRefund = () => {
    document.querySelector('.refundcontainer').style.display = 'none';
}

