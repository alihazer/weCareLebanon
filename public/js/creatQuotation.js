let selecteProducts = []; 
let iswholesale=true;


async function products() {
    document.querySelector(".products").style.display = "none";
    document.querySelector(".loading").style.display = "block";
    document.querySelector("#creatdivqua").style.display = "none";


    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        const quatationscontainer = document.getElementById('getquatations');
        quatationscontainer.innerHTML = '';

        products.data.forEach(qua => {
            const row = document.createElement('div');
            row.classList.add('rowquat');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.width = '25px';
            checkbox.style.height = '25px';
            checkbox.classList.add('checkpro');

            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    selecteProducts.push(qua._id);
                } else {
                    selecteProducts = selecteProducts.filter(id => id !== qua._id);
                }
            });

            row.innerHTML = `
                <div class="columncheck"></div>
                <div class="columns">
                    <div class="image" 
                        style="background-image: url('${qua.image ? qua.image : '/images/default-product.png'}');">
                    </div>
                </div>
                <p class="columns">${qua.name}</p>
            `;

            row.querySelector('.columncheck').appendChild(checkbox);

            quatationscontainer.appendChild(row);
        });

    } catch (error) {
        console.error('Error loading products:', error);
        alert('Failed to load products.');
    } finally {
        document.querySelector(".loading").style.display = "none";
        document.querySelector(".products").style.display = "block";
         document.querySelector("#creatdivqua").style.display = "flex";

    }
}


const selectprice=document.getElementById("prices")
selectprice.addEventListener('change', function () {
    if (selectprice.value=="wholeSale") {
        iswholesale=true
    }
    else{
        iswholesale=false
    }
});


document.querySelector(".creatQuotation").addEventListener('click', function () {
    if (selecteProducts.length==0) {
        document.querySelector('.catcontainer').style.display = 'flex';
        const warningText = document.getElementById('message');
        warningText.textContent = 'Select Products';
    }
    else{
        console.log("fiha");
        
    }
    
});

function handleokqua() {
    document.querySelector('.catcontainer').style.display = 'none';
}

products();
