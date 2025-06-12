# 基础后台相关组件

- [@zfegg/admin-layout](packages/layout) : 基础后台布局及应用程序
- [@zfegg/admin-admin](packages/admin) : 管理员组件
- [@zfegg/admin-data-source-components](packages/data-source-components) :
- [@zfegg/admin-base-project](packages/base-project) : 多项目基础组件
- [`@moln/data-source`](https://github.com/Moln/data-source) + `antd` 结合
  的数据操作组件

开发
---

安装

```shell
npm i --workspaces=false
```

TODO
----

- CI/CD 自动构建发布
- @zfegg/admin-admin
  - 前后端单元测试
- @zfegg/admin-application
  - 前端单元测试
- @zfegg/admin-authorization
  - 前端单元测试
  - 完善角色管理
  - 完善权限配置
- @zfegg/admin-data-source-components 
  - 前端单元测试
- @zfegg/admin-base-project 多项目管理后台组件
  - 前后端单元测试
  - 用户角色管理
  - 后台组件
    - 权限验证: 验证用户是否在该项目有权限

| 组件 | 单元测试 |
|-----|--------|
| [@zfegg/admin-admin](packages/admin) | TODO |
| [@zfegg/admin-application](packages/layout) | TODO |
| [@zfegg/admin-data-source-components](packages/data-source-components) | TODO |
| [@zfegg/admin-base-project](packages/base-project) | TODO |

