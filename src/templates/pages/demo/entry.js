'use strict';

// This file bootstraps the entire application.

import React from 'react';
import ReactDOM from 'react-dom';
import DemoPage from '../../../components/pages/demo';

ReactDOM.render(
  <DemoPage />,
  document.getElementById('__react-content')
);
