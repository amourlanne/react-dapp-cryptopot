import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import {configureStore, browserHistory, web3Helper as web3} from "./helpers";
import {Router} from "react-router-dom";

export const store = configureStore(browserHistory);

web3.initWeb3();

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <App/>
    </Router>
  </Provider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
