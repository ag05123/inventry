// index.js (Main application file)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Node.js built-in path module
const db = require('./models'); 
const apiRoutes = require('./routes/api');
const frontendRoutes = require('./routes/frontendRoutes'); // Import new routes

const app = express();
const PORT = 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 


app.use('/api', apiRoutes);


app.use('/', (req, res, next) => {
    
    res.locals.error = req.query.error;
    res.locals.success = req.query.success;
    next();
}, frontendRoutes);


db.sequelize.sync({ alter: false }).then(() => {
    console.log("Database tables synced successfully (MySQL).");
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});