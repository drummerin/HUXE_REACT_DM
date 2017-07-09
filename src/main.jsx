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
import projects from './projects';

injectTapEventPlugin();
const root = document.querySelector('#root');
const middleware = applyMiddleware(promiseMiddleware(), loggerMiddleware);
const store = createStore(reducers, middleware);

// Check for browser support of service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
        .then((registration) => {
          // Successful registration
          console.log('Registration of Service Worker was successful:', registration.scope);
        }).catch((error) => {
        // Failed registration, service worker wasn't installed
          console.log('Service worker registration failed, error:', error);
        });
}

const config = {
  apiKey: 'AIzaSyC1lpMBv_ko79Ei-XdqkdAtqr4STPnTrRY',
  authDomain: 'planit-e2048.firebaseapp.com',
  databaseURL: 'https://planit-e2048.firebaseio.com',
  projectId: 'planit-e2048',
  storageBucket: 'planit-e2048.appspot.com',
  messagingSenderId: '747737733905',
};
const fb = firebase.initializeApp(config);

const fbDb = fb.database().ref('projects');

const fbAuth = fb.auth();
let curUser = null;

const connectedRef = firebase.database().ref('.info/connected');
connectedRef.on('value', (snap) => {
  if (snap.val() === true) {
    console.log('connected');
  } else {
    console.log('not connected');
    firebase.database().goOffline();
  }
});


function Create(callback) {
  let online2 = false;
  return {
    getIsOnline() { return online2; },
    setIsOnline(p) { online2 = p; callback(online2); },
  };
}

const status = Create((online2) => {
  // console.log(`online?: ${online2}`);
  if (online2) {
    firebase.database().goOnline();
  } else {
    firebase.database().goOffline();
  }
});

const myInit = { mode: 'no-cors' };

function check() {
  fetch('https://www.google.de/', myInit)
        .then(() => {
          status.setIsOnline(true);
        }).catch(() => {
          // console.log('error');
          status.setIsOnline(false);
        });
}
setInterval(check, 3000);


fbDb.on('value', (snapshot) => {
  let array = [];
  if (projects.length > 0) {
    projects.splice(0, projects.length);
  }
  snapshot.forEach((childSnapshot) => {
    const childData = childSnapshot.val();
    if (childData.components != null) {
      array = Object.keys(childData.components).map(key => childData.components[key]);
      childData.components = array;
    }
    if (projects.indexOf(childData) === -1) {
      projects.push(childData);
    }
  });
  ReactDOM.render(
        <Provider store={store}>
            <App user={curUser} />
        </Provider>,
        root,
    );
}, (error) => {
    // The callback failed.
  console.error(error);
});

fbAuth.onAuthStateChanged((user) => {
  if (user) {
    curUser = user.displayName;
    fb.database().ref(`/users/${user.displayName}`).set({
      name: user.displayName,
    });
  } else {
    fb.database().ref(`/users/${curUser}`).set({
      name: null,
    });
    curUser = null;
  }

  ReactDOM.render(
        <Provider store={store}>
          <App user={curUser}/>
        </Provider>,
        root,
    );
});

