import { store } from "../../index";
import Web3 from "web3";
import {web3Actions} from '../../redux/actions/Web3'
import {moneypotActions} from "../../redux/actions/Moneypot";

export const web3Helper = {
  toETH, initWeb3, getWeb3Instance
};

function toETH(value) {
  if(value) {
    const web3 = getWeb3Instance();
    if(web3) {
      const { fromWei } = web3.utils;
      return Number(fromWei(value, "ether"));
    }
  }
};

function getWeb3Instance() {
    return store.getState().web3.web3Instance;
};

async function initWeb3() {

    const {dispatch} = store;

    // Modern dapp browsers...
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        dispatch(web3Actions.dispatchWeb3Instance(web3));

        const network = await web3.eth.net.getNetworkType();
        dispatch(web3Actions.dispatchWeb3Network(network));

        window.ethereum.on('accountsChanged', async (wallets) => {

            const wallet = wallets[0];
            const balance = await web3.eth.getBalance(wallet);
            // dispatch new account
            dispatch(web3Actions.dispatchWeb3Account(wallet, balance));
            dispatch(moneypotActions.moneypotsInitialized())
        });

        const wallets = await window.ethereum.enable();
        if (wallets) {

            const wallet = wallets[0];
            const balance = await web3.eth.getBalance(wallet);
            // dispatch account
            dispatch(web3Actions.dispatchWeb3Account(wallet, balance));
        } else {
            console.log("connection reject");
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {

        const web3 = new Web3(window.web3.currentProvider);
        dispatch(web3Actions.dispatchWeb3Instance(web3));

        const network = await web3.eth.net.getNetworkType();
        dispatch(web3Actions.dispatchWeb3Network(network));

        const wallet = await web3.eth.getCoinbase();
        const balance = await web3.eth.getBalance(wallet);

        dispatch(web3Actions.dispatchWeb3Account(wallet, balance));
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
};
