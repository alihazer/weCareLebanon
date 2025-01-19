if (window.location.pathname=="/allUsers/adduser") {
    document.getElementById('adduser').addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('messageuser');
            warningText.textContent = 'All fields are required!';
            return;
        }
        else if (username.length<3) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('messageuser');
            warningText.textContent = 'username must be at least 3 digits';
            return;
        }
        else if (password.length<6) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('messageuser');
            warningText.textContent = 'password must be at least 6 digits';
            return;
        }

        try {
            const response = await fetch('/api/users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password}),
            });

            const result = await response.json();

            if (response.ok) {
                document.querySelector('.catcontainer').style.display = 'flex';
                const warningText = document.getElementById('messageuser');
                warningText.textContent = result.message;
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';

            } else {
                document.querySelector('.catcontainer').style.display = 'flex';
                const warningText = document.getElementById('messageuser');
                warningText.textContent = result.error.message;
            }
        } catch (error) {
            alert('An error occurred while adding the user.');
        }
    });
}


// get all users
async function Users() {
    document.querySelector(".cats").style.display="none";
    document.querySelector(".loading").style.display="block"
    try {
        const response = await fetch('/api/users');
        const categories = await response.json();
        const container = document.getElementById('categoriesContainer');
        container.innerHTML = '';

        categories.data.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('titles');
            categoryDiv.innerHTML = `
                <p class="name">${category.username}</p>
                <div class="actioncat">
                    <a href="/allUsers/edit/${category._id}" class="edits">
                        <img src="/images/edit.png" class="edit" alt="edit">
                    </a>
                    <img src="/images/delete.png" class="delete" alt="delete" onclick="confirmDelete('${category._id}')" />
                </div>
            `;
            container.appendChild(categoryDiv);
        });
    } catch (error) {
        console.error('Error fetching user:', error);
    }
    finally{
        document.querySelector(".loading").style.display="none"
        document.querySelector(".cats").style.display="block";

    }
}

if (window.location.pathname=="/allUsers"){
    Users();

    // delete a user
    let deleteId = null; 
    function confirmDelete(id) {
        deleteId = id; 
        document.getElementById('customAlert').style.display = 'flex';
    }
    function handleYes() {
        if (deleteId !== null) {
            deletesupplier(deleteId);
            deleteId = null;
        }
        document.getElementById('customAlert').style.display = 'none';
    }
    function handleNo() {
        deleteId = null; 
        document.getElementById('customAlert').style.display = 'none';
    }
    async function deletesupplier(id) {
            try {
                const response = await fetch(`/api/users/delete/${id}`, { method: 'DELETE' });
                const result = await response.json();
                
                if (result.message=="User deleted successfully") {
                    Users();
                } else {
                    alert('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
    }

}


// add alerts
function handleuserok() {
    document.querySelector('.catcontainer').style.display = 'none';
}