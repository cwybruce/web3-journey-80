# 部署指南

本文档详细说明如何将项目部署到 Cloudflare Pages 和 Workers。

## 📋 前置准备

### 1. 购买/配置域名

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择以下方式之一：
   - **购买域名**: 在 Cloudflare 直接购买新域名
   - **转入域名**: 将现有域名转入 Cloudflare
   - **使用 Nameserver**: 保留域名在原注册商，只使用 Cloudflare 的 DNS

### 2. 准备 API Keys

#### DeepSeek (推荐，更便宜)
1. 访问 [DeepSeek 平台](https://platform.deepseek.com/)
2. 注册并登录
3. 创建 API Key
4. 记录下 API Key

#### OpenAI (可选)
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册并登录
3. 创建 API Key
4. 记录下 API Key

## 🚀 部署步骤

### 第一步：部署 Worker

#### 方法一：使用 Wrangler CLI (推荐)

1. **安装依赖**
   ```bash
   # 在项目根目录
   npm install
   ```

2. **配置 Wrangler**
   ```bash
   # 登录 Cloudflare
   cd packages/worker
   npx wrangler login
   ```

3. **配置环境变量**
   ```bash
   # 复制示例文件
   cp .dev.vars.example .dev.vars

   # 编辑 .dev.vars，添加你的 API Key
   # DEEPSEEK_API_KEY=your_actual_api_key_here
   ```

4. **部署**
   ```bash
   npm run deploy
   ```

5. **配置生产环境 Secrets**
   ```bash
   # 设置 DeepSeek API Key
   npx wrangler secret put DEEPSEEK_API_KEY
   # 粘贴你的 API Key，然后按回车

   # 或设置 OpenAI API Key
   npx wrangler secret put OPENAI_API_KEY
   ```

6. **记录 Worker URL**

   部署成功后，你会看到类似这样的输出：
   ```
   Published web3-journey-worker (0.01 sec)
     https://web3-journey-worker.your-subdomain.workers.dev
   ```

   记录这个 URL，后面配置前端时需要用到。

#### 方法二：通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择 "Workers & Pages" > "Create Application" > "Create Worker"
3. 上传 `packages/worker/src/index.ts` 的构建产物
4. 在 Worker 设置中添加环境变量：
   - `DEEPSEEK_API_KEY` 或 `OPENAI_API_KEY`
   - `AI_PROVIDER` (可选，默认为 "deepseek")

### 第二步：部署 Pages (前端)

#### 方法一：通过 Cloudflare Dashboard (推荐，支持 CI/CD)

1. **连接 GitHub 仓库**

   a. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)

   b. 选择 "Workers & Pages" > "Create Application" > "Pages"

   c. 选择 "Connect to Git"

   d. 连接 GitHub 并选择此仓库 (`cwybruce/web3-journey-80`)

2. **配置构建设置**

   设置以下参数：

   | 配置项 | 值 |
   |--------|-----|
   | Production branch | `main` 或你的主分支 |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `packages/frontend` |

3. **配置环境变量**

   在 "Environment variables" 部分添加：

   | 变量名 | 值 | 说明 |
   |--------|-----|------|
   | `VITE_WORKER_URL` | `https://your-worker.workers.dev/graphql` | 替换为第一步部署的 Worker URL，记得加上 `/graphql` |
   | `NODE_VERSION` | `18` | 指定 Node.js 版本 |

4. **开始部署**

   点击 "Save and Deploy"，Cloudflare 会自动开始构建和部署。

5. **配置自定义域名（可选）**

   部署成功后：
   - 进入 Pages 项目设置
   - 选择 "Custom domains"
   - 添加你的自定义域名（如 `app.yourdomain.com`）
   - Cloudflare 会自动配置 DNS 和 SSL

#### 方法二：使用 Wrangler CLI

1. **配置环境变量**
   ```bash
   cd packages/frontend

   # 创建 .env 文件
   echo "VITE_WORKER_URL=https://your-worker.workers.dev/graphql" > .env
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **部署到 Pages**
   ```bash
   npm run deploy
   # 或者
   npx wrangler pages deploy dist --project-name=web3-journey-frontend
   ```

### 第三步：配置自定义域名（可选）

#### 为 Worker 添加自定义域名

1. 进入 Worker 设置
2. 选择 "Triggers" > "Custom Domains"
3. 添加域名（如 `api.yourdomain.com`）
4. Cloudflare 会自动配置 DNS 和 SSL

#### 为 Pages 添加自定义域名

1. 进入 Pages 项目设置
2. 选择 "Custom domains"
3. 添加域名（如 `app.yourdomain.com` 或直接使用 `yourdomain.com`）
4. Cloudflare 会自动配置 DNS 和 SSL

> **提示**: 如果使用自定义域名，记得更新 Pages 的环境变量 `VITE_WORKER_URL`

## 🔧 本地开发

### 启动开发环境

```bash
# 在项目根目录

# 同时启动前端和 Worker
npm run dev

# 或分别启动
npm run dev:frontend  # 前端运行在 http://localhost:5173
npm run dev:worker    # Worker 运行在 http://localhost:8787
```

### 测试 GraphQL API

访问 Worker 的 GraphQL 端点测试：

```bash
# 测试 hello 查询
curl -X POST http://localhost:8787/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { hello(name: \"World\") }"}'

# 测试 chat 查询（需要配置 API Key）
curl -X POST http://localhost:8787/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { chat(message: \"你好\") { response model timestamp } }"}'
```

## 📦 项目结构

部署后的架构：

```
┌─────────────────┐
│   用户浏览器     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Cloudflare Pages (前端)        │
│  - React + Vite                 │
│  - Apollo Client (GraphQL)      │
│  URL: app.yourdomain.com        │
└────────┬────────────────────────┘
         │ GraphQL Query
         ▼
┌─────────────────────────────────┐
│  Cloudflare Workers (后端)      │
│  - GraphQL API (graphql-yoga)   │
│  - AI Integration               │
│  URL: api.yourdomain.com/graphql│
└────────┬────────────────────────┘
         │ API Call
         ▼
┌─────────────────────────────────┐
│  DeepSeek / OpenAI API          │
└─────────────────────────────────┘
```

## 🎯 部署验证

### 检查清单

- [ ] Worker 已成功部署
- [ ] Worker Secrets (API Keys) 已配置
- [ ] Worker GraphQL 端点可访问
- [ ] Pages 已成功部署
- [ ] Pages 环境变量已配置
- [ ] 前端可以连接到 Worker
- [ ] AI 聊天功能正常工作
- [ ] 自定义域名已配置（如果需要）
- [ ] SSL 证书已生效

### 测试步骤

1. **访问前端 URL**
   - 测试 Hello 功能是否正常
   - 测试 AI 聊天是否能收到响应

2. **检查浏览器控制台**
   - 确认没有 CORS 错误
   - 确认 GraphQL 请求成功

3. **查看 Worker 日志**
   ```bash
   cd packages/worker
   npx wrangler tail
   ```

## 🔄 CI/CD 自动部署

如果使用 Cloudflare Pages 的 GitHub 集成，每次推送到主分支时会自动：

1. 触发构建
2. 运行测试（如果配置）
3. 构建前端
4. 部署到 Cloudflare Pages

对于 Worker，可以设置 GitHub Actions：

```yaml
# .github/workflows/deploy-worker.yml
name: Deploy Worker

on:
  push:
    branches: [ main ]
    paths:
      - 'packages/worker/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run deploy --workspace=worker
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

## ❓ 常见问题

### Q: 如何切换 AI 提供商？

A: 修改 Worker 的环境变量 `AI_PROVIDER`：
- 设置为 `deepseek` 使用 DeepSeek
- 设置为 `openai` 使用 OpenAI

### Q: Worker 部署失败怎么办？

A: 检查以下几点：
1. 确认 wrangler.toml 配置正确
2. 确认 Cloudflare 账户权限
3. 查看错误日志：`npx wrangler tail`

### Q: Pages 构建失败怎么办？

A: 常见原因：
1. Node.js 版本不匹配 - 在环境变量中设置 `NODE_VERSION=18`
2. 构建命令或输出目录配置错误
3. 环境变量未设置

### Q: CORS 错误怎么解决？

A: 确保 Worker 的 CORS 配置正确（已在代码中配置），如果仍有问题：
1. 检查 Worker URL 是否正确
2. 确认 Worker 已部署成功
3. 查看浏览器控制台的详细错误信息

## 📚 相关文档

- [Cloudflare Pages 官方文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 官方文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [GraphQL Yoga 文档](https://the-guild.dev/graphql/yoga-server)

## 🎉 完成

恭喜！你的全栈应用已成功部署到 Cloudflare！

**记录你的部署链接：**

- 前端 URL: ___________________________
- Worker URL: ___________________________
- GitHub 仓库: https://github.com/cwybruce/web3-journey-80
