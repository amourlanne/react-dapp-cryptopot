import React, {Component} from 'react';
import logo from './assets/logo.png';
import "bootstrap";
import './App.scss';

import Web3 from "web3";

import TruffleContract from "truffle-contract";
import MoneyPotSystem from "./build/contracts/MoneyPotSystem.json";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            web3: null,
            wallet: null,
            balance: null,
            network: null,
            moneyPotContract: null
        }
    }

    componentWillMount() {

        if (typeof window.web3 !== 'undefined') {

            const web3 = new Web3(window.web3.currentProvider);

            window.web3.currentProvider.publicConfigStore.on('update', (result) => {
                console.log(window.web3.eth.defaultAccount);
            });

            const {
                getCoinbase,
                getBalance,
                net
            } = web3.eth;

            const {
                fromWei
            } = web3.utils;

            net.getNetworkType().then((type) => {
                this.setState({
                    network: type,
                });
            });

            getCoinbase().then((account) => {
                if (account) {

                    let moneyPotContract = TruffleContract(MoneyPotSystem);
                    moneyPotContract.setProvider(window.web3.currentProvider);

                    this.setState({
                        wallet: account,
                        moneyPotContract
                    });

                    return getBalance(account);
                } else {
                    console.log('MetaMask is locked');
                }
            }).then((balance) => {
                if (balance) {
                    const balanceEur = Number(fromWei(balance, "ether"));
                    this.setState({
                        balance: balanceEur
                    });
                }
            });

            this.setState({
                web3: web3
            });

        } else {
            console.log('MetaMask is not installed');
        }
    }

    render() {

        const {
            wallet,
            balance,
            network,
            web3
        } = this.state;

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    {web3 ?
                        <div>{network &&
                        <p>
                            Connected on {network} network
                        </p>}
                            {wallet ?
                                <p>
                                    {wallet} {balance}
                                </p>
                                :
                                <p>
                                    Account is locked
                                </p>
                            }</div>
                        :
                        <p>
                            MetaMask is not installed
                        </p>
                    }
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
