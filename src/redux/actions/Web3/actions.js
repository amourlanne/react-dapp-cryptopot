import { web3Constants } from "../../constants";

import { store } from "../../../index";

export const web3Actions = {
  dispatchWeb3Instance,
    dispatchWeb3Account,
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

function dispatchWeb3Account(wallet, balance) {
  return {
    type: web3Constants.WEB3_ACCOUNT_INITIALIZED,
    payload: {
          wallet,
          balance
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
        return async (dispatch) => {
            const {
                getCoinbase,
                getBalance,
            } = web3.eth;

            let getWallet = () => wallet ? new Promise(resolve => resolve(wallet)) : getCoinbase();

            const wallet = await getWallet();
            if(wallet) {
                const balance = await getBalance(wallet);
                dispatch(dispatchWeb3Account(wallet, balance));
            }
        };
    } else {
        console.error('Web3 is not initialized.');
    }
}