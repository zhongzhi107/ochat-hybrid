/**
 * @file webpack配置文件
 * @author zhi.zhong
 */

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
const AUTOPREFIXER_LOADER = '!autoprefixer?' + JSON.stringify({
  browsers: [
    'Android 2.3',
    'Android >= 4',
    'Chrome >= 20',
    'Firefox >= 24',
    'Explorer >= 8',
    'iOS >= 6',
    'Safari >= 6'
  ]
});

// CSS loader参数
const CSS_LOADER = `style!css${MINIMIZE}${AUTOPREFIXER_LOADER}`;

// 页面入口文件目录
const PAGE_DIRECTORY = `./${marine.path.app}/containers`;

// 入口文件约定的名称
const ENTRY_FILE_NAME = 'entry.js';

// webpack插件
let plugins = [];

if (!DEBUG) {
  // 添加uglify插件压缩代码
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      //for node_modules
      'warnings': false,
      // 删除debugger标示
      'drop_debugger': true,
      // 删除console代码
      'drop_console': true
    }
  }));
}

/**
 * 生成打包配置，包含2部分：
 * 1. 页面入口JS文件
 * 2. 需要独立打包的code splitting文件
 * @return {Object}
 * @see http://webpack.github.io/docs/code-splitting.html
 */
var getEntries = () => {
  let entries = {};
  grunt.file.recurse(PAGE_DIRECTORY, (abspath, rootdir, subdir, filename) => {
    if (filename === ENTRY_FILE_NAME) {
      entries[`${subdir}.js`] = './' + abspath;
    }
  });

  // 从配置文件中获取并生成webpack打包配置
  if (marine.chunks) {
    marine.chunks.forEach((item) => {
      entries[item.name] = item.modules;
    });

    // 扩展阅读 http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    plugins.push(new webpack.optimize.CommonsChunkPlugin({
      names: marine.chunks.map((item) => {
        console.log(item.name);
        return item.name
      })
    }));
  }

  grunt.log.writeflags(entries, 'Webpack chunks');
  return entries;
};

export default {
  options: {
    cache: false,
    entry: getEntries(),
    output: {
      // 输出文件名称，[name]是占位符，会用entry对象中的key替换
      filename: '[name]',
      // build过程产生的物理文件输出目录
      path: path.join(process.cwd(), '<%=ma.path.dist%>', 'js'),
      // 调试模式下文件流输出路径（无物理文件，仅浏览器可访问）
      publicPath: '/js',
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: CSS_LOADER },
        { test: /\.less$/, loader: CSS_LOADER + '!less' },
        // 详细参数写在/.babelrc中
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
      ]
    },
    resolve: {
      // 设置webpack体系下require默认目录
      modulesDirectories: [
        `${marine.path.app}`,
        'node_modules'
      ],
      // 设置webpack体系下require默认文件类型
      extensions: ['', '.json', '.js']
    },
    plugins: plugins
  },
  dist: {}
};
