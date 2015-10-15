'use strict';

export default {
  dist: {
    options: {
      collapseWhitespace: true,
      removeComments: true,
    },
    files: [{
      expand: true,
      cwd: '<%=ma.path.dist%>',
      src: '**/*.html',
      dest: '<%=ma.path.dist%>'
    }]
  }
};
