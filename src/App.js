import React, { Component } from 'react';
import initialState from './initialState';
import './App.css';
//import Product from './components/Product';
import superagent from 'superagent';

import image_lucky_bamboo from './img/lucky_bamboo.png';
// import image_pebbles from './img/pebbles.png';
// import image_petite_bamboo from './img/petite_bamboo.png';
// import image_pot from './img/pot.png';
// import image_soil from './img/soil.png';

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
        <img className="product-image" src={image_lucky_bamboo} alt="Bamboo"/>
        <div className="product-name">{props.product_name}</div>
        <div className="product-description">{props.product_description}</div>
        <div className="product-price">Price: {props.product_price}</div>
        <span className="select-description">Select Quantity: </span>
        <select className="order-quantity-select" onChange={props.handleItemAdd} data-product={props.product_id}>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
    </div>
  );
}

function Order(props) {
  return (
    <div className="order">
      <div className="product-name">Product: {props.product_name}</div>
      <div className="product-name">Description: {props.product_description}</div>
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
    this.submitOrder = this.submitOrder.bind(this);
    this.handleItemAdd = this.handleItemAdd.bind(this);
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
      inputOrder: Number(event.target.value)
    });
  }

  handleItemAdd(event) {
    console.log(event.target.value);
    console.log(event.target.getAttribute('data-product'));
  }

  submitOrder() {
    var self = this;

    superagent
    .post('/orders')
    .set('Content-Type', 'application/json')
    .send(`{
      "order_total_id": 4,
      "product_id": 5,
      "order_quantity": 11
    }`)
    .end(function(err, res){
      if (err || !res.ok) {
        return console.log(err);
      } else {
        console.log(JSON.stringify(res.body));
      }
    })

    self.setState(self.state);
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
            <div className="instructions">Please select how many of each product you would like to order and hit submit.</div>
            {this.state && this.state.products && this.state.products.map(function(product, index) {
              return (
                <Product 
                  product_name={product.product_name} 
                  product_price={product.product_price} 
                  product_description={product.product_description} 
                  product_image={product.product_image} 
                  product_id={product.product_id}
                  handleItemAdd={this.handleItemAdd}
                  key={product.id} 
                />
              );
            }.bind(this))}
            <input type="submit" onClick={this.submitOrder} />
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
                product_name={order.product_name} 
                product_description={order.product_description} 
                order_quantity={order.order_quantity}
                key={order.id} 
              />
            );
          })}
        </div>
        }
      </div>
    );
  }
}

export default App;
