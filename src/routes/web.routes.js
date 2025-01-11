import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';


const router = express.Router();

router.get('/', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/home', { title: 'Home' });
})

router.get('/login',isLoggedIn , (req, res)=>{
    res.render('pages/login', { title: 'Login' });
})

router.get('/add-user', isLoggedIn ,(req, res)=>{
    res.render('pages/add-user', { title: 'Add User' });
});


// Products pages
router.get('/products', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/Products/products', { title: 'Products' });
});

router.get('/products/add', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/Products/add-product', { title: 'Add Product' });
});

router.get('/products/edit/:id',/*isLoggedIn , */(req, res)=>{
    res.render('pages/Products/edit-product', { id: req.params.id, title: 'Edit Product' });
});


// Categories pages
router.get('/categories', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/Categories/categories', { title: 'Categories' });
});
router.get('/categories/add', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/Categories/add-categories', { title: 'Add Category' });
});
router.get('/categories/edit/:id', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/Categories/edit-category', { title: 'edit Category' });
});


// Suppliers pages
router.get('/suppliers', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/Supplier/supplier', { title: 'Suppliers' });
});
router.get('/suppliers/add', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/Supplier/add-supplier', { title: 'Add Supplier' });
});
router.get('/suppliers/edit/:id', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/Supplier/edit-supplier', { title: 'edit Supplier' });
});


// customers pages
router.get('/customers', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/Customers/customers', { title: 'Customers' });
});
router.get('/customers/add', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/Customers/add-customer', { title: 'Add Customer' });
});
router.get('/customers/edit/:id', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/Customers/edit-customer', { title: 'edit Customer' });
});


// users pages
router.get('/users', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/Users/users', { title: 'Users' });
});
router.get('/users/adduser', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/Users/add-user', { title: 'Add user' });
});
router.get('/users/edit/:id', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/Users/edit-user', { title: 'edit user' });
});

export default router;