import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import 'babel-polyfill';
import AdminRoot from './config/AdminRoot';
import '../html/favicon.ico';

window.regeneratorRuntime = require('babel-runtime/regenerator');


const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  );
};

render(AdminRoot);

if (module.hot) {
  module.hot.accept('./config/AdminRoot', () => {
    const newApp = require('./config/AdminRoot').default;
    render(newApp);
  });
}
