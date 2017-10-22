import React, { Component } from 'react';
import initialState from './initialState';
import './App.css';
//import Product from './components/Product';
import superagent from 'superagent';

function Header(props) {
  return (
    <div className="header">
      <a className="header-products" onClick={props.handleProducts}>Products</a>
      <a className="header-orders" onClick={props.handleOrders}>Orders</a>
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

function Order(props) {
  return (
    <div className="order">
      <div className="product-id">Product ID: {props.product_id}</div>
      <div className="order-quantity">Order Quantity: {props.order_quantity}</div>
    </div>
  );
}

class App extends Component {

  constructor() {
    super();

    this.state = initialState;
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleOrders = this.handleOrders.bind(this);
    this.handleProducts = this.handleProducts.bind(this);
    this.handleInputOrder = this.handleInputOrder.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
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

      superagent
      .get('/orders')
      .set('Accept', 'application/json')
      .end(function(err, res){
        if (err || !res.ok) {
          return console.log(err);
        } else {
          console.log(JSON.stringify(res.body));
          self.setState({orders: res.body});
        }
      })
  };

  handleProducts() {
    this.setState({showProducts: true, showOrders: false});
  }

  handleOrders() {
    this.setState({showProducts: false, showOrders: true});
  }

  handleSearch(event) {
    var ordersArray = this.state.orders;
    var self = this;
    var searchOrder = ordersArray.filter(function(order, index, ordersArray) {
      return ordersArray[index].order_total_id === self.state.inputOrder;
    });
    this.setState({order: searchOrder});
  }

  handleInputOrder(event) {
    this.setState({
      inputOrder: parseInt(event.target.value)
    });
  }

  // Make sure the asynchronous call has finished before mapping over products or it will be null
  render() {
    return (
      <div className="App">
        <Header 
          handleOrders={this.handleOrders}
          handleProducts={this.handleProducts}
        />
        {this.state.showProducts ? 

          <div className="products">
            <div className="instructions">Please select which products you would like to order and hit submit.</div>
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
            <input type="submit" />
          </div>

        : 

        <div className="orders">
          <input 
            type="textarea" 
            placeholder="Enter Your Order ID" 
            value={this.state.inputOrder}
            onChange={this.handleInputOrder}
          />
          <input type="submit" onClick={this.handleSearch}/>
          {this.state && this.state.orders && this.state.order && this.state.products && this.state.order.map(function(order, index) {
            return (
              <Order 
                product_id={order.product_id} 
                order_quantity={order.order_quantity}
                key={order.id} 
              />
            );
          }.bind(this))}
        </div>
        }
      </div>
    );
  }
}

export default App;
