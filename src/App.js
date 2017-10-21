import React, { Component } from 'react';
import initialState from './initialState';
import './App.css';
import Product from './components/Product';

class App extends Component {

  constructor() {
    super();

    this.state = initialState;
    console.log(this.state);
  }

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
