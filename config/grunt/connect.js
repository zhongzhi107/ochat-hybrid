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

export default {
  rules: routerApi,
  dev: {
    options: {
      port: grunt.option('port') || ma.port.www,
      hostname: '0.0.0.0',
      localhost: grunt.option('host') || 'localhost',
      livereload: ma.port.liveReload,
      middleware: (connect) => {
        return [
          mountFolder(connect, ma.path.app + '/public'),
          function(req, res, next) {
            let pathname = url.parse(req.url).pathname;
            let jadePath = path.join(ma.path.app, 'templates/pages', pathname, 'index.jade');
            if (fs.existsSync(jadePath)) {
              res.setHeader('Content-Type', 'text/html;charset=UTF-8');
              res.end(jade.renderFile(jadePath));
            } else {
              next();
            }
          },
          rewriteRequest,
          webpackDevMiddleware(webpack(webpackConfig.options), {
            publicPath: '/js',
            //watchDelay: 5000,
            //contentBase: '.tmp',
            //inline: true,
            // hot: true,
            stats: {colors: true}
          })
        ];
      }
    }
  },
  dist: {
    options: {
      port: grunt.option('port') || ma.port.www || 9000,
      hostname: '0.0.0.0',
      localhost: grunt.option('host') || 'localhost',
      keepalive: true,
      middleware: (connect) => {
        return [
          mountFolder(connect, ma.path.dist),
          mountFolder(connect, ma.path.dist + '/views'),
          rewriteRequest
        ];
      }
    }
  }
};
