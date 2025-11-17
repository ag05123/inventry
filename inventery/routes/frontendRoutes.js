const express = require('express');
const axios = require('axios');
const router = express.Router();

// Base URL for the RESTful API you created
const API_BASE_URL = 'http://localhost:3000/api'; 

// --- 1. Product Inventory View ---
router.get('/', async (req, res) => {
    try {
        // Fetch all products using the Product API (GET /api/products)
        const response = await axios.get(`${API_BASE_URL}/products`);
        const products = response.data;
        
        // Render the view, passing the fetched data
        res.render('inventory', { 
            title: 'Product Inventory', 
            products: products,
            success: req.query.success // Pass success message from query params
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.render('error', { message: 'Failed to load inventory.' });
    }
});

// --- 2. Create Order POST Handler ---
router.post('/orders', async (req, res) => {
    try {
        // The form sends product IDs and quantities, which is passed in req.body.
        // We need to transform this into the required API format: items: [{product_id, quantity}, ...]
        
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
        // Call the Order API (POST /api/orders)
        const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
        
        // Redirect back to inventory with a success message
        res.redirect('/?success=' + encodeURIComponent(`Order ${response.data.order.order_number} created! Discount applied: ${response.data.details.discount_rate}`));

    } catch (error) {
        console.error('Order creation error:', error.response ? error.response.data : error.message);
        
        let errorMessage = 'Failed to create order.';
        if (error.response && error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error; // Stock error message (422)
        }
        
        // Redirect to inventory with an error message
        res.redirect('/?error=' + encodeURIComponent(errorMessage));
    }
});

module.exports = router;