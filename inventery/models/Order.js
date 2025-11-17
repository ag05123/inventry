// models/Order.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        order_number: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
           
            defaultValue: () => `ORD-${Date.now()}`
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
            defaultValue: 'pending',
        },
    }, {
        tableName: 'orders',
    });

    Order.associate = (models) => {
       
        Order.belongsToMany(models.Product, {
            through: models.OrderItem,
            foreignKey: 'order_id',
            as: 'products',
        });
    };

    return Order;
};