import 'intl';
import 'core-js/features/map';
import 'core-js/features/set';
import 'raf/polyfill';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { compose, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';
import reduxLogger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './rootReducer';
import { unregister } from './registerServiceWorker';
import './containers/shared/css/global.css';
import App from './containers/App';
import i18n from './i18n';

require('typeface-roboto');

let enhancers;
let store;

// Check if polyfill required for Promise
if (!Promise) {
  require('es6-promise/auto'); // eslint-disable-line global-require
}

const renderApp = () => {
  ReactDOM.render(
    <Suspense fallback="Loading">
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Router>
            <App />
          </Router>
        </Provider>
      </I18nextProvider>
    </Suspense>,
    document.getElementById('xrpl-explorer')
  );
};

const isDevelopment = process.env.NODE_ENV === 'development';

const middlewarePackages = [thunk];
let middleware = applyMiddleware(...middlewarePackages);
if (isDevelopment) {
  localStorage.setItem('debug', 'xrpl-debug:*');
  middlewarePackages.push(reduxLogger);
  middleware = applyMiddleware(...middlewarePackages);
  enhancers = composeWithDevTools(middleware);
  store = createStore(rootReducer, enhancers);
  renderApp();
} else {
  localStorage.removeItem('debug');
  enhancers = compose(middleware);
  store = createStore(rootReducer, enhancers);
  renderApp();
}

unregister();
