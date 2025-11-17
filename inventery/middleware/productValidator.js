// middleware/productValidator.js
const { body, validationResult } = require('express-validator');

const productValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('Product name is required.'),
        body('sku').isString().notEmpty().withMessage('SKU is required.'),
       
        body('price').isDecimal().withMessage('Price must be a decimal number.'),
        body('stock_quantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer.'),
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
        errors: extractedErrors,
    });
};

module.exports = {
    productValidationRules,
    validate,
};