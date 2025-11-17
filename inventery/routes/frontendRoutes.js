const express = require('express');
const axios = require('axios');
const router = express.Router();


const API_BASE_URL = 'http://localhost:3000/api'; 


router.get('/', async (req, res) => {
    try {
     
        const response = await axios.get(`${API_BASE_URL}/products`);
        const products = response.data;
        
     
        res.render('inventory', { 
            title: 'Product Inventory', 
            products: products,
            success: req.query.success
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.render('error', { message: 'Failed to load inventory.' });
    }
});

router.post('/orders', async (req, res) => {
    try {
   
        
        const items = [];
        
        for (const key in req.body) {
            if (key.startsWith('product_')) {
                const productId = req.body[key];
                const quantityKey = `quantity_${key.split('_')[1]}`;
                const quantity = parseInt(req.body[quantityKey]);
                
                if (productId && quantity > 0) {
                    items.push({ product_id: parseInt(productId), quantity });
                }
            }
        }
        
        const orderData = { items };
        console.log(orderData);
       
        const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
        
     
        res.redirect('/?success=' + encodeURIComponent(`Order ${response.data.order.order_number} created! Discount applied: ${response.data.details.discount_rate}`));

    } catch (error) {
        console.error('Order creation error:', error.response ? error.response.data : error.message);
        
        let errorMessage = 'Failed to create order.';
        if (error.response && error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error; 
        }
        
   \
        res.redirect('/?error=' + encodeURIComponent(errorMessage));
    }
});

module.exports = router;
