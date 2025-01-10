// document.getElementById('addsup').addEventListener('submit', async function (e) {
//     e.preventDefault();

//     const name = document.getElementById('name').value.trim();
//     const phone = document.getElementById('phone').value.trim();
//     const address = document.getElementById('address').value.trim();

//     if (!name || !phone || !address) {
//         alert('All fields are required!');
//         return;
//     }
//     else if (name.length<3) {
//         alert('name must be at least 3 digits');
//         return;
//     }
//     else if (phone.length!=8) {
//         alert('phone must be 8 digits');
//         return;
//     }
//     else if (address.length<10) {
//         alert('address must be at least 10 characters');
//         return;
//     }

//     try {
//         const response = await fetch('/api/suppliers/add', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ name, phone, address }),
//         });

//         const result = await response.json();

//         if (response.ok) {
//             alert('Supplier added successfully!');
//         } else {
//             alert(result.message);
//         }
//     } catch (error) {
//         console.error('Error adding supplier:', error);
//         alert('An error occurred while adding the supplier.');
//     }
// });



// document.addEventListener('DOMContentLoaded', async () => {
//     async function Categories() {
//     const productsContainer = document.querySelector('.products');

//     try {
//         const response = await fetch('/api/suppliers');
//         if (!response.ok) throw new Error('Failed to fetch suppliers.');

//         const suppliers = await response.json();

//         // Generate rows for each supplier
//         suppliers.forEach(supplier => {
//             const row = document.createElement('div');
//             row.classList.add('rows');

//             row.innerHTML = `
//                 <p class="columns">${supplier.name}</p>
//                 <p class="columns">${supplier.phone}</p>
//                 <p class="columns">${supplier.address}</p>
//                 <div class="actions">
//                     <a href="/suppliers/edit/${supplier._id}" class="edits">
//                         <img src="/images/edit.png" class="edit" alt="edit">
//                     </a>
//                     <img src="/images/delete.png" class="delete" alt="delete" data-id="${supplier._id}" />
//                 </div>
//             `;

//             productsContainer.appendChild(row);
//         });

//         // Add event listener for delete buttons
//         document.querySelectorAll('.delete').forEach(button => {
//             button.addEventListener('click', async (e) => {
//                 const supplierId = e.target.getAttribute('data-id');

//                 if (confirm('Are you sure you want to delete this supplier?')) {
//                     try {
//                         const deleteResponse = await fetch(`/api/suppliers/delete/${supplierId}`, {
//                             method: 'DELETE',
//                         });

//                         if (!deleteResponse.ok) throw new Error('Failed to delete supplier.');

//                         alert('Supplier deleted successfully.');
//                         location.reload(); // Reload the page to reflect changes
//                     } catch (error) {
//                         console.error('Error deleting supplier:', error);
//                         alert('An error occurred while deleting the supplier.');
//                     }
//                 }
//             });
//         });
//     } catch (error) {
//         console.error('Error loading suppliers:', error);
//         alert('Failed to load suppliers.');
//     }
// });
