import React, {Component} from 'react';
import "bootstrap";
import './App.scss';

import {connect} from "react-redux";

import {moneypotActions} from "./redux/actions";

import MoneyPots from "./components/MoneyPots/index";
import Account from "./components/Account/index";
import Network from "./components/Network/index";
import {bindActionCreators} from "redux";

class App extends Component {

  render() {

    const {web3, createMoneypot, wallet} = this.props;

    return web3 ?
      <div>
          <Network/>
          <Account/>
          {wallet && <MoneyPots/>}
          <div>
              <h6>Create</h6>
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
      </div>
      :
      <p>Install Metamask</p>;
  }
}

function mapStateToProps(state) {
  const {web3Instance, account} = state.web3;
  const {wallet} = account;

  return {
    web3: web3Instance,
    wallet: wallet,
  };
}

const actions = {
    createMoneypot: moneypotActions.createMoneypot
};

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
