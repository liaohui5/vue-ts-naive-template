# 项目概览

`vue-ts-naive-template` 是一个自用的 Vue 3 + TypeScript 中后台前端模板项目。封装了认证、CRUD、主题切换、Mock API、单元测试、Docker 部署等完整链路，用于快速搭建新项目。

**作者**: liaohui5 | **协议**: MIT | **包管理器**: pnpm | **模块**: ESM

---

# 技术栈

| 层面      | 技术                                       | 版本                  | 用途                  |
| --------- | ------------------------------------------ | --------------------- | --------------------- |
| 框架      | Vue 3 + Composition API + `<script setup>` | ^3.5.38               | 视图层                |
| 语言      | TypeScript ~6.0                            | ^6.0.3                | 类型安全              |
| 构建      | Vite 8                                     | ^8.0.16               | 开发/构建             |
| 状态管理  | Pinia                                      | ^2.3.1                | Store                 |
| 路由      | Vue Router 4 (Hash)                        | ^4.6.4                | 路由                  |
| UI 组件   | Naive UI                                   | ^2.44.1               | 组件库                |
| CSS       | Tailwind CSS 4                             | 4.0.14                | 原子样式              |
| 图标      | Iconify (`@iconify/vue`)                   | ^5.0.1                | 图标                  |
| HTTP 上层 | Alova + `@alova/adapter-axios`             | ^3.5.1                | 请求状态管理          |
| HTTP 底层 | Axios                                      | ^1.18.0               | 请求/拦截器           |
| 表单校验  | Zod 4 + VeeValidate (beta)                 | ^4.4.3 / 5.0.0-beta.1 | 运行时校验 + 类型推断 |
| 工具库    | VueUse (`@vueuse/core`)                    | ^12.8.2               | 组合式工具            |
| 工具库    | lodash-es                                  | ^4.18.1               | 通用                  |
| 加密      | crypto-js (md5)                            | ^4.2.0                | MD5                   |
| UUID      | uuid + Web Crypto API                      | ^11.1.1               | UUID 生成             |
| 单元测试  | Vitest + happy-dom + `@vue/test-utils`     | ^4.1.9                | 测试                  |
| Mock      | MSW v2 (浏览器 + Node) + zocker            | 2.7.3                 | API Mock + 假数据     |
| 代码规范  | Oxlint/Oxfmt (Rust lint) + EditorConfig    | —                     | Lint/Format           |

---

# 目录结构与文件职责

```
src/
├── api/                    # API 请求方法
│   ├── auth.ts             #   - login(), refreshAccessToken()
│   └── article.ts          #   - fetchArticles, createArticle, updateArticle, deleteArticle
├── components/
│   ├── curd-table/         #   - 通用 CRUD 表格: 搜索栏 + 操作按钮 + 分页 + 最大化/全屏
│   └── nav-bar/            #   - 导航栏 + 主题切换按钮
├── hooks/
│   ├── useGoto.ts          #   - 非组件环境路由导航 ($goto)
│   └── useMaxium.ts        #   - 元素最大化切换
├── plugins/
│   ├── msw.ts              #   - 条件性启动 MSW (仅开发且无 API_BASE_URL)
│   └── naive-ui.ts         #   - 安装 discrete API + 修复 Naive UI 样式冲突
├── router/
│   ├── index.ts            #   - createRouter, setupRouterGuards, set/getRouterInstance
│   ├── routes.ts           #   - 路由定义 (/) -> Home, (/login) -> Login + RouteNames
│   └── guards.ts           #   - setupProgressGuard + setupAuthGuard
├── store/
│   ├── auth.ts             #   - 登录/注销, 用户信息持久化
│   ├── theme.ts            #   - 亮/暗主题切换, 持久化
│   ├── curd.ts             #   - CurdStore<T> 类: 列表/搜索/分页/CRUD
│   └── article.ts          #   - 继承 CurdStore<IArticleItem>
├── tools/
│   ├── http/               #   - HTTP 层: Alova 实例 + Axios 实例 + 拦截器
│   │   ├── index.ts        #     - Alova 实例 (自动 token 刷新)
│   │   ├── axiosInst.ts    #     - Axios 实例工厂
│   │   └── interceptors/   #     - 请求/响应/错误拦截器
│   ├── token-manager.ts    #   - localStorage Token 管理
│   ├── env-vars.ts         #   - Zod 校验环境变量
│   ├── password.ts         #   - MD5 加密密码
│   ├── notify.ts           #   - 消息提示 (window.$message)
│   ├── progress.ts         #   - LoadingBar 进度条
│   ├── color.ts            #   - lighten()
│   ├── md5.ts / uuid.ts    #   - MD5 / UUID
│   └── index.ts            #   - 工具重新导出 + log/isURL/setHtmlTheme/isUseMSW
├── types/
│   ├── auth.ts             #   - ILoginForm, ILoginResponse, IRefreshTokenResponse
│   ├── article.ts          #   - IArticleItem, ICreateArticleForm, IUpdateArticleForm
│   └── api.ts              #   - PaginationData, IPagination, ISearchParams
├── views/
│   ├── login/              #   - 登录页 (VeeValidate + Zod)
│   └── home/               #   - 文章管理页 (CRUD 表格 + 创建/更新对话框)
├── __mocks__/              #   - MSW handlers (auth + articles)
│   ├── handlers/           #     - import.meta.glob 自动收集
│   ├── shared.ts           #     - success(), failed(), successWithId()
│   ├── browser.ts / node.ts#     - Worker / Server 实例
├── __tests__/              #   - 测试基础设施
│   ├── setupMSW.ts         #     - 全局 MSW setup (beforeAll/afterAll)
│   └── helpers.ts          #     - RouterMock, axios-mock-adapter 辅助
├── main.ts                 #   - bootstrap(): MSW -> Vue -> Pinia -> NaiveUI -> Router -> mount
├── App.vue                 #   - n-config-provider + 布局分发
├── Layout.vue              #   - 标准布局 (NavBar + Content)
└── style.css               #   - Tailwind + @theme 令牌
```

---

# 核心业务流程

## 认证流程

1. 路由守卫检查 `tokenManager.hasAccessToken()`, 未登录 → 重定向 `/login`
2. 用户提交表单 → VeeValidate + Zod 校验 → MD5 加密密码 → POST `/api/login`
3. 成功: 保存 token + 用户信息到 localStorage → 跳转首页
4. 后续请求: 拦截器自动注入 `Bearer <accessToken>` 到 header
5. 401 响应: Alova 自动调用 `refreshAccessToken()` → 更新 accessToken → 重试
6. refreshToken 也过期: `logout()` 清除 token → 跳转登录页

## CRUD 流程 (文章)

1. onMounted → `store.list()` → 列表请求 → 分页表格展示
2. 搜索 → `store.search()` → 重新请求列表
3. 添加 → 对话框 → 表单校验 → `store.sendCreateRequest()` → 刷新列表
4. 编辑 → 对话框预填 → `store.sendUpdateRequest()` → 刷新列表
5. 删除 → PopConfirm → `store.sendDeleteRequest()` → 刷新列表

## 主题切换

1. 点击按钮 → `themeStore.switchAppTheme()`
2. `watchEffect` → 更新 `document.documentElement` 的 `data-theme` 属性
3. Naive UI `n-config-provider` 自动响应主题变化

---

# HTTP 层架构 (两层)

```
请求方 (api/*.ts)
    ↓ Alova (useRequest / usePagination)
src/tools/http/index.ts      ← 自动 token 刷新 (createServerTokenAuthentication)
    ↓ @alova/adapter-axios
src/tools/http/axiosInst.ts  ← 工厂函数, 配置拦截器
    ↓
请求拦截器: genRequestId + withBearerToken
响应拦截器: unwrapData
错误拦截器: validationErrorHandler + internalErrorHandler
```

- **Alova 实例**: `statesHook: alova/vue`, `cacheFor: null(dev) / 5000ms(prod)`
- **Axios 实例**: `timeout: 30s`, `Content-Type: application/json`
- **响应类型增强**: `axios.d.ts` 重写类型, 使 `get<T>()` 直接返回 `Promise<T>`

---

# 状态管理

| Store     | 类型                      | 持久化               | 关键状态                           |
| --------- | ------------------------- | -------------------- | ---------------------------------- |
| `auth`    | `defineStore`             | user → localStorage  | loginForm, authUser, isLogin       |
| `theme`   | `defineStore`             | theme → localStorage | appTheme, configProviderProps      |
| `article` | `CurdStore<IArticleItem>` | 否                   | items, page, pageSize, searchQuery |

- **CurdStore**: 类 + `defineStore` 组合, 通过传入 `ICurdService` 实现复用
- **Alova 状态管理**: 使用 `useRequest`/`usePagination` 管理 loading/error

---

# 路由

| Path     | Component | isPublic | Layout   |
| -------- | --------- | -------- | -------- |
| `/`      | Home      | false    | 标准布局 |
| `/login` | Login     | true     | 无布局   |

- **模式**: Hash (`createWebHashHistory`)
- **守卫**: 认证守卫 (token 检查) + 进度守卫 (LoadingBar)
- **实例管理**: `setRouterInstance` / `getRouterInstance` 用于非组件环境

---

# Mock 策略

- **工具**: MSW v2 (Service Worker / Node Server)
- **启动条件**: `isUseMSW()` → 仅开发模式 + `VITE_APP_API_BASE_URL` 为空
- **Handler 收集**: `import.meta.glob('./handlers/**.ts')` 自动发现
- **数据生成**: `zocker` 基于 Zod schema 生成随机数据
- **共享辅助**: `success()`, `failed()`, `successWithId()`

---

# 测试策略

- **运行器**: Vitest (全局模式 + happy-dom)
- **Setup**: `setupMSW.ts` 自动启停 MSW server
- **辅助**: `helpers.ts` → `setupRouterMock`, `initMockHttp`, `mountSetupComponentWithRouterMock`
- **覆盖**: 认证流程, HTTP 拦截器, 路由守卫, 工具函数, 导航 hooks

---

# 代码规范

- **格式化**: Oxfmt (无 tab, 分号, 双引号, 尾逗号)
- **缩进**: 2 空格, EditorConfig 统一
- **类型检查**: `vue-tsc -b` (构建时)
- **Pre-commit**: Husky → `pnpm test:unit`
- **自动导入**: `unplugin-auto-import` (Vue API + Naive UI API) + `unplugin-vue-components`

---

# 构建与部署

```sh
# 构建 + 打包
./rebuild.sh    # 产出 build/build.zip

# 部署
unzip build.zip && cd build && docker-compose up -d --build
```

- **Docker**: `nginx:stable`, 端口 8080:80, restart=always
- **构建分包**: naive-ui, lodash-es, vue-router, iconify, vueuse, vue, pinia 独立 chunk

---

# 关键约定与设计模式

1. **启动引导**: `bootstrap()` 异步串联 MSW → Vue → Pinia → NaiveUI → Router → Mount
2. **Mock 条件**: `env.DEV && !VITE_APP_API_BASE_URL` 启用, 生产零开销
3. **Zod 单一事实源**: `rules.ts` 定义 schema → `z.infer` 自动推导类型 → 跨层共享
4. **密码 MD5**: `encodePassword()` 在发送前自动加密 password 字段
5. **CurdStore 复用**: 类定义 + `defineStore` 包装, 传入 `ICurdService` 实现不同实体的 CRUD
6. **Naive UI 离散 API**: `createDiscreteApi` 挂载到 `window`, 供非组件环境使用
7. **类型安全 env**: Zod 校验 `import.meta.env`, 冻结导出
8. **路由守卫解耦**: 认证 + 进度条作为独立函数, 可单独测试
9. **相对路径 handler**: `import.meta.glob` 自动收集, 无手动注册
10. **操作列渲染函数**: 使用 `h()` 创建编辑/删除按钮, 保持类型安全
