// get categories
async function getCategories() {
    
    try {
        const response = await fetch('/api/categories');
        const result = await response.json();
        const categorySelect = document.getElementById('category_id');

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
// get suppliers
async function getsupplier() {
    
    try {
        const response = await fetch('/api/suppliers');
        const result = await response.json();
        const supSelect = document.getElementById('supplierId');
       
        if (response.ok) {
            const sups = result.data;
            
            sups.forEach(sup => {
                const option = document.createElement('option');
                option.value = sup._id; 
                option.textContent = sup.name;
                supSelect.appendChild(option);
            });
        } else {
            alert('Failed to load supplier.');
        }
    } catch (error) {
        alert('An error occurred while loading categories.');
    }
}

function handleokprod() {
    document.querySelector('.catcontainer').style.display = 'none';
    document.getElementById('addprobutton').disabled = false;

}
function handleokeditprod() {
    document.querySelector('.catcontainer').style.display = 'none';
    document.getElementById('updateprobutton').disabled = false;

}
if (window.location.pathname=="/products/add") {
     getCategories();    
     getsupplier();


       document.getElementById('addProduct').addEventListener('submit', async function (e) {
            e.preventDefault();
            document.getElementById('addprobutton').disabled = true;

            const name = document.getElementById('name').value.trim();
            const details = document.getElementById('details').value.trim();
            const code = document.getElementById('code').value.trim();
            const quantity = parseInt(document.getElementById('quantity').value, 10);
            const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
            const wholeSalePrice = parseFloat(document.getElementById('wholeSalePrice').value);
            const singlePrice = parseFloat(document.getElementById('singlePrice').value);
            const category_id = document.getElementById('category_id').value.trim();
            const supplierId = document.getElementById('supplierId').value.trim();
            const image = document.getElementById('image').files[0];
            
            if (!name || !code ||isNaN(quantity) || isNaN(purchasePrice) || isNaN(wholeSalePrice) || isNaN(singlePrice) || !category_id || !supplierId || !image) {
                document.querySelector('.catcontainer').style.display = 'flex';
                const warningText = document.getElementById('message');
                warningText.textContent = 'All fields are required';
                return;
            }
            
            else if (name.length < 3) {
                document.querySelector('.catcontainer').style.display = 'flex';
                const warningText = document.getElementById('message');
                warningText.textContent = 'name must be at least 3 characters';
                return;
            }
            else if (code.length < 3) {
                document.querySelector('.catcontainer').style.display = 'flex';
                const warningText = document.getElementById('message');
                warningText.textContent = 'code must be at least 3 characters';
                return;
            }
            else if (purchasePrice >=singlePrice || purchasePrice >=wholeSalePrice) {
                document.querySelector('.catcontainer').style.display = 'flex';
                const warningText = document.getElementById('message');
                warningText.textContent = 'Purchase price must be less than both single price and wholesale price';
                return;
            }



            try {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('details', details);
                formData.append('code', code);
                formData.append('quantity', quantity);
                formData.append('purchasePrice', purchasePrice);
                formData.append('wholeSalePrice', wholeSalePrice);
                formData.append('singlePrice', singlePrice);
                formData.append('category_id', category_id);
                formData.append('supplierId', supplierId);
                formData.append('image', image); 
        
                const response = await fetch('/api/products/add', {
                    method: 'POST',
                    body: formData, 
                });
                
                const result = await response.json();
    
                if (response.ok) {
                    document.querySelector('.catcontainer').style.display = 'flex';
                    const succ = document.getElementById('message');
                    succ.textContent = result.message;
                    document.getElementById('addProduct').reset();
                    
                } else {
                    document.querySelector('.catcontainer').style.display = 'flex';
                    const warningText = document.getElementById('message');
                    warningText.textContent = result.message;

                }
            } catch (error) {
                alert('An error occurred while adding the supplier.');
            }
        });
    
}



// get products
async function getProducts() {
            document.querySelector(".products").style.display="none";
        document.querySelector(".loading").style.display="block"
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        const productsContainer = document.querySelector('.getproducts');
        productsContainer.innerHTML = '';

        products.data.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'titles';
            if (product.quantity==0) {
                productElement.style.backgroundColor="#f03636";
                productElement.style.color="white";

            }
            productElement.innerHTML = `
                <div class="images">
                    <div class="image" 
                        style="background-image: url('${product.image ? product.image : '/images/default-product.png'}');">
                    </div>
                </div>
                <p class="name" id="title">${product.name}</p>
                <p class="details" id="title">${product.details ? product.details : 'null'}</p>
                <p class="quantity">${product.quantity}</p>
                <p class="purchasePrice">${product.purchasePrice}$</p>
                <p class="wholeSalePrice">${product.wholeSalePrice}$</p>
                <p class="singlePrice">${product.singlePrice}$</p>
                <p class="code">${product.code}</p>
                <p class="supplier" id="title">${product.supplierId?.name}</p>
                <div class="actions">
                    <a href="/products/view/${product._id}" class="edits"><img src="/images/view.png" class="edit" alt="view"></a>
                    <a href="/products/edit/${product._id}" class="edits"><img src="/images/edit.png" class="edit" alt="edit"></a>
                    <img src="/images/delete.png" class="delete" alt="delete" onclick="confirmDelete('${product._id}')"/>
                </div>
            `;

            productsContainer.appendChild(productElement);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
    finally{
        document.querySelector(".loading").style.display="none"
                document.querySelector(".products").style.display="block";
    }
};
if (window.location.pathname=="/products"){
    getProducts()

    // delete a product
    let deleteId = null; 
    function confirmDelete(id) {
        deleteId = id; 
        document.getElementById('productAlert').style.display = 'flex';
    }
    function handleYes() {
        if (deleteId !== null) {
            deleteproduct(deleteId);
            deleteId = null;
        }
        document.getElementById('productAlert').style.display = 'none';
    }
    function handleNo() {
        deleteId = null; 
        document.getElementById('productAlert').style.display = 'none';
    }
    async function deleteproduct(id) {
            try {
                const response = await fetch(`/api/products/delete/${id}`, { method: 'DELETE' });
                const result = await response.json();
                
                if (result.message=="Product deleted successfully") {
                    getProducts();
                } else {
                    alert('Failed to delete customer');
                }
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
    }
}




async function getAproduct() {
        document.getElementById("editProduct").style.display="none";
        document.querySelector(".loading").style.display="block"
    try {
        const urlPath = window.location.pathname;
        const segments = urlPath.split('/');
        const proid = segments[segments.length - 1]; 

        const response = await fetch(`/api/products/${proid}`);
        const product = await response.json();
        console.log(product)
        
        if (product && product.data) {
            const nameInput = document.getElementById('name');
            nameInput.value = product.data.name; 

            const details = document.getElementById('details');
            details.value = product.data.details ? product.data.details : '';    

            const code = document.getElementById('code');
            code.value = product.data.code; 

            const quantity = document.getElementById('quantity');
            quantity.value = product.data.quantity;
            
            const purchasePrice = document.getElementById('purchasePrice');
            purchasePrice.value = product.data.purchasePrice; 

            const wholeSalePrice = document.getElementById('wholeSalePrice');
            wholeSalePrice.value = product.data.wholeSalePrice; 

            const singlePrice = document.getElementById('singlePrice');
            singlePrice.value = product.data.singlePrice;
            
            const category_id = document.getElementById('category_id');
            category_id.value = product.data.category_id;

            const supplierId = document.getElementById('supplierId');
            supplierId.value = product.data.supplierId;

            document.getElementById('displayImage').style.backgroundImage = `url(${product.data.image ? product.data.image : '/images/default-product.png'})`;

        } else {
            console.error('product not found');
        }
    } catch (error) {
        console.error('Error fetching the product:', error);
    }
    finally{
        document.querySelector(".loading").style.display="none"
        document.getElementById("editProduct").style.display="flex";
    }
}
// edit product
if (window.location.pathname.startsWith("/products/edit")) {
    getCategories();    
    getsupplier();

    getAproduct();

    document.getElementById('editProduct').addEventListener('submit', async function (e) {
        e.preventDefault(); 
        document.getElementById('updateprobutton').disabled = true;

        const urlPath = window.location.pathname;
        const segments = urlPath.split('/');
        const proid = segments[segments.length - 1]; 
    
        const name = document.getElementById('name').value.trim();
        const details = document.getElementById('details').value.trim();
        const code = document.getElementById('code').value.trim();
        const quantity = parseInt(document.getElementById('quantity').value, 10);
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
        const wholeSalePrice = parseFloat(document.getElementById('wholeSalePrice').value);
        const singlePrice = parseFloat(document.getElementById('singlePrice').value);
        const category_id = document.getElementById('category_id').value.trim();
        const supplierId = document.getElementById('supplierId').value.trim();
        const image = document.getElementById('image').files[0];
        
        if (!name || !code ||isNaN(quantity) || isNaN(purchasePrice) || isNaN(wholeSalePrice) || isNaN(singlePrice) || !category_id || !supplierId ) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('message');
            warningText.textContent = 'All fields are required';
            return;
        }
        
        if (name.length < 3) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('message');
            warningText.textContent = 'name must be at least 3 characters';
            return;
        }
        else if (code.length < 3) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('message');
            warningText.textContent = 'code must be at least 3 characters';
            return;
        }
        else if (purchasePrice >=singlePrice || purchasePrice >=wholeSalePrice) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('message');
            warningText.textContent = 'Purchase price must be less than both single price and wholesale price';
            return;
        }


        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('details', details);
            formData.append('code', code);
            formData.append('quantity', quantity);
            formData.append('purchasePrice', purchasePrice);
            formData.append('wholeSalePrice', wholeSalePrice);
            formData.append('singlePrice', singlePrice);
            formData.append('category_id', category_id);
            formData.append('supplierId', supplierId);
            

            
            
            if (image) {
                formData.append('image', image);
            }
            formData.forEach((value, key) => console.log(`${key}: ${value}`));

            
            const response = await fetch(`/api/products/edit/${proid}`, {
                method: 'PUT',
                body: formData,
            });

    
            const result = await response.json();
            if (response.ok) {
                document.querySelector('.catcontainer').style.display = 'flex';
                const warningText = document.getElementById('message');
                
                warningText.textContent = result.message;
                getAproduct()
                
            } else {
                document.querySelector('.catcontainer').style.display = 'flex';
                const warningText = document.getElementById('message');
                warningText.textContent = result.message;
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    });
}

async function getinfoProduct() {
    document.querySelector(".containerAproducts").style.display="none";
    document.querySelector(".loading").style.display="block"
try {
    const urlPath = window.location.pathname;
    const segments = urlPath.split('/');
    const proid = segments[segments.length - 1]; 

    const response = await fetch(`/api/products/${proid}`);
    const product = await response.json();
    
    const productsContainer = document.querySelector('.getproducts');
    productsContainer.innerHTML = '';

    if (product && product.data) {
        
        const productElement = document.createElement('div');
        productElement.className = 'titlesinfo';
        if (product.data.quantity==0) {
            productElement.style.backgroundColor="#f03636";
            productElement.style.color="white";

        }
        productElement.innerHTML = `
            <div class="images">
                <div class="image" 
                    style="background-image: url('${product.data.image ? product.data.image : '/images/default-product.png'}');">
                </div>
            </div>
            <p class="name" id="title">${product.data.name}</p>
            <p class="details" id="title">${product.data.details ? product.data.details : 'null'}</p>
            <p class="quantity">${product.data.quantity}</p>
            <p class="purchasePrice">${product.data.purchasePrice}$</p>
            <p class="wholeSalePrice">${product.data.wholeSalePrice}$</p>
            <p class="singlePrice">${product.data.singlePrice}$</p>
            <p class="code">${product.data.code}</p>
            <p class="supplier" id="title">${product.data.supplierId.name}</p>
        `;

        productsContainer.appendChild(productElement);
    };
    } catch (error) {
      console.error('Error fetching product:', error);
    }
    finally{
            document.querySelector(".loading").style.display="none"
            document.querySelector(".containerAproducts").style.display="block";
    }
};

const renderChart = async (year) => {
    const productId = window.location.pathname.split('/')[3];
    
    // Fetch stats for the selected year
    const response = await fetch(`/api/products/stats/${productId}?startDate=${year}`);
    const result = await response.json();

    if (response.ok) {
        const stats = result.data || [];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const categories = stats.map(stat => months[stat.month - 1] || 'Unknown');
        const totalQuantities = stats.map(stat => stat.totalQuantity || 0);

        const options = {
            series: [{
                name: 'Total Quantity',
                data: totalQuantities,
            }],
            chart: {
                type: 'bar',
                height: 350,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            xaxis: {
                categories: categories,
            },
            yaxis: {
                title: {
                    text: 'Quantity Sold',
                },
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val;
                    },
                },
            },
        };

        // Destroy existing chart if it exists
        if (window.chart && typeof window.chart.destroy === 'function') {
            window.chart.destroy();
        }

        const chartElement = document.getElementById('chart');
        if (chartElement) {
            window.chart = new ApexCharts(chartElement, options);
            window.chart.render();
        } else {
            console.error('Chart element not found');
        }
    } else {
        console.error('Failed to fetch stats:', result.message);
    }
};

if (window.location.pathname.startsWith("/products/view")){
    getinfoProduct();

    // Initialize chart on page load and set up event listeners
    const yearSelect = document.getElementById('year');
    const defaultYear = parseInt(yearSelect.value);

    // Render chart for default year
    renderChart(defaultYear);

    // Attach event listener to year dropdown
    yearSelect.addEventListener('change', (event) => {
        const selectedYear = parseInt(event.target.value);
        renderChart(selectedYear);
    });
}
