## Ochat Hybrid

### Directory Layout

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
│   ├── /actions/               # Action creators that allow to trigger a dispatch to stores
│   ├── /components/            # React components
│   ├── /constants/             # Constants (action types etc.)
│   ├── /core/                  # Dispatcher
│   ├── /public/                # Static files which are copied into the /build/public folder
│   ├── /stores/                # Stores contain the application state and logic
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

### Getting Started

```shell
$ npm install                   # Install Node.js components listed in ./package.json
$ npm start                     # Compile and launch

#visit http://localhost:9002/demo
```
