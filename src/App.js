import React, { Component } from 'react';
import logo from './assets/logo.png';
import "bootstrap";
import './App.scss';

import Web3 from "web3";
import TruffleContract from "truffle-contract";

import MoneyPotSystem from "./build/contracts/MoneyPotSystem.json";

class App extends Component {

  componentWillMount() {

    let web3 = window.web3;

    if (typeof web3 !== 'undefined') {

      this.web3Provider = web3.currentProvider;
      this.web3 = new Web3(web3.currentProvider);

      this.tokenZendr = TruffleContract(MoneyPotSystem);
      this.tokenZendr.setProvider(this.web3Provider);

      // if (web3.eth.coinbase === null) {
      //   console.log('MetaMask is locked');
      // }

    } else {
      console.log('MetaMask is not installed');
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
