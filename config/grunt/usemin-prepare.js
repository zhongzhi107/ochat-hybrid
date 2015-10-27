'use strict';

export default {
  options: {
    root: '<%=ma.path.dist%>',
    dest: '<%=ma.path.dist%>'
  },
  // Entrance files to find usemin block
  html: '<%=ma.path.dist%>/**/*.html'
};
