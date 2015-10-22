'use strict';

import _ from 'lodash';

export default (grunt) => {

  // 定义编译类型，并将其存入运行环境变量中
  switch (grunt.option('deploy-type')) {
    case 'beta':
      process.env.NODE_ENV = 'beta';
      break;
    case 'prod':
      process.env.NODE_ENV = 'production';
      break;
    default:
      process.env.NODE_ENV = 'development';
  }

  var ma = require('./config/marine');

  // node-modules是提供给QDR编译环境使用的参数
  // 本机开发可以忽略
  let nodeModulesDir = grunt.option('node-modules') || '.';

  require('matchdep').filterAll('grunt-*').forEach((nodeModule) => {
    if (nodeModulesDir) {
      let cwd = process.cwd();
      process.chdir(nodeModulesDir);
      grunt.loadNpmTasks(nodeModule);
      process.chdir(cwd);
    } else {
      grunt.loadNpmTasks(nodeModule);
    }
  });

  // 各模块运行所消耗的时间，可以用来指导优化编译过程
  require(nodeModulesDir + '/node_modules/time-grunt')(grunt);

  grunt.initConfig({
    // 项目配置
    ma: ma,

    // 清除文件/目录
    clean: require('./config/grunt/clean'),

    // 本地web服务器
    connect: require('./config/grunt/connect'),

    // 复制文件/目录
    copy: require('./config/grunt/copy'),

    // eslint
    eslint: require('./config/grunt/eslint'),

    // 编译jade成html
    jade: require('./config/grunt/jade'),

    // 监听文件变化
    watch: require('./config/grunt/watch'),

    // webpack
    webpack: require('./config/grunt/webpack'),

  });

  // 注册默认任务
  grunt.registerTask('default', ['build']);

  // 注册本地开发环境任务
  grunt.registerTask('serve', (target = 'dev') => {

    let taskList = [
      `clean:${target}`,
      'eslint',
      'build',
      'configureRewriteRules',
      `connect:${target}`,
      'watch'
    ];

    if (target === 'dist') {
      _.remove(taskList, (item) => {
        return item === 'watch';
      });
    } else {
      _.remove(taskList, (item) => {
        return item === 'build';
      });
    }

    // 禁用eslint
    if (grunt.option('no-eslint')) {
      _.remove(taskList, (item) => {
        return item === 'eslint';
      });
    }

    taskList = _.uniq(taskList);

    grunt.task.run(taskList);
  });

  // 注册编译任务
  grunt.registerTask('build', [
    'clean:dist',
    'eslint',
    'copy',
    'webpack',
    'jade'
  ]);
};
