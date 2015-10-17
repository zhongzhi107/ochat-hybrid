'use strict';

import assign from 'object-assign';

let env = process.env.NODE_ENV || 'development';

// Get profile configs
let profile = require('./env/' + env);

// Set common configs
let common = {

  // 端口信息
  port:  {
    www: 9002,
    liveReload: 35733
  },

  // 路径信息
  path: {
    // app src
    app: 'src',
    // dist
    dist: 'prd'
  },

  vendorJs: {
    chunkName: 'vendor.js',
    files: [
      'react',
      'react-dom',
      'classnames',
      'ajax',
      'core-decorators'
    ]
  },

  // 静态文件类型
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
