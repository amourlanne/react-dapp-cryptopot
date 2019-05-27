import { web3Constants } from "../../constants";

import { store } from "../../../index";

export const web3Actions = {
  dispatchWeb3Instance,
  dispatchWeb3Wallet,
  dispatchWeb3Balance,
  dispatchWeb3Network,
  web3AccountInitialized,
};

function dispatchWeb3Instance(web3) {
  return {
    type: web3Constants.WEB3_INITIALIZED,
    payload: {
      web3Instance: web3,
    }
  };
}

function dispatchWeb3Wallet(wallet) {
  return {
    type: web3Constants.WEB3_WALLET_INITIALIZED,
    payload: {
      wallet: wallet,
    }
  };
}

function dispatchWeb3Balance(balance) {
  return {
    type: web3Constants.WEB3_BALANCE_INITIALIZED,
    payload: {
      balance: balance,
    }
  };
}

function dispatchWeb3Network(network) {
  return {
    type: web3Constants.WEB3_NETWORK_INITIALIZED,
    payload: {
      network: network,
    }
  };
}

function web3AccountInitialized(wallet = null) {
  const web3 = store.getState().web3.web3Instance;

  if(web3) {
    return dispatch => {
      const {
        getCoinbase,
        getBalance,
      } = web3.eth;

      let getWallet = () => wallet ? new Promise(resolve => resolve(wallet)) : getCoinbase();

      getWallet().then((wallet) => {
        if (wallet) {
          dispatch(dispatchWeb3Wallet(wallet));
          return getBalance(wallet);
        }
      }).then((balance) => {
        if (balance) {
          dispatch(dispatchWeb3Balance(balance));
        }
      });
    };
  } else {
    console.error('Web3 is not initialized.');
  }
}


