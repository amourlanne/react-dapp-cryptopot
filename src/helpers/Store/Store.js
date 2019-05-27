import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {routerMiddleware} from 'react-router-redux';
import rootReducer from '../../redux/reducers';

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create the store with three middlewares
const loggerMiddleware = createLogger();

export const configureStore = (browserHistory) => createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      // 1. thunkMiddleware:
      thunkMiddleware,
      // 2. loggerMiddleware: Log all redux events
      loggerMiddleware,
      // 3. routerMiddleware: Syncs the location/URL path to the state
      routerMiddleware(browserHistory)
    )
  )
);
