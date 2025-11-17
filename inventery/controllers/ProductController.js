// controllers/ProductController.js
const { Product } = require('../models'); 

class ProductController {
    
    static async index(req, res) {
        try {
            const products = await Product.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch products.' });
        }
    }

   
    static async store(req, res) {
        try {
            
            const product = await Product.create(req.body);
            res.status(201).json(product);
        } catch (error) {
           
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ error: 'SKU already exists.' });
            }
            res.status(500).json({ error: 'Failed to create product.' });
        }
    }

   
    static async show(req, res) {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        res.json(product);
    }

   
    static async update(req, res) {
        const [updated] = await Product.update(req.body, {
            where: { id: req.params.id }
        });

        if (updated) {
            const updatedProduct = await Product.findByPk(req.params.id);
            return res.json(updatedProduct);
        }
        res.status(404).json({ error: 'Product not found.' });
    }

    // DELETE
    static async destroy(req, res) {
        const deleted = await Product.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            return res.status(204).send();
        }
        res.status(404).json({ error: 'Product not found.' });
    }
}

module.exports = ProductController;