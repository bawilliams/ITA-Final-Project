const express = require('express');
const bodyParser = require('body-parser'); 
const mysql = require('mysql'); 

const {connection} = require('./db/connection');
const Product = require('./models/product');
const Order = require('./models/order');

// Create the express application
var app = express();
const port = 8890;

// Takes object and converts it to JSON, adding it on to the body; used for POST
app.use(bodyParser.json());

// POST Request to insert new order
app.post('/orders', (req, res) => {
    Order.addOrder(req.body, function(err) {
        if (err) {
            res.json(err);
        } else {
            res.json(req.body);
        }
    });
});

// GET Request to grab all products data
app.get('/products', (req, res) => {
    Product.getAllProducts(function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });
});

// GET Request to grab product by ID
app.get('/products/:id', (req, res) => {
    // grab the variable passed in as a parameter
    var id = req.params.id;

    Product.getProductById(id, function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });
});

// GET Request to grab all orders data
app.get('/orders', (req, res) => {
    
    Order.getAllOrders(function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });
});

// GET Request to grab order by ID
app.get('/orders/:id', (req, res) => {
    // grab the variable passed in as a parameter
    var id = req.params.id;

    Order.getOrderById(id, function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });
});

// DELETE Request using a specific individual order ID
app.delete('/orders/:id', (req, res) => {
    // get the id
    var id = req.params.id;

    Order.deleteOrder(id, function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });    
});

// DELETE Request using a specific total order ID
app.delete('/orders/total/:id', (req, res) => {
    // get the id
    var id = req.params.id;

    Order.deleteTotalOrder(id, function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });    
});

// PUT Request using a specific order ID - updates the entire document
app.put('/orders/:id', (req, res) => {
    var id = req.params.id;

    Order.updateOrder(id, req.body, function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    }); 
});

// PUT Request using a specific produt ID - updates the entire document
app.put('/products/:id', (req, res) => {
    var id = req.params.id;

    Product.updateProduct(id, req.body, function(err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    }); 
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};