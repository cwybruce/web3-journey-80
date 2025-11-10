# Frontend - React + Vite + Apollo Client

这是使用 React、Vite 和 Apollo Client 构建的前端应用，部署在 Cloudflare Pages 上。

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Apollo Client** - GraphQL 客户端
- **Cloudflare Pages** - 部署平台

## 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env，设置 VITE_WORKER_URL
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

   访问 http://localhost:5173

## 构建

```bash
npm run build
```

构建产物会输出到 `dist/` 目录。

## 部署

### 通过 Cloudflare Dashboard

1. 连接 GitHub 仓库
2. 设置构建配置：
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `packages/frontend`
3. 配置环境变量 `VITE_WORKER_URL`

### 通过 Wrangler CLI

```bash
npm run deploy
```

## GraphQL 查询示例

```typescript
import { gql, useQuery } from '@apollo/client';

// Hello 查询
const HELLO_QUERY = gql`
  query Hello($name: String!) {
    hello(name: $name)
  }
`;

// Chat 查询
const CHAT_QUERY = gql`
  query Chat($message: String!) {
    chat(message: $message) {
      response
      model
      timestamp
    }
  }
`;
```

## 项目结构

```
src/
├── main.tsx        # 入口文件，配置 Apollo Client
├── App.tsx         # 主应用组件
├── App.css         # 应用样式
├── index.css       # 全局样式
└── vite-env.d.ts   # TypeScript 类型定义
```

## 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_WORKER_URL` | Worker GraphQL API 地址 | `http://localhost:8787/graphql` |
