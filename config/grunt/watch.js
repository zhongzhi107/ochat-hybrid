'use strict';

import marine from '../marine';

export default {
  options: {
    livereload: marine.port.liveReload
  },
  dev: {
    options: {
      //TODO: 暂时整页刷新
      reload: true,
      debounceDelay: 1000,
    },
    files: [
      '<%=ma.path.app%>/templates/**/*.jade',
      '<%=ma.path.app%>/**/*.{js,css,less}'
    ]
  }
};
