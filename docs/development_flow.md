# 文档：开发 - 测试 - 正式包构建 - 发布

## 开发

### 目录说明

```bash
build:         # 开发、构建任务
docs:          # 项目、开发文档指南
samples:       # 样本目录（开发/测试）
src:           # 开发源代码
test:          # 自动化测试
```

### 分支说明

```bash
master:      # 主干分支（发布）
dev:         # 开发分支，从这里拉取新分支开发
test:        # 集成测试分支
```

### 流程说明

运行命令： `yarn dev`

- 命令使用 Webpack 生成实时预览的浏览器环境，自动打开包含所有示例样本的集合页面，对应 `samples` 目录下的所有 HTML 页面。

- 命令监听 `src` 与 `samples` 目录文件变化，重新编译并热重载刷新页面。


## 测试

> 测试包含单元测试、E2E测试

运行命令：`yarn test`

1. 运行单元测试
1. 运行 E2E 测试


## 正式包构建

> 正式包：发布到 npm 平台的包文件

修改 `package.json` 版本号，运行命令：`yarn build`

1. 运行自动化测试
1. 生成以下包文件目录

```bash
.
├── browser                            # IIFE, AMD
│   ├── jparticles.all.js
│   ├── jparticles.base.js
│   ├── particle.js
│   ├── snow.js
│   └── ...
├── lib                                # CMD, ES, TS
│   ├── types
│   │   ├── particle.d.ts
│   │   ├── snow.d.ts
│   │   └── ...
│   ├── common
│   │   ├── base.js
│   │   └── ...
│   ├── utils
│   │   ├── index.js
│   │   └── ...
│   ├── index.js
│   ├── particle.js
│   ├── snow.js
│   └── ...
├── README.md
├── package.json
```


## 发布

运行命令：`yarn release`


