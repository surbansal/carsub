import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import 'babel-polyfill';
import registerServiceWorker from './registerServiceWorker';
import registerEvents from './installEvents';
import Root from './config/Root';
import {isProgressiveWebappEnabled} from './config/ApplicationContext';
import '../html/favicon.ico';
import './assets/mobile/manifest.json';
import './assets/images/icons-180.png';
import './assets/images/icons-192.png';
import './assets/images/icons-512.png';
import './assets/mobile/backend-cache-worker';

window.regeneratorRuntime = require('babel-runtime/regenerator');


const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  );
};

render(Root);
if (isProgressiveWebappEnabled) {
  registerServiceWorker();
  registerEvents();
}

if (module.hot) {
  module.hot.accept('./config/Root', () => {
    const newApp = require('./config/Root').default;
    render(newApp);
  });
}
