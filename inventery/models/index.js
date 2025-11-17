// models/index.js
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');


const sequelize = new Sequelize('rahul', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql', // Specify MySQL dialect
    port: 3306,      // Default MySQL port
    logging: false,  
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const db = {};


const modelsDir = __dirname;
fs.readdirSync(modelsDir)
    .filter(file => {
       
        return (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(modelsDir, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });


Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.Product = db.Product;
db.Order = db.Order;
db.OrderItem = db.OrderItem;

module.exports = db;