'use strict';

// This file bootstraps the entire application.

import React from 'react';
import ReactDOM from 'react-dom';
// import { createStore } from 'redux';
// import { Provider } from 'react-redux';
// import todoApp from '../../../reducers/reducers';
import DemoPage from '.';

// let store = createStore(todoApp);

ReactDOM.render(
  // <Provider store={store}>
    <DemoPage />,
  // </Provider>,
  document.getElementById('root')
);
