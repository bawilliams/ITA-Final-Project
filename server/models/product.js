const {connection} = require('./../db/connection');

var Product = {

    getAllProducts:function(callback){

    return connection.query("Select * from products",callback);

    },
    getProductById:function(id,callback){

    return connection.query("select * from products where product_id=?",[id],callback);
    },

    updateProduct:function(id,Product,callback){
        return connection.query(
            "update products set product_name=?, product_stock=?, product_category=?, product_price=?, product_description=? where product_id=?", [
                Product.product_name,
                Product.product_stock,
                Product.product_category,
                Product.product_price,
                Product.product_description,
                id
            ],callback);
        }

};
module.exports = Product;
