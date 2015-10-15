'use strict';

import marine from '../marine';

export default {
  options: {
    livereload: marine.port.liveReload
  },
  html: {
    files: [
      '<%=ma.path.app%>/public/index.html'
    ]
  },
  js: {
    files: [
      '<%=ma.path.app%>/**/*.{js,css}'
    ],
    options: {
      //TODO: 暂时整页刷新
      reload: true
    }
  }
};
