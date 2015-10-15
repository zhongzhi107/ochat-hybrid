'use strict';

export default {
  dist: {
    files: [{
      dot: true,
      src: [
        '.tmp',
        '<%=ma.path.dist%>/*',
      ]
    }]
  },
  dev: '.tmp'
};
