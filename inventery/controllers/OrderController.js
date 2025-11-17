// controllers/OrderController.js
const { Order, Product, OrderItem, sequelize } = require('../models');

class OrderController {

    
    static #calculateDiscount(baseTotal, uniqueItemCount) {
        let discountRate = 0;

      
        if (uniqueItemCount >= 3) {
            discountRate = Math.max(discountRate, 0.10);
        }

       
        if (baseTotal > 500) {
            discountRate = Math.max(discountRate, 0.15);
        }

        if (discountRate > 0) {
            const discountAmount = baseTotal * discountRate;
            const discountedTotal = baseTotal - discountAmount;
            return {
                finalAmount: parseFloat(discountedTotal.toFixed(2)),
                discountApplied: discountRate * 100,
                baseTotal: baseTotal
            };
        }

        return {
            finalAmount: parseFloat(baseTotal.toFixed(2)),
            discountApplied: 0,
            baseTotal: baseTotal
        };
    }
     static async index(req, res) {
        try {
            
            const orders = await Order.findAll({
                order: [['createdAt', 'DESC']]
            });
            res.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Failed to retrieve order history.' });
        }
    }
    
    static async create(req, res) {
        const { items } = req.body; 

        if (!items || items.length === 0) {
            return res.status(422).json({ error: 'Order must contain items.' });
        }

        const productIds = items.map(item => item.product_id);
        const productsMap = new Map();
        let baseTotal = 0;

       
        try {
            const products = await Product.findAll({ where: { id: productIds } });
            
            
            for (const product of products) {
                productsMap.set(product.id, product);
            }

            for (const item of items) {
                const product = productsMap.get(item.product_id);

             
                if (!product) {
                    return res.status(422).json({ error: `Product with ID ${item.product_id} not found.` });
                }

              
                if (product.stock_quantity < item.quantity) {
                    return res.status(422).json({ error: `Insufficient stock for product: ${product.name}. Requested: ${item.quantity}, Available: ${product.stock_quantity}` });
                }

               
                baseTotal += parseFloat(product.price) * item.quantity;
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error during product and stock verification.' });
        }

        
        const uniqueItemCount = new Set(items.map(item => item.product_id)).size;
        const discountResult = OrderController.#calculateDiscount(baseTotal, uniqueItemCount);

       
        const t = await sequelize.transaction();

        try {
            
            const order = await Order.create({
                total_amount: discountResult.finalAmount,
                status: 'pending',  
            }, { transaction: t });

        
            const orderItemsData = [];
            const stockUpdates = [];

            for (const item of items) {
                const product = productsMap.get(item.product_id);

             
                orderItemsData.push({
                    order_id: order.id,
                    product_id: product.id,
                    quantity: item.quantity,
                    unit_price: parseFloat(product.price),  
                });

              
                stockUpdates.push(Product.update(
                    { stock_quantity: product.stock_quantity - item.quantity },
                    { where: { id: product.id }, transaction: t }
                ));
            }

             
            await OrderItem.bulkCreate(orderItemsData, { transaction: t });
            await Promise.all(stockUpdates);

            
            await t.commit();

            
            return res.status(201).json({
                message: 'Order created successfully.',
                order: order,
                details: {
                    base_total: baseTotal,
                    discount_rate: `${discountResult.discountApplied}%`,
                    final_amount: discountResult.finalAmount
                }
            });

        } catch (error) {
            
            await t.rollback();
            console.error("Order creation failed and transaction rolled back:", error);
            return res.status(500).json({ error: 'Order creation failed due to a server error or stock update issue.' });
        }
    }
}

module.exports = OrderController;
