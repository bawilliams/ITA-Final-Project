import React, { Component } from 'react';
import initialState from './initialState';
import './App.css';
import superagent from 'superagent';

function Header(props) {
  return (
    <div className="header">
      <span className="store-name">Baylee's Bamboo</span>
      <a className="header-products" onClick={props.handleProducts}>Products</a>
      <a className="header-orders" onClick={props.handleOrders}>Orders</a>
    </div>
  );
}

// Product component only shows selector on Product page
function Product(props) {
  return (
    <div className="product">
        <img className="product-image" src={'./img/'+props.product_image} alt={props.product_name}/>
        <div className="product-name">{props.product_name}</div>
        <div className="product-description">{props.product_description}</div>
        <div className="product-price">Price: ${props.product_price}</div>
        {
          props.showProducts ? 
          <div className="select-quantity">
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
          : 
          <div></div>
        }
        
    </div>
  );
}

function Order(props) {
  return (
    <div className="order">
      <img className="product-image-order" src={'./img/'+props.product_image} alt={props.product_name}/>
      <div className="product-name">Product: {props.product_name}</div>
      <div className="product-description">Description: {props.product_description}</div>
      <div className="product-price">Price: ${props.product_price}</div>
      <div className="order-quantity">Order Quantity: {props.order_quantity}</div>
      <button className="delete-order-item button" onClick={props.deleteItem} data-order-item={props.order_individual_id}>Remove</button>
    </div>
  );
}

class App extends Component {

  constructor() {
    super();

    this.state = initialState;
    this.handleOrders = this.handleOrders.bind(this);
    this.handleProducts = this.handleProducts.bind(this);
    this.handleInputOrder = this.handleInputOrder.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
    this.handleItemAdd = this.handleItemAdd.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.handleNewProduct = this.handleNewProduct.bind(this);
    this.handleNewQuantity = this.handleNewQuantity.bind(this);
    this.addNewItemToOrder = this.addNewItemToOrder.bind(this);

    // Need to set a reference to this or when you call setState in superagent this is undefined
    var self = this;

    // Load in products, so they are ready to go
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

    // Load in orders, so they are ready to go
    superagent
      .get('/orders')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err || !res.ok) {
          return console.log(err);
        } else {
          self.setState({orders: res.body});
        }
      })
  }

  // Switch page to products
  handleProducts() {
    this.setState({showProducts: true, showOrders: false});
  }

  // Switch page to orders - load in orders again to grab newly created orders, or individual ids won't populate
  handleOrders() {
    var self = this;

    superagent
    .get('/orders')
    .set('Accept', 'application/json')
    .end(function(err, res) {
      if (err || !res.ok) {
        return console.log(err);
      } else {
        self.setState({orders: res.body});
        self.setState({showProducts: false, showOrders: true});
      }
    })
  }

  // Set up state for displaying searched orders
  handleSearch(event) {
    event.preventDefault();

    var self = this;

    // Set separate property to keep track of the searched Order ID, because the field will be reset for new searches
    self.setState({inputOrderValue: self.state.inputOrder});

    var ordersArray = self.state.orders;

    // Filter out all orders that do not match the searched ID
    var searchOrder = ordersArray.filter(function(order, index, ordersArray) {
      return ordersArray[index].order_total_id === self.state.inputOrder;
    });

    // Clear input field and setState for order, so it can render to the page
    this.setState({order: searchOrder});
    this.setState({inputOrder: ''})
  }

  // Grab input from the user and store in state
  handleInputOrder(event) {
    this.setState({
      inputOrder: Number(event.target.value),
    });
  }

  // On Products Page, set up state to submit order info (product id, order quantity, order total id)
  handleItemAdd(event) {
    this.setState({ submittedOrder: this.state.submittedOrder.concat({
      "product_id": Number(event.target.getAttribute('data-product')),
      "order_quantity": Number(event.target.value)
    }) })

    var self = this;
    
    // Get an array of all existing total order IDs
    var orderTotalIdList = self.state.orders.map(function(order, index) {
      return Number(order.order_total_id);
    });

    // Find the largest total order ID and add 1 for a new total order ID
    var maxId = Math.max.apply(Math, orderTotalIdList) + 1; 

    self.setState({orderTotalId: maxId});
  }

  // Handle submitting orders - state, requests, etc.
  submitOrder() {
    var self = this;

    // When submitting the order, save the order total id, so you can tell the consumer
    self.setState({lookupId: self.state.orderTotalId});

    self.state.submittedOrder.map(function(orderItem, index) {

      // Set up each individual order with existing info (product id, order total id, order quantity)
      var order = {
        order_total_id: self.state.orderTotalId, 
        product_id: orderItem.product_id, 
        order_quantity: orderItem.order_quantity
      };

      // Grab product info from product id 
      var productInfo = self.state.products.filter(function(product) {
        return product.product_id === self.state.submittedOrder[index].product_id; 
      });

      // Combine product info to the order        
      order.product_name = productInfo[0].product_name;
      order.product_price = productInfo[0].product_price;
      order.product_description = productInfo[0].product_description;
      order.product_image = productInfo[0].product_image;
      order.product_category = productInfo[0].product_category;
      order.product_stock = productInfo[0].product_stock;
      order.order_total_id = self.state.orderTotalId;

      // Make post request to add new order to the database
      superagent
      .post('/orders')
      .set('Content-Type', 'application/json')
      .send(order)
      .end(function(err, res){
        if (err || !res.ok) {
          return console.log(err);
        } else {
          // After submitting an order, update orders and prepare next total order ID
          self.setState({orderTotalId: (self.state.orderTotalId + 1)});
          self.setState({orders: self.state.orders.concat(order)});
        }
      });    
    })
  }

  // Delete individual items on an order
  deleteItem(event) {
    var self = this;

    // Get individual order ID using a custom param
    var orderItem = Number(event.target.getAttribute('data-order-item'));    

    // Make delete request using superagent
    superagent
    .del(`/orders/${orderItem}`)
    .set('Content-Type', 'application/json')
    .end(function(err, res){
      if (err || !res.ok) {
        return console.log(err);
      } else {
        // Filter out the individual order ID that you want to delete then set state to updated orders
        var ordersCopy = self.state.orders.filter(function(order){
          return order.order_individual_id !== orderItem;
        });
        self.setState({orders: ordersCopy});

        // Filter out all individual items that are not on this order and the item that was deleted, then set state to update
        var ordersArray = self.state.orders;
        var searchOrder = ordersArray.filter(function(order) {
          return (order.order_total_id === self.state.inputOrderValue && order.order_individual_id !== orderItem);
        });
        self.setState({order: searchOrder});
      }
    })
  }

  // Delete an entire order with the order total ID
  deleteOrder(event) {
    var self = this;
    // All items in order have the same total order ID, so just grab the first one
    var orderTotalId = self.state.order[0].order_total_id;

    // Make delete request using total order ID
    superagent
    .del(`/orders/total/${orderTotalId}`)
    .set('Content-Type', 'application/json')
    .end(function(err, res){
      if (err || !res.ok) {
        return console.log(err);
      } else {
        // Filter out all order items that have that total order ID, then update orders and order state
        var ordersCopy = self.state.orders.filter(function(order){
          return order.order_total_id !== orderTotalId;
        });
        self.setState({orders: ordersCopy, order: null});
      }
    })
  }

  // On Orders Page, set up state to add new products to the order - product ID
  handleNewProduct(event) {
    this.setState({newProduct: Number(event.target.value)})
  }

  // On Orders Page, set up state to add new products to the order - order quantity
  handleNewQuantity(event) {
    this.setState({newQuantity: Number(event.target.value)})
  }

  // On Orders Page, add new products to an existing order
  addNewItemToOrder() {
    var self = this;
    
    // Set up order to send during request
    var order = {
      order_total_id: self.state.inputOrder, 
      product_id: self.state.newProduct, 
      order_quantity: self.state.newQuantity
    };

    // Grab product info from specified product id 
    var productInfo = self.state.products.filter(function(product) {
      return product.product_id === self.state.newProduct; 
    });

    // Combine product info to the order        
    order.product_name = productInfo[0].product_name;
    order.product_price = productInfo[0].product_price;
    order.product_description = productInfo[0].product_description;
    order.product_image = productInfo[0].product_image;
    order.product_category = productInfo[0].product_category;
    order.product_stock = productInfo[0].product_stock;

    // Make POST request to superagent and add updated order to state
    superagent
    .post('/orders')
    .set('Content-Type', 'application/json')
    .send(order)
    .end(function(err, res){
      if (err || !res.ok) {
        return console.log(err);
      } else {
        self.setState({
          orders: self.state.orders.concat(order),
          order: self.state.order.concat(order)
        })
      }
    })
  }

  // Make sure the asynchronous call has finished before mapping over state or it will be null
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
            {this.state && this.state.products && this.state.products.map((product, index) => {
              return (
                <Product 
                  product_name={product.product_name} 
                  product_price={product.product_price} 
                  product_description={product.product_description} 
                  product_image={product.product_image} 
                  product_id={product.product_id}
                  showProducts={this.state.showProducts}
                  handleItemAdd={this.handleItemAdd}
                  key={product.id} 
                />
              );
            })}
            {this.state && this.state.lookupId !== null ? <span className="order-id">Your Order ID is: </span> : <span></span>} 
            {this.state && this.state.lookupId !== null ? `${this.state.lookupId}` : <span></span>} 
            <input className="submit-order button" type="submit" onClick={this.submitOrder} />
          </div>

        : 

        <div className="orders">
          <form id="submit-order-form">
            <input 
              type="textarea" 
              id="insert-order-id"
              placeholder="Enter Your Order ID" 
              value={this.state.inputOrder}
              onChange={this.handleInputOrder}
            />
            <input className="button" type="submit" onClick={this.handleSearch}/>
          </form>
          {this.state && this.state.orders && this.state.order && this.state.products && this.state.order.map((order, index) => {
            return (
              <Order 
                product_name={order.product_name} 
                product_description={order.product_description} 
                product_image={order.product_image}
                product_price={order.product_price}
                order_quantity={order.order_quantity}
                order_individual_id={order.order_individual_id}
                deleteItem={this.deleteItem}
                key={order.id} 
              />
            );
          })}
          {this.state.order !== null ? 
            <div className="manage-order">
              <button className="delete-order button" onClick={this.deleteOrder}>Delete Order</button> 
              <div className="add-product">
                <div className="instructions">Please select any additional products you would like to add to your order.</div>
                <select className="add-product-select" onChange={this.handleNewProduct}>
                  {this.state.products.map(function(product, index) {
                    return (
                      <option value={product.product_id}>{product.product_name}</option>
                    );
                  })}
                </select>
                <select className="add-quantity-select" onChange={this.handleNewQuantity}>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <span className="add-to-order-span">
                  <button className="add-to-order button" onClick={this.addNewItemToOrder}>Add to Order</button>
                </span>
                {this.state.products.map((product, index) => {
                  if (product.product_id === this.state.newProduct) {
                    return (
                      <Product 
                        product_name={product.product_name} 
                        product_price={product.product_price} 
                        product_description={product.product_description} 
                        product_image={product.product_image} 
                        product_id={product.product_id}
                        showProducts={this.state.showProducts}
                      />
                    )
                  } 
                })}
              </div>
            </div>
            : 
            <div className="orders-page"></div>}
        </div>
        }
        <div className="end-of-page"></div>
      </div>
    );
  }
}

export default App;
