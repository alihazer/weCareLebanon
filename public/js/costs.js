async function getCosts() {
     document.querySelector(".costs").style.display = "none";
     document.querySelector(".loading").style.display = "block";
 
     try {
         const response = await fetch('/api/costs');
         const costs = await response.json();
         console.log(costs);
         const costsContainer = document.querySelector('.getcosts');
         costsContainer.innerHTML = '';
 
         costs.forEach(cost => {
             const costElement = document.createElement('div');
             costElement.className = 'costs-titles';
           const formattedDate = new Date(cost.date).toLocaleDateString();
           costElement.innerHTML = `
                <h2 class="name" id="title">${cost.name}</h2>
                <h2 class="details" id="title">${formattedDate}</h2>
                <h2 class="quantity">${cost.amount}$</h2>
           `;
             costsContainer.appendChild(costElement);
         });
     } catch (error) {
         console.error('Error fetching costs:', error);
     } finally {
         document.querySelector(".loading").style.display = "none";
         document.querySelector(".costs").style.display = "block";
     }
 }
if(window.location.pathname === '/costs'){
     getCosts();
}
if (window.location.pathname == "/costs/add") {
     document.getElementById('addcost').addEventListener('submit', async function (e) {
         e.preventDefault();
         document.getElementById('addCost').disabled = true;
         const name = document.getElementById('name').value.trim();
         const date = document.getElementById('date').value;
         const amount = document.getElementById('ammount').value.trim(); 
 
         const warningText = document.getElementById('messagecus');
         const showAlert = (message) => {
             document.querySelector('.catcontainer').style.display = 'flex';
             warningText.textContent = message;
         };
 
         if (!name || !date || !amount) {
             showAlert('All fields are required!');
             return;
         } else if (name.length < 3) {
             showAlert('Name must be at least 3 characters.');
             return;
         } else if (amount <= 0) {
             showAlert('Amount must be greater than zero.');
             return;
         }
 
         try {
             const response = await fetch('/api/costs/', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({ name, date, amount }),
             });
 
             const result = await response.json();
 
             showAlert(result.message);
 
             if (response.ok) {
                 document.getElementById('name').value = '';
                 document.getElementById('date').value = '';
                 document.getElementById('ammount').value = '';
             }
         } catch (error) {
             alert('An error occurred while adding the cost.');
         } finally {
             document.getElementById('addCost').disabled = false;
         }
     });
 }
 
function handlecostok(){
     document.querySelector('.catcontainer').style.display = 'none';
 }