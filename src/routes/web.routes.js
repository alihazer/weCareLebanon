import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';


const router = express.Router();

router.get('/', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/home');
})

router.get('/login',isLoggedIn , (req, res)=>{
    res.render('pages/login');
})

router.get('/add-user', isLoggedIn ,(req, res)=>{
    res.render('pages/add-user');
});

router.get('/products', isLoggedIn ,(req, res)=>{
    res.render('pages/products');
});

router.get('/products/add', /*isLoggedIn ,*/(req, res)=>{
    res.render('pages/add-product');
});

router.get('/products/edit/:id',isLoggedIn , (req, res)=>{
    res.render('pages/edit-product', { id: req.params.id });
});

export default router;