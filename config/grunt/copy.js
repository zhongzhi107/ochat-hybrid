'use strict';

export default {
  all: {
    expand: true,
    cwd: '<%=ma.path.app%>/public',
    dest: '<%=ma.path.dist%>',
    src: '**/*'
  }
};
