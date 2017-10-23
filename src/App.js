import React, { Component } from 'react';
import initialState from './initialState';
import './App.css';
//import Product from './components/Product';
import superagent from 'superagent';

import image_lucky_bamboo from './img/lucky_bamboo.png';
import image_pebbles from './img/pebbles.png';
import image_petite_bamboo from './img/petite_bamboo.png';
import image_pot from './img/pot.png';
import image_soil from './img/soil.png';

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
        <img className="product-image" src={'./img/'+props.product_image} alt={props.product_name}/>
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
      <img className="product-image-order" src={'./img/'+props.product_image} alt={props.product_name}/>
      <div className="product-name">Product: {props.product_name}</div>
      <div className="product-name">Description: {props.product_description}</div>
      <div className="order-quantity">Order Quantity: {props.order_quantity}</div>
      <button className="delete-order-item" onClick={props.deleteItem} data-order-item={props.order_individual_id}>Remove</button>
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
    this.deleteItem = this.deleteItem.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
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
    this.setState({ submittedOrder: this.state.submittedOrder.concat({
      "order_total_id": this.state.orderTotalId,
      "product_id": Number(event.target.getAttribute('data-product')),
      "order_quantity": Number(event.target.value)
    }) })
  }

  submitOrder() {
    var self = this;

    self.state.submittedOrder.map(function(orderItem, index) {
      var order = `{
        "order_total_id": ${self.state.submittedOrder[index].order_total_id}, 
        "product_id": ${self.state.submittedOrder[index].product_id}, 
        "order_quantity": ${self.state.submittedOrder[index].order_quantity}
      }`;

      superagent
      .post('/orders')
      .set('Content-Type', 'application/json')
      .send(order)
      .end(function(err, res){
        if (err || !res.ok) {
          return console.log(err);
        } else {
          self.setState({orders: self.state.orders.concat(JSON.parse(order))});
          self.setState({orderTotalId: (self.state.orderTotalId + 1)});
        }
      })
    })
    self.setState(self.state);
  }

  deleteItem(event) {
    var self = this;
    var orderItem = Number(event.target.getAttribute('data-order-item'));

      superagent
      .del(`/orders/${orderItem}`)
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        if (err || !res.ok) {
          return console.log(err);
        } else {
          var ordersCopy = self.state.orders.filter(function(order){
            return order.order_individual_id !== orderItem;
          });
          self.setState({orders: ordersCopy});
        }
      })
  }

  deleteOrder(event) {
    var self = this;
    var orderTotalId = self.state.order[0].order_total_id;

    console.log(self.state.order[0].order_total_id);
    console.log(orderTotalId);
      superagent
      .del(`/orders/total/${orderTotalId}`)
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        if (err || !res.ok) {
          return console.log(err);
        } else {
          var ordersCopy = self.state.orders.filter(function(order){
            return order.order_total_id !== orderTotalId;
          });
          self.setState({orders: ordersCopy});
        }
      })
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
                product_image={order.product_image}
                order_quantity={order.order_quantity}
                order_individual_id={order.order_individual_id}
                deleteItem={this.deleteItem}
                key={order.id} 
              />
            );
          }.bind(this))}
          {this.state.order ? 
            <button className="delete-order" onClick={this.deleteOrder}>Delete Order</button> 
            : 
            <div></div>}
        </div>
        }
      </div>
    );
  }
}

export default App;
