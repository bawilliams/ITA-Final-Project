const {connection} = require('./../db/connection');

// Product model containing all possible methods
var Product = {

    getAllProducts: function(callback) {
        return connection.query("SELECT * FROM products", callback);
    },

    getProductById: function(id, callback) {
        return connection.query("SELECT * FROM products WHERE product_id=?", [id], callback);
    },

    updateProduct: function(id, Product, callback) {
        return connection.query(
            "UPDATE products SET product_name=?, product_stock=?, product_category=?, product_price=?, product_description=? WHERE product_id=?", [
                Product.product_name,
                Product.product_stock,
                Product.product_category,
                Product.product_price,
                Product.product_description,
                id
            ], callback);
        }

};
module.exports = Product;
