import React, {Component} from 'react';
import "bootstrap";
import './App.scss';

import Web3 from "web3";

import {connect} from "react-redux";

import {web3Actions, moneypotActions} from "./redux/actions";
import {web3Helper} from "./helpers";

class App extends Component {

  initWeb3() {

    const {
      dispatchWeb3Instance,
      dispatchWeb3Network,
      web3AccountInitialized,
      moneypotsInitialized
    } = this.props;

    let web3 = window.web3;
    let ethereum = window.ethereum;

    if (typeof web3 !== 'undefined') {

      if (ethereum) {
        ethereum.enable().then(() => console.log("connect"));
        ethereum.on('accountsChanged', (accounts) => {
          const wallet = accounts[0];
          web3AccountInitialized(wallet);
          moneypotsInitialized(wallet);
        });
      }
      const provider = ethereum || web3.currentProvider;

      web3 = new Web3(provider);
      dispatchWeb3Instance(web3);

      const {
        net
      } = web3.eth;

      net.getNetworkType().then((network) => {
        dispatchWeb3Network(network);
      });

      web3AccountInitialized();
    }
  }

  componentWillMount() {
    this.initWeb3();
  }

  render() {

    const {web3, network, account, moneypots, createMoneypot} = this.props;
    const {wallet, balance} = account;

    return web3 ?
      <div>
        <p>
          Connected on {network} network
        </p>
        {wallet ?
          <div>
            {wallet} {web3Helper.toETH(balance)}
            <ul>
              {moneypots.map((moneypot) =>
                <li>
                  {moneypot.name} {moneypot.description}
                </li>) }
            </ul>
            <form>
              <ul>
                <li>
                  <input name="name" type="text" placeholder="name" required/>
                </li>
                <li>
                  <textarea name="description" placeholder="description" rows="2"/>
                </li>
                <li>
                  <input name="beneficary" type="text" placeholder="beneficary address" required/>
                </li>
                <li>
                  <input type="text" className="form-control form-input" placeholder="Donor address"/>
                  <button>add</button>
                  <ol>
                    <li>
                      <button>remove</button>
                    </li>
                  </ol>
                </li>
              </ul>
              <button type="submit" onClick={() => createMoneypot("name","desription", "0xF9c5C5D557C297a018407Ce68c8fC043Df186Ba8" , [])}>create</button>
            </form>
          </div>
          :
          <p>
          Account is locked
          </p>
        }
      </div>
      :
      <p>Install Metamask</p>;
  }
}

function mapStateToProps(state) {
  const {web3Instance, account, network} = state.web3;
  const {moneypots} = state.moneypot;
  return {
    web3: web3Instance,
    account: account,
    network: network,
    moneypots: moneypots
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchWeb3Instance: (web3) => dispatch(web3Actions.dispatchWeb3Instance(web3)),
    dispatchWeb3Network: (network) => dispatch(web3Actions.dispatchWeb3Network(network)),
    web3AccountInitialized: (wallet = null) => dispatch(web3Actions.web3AccountInitialized(wallet)),
    moneypotsInitialized: (wallet) => dispatch(moneypotActions.moneypotsInitialized(wallet)),
    createMoneypot: (name, description, beneficiary, donors) => dispatch(moneypotActions.createMoneypot(name, description, beneficiary, donors))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
