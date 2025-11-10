# Worker - GraphQL API + AI Integration

Cloudflare Worker 实现的 GraphQL API，集成 DeepSeek 和 OpenAI。

## 技术栈

- **Cloudflare Workers** - 边缘计算平台
- **GraphQL Yoga** - GraphQL 服务器
- **TypeScript** - 类型安全
- **DeepSeek / OpenAI** - AI 能力

## 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**
   ```bash
   cp .dev.vars.example .dev.vars
   # 编辑 .dev.vars，添加你的 API Key
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

   Worker 运行在 http://localhost:8787

## GraphQL Schema

### Queries

#### hello

简单的问候查询，用于测试连接。

```graphql
query {
  hello(name: "World")
}
```

**响应:**
```
"你好, World! 欢迎使用 Cloudflare Workers + GraphQL 🚀"
```

#### chat

与 AI 对话。

```graphql
query {
  chat(message: "你好，AI!") {
    response
    model
    timestamp
  }
}
```

**响应:**
```json
{
  "data": {
    "chat": {
      "response": "你好！很高兴见到你。有什么我可以帮助你的吗？",
      "model": "deepseek-chat",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## 环境变量

### 必需

至少配置以下一个：

- `DEEPSEEK_API_KEY` - DeepSeek API Key
- `OPENAI_API_KEY` - OpenAI API Key

### 可选

- `AI_PROVIDER` - AI 提供商选择，可选值：
  - `deepseek` (默认)
  - `openai`

## 部署

### 使用 Wrangler CLI

```bash
# 登录 Cloudflare
npx wrangler login

# 部署
npm run deploy

# 配置 Secrets
npx wrangler secret put DEEPSEEK_API_KEY
```

### 查看日志

```bash
npm run tail
```

## 项目结构

```
src/
├── index.ts    # Worker 入口，创建 GraphQL 服务
├── schema.ts   # GraphQL Schema 和 Resolvers
├── ai.ts       # AI API 调用逻辑
└── types.ts    # TypeScript 类型定义
```

## API 调用示例

### 使用 curl

```bash
# Hello 查询
curl -X POST http://localhost:8787/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { hello(name: \"World\") }"
  }'

# Chat 查询
curl -X POST http://localhost:8787/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { chat(message: \"你好\") { response model timestamp } }"
  }'
```

### 使用 JavaScript

```javascript
const response = await fetch('https://your-worker.workers.dev/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      query Chat($message: String!) {
        chat(message: $message) {
          response
          model
          timestamp
        }
      }
    `,
    variables: {
      message: '你好，AI!'
    }
  })
});

const data = await response.json();
console.log(data);
```

## AI Providers

### DeepSeek

- **官网**: https://platform.deepseek.com/
- **模型**: deepseek-chat
- **特点**: 性价比高，中文友好
- **价格**: 约 ¥0.001 / 1K tokens

### OpenAI

- **官网**: https://platform.openai.com/
- **模型**: gpt-3.5-turbo (默认)
- **特点**: 性能优秀，生态成熟
- **价格**: 约 $0.002 / 1K tokens

## 性能优化

Worker 运行在 Cloudflare 的边缘网络上，具有以下优势：

- ⚡ 全球低延迟（< 50ms）
- 🚀 自动扩展
- 💰 按请求计费
- 🔒 内置 DDoS 防护

## 注意事项

1. **API Key 安全**:
   - 使用 Wrangler Secrets 存储敏感信息
   - 不要将 `.dev.vars` 提交到 Git

2. **费用控制**:
   - 设置 API 使用限制
   - 监控 Worker 调用次数
   - 考虑添加缓存层

3. **错误处理**:
   - 已实现基本的错误处理
   - 建议添加更详细的日志记录
   - 可以集成错误追踪服务（如 Sentry）
