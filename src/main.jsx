import React from 'react'; // imports first modules
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import loggerMiddleware from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import App from './App.jsx';
import reducers from './reducers';
import './styles.css'; // imports last locale stuff

injectTapEventPlugin();
const root = document.querySelector('#root');
const middleware = applyMiddleware(promiseMiddleware(), loggerMiddleware);
const store = createStore(reducers, middleware);

const config = {
  apiKey: 'AIzaSyC1lpMBv_ko79Ei-XdqkdAtqr4STPnTrRY',
  authDomain: 'planit-e2048.firebaseapp.com',
  databaseURL: 'https://planit-e2048.firebaseio.com',
  projectId: 'planit-e2048',
  storageBucket: 'planit-e2048.appspot.com',
  messagingSenderId: '747737733905',
};
firebase.initializeApp(config);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    root,
);

