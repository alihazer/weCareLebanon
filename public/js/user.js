if (window.location.pathname=="/users/adduser") {
    document.getElementById('adduser').addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            document.getElementById('messagesadduser').style.display = 'flex';
            const warningText = document.getElementById('messageuser');
            warningText.textContent = 'All fields are required!';
            return;
        }
        else if (username.length<3) {
            document.getElementById('messagesadduser').style.display = 'flex';
            const warningText = document.getElementById('messageuser');
            warningText.textContent = 'username must be at least 3 digits';
            return;
        }
        else if (password.length<6) {
            document.getElementById('messagesadduser').style.display = 'flex';
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
                document.getElementById('messagesadduser').style.display = 'flex';
                const warningText = document.getElementById('messageuser');
                warningText.textContent = result.message;
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';

            } else {
                document.getElementById('messagesadduser').style.display = 'flex';
                const warningText = document.getElementById('messageuser');
                warningText.textContent = result.error.message;
            }
        } catch (error) {
            alert('An error occurred while adding the user.');
        }
    });
}


// get all users
// async function Users() {

//     try {
//         const response = await fetch('/api/users');
//         const users = await response.json();
//         console.log(users);
        
//         const productsContainer = document.getElementById('getUsers');
//         productsContainer.innerHTML = '';

//         users.data.forEach(user => {
//             const row = document.createElement('div');
//             row.classList.add('userrow');

//             row.innerHTML = `
//                 <p class="columns">${user.username}</p>
//                 <div class="actions">
//                     <a href="/users/edit/${user._id}" class="edits">
//                         <img src="/images/edit.png" class="edit" alt="edit">
//                     </a>
//                     <img src="/images/delete.png" class="delete" alt="delete" onclick="confirmDelete('${user._id}')" />
//                 </div>
//             `;

//             productsContainer.appendChild(row);
//         });

//     } catch (error) {
//         console.error('Error loading users:', error);
//         alert('Failed to load users.');
//     }
// };
// if (window.location.pathname=="/users"){
//     // Users();

//     // delete a user
//     let deleteId = null; 
//     function confirmDelete(id) {
//         deleteId = id; 
//         // document.getElementById('customAlert').style.display = 'flex';
//     }
//     function handleYes() {
//         if (deleteId !== null) {
//             deletesupplier(deleteId);
//             deleteId = null;
//         }
//         document.getElementById('customAlert').style.display = 'none';
//     }
//     function handleNo() {
//         deleteId = null; 
//         document.getElementById('customAlert').style.display = 'none';
//     }
//     async function deletesupplier(id) {
//             try {
//                 const response = await fetch(`/api/suppliers/delete/${id}`, { method: 'DELETE' });
//                 const result = await response.json();
                
//                 if (result.message=="Supplier deleted successfully") {
//                     Suppliers();
//                 } else {
//                     alert('Failed to delete supplier');
//                 }
//             } catch (error) {
//                 console.error('Error deleting category:', error);
//             }
//     }

// }


// add alerts
function handleuserok() {
    document.getElementById('messagesadduser').style.display = 'none';
}