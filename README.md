# 使用说明

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## 前提

需要nodejs，版本 >0.10

如无nodejs环境，请到官方网站（[http://nodejs.org](http://nodejs.org)）下载、安装

## 步骤

```sh
# 更新为淘宝镜像
npm config set registry https://registry.npm.taobao.org

# 安装grunt-cli和PageSpeed Insights
npm install -g grunt-cli psi

# 安装项目依赖包
npm install
# 生产环境运行以下命令
# npm install -production

# 运行grunt本地服务器
npm start

# 成功启动话，访问 http://localhost:9002/demo 可以浏览网页

#### 其他命令 ####
# 编译全站
grunt build

# 预览编译后的文件
grunt server:dist
```

## 特点
* [babel]支持ES6、ES7
* [模板]支持jade
* [less]支持less
* [webpack]支持模块化、JSX
* [autoprefixer]自动补全浏览器厂商前缀
* [esint]esint语法检查
* [router-api]开发环境支持同步／异步接口假数据
* [liveReload]文件修改后自动刷新浏览器

## 约定
* 用entry.js作为页面的入口文件
* 文件名称统一使用小写和中划线

## 目录说明

```
.
├── /api/                       # Mock数据文件
├── /config/                    # 项目配置文件目录
│   ├── /env/                   # 环境差异配置文件
│   │   ├── /beta.js            # Beta环境配置文件
│   │   ├── /development.js     # DEV环境配置文件
│   │   └── /production.js      # 生产环境配置文件
│   ├── /grunt/                 # Grunt任务配置文件
│   ├── /marine.js              # 项目综合配置文件
│   └── /router-api.js          # APIs接口mock路由配置文件
├── /docs/                      # 文档
├── /node_modules/              # 依赖包
├── /prd/                       # 项目编译输出目录
├── /src/                       # 项目源码目录
│   ├── /asset/                 # 静态资源，包含图片、字体等
│   ├── /components/            # React components
│   │   ├── /pages/             # 页面组件
│   │   │   └── /demo/          # demo页面
│   │   │       ├── /xxx/       # 页面包含的非公用其他组件
│   │   │       ├── demo.less   # 页面css文件
│   │   │       └── index.js    # 页面组件定义文件
│   │   ├── /dialog/            # 公用dialog组件
│   │   └── /tips/              # 公用tips组件
│   ├── /templates/             # Jade templates
│   │   ├── /layout/            # 布局模版
│   │   └── /pages/             # 页面目录
│   │       └── /demo/          # demo页面
│   │           ├── entry.js    # 约定的js入口文件
│   │           └── index.jade  # 模版文件
│   └── /utils/                 # Utility classes and functions
│── .editorconfig               # 代码编辑器配置
│── .eslintrc                   # eslint配置
│── Gruntfile.es6               # 用ES6编写的Grunt主配置
│── Gruntfile.js                # Grunt入口
│── package.json
└── README.md                   
```
