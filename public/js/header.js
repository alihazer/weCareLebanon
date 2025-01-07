document.querySelector('.menuIcon').addEventListener('click', () => {
    document.querySelector('.menuContainer').style.left='0';
});
document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('.menuContainer').style.left = '-100%';
});
document.querySelector('.closeContainer').addEventListener('click', () => {
    document.querySelector('.menuContainer').style.left = '-100%';
});