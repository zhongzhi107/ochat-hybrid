/**
 * @file grunt任务配置文件
 * @author zhi.zhong
 */

'use strict';

const TMP = '.tmp';

export default {
  dist: {
    files: [{
      dot: true,
      src: [
        TMP,
        '<%=ma.path.dist%>/*',
      ]
    }]
  },
  dev: TMP
};
