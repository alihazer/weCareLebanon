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
if (window.location.pathname=="/products/add") {
     getCategories();    
     getsupplier();
}




