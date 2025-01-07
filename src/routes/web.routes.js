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

router.get('/products', isLoggedIn ,(req, res)=>{
    res.render('pages/products', { title: 'Products' });
});

router.get('/products/add', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/add-product', { title: 'Add Product' });
});

router.get('/products/edit/:id',isLoggedIn , (req, res)=>{
    res.render('pages/edit-product', { id: req.params.id, title: 'Edit Product' });
});

export default router;