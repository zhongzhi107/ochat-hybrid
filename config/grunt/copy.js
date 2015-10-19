'use strict';

export default {
  all: {
    expand: true,
    cwd: '<%=ma.path.app%>/assets',
    dest: '<%=ma.path.dist%>',
    src: '**/*'
  }
};
