'use strict';

export default {
  options: {
    configFile: '.eslintrc',
    // rulePaths: ['conf/rules']
  },
  target: [
    'Gruntfile.es6',
    'config/**/*.js',
    '<%=ma.path.app%>/**/*.js'
  ],
};
