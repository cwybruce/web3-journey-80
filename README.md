# Web3 Journey - Cloudflare Pages + Workers + GraphQL

这个项目演示了如何使用 Cloudflare Pages、Workers 和 GraphQL 构建全栈应用。

## 项目结构

```
web3-journey-80/
├── packages/
│   ├── frontend/          # React 前端 (Cloudflare Pages)
│   └── worker/            # Cloudflare Worker + GraphQL API
├── package.json           # Monorepo 配置
└── README.md
```

## 功能特性

✅ **前端 (Cloudflare Pages)**
- React + TypeScript + Vite
- GraphQL Client (Apollo Client)
- AI Provider 选择器（可在 DeepSeek 和 OpenAI 之间切换）
- 实时显示 AI 模型信息
- 自动 CI/CD 部署

✅ **后端 (Cloudflare Workers)**
- GraphQL API (使用 graphql-yoga)
- DeepSeek / OpenAI API 集成
- 支持前端动态选择 AI Provider
- 边缘计算性能

## 开发指南

### 前置要求

1. Node.js 18+
2. npm 或 pnpm
3. Cloudflare 账号
4. DeepSeek 或 OpenAI API Key

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
# 同时启动前端和 Worker
npm run dev

# 单独启动前端
npm run dev:frontend

# 单独启动 Worker
npm run dev:worker
```

### 部署

#### 1. 购买域名并配置 Cloudflare

1. 在 Cloudflare 购买或转入域名
2. 配置 DNS 设置

#### 2. 部署 Worker

```bash
# 首先配置环境变量
cd packages/worker
cp .dev.vars.example .dev.vars
# 编辑 .dev.vars，添加你的 API keys

# 部署
npm run deploy
```

#### 3. 部署 Pages

```bash
cd packages/frontend

# 方式一：通过 Cloudflare Dashboard
# 1. 连接 GitHub 仓库
# 2. 配置构建设置：
#    - Build command: npm run build
#    - Build output directory: dist
#    - Root directory: packages/frontend

# 方式二：使用 Wrangler CLI
npm run deploy
```

#### 4. 配置环境变量

在 Cloudflare Dashboard 中配置：

**Worker 环境变量：**
- `DEEPSEEK_API_KEY` 或 `OPENAI_API_KEY`

**Pages 环境变量：**
- `VITE_WORKER_URL` - Worker 的 URL

## API 使用示例

### GraphQL Query 示例

```graphql
# Hello 查询
query {
  hello(name: "World")
}

# AI 聊天（使用默认 Provider）
query {
  chat(message: "Hello, AI!") {
    response
    model
    provider
    timestamp
  }
}

# AI 聊天（指定使用 DeepSeek）
query {
  chat(message: "你好", provider: DEEPSEEK) {
    response
    model
    provider
    timestamp
  }
}

# AI 聊天（指定使用 OpenAI）
query {
  chat(message: "Hello", provider: OPENAI) {
    response
    model
    provider
    timestamp
  }
}
```

### 在前端调用示例

```typescript
import { gql, useQuery } from '@apollo/client';

const CHAT_QUERY = gql`
  query Chat($message: String!, $provider: AIProvider) {
    chat(message: $message, provider: $provider) {
      response
      model
      provider
      timestamp
    }
  }
`;

function ChatComponent() {
  const [aiProvider, setAiProvider] = useState('DEEPSEEK');

  const { data, loading } = useQuery(CHAT_QUERY, {
    variables: {
      message: 'Hello!',
      provider: aiProvider  // 动态选择 AI Provider
    }
  });

  return (
    <div>
      <select onChange={(e) => setAiProvider(e.target.value)}>
        <option value="DEEPSEEK">DeepSeek</option>
        <option value="OPENAI">OpenAI</option>
      </select>
      {/* ... */}
    </div>
  );
}
```

## 技术栈

- **前端**: React, TypeScript, Vite, Apollo Client
- **后端**: Cloudflare Workers, GraphQL Yoga
- **AI**: DeepSeek / OpenAI API
- **部署**: Cloudflare Pages, Cloudflare Workers

## 项目链接

- **GitHub**: 当前仓库
- **前端 URL**: 部署后在 Cloudflare Pages 设置中查看
- **Worker URL**: 部署后在 Cloudflare Workers 设置中查看

## 参考资料

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [GraphQL 文档](https://graphql.org/)
- [DeepSeek API 文档](https://platform.deepseek.com/docs)
