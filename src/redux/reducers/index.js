import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import { web3Reducer } from "./Web3/reducer";
import { moneypotReducer } from "./Moneypot/reducer";

const rootReducer = combineReducers({
  router: routerReducer,
  web3: web3Reducer,
  moneypot: moneypotReducer
});

export default rootReducer;
