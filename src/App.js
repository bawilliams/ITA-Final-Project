import React, { Component } from 'react';
//import initialState from './initialState';
import './App.css';
import Product from './components/Product';
import superagent from 'superagent';


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

  render() {
    return (
      <div className="App">
        <div className="products">
          <Product />
        </div>
      </div>
    );
  }
}

export default App;
