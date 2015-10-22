'use strict';

// This file bootstraps the page.

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import DemoPage from '.';
import demo from './reducers';

let store = createStore(demo);
let root = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <DemoPage />
  </Provider>,
  root
);
