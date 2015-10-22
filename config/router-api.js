/**
 * @file grunt urlrewrite路由规则配置文件
 * @author zhi.zhong
 */

'use strict';

export default {
	// 从上至下匹配，遇到第一个匹配的规则后就返回，通用配置写在最下面
	// 特殊配置


	// 通用配置
  '^/api/(.*)': 'require!/api/$1.js',
};
