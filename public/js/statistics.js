let profitChartInstance = null; 
let invoiceChartInstance = null; 

document.addEventListener('DOMContentLoaded', async () => {
    populateYearDropdown();

    const defaultYear = new Date().getFullYear();
    await fetchDataAndRenderCharts(defaultYear);

    document.getElementById('yearSelect').addEventListener('change', async (event) => {
        const selectedYear = event.target.value;
        await fetchDataAndRenderCharts(selectedYear);
    });
});

function populateYearDropdown() {
    const yearSelect = document.getElementById('yearSelect');
    const currentYear = new Date().getFullYear();

    for (let year = 2025; year <= currentYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    yearSelect.value = currentYear;
}

async function fetchDataAndRenderCharts(year) {
    const loadingElement = document.querySelector('.loading');

    loadingElement.style.display = 'flex';
    try {
   
        const profitResponse = await fetch(`/api/statistics/profit?year=${year}`);
        const profitResult = await profitResponse.json();

      
        const invoiceResponse = await fetch(`/api/statistics/invoice?year=${year}`);
        const invoiceResult = await invoiceResponse.json();

       
        const topProductsResponse = await fetch(`/api/statistics/top-products?year=${year}`);
        const topProductsResult = await topProductsResponse.json();

        if (profitResponse.ok && invoiceResponse.ok && topProductsResponse.ok) {
         
            const profitData = profitResult.data;
            const profitChartData = prepareProfitChartData(profitData);
            renderProfitChart(profitChartData);

         
            const invoiceData = invoiceResult.data;
            const invoiceChartData = prepareInvoiceChartData(invoiceData);
            renderInvoiceChart(invoiceChartData);

          
            const topProductsData = topProductsResult.data;
            renderTopProductsTable(topProductsData);
        } else {
            console.error('Failed to fetch statistics:', profitResult.message || invoiceResult.message || topProductsResult.message);
        }
    } catch (error) {
        console.error('Error fetching statistics:', error);
    } finally {
     
        loadingElement.style.display = 'none';
    }
}

function prepareProfitChartData(data) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return {
        categories: months,
        series: [{
            name: 'Total Profit',
            data: data.map(stat => stat.totalProfit)
        }]
    };
}


function prepareInvoiceChartData(data) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return {
        categories: months,
        series: [{
            name: 'Total Invoices',
            data: data.map(stat => stat.totalInvoices)
        }]
    };
}

function renderProfitChart(data) {
    const chartElement = document.querySelector("#profitStatsChart");

    if (profitChartInstance) {
        profitChartInstance.destroy();
    }

    const options = {
        chart: {
            type: 'bar', 
            height: 350,
        },
        series: data.series,
        xaxis: {
            categories: data.categories,
        },
        title: {
            text: 'Monthly Profit Statistics',
            align: 'center',
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
            },
        },
        tooltip: {
            enabled: true,
        },
        colors: ['#17526B'], 
    };

    profitChartInstance = new ApexCharts(chartElement, options);
    profitChartInstance.render();
}

function renderInvoiceChart(data) {
    const chartElement = document.querySelector("#invoiceStatsChart");

    if (invoiceChartInstance) {
        invoiceChartInstance.destroy();
    }

    const options = {
        chart: {
            type: 'bar', 
            height: 350,
        },
        series: data.series,
        xaxis: {
            categories: data.categories,
        },
        title: {
            text: 'Monthly Invoice Statistics',
            align: 'center',
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
            },
        },
        tooltip: {
            enabled: true,
        },
        colors: ['#FF4560'],
    };


    invoiceChartInstance = new ApexCharts(chartElement, options);
    invoiceChartInstance.render();
}

function renderTopProductsTable(data) {
    const tableElement = document.querySelector("#topProductsData");
    tableElement.innerHTML = ''; 

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    data.forEach(monthData => {
        const monthName = months[monthData.month - 1]; 

        const row = document.createElement('div');
        row.className = 'staticrows';


        const monthCell = document.createElement('p');
        monthCell.className = 'columns';
        monthCell.textContent = monthName;
        row.appendChild(monthCell);


        const productsCell = document.createElement('p');
        productsCell.className = 'columns';


        const productsList = document.createElement('ul');
        monthData.topProducts.forEach(product => {
            const productItem = document.createElement('li');
            productItem.textContent = `${product.productName} (${product.totalQuantity} sold)`;
            productsList.appendChild(productItem);
        });

        productsCell.appendChild(productsList);
        row.appendChild(productsCell);

        tableElement.appendChild(row);
    });
}