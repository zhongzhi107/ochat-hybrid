/**
 * @file grunt任务配置文件
 * @author zhi.zhong
 */

'use strict';

import fs from 'fs';
import url from 'url';
import path from 'path';
import jade from 'jade';
import grunt from 'grunt';
import webpack from 'webpack';
import webpackConfig from './webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import ma from '../marine';
import routerApi from '../router-api';
import {rewriteRequest} from 'grunt-connect-route/lib/utils';

let mountFolder = (connect, dir) => {
  return connect.static(require('path').resolve(dir));
};

let parseJade = (req, res, next) => {
  let pathname = url.parse(req.url).pathname;
  let jadePath = path.join(ma.path.app, 'templates/pages', `${pathname}.jade`);
  if (fs.existsSync(jadePath)) {
    res.setHeader('Content-Type', 'text/html;charset=UTF-8');
    res.end(jade.renderFile(jadePath));
  } else {
    next();
  }
}

export default {
  rules: routerApi,
  options: {
    port: grunt.option('port') || ma.port.www,
    hostname: '0.0.0.0',
    localhost: grunt.option('host') || 'localhost'
  },
  dev: {
    options: {
      livereload: ma.port.liveReload,
      middleware: (connect) => {
        return [
          mountFolder(connect, ma.path.app + '/assets'),
          parseJade,
          rewriteRequest,
          webpackDevMiddleware(webpack(webpackConfig.options), {
            publicPath: '/js',
            stats: {
              colors: true
            }
          })
        ];
      }
    }
  },
  dist: {
    options: {
      keepalive: true,
      middleware: (connect) => {
        return [
          mountFolder(connect, ma.path.dist),
          mountFolder(connect, ma.path.dist + '/pages'),
          rewriteRequest
        ];
      }
    }
  }
};
