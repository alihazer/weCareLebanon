// get categories
async function Categories() {
        try {
            const response = await fetch('/api/categories');
            const categories = await response.json();
            const container = document.getElementById('categoriesContainer');
            container.innerHTML = '';

            categories.data.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('titles');
                categoryDiv.innerHTML = `
                    <p class="name">${category.name}</p>
                    <div class="actions">
                        <a href="/categories/edit/${category._id}" class="edits">
                            <img src="/images/edit.png" class="edit" alt="edit">
                        </a>
                        <img src="/images/delete.png" class="delete" alt="delete" onclick="confirmDelete('${category._id}')" />
                    </div>
                `;
                container.appendChild(categoryDiv);
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
}
if (window.location.pathname=="/categories") {
    Categories();
}

// delete a category
let deleteId = null; 
function confirmDelete(id) {
    deleteId = id; 
    document.getElementById('customAlert').style.display = 'flex';
}

async function handleYes() {
    if (deleteId !== null) {
        await deleteCategory(deleteId);
        deleteId = null;
    }
    document.getElementById('customAlert').style.display = 'none';
}

function handleNo() {
    deleteId = null; 
    document.getElementById('customAlert').style.display = 'none';
}
async function deleteCategory(id) {
        try {
            const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.success) {
                Categories();
            } else {
                alert('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
}



// add category
if (window.location.pathname.startsWith("/categories/add")) {
    document.getElementById('addCat').addEventListener('submit', async function (e) {
        e.preventDefault(); 
    
        const name = document.getElementById('name').value;
    
        if (!name) {
            alert('Please enter a name');
            return;
        }
        else if (name.length < 3) {
            alert('Name must be at least 3 characters');
            return;
        } 
            const response = await fetch('/api/categories/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
    
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                document.getElementById('name').value = '';
            } else {
                alert(result.message);
            }
    });
}





async function getCategory() {
    try {
        const urlPath = window.location.pathname;
        const segments = urlPath.split('/');
        const categoryId = segments[segments.length - 1]; 

        if (!categoryId) {
            console.error('No category ID found in the URL');
            return;
        }

        // Fetch the category data from the API
        const response = await fetch(`/api/categories/${categoryId}`);
        const category = await response.json();

        // Check if the category exists
        if (category && category.data) {
            // Prefill the form input with the category name
            const nameInput = document.getElementById('name');
            nameInput.value = category.data.name; // Set the input value to the category name
        } else {
            console.error('Category not found');
        }
    } catch (error) {
        console.error('Error fetching the category:', error);
    }
}

if (window.location.pathname.startsWith("/categories/edit/")) {
    getCategory();
}

