// routes/api.js
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const OrderController = require('../controllers/OrderController');
const { productValidationRules, validate } = require('../middleware/productValidator');

 
router.get('/products', ProductController.index);
router.post('/products', productValidationRules(), validate, ProductController.store);
router.get('/products/:id', ProductController.show);
router.put('/products/:id', productValidationRules(), validate, ProductController.update);
router.delete('/products/:id', ProductController.destroy);


 
    router.post('/orders', OrderController.create);

module.exports = router;