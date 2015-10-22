/**
 * @file 网站综合配置文件
 * @author zhi.zhong
 */

'use strict';

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

  // 打包规则
  chunks: [
    {
      name: 'redux.js',
      modules: [
        'redux',
        'react-redux'
      ]
    },

    {
      name: 'remove.js',
      modules: [
        'classnames',
        'core-decorators'
      ]
    },

    // CommonsChunkPlugin会将最后一个当作Entry chunk
    // Todo: 通过参数控制Entry chunk
    {
      name: 'vendor.js',
      modules: [
        'react',
        'react-dom',
        // 'redux',
        // 'react-redux',
        'utils/http'
      ]
    },
  ],

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

export default Object.assign({}, common, profile);
