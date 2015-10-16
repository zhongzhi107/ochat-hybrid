'use strict';
/**
 * @fileOverview Grunt URL rewrite rule config file
 * @author <a href="mailto:zhi.zhong@qunar.com">Zhongzhi</a>
 * @version	1.0.1
 */

export default {
	// 从上至下匹配，遇到第一个匹配的规则后就返回，通用配置写在最下面
	// 特殊配置


	// 通用配置
  '^/api/(.*)': 'require!/api/$1.js',
};
