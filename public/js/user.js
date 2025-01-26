if (window.location.pathname=="/allUsers/adduser") {
    document.getElementById('adduser').addEventListener('submit', async function (e) {
        e.preventDefault();
        document.getElementById('adduserbutton').disabled = true;

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
                warningText.textContent = result.message;
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
                console.log(result);
                if (result.message=="User deleted successfully") {
                    Users();
                } else {
                    document.querySelector('.catcontainer').style.display = 'flex';
                    const warningText = document.getElementById('messageuser');
                    warningText.textContent = `Error: ${result.message}`;
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
    }

}

async function getuser() {
    document.getElementById("edituser").style.display="none";
    document.querySelector(".loading").style.display="block"
try {
    const urlPath = window.location.pathname;
    const segments = urlPath.split('/');
    const userId = segments[segments.length - 1]; 

    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();

    if (user && user.data) {

        const username = document.getElementById('username');
        username.value = user.data.username; 
    } else {
        console.error('user not found');
    }
} catch (error) {
    console.error('Error fetching the category:', error);
}
finally{
    document.querySelector(".loading").style.display="none"
    document.getElementById("edituser").style.display="flex";
}
}

if (window.location.pathname.startsWith("/allUsers/edit")) {
    getuser();

    document.getElementById('edituser').addEventListener('submit', async function (e) {
        e.preventDefault();
        document.getElementById('edituserbutton').disabled = true;


        const urlPath = window.location.pathname;
        const segments = urlPath.split('/');
        const userid = segments[segments.length - 1]; 

        const username = document.getElementById('username').value.trim();

        if (!username) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('messageuser');
            warningText.textContent = 'enter a username';
            return;
        }
        else if (username.length<3) {
            document.querySelector('.catcontainer').style.display = 'flex';
            const warningText = document.getElementById('messageuser');
            warningText.textContent = 'username must be at least 3 digits';
            return;
        }


        try {
            const response = await fetch(`/api/users/update/${userid}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username}),
            });

            const result = await response.json();

            if (response.ok) {
                document.querySelector('.catcontainer').style.display = 'flex';
                const warningText = document.getElementById('messageuser');
                warningText.textContent = result.message;
            } else {
                document.querySelector('.catcontainer').style.display = 'flex';
                const warningText = document.getElementById('messageuser');
                warningText.textContent = result.message;
            }
        } catch (error) {
            alert('An error occurred while updating the user.');
        }
    });
}
// add alerts
function handleuserok() {
    document.querySelector('.catcontainer').style.display = 'none';
    document.getElementById('adduserbutton').disabled = false;

}
function handleusereditok() {
    document.querySelector('.catcontainer').style.display = 'none';
    document.getElementById('edituserbutton').disabled = false;

}