const {connection} = require('./../db/connection');

var Order = {

    getAllOrders:function(callback){
        
    return connection.query("SELECT * FROM products LEFT JOIN orders ON products.product_id = orders.product_id",callback);

    },
    getOrderById:function(id,callback){

    return connection.query("SELECT * FROM products LEFT JOIN orders ON products.product_id = orders.product_id WHERE orders.order_total_id = ?;",[id],callback);
    },
    addOrder:function(Order,callback){
    return connection.query("Insert into orders (order_total_id, order_name, product_id, order_quantity, order_address, order_email) values(?,?,?,?,?,?)", [
        Order.order_total_id, 
        Order.order_name,
        Order.product_id,
        Order.order_quantity,
        Order.order_address,
        Order.order_email
    ],callback);
    },
    deleteOrder:function(id,callback){
    return connection.query("delete from orders where order_individual_id=?",[id],callback);
    },
    deleteTotalOrder:function(id,callback){
        return connection.query("delete from orders where order_total_id=?",[id],callback);
        },
    updateOrder:function(id,Order,callback){
    return connection.query(
        "update orders set order_name=?,order_quantity=?, order_address=?, order_email=? where order_individual_id=?", [
            Order.order_name,
            Order.order_quantity,
            Order.order_address,
            Order.order_email,
            id
        ],callback);
    }

};
module.exports = Order;

