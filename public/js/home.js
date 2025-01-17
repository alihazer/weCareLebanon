// get categories
async function getCategories() {
    
    try {
        const response = await fetch('/api/categories');
        const result = await response.json();
        const categorySelect = document.getElementById('categoryfilter');

        if (response.ok) {
            const categories = result.data;
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category._id; 
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } else {
            alert('Failed to load categories.');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        alert('An error occurred while loading categories.');
    }
}

// get home products
async function gethomeProducts() {
    document.querySelector(".homeproducts").style.display="none";
    document.querySelector(".loader").style.display="block";
    try {
        let salevalue=document.getElementById('sale').value
        let categoryvalue=document.getElementById('categoryfilter').value
        const category =categoryvalue=="all"?
                        '':`&category=${categoryvalue}`;       
        
        const response = await fetch(`/api/products?quantity=gt0${category}`); 
        const products = await response.json();
        
        const homeProductsContainer = document.querySelector('.homeproducts'); 
        homeProductsContainer.innerHTML = ''; 

        if (products.data.length === 0) {
            homeProductsContainer.innerHTML = '<p class="noProducts">No products found</p>';
        } else {

            products.data.forEach(product => {
                const productElement = document.createElement('div'); 
                productElement.className = 'homeproduct';
                
                productElement.innerHTML = `
                    <div class="product-image" style="background-image: url('${product.image ? product.image : "/images/default-product.png"}');"></div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">${salevalue=="wholesale"? product.wholeSalePrice : product.singlePrice}$</p>
                    </div>
                `;
                productElement.addEventListener('click', () => {
                    AddToInvoice(product);
                })
                homeProductsContainer.appendChild(productElement);
            });

        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
    finally{
        
        document.querySelector(".homeproducts").style.display="flex";
        document.querySelector(".loader").style.display="none";
    }
}


if (window.location.pathname === "/") {
    getCategories();
    gethomeProducts();
}
function changeFilterCategory(){
    gethomeProducts();
}
function changeFilterSale(){
    gethomeProducts();
}




// add to invoice
// Object to track product quantities by their IDs
const productQuantities = {};

function AddToInvoice(product) {
    let salevalue = document.getElementById('sale').value;
    const invoiceProductsContainer = document.querySelector('.invoiceproducts');

    const productKey = product.wholeSalePrice === product.singlePrice 
        ? product._id 
        : `${product._id}-${salevalue}`;

    // Check if the product already exists in the invoice
    const existingProduct = Array.from(invoiceProductsContainer.children).find(invoiceProduct => {
        return invoiceProduct.getAttribute('data-product-key') === productKey;
    });

    // Calculate the total quantity already in the invoice for this product
    const totalQuantityInInvoice = Array.from(invoiceProductsContainer.children)
        .filter(invoiceProduct => invoiceProduct.getAttribute('data-product-id') === product._id.toString())
        .reduce((sum, invoiceProduct) => {
            const quantityElement = invoiceProduct.querySelector('.quantitypronb');
            return sum + parseInt(quantityElement.textContent, 10);
        }, 0);

    if (existingProduct) {
        // If the product already exists, increase its quantity
        const quantityElement = existingProduct.querySelector('.quantitypronb');
        const currentQuantity = parseInt(quantityElement.textContent, 10);
        if (totalQuantityInInvoice < product.quantity) {
            const newQuantity = currentQuantity + 1;
            quantityElement.textContent = newQuantity;

            productQuantities[productKey] = newQuantity;
            calculateTotal();
            document.querySelector('.invoiceContainer').style.right = '0';
        } else {
            alert("No more products to add");
        }

    } else {
        if (totalQuantityInInvoice < product.quantity) {
            // Add the product to the invoice
            const invoiceProduct = document.createElement('div');
            invoiceProduct.className = 'invoiceproduct';
            invoiceProduct.setAttribute('data-product-key', productKey);
            invoiceProduct.setAttribute('data-product-id', product._id);

            invoiceProduct.innerHTML = `
                <div class="productimage" style="background-image: url('${product.image ? product.image : "/images/default-product.png"}');"></div>
                <div class="productinfo">
                    <h3 class="productname">${product.name}</h3>
                    <div class="priceAndquantity">
                        <p class="productprice">${salevalue == "wholesale" ? product.wholeSalePrice : product.singlePrice}$</p>
                        <div class="quantitypro">
                            <p class="min" id="mines">-</p>
                            <p class="quantitypronb" id="quantitynb">1</p>
                            <p class="min" id="plus">+</p>
                        </div>
                    </div>
                </div>
                <svg class="removepro" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="#17526B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;

            productQuantities[productKey] = 1;
            document.querySelector('.invoiceContainer').style.right = '0';

            // Decrease the quantity
            invoiceProduct.querySelector('#mines').addEventListener('click', () => {
                const quantityElement = invoiceProduct.querySelector('.quantitypronb');
                const currentQuantity = parseInt(quantityElement.textContent, 10);
                if (currentQuantity > 1) {
                    
                    const newQuantity = currentQuantity - 1;
                    quantityElement.textContent = newQuantity;
                    
                    productQuantities[productKey] = newQuantity;
                    calculateTotal();
                } else {
                    invoiceProduct.remove();
                    delete productQuantities[productKey];
                    calculateTotal();
                }
            });

            // Increase quantity
            invoiceProduct.querySelector('#plus').addEventListener('click', () => {
                const quantityElement = invoiceProduct.querySelector('.quantitypronb');
                const currentQuantity = parseInt(quantityElement.textContent, 10);

                const totalQuantityInInvoice = Array.from(invoiceProductsContainer.children)
                    .filter(invoiceProduct => invoiceProduct.getAttribute('data-product-id') === product._id.toString())
                    .reduce((sum, invoiceProduct) => {
                        const quantityElement = invoiceProduct.querySelector('.quantitypronb');
                        return sum + parseInt(quantityElement.textContent, 10);
                    }, 0);

                if (totalQuantityInInvoice < product.quantity) {
                    const newQuantity = currentQuantity + 1;
                    quantityElement.textContent = newQuantity;

                    productQuantities[productKey] = newQuantity;
                    calculateTotal();
                } else {
                    alert("No more products to add");
                }
            });


            // Remove a product
            invoiceProduct.querySelector('.removepro').addEventListener('click', () => {
                invoiceProduct.remove();
                delete productQuantities[productKey];
                calculateTotal();
            });

            invoiceProductsContainer.appendChild(invoiceProduct);
            calculateTotal();

        } else {
            alert("No more products to add");
        }
    }
}

function calculateTotal() {
    let total = 0;
    const invoiceProducts = document.querySelector('.invoiceproducts');

    Array.from(invoiceProducts.children).forEach(invoiceProduct => {
        const priceElement = invoiceProduct.querySelector('.productprice');
        const quantityElement = invoiceProduct.querySelector('.quantitypronb');

        const priceText = priceElement.textContent.trim();
        const price = parseFloat(priceText.replace('$', '').trim());
        const quantity = parseInt(quantityElement.textContent, 10);

        total += price * quantity;
    });

    document.querySelector('.priceSub').textContent = `${total.toFixed(2)}$`;
    document.querySelector('.pricetotal').textContent = `${total.toFixed(2)}$`;
    if (total==0) {
        document.querySelector(".fordisplay").style.display="none"
        document.querySelector(".noinvoice").style.display="block"
    }
    else{
        document.querySelector(".fordisplay").style.display="flex"
        document.querySelector(".noinvoice").style.display="none"
    }
}
calculateTotal();




