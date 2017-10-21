import React, { Component } from 'react';

class Product extends Component {
  render() {
    return (
        <div className="product">
            <img className="product-image" src="https://images-na.ssl-images-amazon.com/images/I/616IDFESKtL._SL1063_.jpg" />
            <div className="price-button">
                <div className="product-name">{this.props.product_name}</div>
                <div className="product-price">19.99</div>
            </div>
            <button className="add-to-cart">Add to Cart</button>
            <div className="product-description">Small bamboo plant</div>
        </div>
    );
  }
}

export default Product;
