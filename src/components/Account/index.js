import React, {Component} from 'react';
import "bootstrap";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {web3Helper} from "../../helpers/Web3";

class Account extends Component {

  componentDidMount() {
  }

  render() {
      const {wallet, balance } = this.props;

      return wallet ?
          <div>
              <h6>Account</h6>
              <ul>
                  <li>{wallet}</li>
                  <li>{web3Helper.toETH(balance)}</li>
              </ul>
           </div>
        :
          <div>No account available</div>
  }
}

function mapStateToProps(state) {
  const {account} = state.web3;
  const {wallet, balance} = account;
  return {
      wallet: wallet,
      balance: balance,
  };
}

const actions = {
};

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Account);
