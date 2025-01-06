import express from 'express';


const router = express.Router();

router.get('/home', (req, res)=>{
    res.render('pages/home');
})

router.get('/login', (req, res)=>{
    res.render('pages/login');
})

router.get('/add-user', (req, res)=>{
    res.render('pages/add-user');
});

router.get('/products', (req, res)=>{
    res.render('pages/products');
});

router.get('/products/add', (req, res)=>{
    res.render('pages/add-product');
});

router.get('/products/edit/:id', (req, res)=>{
    res.render('pages/edit-product', { id: req.params.id });
});

export default router;