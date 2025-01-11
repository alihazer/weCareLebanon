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

    // delete a category
    let deleteId = null; 
    function confirmDelete(id) {
        deleteId = id; 
        document.getElementById('customAlert').style.display = 'flex';
    }
    function handleYes() {
        if (deleteId !== null) {
            deleteCategory(deleteId);
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
                const response = await fetch(`/api/categories/delete/${id}`, { method: 'DELETE' });
                const result = await response.json();
                if (result.message=="Category deleted successfully") {
                    Categories();
                } else {
                    alert('Failed to delete category');
                }
            } catch (error) {
                console.error('Error deleting category:', error);
            }
    }

}








function handleokcat() {
    document.getElementById('messagesadd').style.display = 'none';
}

// add category
if (window.location.pathname.startsWith("/categories/add")) {
    document.getElementById('addCat').addEventListener('submit', async function (e) {
        e.preventDefault(); 
    
        const name = document.getElementById('name').value;
    
        if (!name) {
            document.getElementById('messagesadd').style.display = 'flex';
            const warningText = document.getElementById('message');
            warningText.textContent = 'Please enter a name';
            return;
        }
        else if (name.length < 3) {
            document.getElementById('messagesadd').style.display = 'flex';
            const warningText = document.getElementById('message');
            warningText.textContent = 'Name must be at least 3 characters';
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
                document.getElementById('messagesadd').style.display = 'flex';
                const warningText = document.getElementById('message');
                warningText.textContent =result.message;
                document.getElementById('name').value = '';
            } else {
                document.getElementById('messagesadd').style.display = 'flex';
                const warningText = document.getElementById('message');
                warningText.textContent =result.error.message;
            }
    });
}





// get a category and edit category
async function getCategory() {
    try {
        const urlPath = window.location.pathname;
        const segments = urlPath.split('/');
        const categoryId = segments[segments.length - 1]; 

        const response = await fetch(`/api/categories/${categoryId}`);
        const category = await response.json();

        if (category && category.data) {
            const nameInput = document.getElementById('nameinput');
            nameInput.value = category.data.name; 
        } else {
            console.error('Category not found');
        }
    } catch (error) {
        console.error('Error fetching the category:', error);
    }
}

if (window.location.pathname.startsWith("/categories/edit")) {

    getCategory();

    document.getElementById('editCategoryForm').addEventListener('submit', async function (e) {
        e.preventDefault(); 
    
        const urlPath = window.location.pathname;
        const segments = urlPath.split('/');
        const categoryId = segments[segments.length - 1]; 
    
        const name = document.getElementById('nameinput').value;

        if (!name) {
            document.getElementById('messagesadd').style.display = 'flex';
            const warningText = document.getElementById('message');
            warningText.textContent = 'Please enter a name';
            return;
        }
        else if (name.length < 3) {
            document.getElementById('messagesadd').style.display = 'flex';
            const warningText = document.getElementById('message');
            warningText.textContent = 'Name must be at least 3 characters';
            return;
        } 

        try {
            const response = await fetch(`/api/categories/edit/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name })
            });
    
            const result = await response.json();
    
            if (response.ok) {
                document.getElementById('messagesadd').style.display = 'flex';
                const warningText = document.getElementById('message');
                warningText.textContent =result.message;
            } else {
                document.getElementById('messagesadd').style.display = 'flex';
                const warningText = document.getElementById('message');
                warningText.textContent =result.error.message;
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    });
}



