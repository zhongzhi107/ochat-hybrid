/**
 * @file grunt任务配置文件
 * @author zhi.zhong
 */

'use strict';

export default {
  dist: {
    expand: true,
    ext: '.html',
    cwd: '<%=ma.path.app%>/templates/pages',
    dest: '<%=ma.path.dist%>/pages',
    src: '**/*.jade'
  }
};
