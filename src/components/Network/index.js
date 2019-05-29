import React, {Component} from 'react';
import "bootstrap";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";

class Network extends Component {

  componentDidMount() {
  }

  render() {
      const {network} = this.props;

      return network ?
          <div>
              <h6>Network</h6>
              <ul>
                  <li>{network}</li>
              </ul>
           </div>
        :
          <div>No network available</div>
  }
}

function mapStateToProps(state) {
  const {network} = state.web3;
  return {
      network: network,
  };
}

const actions = {
};

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Network);
