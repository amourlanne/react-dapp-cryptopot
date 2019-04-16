import React, { Component } from 'react';
import logo from './assets/logo.png';
import "bootstrap";
import './App.scss';

import Web3 from "web3";
// import TruffleContract from "truffle-contract";

// import MoneyPotSystem from "./build/contracts/MoneyPotSystem.json";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            web3 : null,
        }
    }

  componentWillMount() {

    if (typeof window.web3 !== 'undefined') {

        const web3 = new Web3(window.web3.currentProvider);

        const {
            getCoinbase,
            getBalance
        } = web3.eth;

        const {
            fromWei
        } = web3.utils;

        getCoinbase().then((account) => {
            if(account) {
                console.log(account);
                return getBalance(account);
            } else {
                console.log('MetaMask is locked');
            }
        }).then((balance) => {
            if(balance) {
                console.log(Number(fromWei(balance, "ether")));
            }
        });

        this.setState({
            web3: web3
        });

      // this.tokenZendr = TruffleContract(MoneyPotSystem);
      // this.tokenZendr.setProvider(this.web3Provider);

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
