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
    document.querySelector(".loading").style.display="block";
    try {
        let salevalue=document.getElementById('sale').value
        let categoryvalue=document.getElementById('categoryfilter').value;
        let Searchvalue=document.getElementById('search').value;

        const category =categoryvalue=="all"?
                        '':`&category=${categoryvalue}`;   

        const search =Searchvalue?
                        `&search=${Searchvalue}`: '';       
        
        const response = await fetch(`/api/products?quantity=gt0${category}${search}`); 
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
        document.querySelector(".loading").style.display="none";
    }
}


if (window.location.pathname === "/") {
    getCategories();
    gethomeProducts();
    document.getElementById('search').addEventListener('input', () => {
        gethomeProducts()
    });
    
}
function changeFilterCategory(){
    gethomeProducts();
}
function changeFilterSale(){
    gethomeProducts();
}




// add to invoice
let productQuantities = {};
let invoiceProductsArray = [];

function AddToInvoice(product, isFromLocalStorage = false) {
    let salevalue = 0;
    if (!isFromLocalStorage) {
        salevalue = document.getElementById('sale').value;
    }
    const invoiceProductsContainer = document.querySelector('.invoiceproducts');

    const productKey = isFromLocalStorage ? product.key : product.wholeSalePrice === product.singlePrice ?
        product._id :
        `${product._id}-${salevalue}`;

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

    if (existingProduct && !isFromLocalStorage) {
        const quantityElement = existingProduct.querySelector('.quantitypronb');
        const currentQuantity = parseInt(quantityElement.textContent, 10);
        if (totalQuantityInInvoice < product.quantity) {
            const newQuantity = currentQuantity + 1;
            quantityElement.textContent = newQuantity;

            const arrayProduct = invoiceProductsArray.find(p => p.key === productKey);
            arrayProduct.quantity = newQuantity;

            productQuantities[productKey] = newQuantity;
            calculateTotal();
            if (!isFromLocalStorage) saveToLocalStorage();
        } else {
            document.querySelector('.invoiceContainer').style.right = '0';
            document.querySelector('.messageordercontainer').style.display = 'flex';
            const warningText = document.getElementById('messageorder');
            warningText.textContent = 'No more products to add';
            document.getElementById('BokeOrder').addEventListener('click', function () {
                handleokOrder();
            });
        }
    } else {
        if (totalQuantityInInvoice < product.quantity || isFromLocalStorage) {
            const invoiceProduct = document.createElement('div');
            invoiceProduct.className = 'invoiceproduct';
            invoiceProduct.setAttribute('data-product-key', productKey);
            invoiceProduct.setAttribute('data-product-id', product._id);

            invoiceProduct.innerHTML = `
            <div class="productimage" style="background-image: url('${product.image ? product.image : "/images/default-product.png"}');"></div>
            <div class="productinfo">
              <h3 class="productname">${product.name}</h3>
              <div class="priceAndquantity">
                <p class="productprice">${isFromLocalStorage ? product.price : salevalue == "wholesale" ? product.wholeSalePrice : product.singlePrice}$</p>
                <div class="quantitypro">
                  <p class="min" id="mines">-</p>
                  <p class="quantitypronb" id="quantitynb">${isFromLocalStorage ? product.quantity : 1}</p>
                  <p class="min" id="plus">+</p>
                </div>
              </div>
              
              <input type="text" class="product-note" 
                     placeholder="Add note" 
                     value="${product.note || ''}" 
                     style="margin-top: 5px; padding: 2px 5px; width: 100%">
            </div>
                <svg class="removepro" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="#17526B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;

            productQuantities[productKey] = isFromLocalStorage ? product.quantity : 1;
            if (!isFromLocalStorage) {
                invoiceProductsArray.push({
                    key: productKey,
                    _id: product._id,
                    name: product.name,
                    image: product.image,
                    price: salevalue === "wholesale" ? product.wholeSalePrice : product.singlePrice,
                    purchasePrice: product.purchasePrice,
                    quantity: 1,
                    instock: product.quantity,
                    isWholeSale: salevalue === "wholesale",
                    note: "" 
                  });
            }

            invoiceProduct.querySelector('.product-note').addEventListener('input', (e) => {
                const arrayProduct = invoiceProductsArray.find(p => p.key === productKey);
                arrayProduct.note = e.target.value;
                saveToLocalStorage();
              });

            // Decrease the quantity
            invoiceProduct.querySelector('#mines').addEventListener('click', () => {
                const quantityElement = invoiceProduct.querySelector('.quantitypronb');
                const currentQuantity = parseInt(quantityElement.textContent, 10);
                if (currentQuantity > 1) {
                    const newQuantity = currentQuantity - 1;
                    quantityElement.textContent = newQuantity;

                    const arrayProduct = invoiceProductsArray.find(p => p.key === productKey);
                    arrayProduct.quantity = newQuantity;

                    productQuantities[productKey] = newQuantity;
                    calculateTotal();
                    saveToLocalStorage();
                } else {
                    invoiceProduct.remove();
                    const productIndex = invoiceProductsArray.findIndex(p => p.key === productKey);
                    invoiceProductsArray.splice(productIndex, 1);

                    delete productQuantities[productKey];
                    calculateTotal();
                    saveToLocalStorage();
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

                if (totalQuantityInInvoice < (isFromLocalStorage ? product.instock : product.quantity)) {
                    const newQuantity = currentQuantity + 1;
                    quantityElement.textContent = newQuantity;

                    const arrayProduct = invoiceProductsArray.find(p => p.key === productKey);
                    arrayProduct.quantity = newQuantity;

                    productQuantities[productKey] = newQuantity;
                    calculateTotal();
                    saveToLocalStorage();
                } else {
                    document.querySelector('.messageordercontainer').style.display = 'flex';
                    const warningText = document.getElementById('messageorder');
                    warningText.textContent = 'No more products to add';
                    document.getElementById('BokeOrder').addEventListener('click', function () {
                        handleokOrder();
                    });
                }
            });

            // Remove a product
            invoiceProduct.querySelector('.removepro').addEventListener('click', () => {
                invoiceProduct.remove();

                const productIndex = invoiceProductsArray.findIndex(p => p.key === productKey);
                invoiceProductsArray.splice(productIndex, 1);

                delete productQuantities[productKey];
                calculateTotal();
                saveToLocalStorage();
            });

            invoiceProductsContainer.appendChild(invoiceProduct);
            calculateTotal();
            if (!isFromLocalStorage) saveToLocalStorage();
        } else {
            alert("No more products to add");
        }
    }
}

function calculateTotal() {
    const subtotal = invoiceProductsArray.reduce((sum, product) => {
        return sum + product.price * product.quantity;
    }, 0);

    document.querySelector('.priceSub').textContent = `${subtotal.toFixed(2)}$`;

    const discountInput = document.querySelector('.codeinput').value;
    const discount = (parseFloat(discountInput) * subtotal / 100) || 0;

    const total = subtotal - discount;

    document.querySelector('.pricetotal').textContent = `${total.toFixed(2)}$`;

    calculateProfit(subtotal);

    if (subtotal === 0) {
        document.querySelector(".fordisplay").style.display = "none";
        document.querySelector(".noinvoice").style.display = "block";
    } else {
        document.querySelector(".fordisplay").style.display = "flex";
        document.querySelector(".noinvoice").style.display = "none";
    }

    const inInvoice = invoiceProductsArray.reduce((sum, product) => {
        return sum + product.quantity;
    }, 0);

    if (inInvoice > 0) {
        document.querySelector(".productinInvoice").style.display = "block";
        document.querySelector(".productinInvoice").textContent = inInvoice;
    } else {
        document.querySelector(".productinInvoice").style.display = "none";
    }
}
document.querySelector('.codeinput').addEventListener('input', () => {
    let disc = document.querySelector('.codeinput').value;
    if (disc > 100) {
        document.querySelector('.codeinput').value = 100;
        disc = 100;
    }
    if (disc < 0) {
        document.querySelector('.codeinput').value = 0;
        disc = 0;
    }
    calculateTotal();
    document.getElementById("displayDiscount").textContent = disc ? `${disc}%` : '0%';
});

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('invoiceProducts', JSON.stringify(invoiceProductsArray));
}

// Load from localStorage
function loadFromLocalStorage() {
    const savedProducts = localStorage.getItem('invoiceProducts');
    if (savedProducts) {
        invoiceProductsArray = JSON.parse(savedProducts);
        invoiceProductsArray.forEach(product => {
            if (!product.note) product.note = "";
            AddToInvoice(product, true);
            
        });
    }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    calculateTotal();
});




document.getElementById('addorder').addEventListener('click', async function (e) {
    let customerIdValue=document.getElementById('chooseCus').value;
    document.getElementById('addorder').disabled = true;

    if (invoiceProductsArray.length===0) {
        document.querySelector('.messageordercontainer').style.display = 'flex';
        const warningText = document.getElementById('messageorder');
        warningText.textContent = 'invoice is empty';
        document.getElementById('BokeOrder').addEventListener('click', function () {
            handleokOrder();
        });
        return;
    }
    else if(document.querySelector('.codeinput').value>100 && document.querySelector('.codeinput').value <0){
        document.querySelector('.messageordercontainer').style.display = 'flex';
        const warningText = document.getElementById('messageorder');
        warningText.textContent = 'The discount must be between 0 and 100';
        document.getElementById('BokeOrder').addEventListener('click', function () {
            handleokOrder();
           
        });
        return;
    }
    else if(!customerIdValue) {
        document.querySelector('.messageordercontainer').style.display = 'flex';
        const warningText = document.getElementById('messageorder');
        warningText.textContent = 'choose a customer';
        document.getElementById('BokeOrder').addEventListener('click', function () {
            handleokOrder();
           
        });
        return;
    }
    
    document.querySelector('.messageordercontainer').style.display = 'flex';
    const warningText = document.getElementById('messageorder');
    warningText.textContent = "loading...";
    document.getElementById('BokeOrder').style.display="none"
    try {
        const orderData = {
            products: invoiceProductsArray.map(product => ({
                productId: product._id,
                quantity: product.quantity,
                price: product.price,
                isWholeSale: product.isWholeSale,
                note: product.note,
            })),
            customerId: customerIdValue,
            discount: parseFloat(document.querySelector('.codeinput').value) || 0,
        };
    
        const response = await fetch('/api/invoice/addOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
    
        const result = await response.json();
    
        if (response.ok) {

            // Download the PDF
            const pdfBytes = atob(result.pdfBytes); // Decode base64 to binary
            const blob = new Blob([new Uint8Array([...pdfBytes].map(char => char.charCodeAt(0)))], {
                type: 'application/pdf',
            });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `invoice-${result.data.invoiceNumber}-${result.customerName}.pdf`;
            link.click();
            URL.revokeObjectURL(link.href); // Clean up the URL object

            // Reset local state
            invoiceProductsArray = [];
            productQuantities = {};
            saveToLocalStorage();
            calculateTotal();


            document.querySelector('.messageordercontainer').style.display = 'flex';
            const warningText = document.getElementById('messageorder');
            warningText.textContent = result.message;
            document.getElementById('BokeOrder').style.display="block"
    
            document.getElementById('BokeOrder').addEventListener('click', function () {
                handleokOrder(true);
               
            });
            
        } else {
            document.querySelector('.messageordercontainer').style.display = 'flex';
            const warningText = document.getElementById('messageorder');
            warningText.textContent = result.message || 'An error occurred while placing the order.';
            document.getElementById('BokeOrder').style.display="block"
            document.getElementById('BokeOrder').addEventListener('click', function () {
                handleokOrder();
            });
        }

    } catch (error) {
        alert('An error occurred while placing the order.');
    }


});


function handleokOrder(Refresh = false){
    document.querySelector('.messageordercontainer').style.display = 'none';
    const warningText = document.getElementById('messageorder');
    warningText.textContent = " ";
    if (Refresh) {
        window.location.href = "/";
    }
    document.getElementById('addorder').disabled = false;

}

function calculateProfit(subtotal) {
    const discountInput = document.querySelector('.codeinput').value;
    const discount = (parseFloat(discountInput) * subtotal / 100) || 0;

    let totalProfit = 0;

    invoiceProductsArray.forEach(product => {
        const unitProfit = product.isWholeSale ? 
            (product.price - product.purchasePrice) : 
            (product.price - product.purchasePrice);

        totalProfit += unitProfit * product.quantity;
    });

    const profitWithDiscount = totalProfit - discount;
    document.getElementById('profit').textContent = `${profitWithDiscount.toFixed(2)}$`;
}
