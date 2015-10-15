'use strict';

import path from 'path';
import webpack from 'webpack';
import marine from '../marine';
import grunt from 'grunt';

// 是否为debug模式
const DEBUG = process.env.NODE_ENV === 'development';

// css是否需要代码压缩
const MINIMIZE = DEBUG ? '' : '?minimize';

// autoprefixer兼容的浏览器列表
const AUTOPREFIXER_LOADER = '!autoprefixer?{browsers:[' +
'"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
'"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';

const STYLE_LOADER = 'style!css' + MINIMIZE + AUTOPREFIXER_LOADER;

const PAGE_DIRECTORY = `./${marine.path.app}/templates/pages`;

const ENTRY_FILE_NAME = 'entry.js';

// webpack插件
let plugins = [];
if (!DEBUG) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      //for node_modules
      'warnings': false,
      'drop_debugger': true,
      'drop_console': true
    }
  }));
}

var getEntries = () => {
  let entries = {};
  grunt.file.recurse(PAGE_DIRECTORY, (abspath, rootdir, subdir, filename) => {
    if (filename === ENTRY_FILE_NAME) {
      entries[subdir] = './' + abspath;
    }
    // console.log('abspath:%s\n rootdir:%s\n subdir:%s\n filename:%s', abspath, rootdir, subdir, filename);
  });
  return entries;
};

export default {
  options: {
    cache: false,
    entry: getEntries(),//{
    //   demo: `./${marine.path.app}/templates/pages/demo/entry.js`
    // },
    output: {
      filename: '[name].js',
      path: path.join(process.cwd(), '<%=ma.path.dist%>', 'js'),
      publicPath: '/js',
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: STYLE_LOADER },
        { test: /\.less$/, loader: STYLE_LOADER + '!less' },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
      ]
    },
    plugins: plugins
  },
  dist: {}
};
