/**
 * @file 浏览器js代码获取环境变量
 * @author zhi.zhong
 */

'use strict';

import assign from 'object-assign';

let env = 'development';

// for webpack
if (typeof NODE_ENV !== 'undefined') {
  env = NODE_ENV;
}

// Get profile configs
let profile = require('config/env/' + env);

// Set common configs
let common = {
};

export default assign({}, common, profile);
