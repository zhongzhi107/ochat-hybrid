'use strict';

import assign from 'object-assign';

let env = process.env.NODE_ENV || 'development';

// Get profile configs
let profile = require('./env/' + env);

// Set common configs
let common = {
  port:  {
    www: 9002,
    liveReload: 35733
  },

  path: {
    // app src
    app: 'src',
    // dist
    dist: 'prd'
  },

  assetsType: [
    'js',
    'css',
    'png',
    'jpg',
    'jpeg',
    'gif',
    'ttf',
    'eot',
    'otf',
    'svg',
    'woff',
    'woff2',
    'mp3',
    'swf',
    'ico'
  ],

};

export default assign({}, common, profile);
