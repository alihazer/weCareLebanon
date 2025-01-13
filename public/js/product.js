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
    document.getElementById('messageproduct').style.display = 'none';
}

if (window.location.pathname=="/products/add") {
     getCategories();    
     getsupplier();


       document.getElementById('addProduct').addEventListener('submit', async function (e) {
            e.preventDefault();
    
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
                document.getElementById('messageproduct').style.display = 'flex';
                const warningText = document.getElementById('message');
                warningText.textContent = 'All fields are required';
                return;
            }
            
            else if (name.length < 3) {
                document.getElementById('messageproduct').style.display = 'flex';
                const warningText = document.getElementById('message');
                warningText.textContent = 'name must be at least 3 characters';
                return;
            }
            else if (code.length < 3) {
                document.getElementById('messageproduct').style.display = 'flex';
                const warningText = document.getElementById('message');
                warningText.textContent = 'code must be at least 3 characters';
                return;
            }
            else if (purchasePrice >=singlePrice || purchasePrice >=wholeSalePrice) {
                document.getElementById('messageproduct').style.display = 'flex';
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
                formData.append('image', image); // Append the image file
        
                const response = await fetch('/api/products/add', {
                    method: 'POST',
                    body: formData, // Send FormData directly
                });
                
                const result = await response.json();
    
                if (response.ok) {
                    document.getElementById('messageproduct').style.display = 'flex';
                    const succ = document.getElementById('message');
                    succ.textContent = result.message;
                    document.getElementById('addProduct').reset();
                    console.log(result);
                    
                } else {
                    document.getElementById('messageproduct').style.display = 'flex';
                    const warningText = document.getElementById('message');
                    warningText.textContent = result.errors;
                    console.log(result.errors);

                }
            } catch (error) {
                alert('An error occurred while adding the supplier.');
            }
        });
    
}




