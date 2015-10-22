/**
 * @file grunt入口文件，该文件不支持ES6语法
 * @author zhi.zhong
 */

'use strict';

require('babel/register');
module.exports = require('./Gruntfile.es6');
