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
      <div className="product-description">Description: {props.product_description}</div>
      <div className="product-price">Price: {props.product_price}</div>
      <div className="order-quantity">Order Quantity: {props.order_quantity}</div>
      <button className="delete-order-item button" onClick={props.deleteItem} data-order-item={props.order_individual_id}>Remove</button>
    </div>
  );
}

class App extends Component {

  constructor() {
    super();

    this.state = initialState;
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleOrderTotalId = this.handleOrderTotalId.bind(this);
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
    this.addNewItem = this.addNewItem.bind(this);

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

  }
  
  componentDidMount() { 
    var self = this; 
    
    // {self.state && self.state.orders && self.handleOrderTotalId();}

      
  };

  handleOrderTotalId() {
    var self = this; 
    var orderTotalIdList = self.state.orders.map(function(order, index) {
      return Number(order.order_total_id);
    });
    console.log(orderTotalIdList);

    var maxId = Math.max.apply(Math, orderTotalIdList); // 306

    // var maxId = Math.max(orderTotalIdList);
    console.log(maxId);

    self.setState({orderTotalId: maxId});
  }

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
      "product_id": Number(event.target.getAttribute('data-product')),
      "order_quantity": Number(event.target.value)
    }) })
  }

  submitOrder() {
    var self = this;

    var orderTotalIdList = self.state.orders.map(function(order, index) {
      return Number(order.order_total_id);
    });
    console.log(orderTotalIdList);

    var maxId = Math.max.apply(Math, orderTotalIdList); // 306

    // var maxId = Math.max(orderTotalIdList);
    console.log(maxId);

    self.setState({orderTotalId: maxId}, function() {
      self.state.submittedOrder.map(function(orderItem, index) {
        var order = JSON.parse(`{
          "order_total_id": ${self.state.orderTotalId}, 
          "product_id": ${orderItem.product_id}, 
          "order_quantity": ${orderItem.order_quantity}
        }`);
        console.log(order);
        // grab product info from product id 
        var productInfo = self.state.products.filter(function(product) {
          return product.product_id === self.state.submittedOrder[index].product_id; 
        });
        console.log(productInfo);
        console.log(productInfo[0].product_image);
        // combine product info to the order        
        order.product_name = productInfo[0].product_name;
        order.product_price = productInfo[0].product_price;
        order.product_description = productInfo[0].product_description;
        order.product_image = productInfo[0].product_image;
        order.product_category = productInfo[0].product_category;
        order.product_stock = productInfo[0].product_stock;
        order.order_total_id = self.state.orderTotalId;
        console.log(order);
        superagent
        .post('/orders')
        .set('Content-Type', 'application/json')
        .send(order)
        .end(function(err, res){
          if (err || !res.ok) {
            return console.log(err);
          } else {
            self.setState({lookupId: self.state.orderTotalId});
            self.setState({orders: self.state.orders.concat(order)});
          }
        });    
      })
    })

    //self.setState({orderTotalId: (self.state.orderTotalId + 1)});
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

  handleNewProduct(event) {
    this.setState({ newProduct: Number(event.target.value) })
  }

  handleNewQuantity(event) {
    this.setState({ newQuantity: Number(event.target.value) })
  }

  addNewItem() {
    var self = this;
    
    var order = JSON.parse(`{
      "order_total_id": ${self.state.inputOrder}, 
      "product_id": ${self.state.newProduct}, 
      "order_quantity": ${self.state.newQuantity}
    }`);

    // grab product info from product id 
    var productInfo = self.state.products.filter(function(product) {
      return product.product_id === self.state.newProduct; 
    });

    // combine product info to the order        
    order.product_name = productInfo[0].product_name;
    order.product_price = productInfo[0].product_price;
    order.product_description = productInfo[0].product_description;
    order.product_image = productInfo[0].product_image;
    order.product_category = productInfo[0].product_category;
    order.product_stock = productInfo[0].product_stock;

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
            {this.state && this.state.products && this.state.products.map((product, index) => {
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
            })}
            {this.state && this.state.lookupId !== null ? <span>Your Order ID is: </span> : <span></span>} 
            {this.state && this.state.lookupId !== null ? `${this.state.lookupId}` : <span></span>} 
            <input className="button" type="submit" onClick={this.submitOrder} />
          </div>

        : 

        <div className="orders">
          <input 
            type="textarea" 
            className="insert-order-id"
            placeholder="Enter Your Order ID" 
            value={this.state.inputOrder}
            onChange={this.handleInputOrder}
          />
          <input className="button" type="submit" onClick={this.handleSearch}/>
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
                <p>Please select any additional products you would like to add to your order.</p>
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
                <button className="add-to-order button" onClick={this.addNewItem}>Add to Order</button>
              </div>
            </div>
            : 
            <div></div>}
        </div>
        }
      </div>
    );
  }
}

export default App;
