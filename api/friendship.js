/**
 * @file 接口mock数据文件，用于本地开发使用，不影响线上
 * @author zhi.zhong
 */

'use strict';

import {random} from 'lodash';

export default (req, res) => {
  let data = {
    userId: '10000',
    remarkName: '习大大',
    username: 'Abcd1000',
    avatar: 'http://xxx.jpg',
    level: 'V2',
    age: '323天',
    gender: random(1, 2),
    relation: random(0, 2)
  };

  res.end(JSON.stringify(data));
};
