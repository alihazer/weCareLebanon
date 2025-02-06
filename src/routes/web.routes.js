import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';


const router = express.Router();

router.get('/', isLoggedIn ,(req, res)=>{
    res.render('pages/home', { title: 'Home' });
})

router.get('/login' , (req, res)=>{
    res.render('pages/login', { title: 'Login', layout: 'layouts/auth' });
})

router.get('/invoices', isLoggedIn ,(req, res)=>{
    res.render('pages/invoices', { title: 'invoices' });
});

router.get('/creatQuotations', isLoggedIn ,(req, res)=>{
    res.render('pages/creatQuotation', { title: 'creatQuotation' });
});
router.get('/create-text-quotation', isLoggedIn ,(req, res)=>{
    res.render('pages/create-text-quotation', { title: 'create-text-quotation' });
});


// Products pages
router.get('/products', isLoggedIn ,(req, res)=>{
    res.render('pages/Products/products', { title: 'Products' });
});
router.get('/products/add', isLoggedIn ,(req, res)=>{
    res.render('pages/Products/add-product', { title: 'Add Product' });
});
router.get('/products/edit/:id',isLoggedIn ,(req, res)=>{
    res.render('pages/Products/edit-product', { id: req.params.id, title: 'Edit Product' });
});
router.get('/products/view/:id',isLoggedIn , (req, res)=>{
    res.render('pages/Products/aproduct', { id: req.params.id, title: 'A Product' });
});

// Categories pages
router.get('/categories', isLoggedIn ,(req, res)=>{
    res.render('pages/Categories/categories', { title: 'Categories' });
});
router.get('/categories/add', isLoggedIn ,(req, res)=>{
    res.render('pages/Categories/add-categories', { title: 'Add Category' });
});
router.get('/categories/edit/:id', isLoggedIn ,(req, res)=>{
    res.render('pages/Categories/edit-category', { title: 'edit Category' });
});


// Suppliers pages
router.get('/suppliers', isLoggedIn ,(req, res)=>{
    
    res.render('pages/Supplier/supplier', { title: 'Suppliers' });
});
router.get('/suppliers/add', isLoggedIn ,(req, res)=>{
    res.render('pages/Supplier/add-supplier', { title: 'Add Supplier' });
});
router.get('/suppliers/edit/:id', isLoggedIn ,(req, res)=>{
    res.render('pages/Supplier/edit-supplier', { title: 'edit Supplier' });
});
router.get('/suppliers/view/:id', isLoggedIn ,(req, res)=>{
    res.render('pages/Supplier/asupplier', { title: 'A Supplier' });
});


// customers pages
router.get('/customers', isLoggedIn ,(req, res)=>{
    res.render('pages/Customers/customers', { title: 'Customers' });
});
router.get('/customers/add', isLoggedIn ,(req, res)=>{
    res.render('pages/Customers/add-customer', { title: 'Add Customer' });
});
router.get('/customers/edit/:id', isLoggedIn ,(req, res)=>{
    res.render('pages/Customers/edit-customer', { title: 'edit Customer' });
});
router.get('/customers/view/:id', isLoggedIn ,(req, res)=>{
    res.render('pages/Customers/acustomer', { title: 'A Customer' });
});

// users pages
router.get('/allUsers', isLoggedIn ,(req, res)=>{
    res.render('pages/Users/users', { title: 'Users' });
});
router.get('/allUsers/adduser', isLoggedIn ,(req, res)=>{
    res.render('pages/Users/add-user', { title: 'Add user' });
});
router.get('/allUsers/edit/:id', isLoggedIn ,(req, res)=>{
    res.render('pages/Users/edit-user', { title: 'edit user' });
});

router.get('/statistics', isLoggedIn ,(req, res)=>{
    console.log('statistics');
    res.render('pages/statistics', { title: 'Statistics' });
});

router.get('/refund-invoice', isLoggedIn ,(req, res)=>{
    res.render('pages/refund-invoice', { title: 'Refund Invoice' });
});

export default router;