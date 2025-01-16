// pages
document.querySelector('.menuIcon').addEventListener('click', () => {
    document.querySelector('.menuContainer').style.left='0';
});
document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('.menuContainer').style.left = '-170%';
});
document.querySelector('.closeContainer').addEventListener('click', () => {
    document.querySelector('.menuContainer').style.left = '-170%';
});


// invoices
document.querySelector('.invoiceIcon').addEventListener('click', () => {
    document.querySelector('.invoiceContainer').style.right='0';
});
document.querySelector('.closeinvoice').addEventListener('click', () => {
    document.querySelector('.invoiceContainer').style.right = '-100%';
});
document.querySelector('.Xclose').addEventListener('click', () => {
    document.querySelector('.invoiceContainer').style.right = '-100%';
});