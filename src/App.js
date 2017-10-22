import React, { Component } from 'react';
//import initialState from './initialState';
import './App.css';
//import Product from './components/Product';
import superagent from 'superagent';

function Header() {
  return (
    <div className="header">
      <a className="header-products">Products</a>
      <a className="header-orders">Orders</a>
    </div>
  );
}

function Product(props) {
  return (
    <div className="product">
        <img className="product-image" src="https://images-na.ssl-images-amazon.com/images/I/616IDFESKtL._SL1063_.jpg" />
        <div className="price-button">
            <div className="product-name">{props.product_name}</div>
            <div className="product-price">{props.product_price}</div>
        </div>
        <button className="add-to-cart">Add to Cart</button>
        <div className="product-description">{props.product_description}</div>
    </div>
  );
}

class App extends Component {

  constructor() {
    super();

    this.state = {products: null};
    this.componentDidMount = this.componentDidMount.bind(this);
    console.log(this.state);
  }
  
  componentDidMount() { 
    var self = this; 

    superagent
      .get('/products')
      .set('Accept', 'application/json')
      .end(function(err, res){
        if (err || !res.ok) {
          return console.log(err);
        } else {
          console.log(JSON.stringify(res.body));
          self.setState({products: res.body});
        }
      })
  };

  // Make sure the asynchronous call has finished before mapping over products or it will be null
  render() {
    return (
      <div className="App">
        <Header />
        <div className="products">
          {this.state && this.state.products && this.state.products.map(function(product, index) {
            return (
              <Product 
                product_name={product.product_name} 
                product_price={product.product_price} 
                product_description={product.product_description} 
                key={product.id} 
              />
            );
          }.bind(this))}
        </div>
      </div>
    );
  }
}

export default App;
