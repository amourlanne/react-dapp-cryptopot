import {web3Constants} from "../../constants/Web3";

const initialState = {
  web3Instance: null,
  network: null,
  account: {
    wallet: null,
    balance: null
  }
};

export function web3Reducer(state = initialState, action) {

  const {
    type,
    payload
  } = action;

  switch (type) {
  case web3Constants.WEB3_INITIALIZED:
    return {
      ...state,
      web3Instance: payload.web3Instance,
    };
  case web3Constants.WEB3_WALLET_INITIALIZED:
    return {
      ...state,
      account: {
        wallet: payload.wallet,
        balance: state.account.balance
      }
    };
  case web3Constants.WEB3_BALANCE_INITIALIZED:
    return {
      ...state,
      account: {
        wallet: state.account.wallet,
        balance: payload.balance
      }
    };
  case web3Constants.WEB3_NETWORK_INITIALIZED:
    return {
      ...state,
      network: payload.network,
    };
  default:
    return state;
  }
}
