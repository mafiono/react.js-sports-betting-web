import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import App from './containers/app';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import {combineReducers, createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {appStateReducer,sportsBookReducer,profileReducer,modalReducer,homeDataReducer,casinoReducer} from './actionReducers'
 const reducers = combineReducers({
     appState:appStateReducer,
     sportsbook:sportsBookReducer,
     profile:profileReducer,
     sb_modal:modalReducer,
     homeData:homeDataReducer,
     casinoMode:casinoReducer
 }),store = createStore(reducers,applyMiddleware(thunk))

 const AppView = ()=>{
     return(
         <Provider store={store}>
             <App/>
         </Provider>
     )
 }
if (document.getElementById('root')) {
    ReactDOM.render(<AppView />, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
