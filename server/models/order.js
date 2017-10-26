const {connection} = require('./../db/connection');

// Order Model containing all possible methods
var Order = {

    // Pass in callback function, which will determine what happens when the method is called (i.e. getting the res.body, etc.)
    getAllOrders: function(callback) { 
        return connection.query("SELECT * FROM products LEFT JOIN orders ON products.product_id = orders.product_id", callback);
    },

    getOrderById: function(id, callback) {
        return connection.query(
            "SELECT * FROM products LEFT JOIN orders ON products.product_id = orders.product_id WHERE orders.order_total_id = ?;", 
            [id], 
            callback
        );
    },

    addOrder: function(Order, callback) {
        return connection.query("INSERT INTO orders (order_total_id, product_id, order_quantity) VALUES (?,?,?)", [
            Order.order_total_id, 
            Order.product_id,
            Order.order_quantity
        ], callback);
    },

    deleteOrder: function(id, callback) {
        return connection.query("DELETE FROM orders WHERE order_individual_id=?", [id], callback);
    },

    deleteTotalOrder: function(id, callback) {
        return connection.query("DELETE FROM orders WHERE order_total_id=?", [id], callback);
    },

    updateOrder: function(id, Order, callback) {
        return connection.query(
            "UPDATE orders SET order_quantity=? WHERE order_individual_id=?", [
                Order.order_quantity,
                id
            ], callback);
    }

};
module.exports = Order;

