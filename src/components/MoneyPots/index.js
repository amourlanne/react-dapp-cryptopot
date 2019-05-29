import React, {Component} from 'react';
import "bootstrap";

import {connect} from "react-redux";

import {moneypotActions} from "../../redux/actions";
import {bindActionCreators} from "redux";

class MoneyPots extends Component {

  componentDidMount() {
    const {moneypotsInitialized} = this.props;
    moneypotsInitialized();
  };

  render() {
      const {moneypots} = this.props;

      return (
          <div>
              <h6>Moneypots ({moneypots.length})</h6>
              <ul>
                  {moneypots.map((moneypot) =>
                      <li key={moneypot.id}>
                        <ul>
                            <li><b>name:</b> {moneypot.name}</li>
                            <li><b>author:</b> {moneypot.author}</li>
                            <li><b>description:</b> {moneypot.description}</li>
                            <li><b>beneficiary:</b> {moneypot.beneficiary}</li>
                            <li><b>donations:</b> {moneypot.donations.length}</li>
                            <li><b>donors:</b> {moneypot.donors.length}
                            <ul>
                                {moneypot.donors.map((donor) => <li key={donor} >{donor}</li>)}
                            </ul>
                            </li>
                        </ul>
                      </li>)}
              </ul>
          </div>
          )
  }
}

function mapStateToProps(state) {
  const {moneypots} = state.moneypot;

  return {
      moneypots: moneypots,
  };
}

const actions = {
    moneypotsInitialized: moneypotActions.moneypotsInitialized,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MoneyPots);
