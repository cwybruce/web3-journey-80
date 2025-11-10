import { createYoga } from 'graphql-yoga'
import { schema } from './schema'
import type { Env } from './types'

// 创建 GraphQL Yoga 实例
const yoga = createYoga({
  schema,
  landingPage: false,
  // CORS 配置，允许前端访问
  cors: {
    origin: '*',
    credentials: true,
  },
  // 将 env 传递到 context
  context: ({ request, env }) => ({ request, env }),
})

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 处理 GraphQL 请求
    return yoga.fetch(request, { env, ctx })
  },
}
