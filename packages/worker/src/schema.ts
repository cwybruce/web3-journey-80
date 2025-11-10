import { createSchema } from 'graphql-yoga'
import { callDeepSeek, callOpenAI } from './ai'
import type { GraphQLContext, ChatResponse } from './types'

export const schema = createSchema<GraphQLContext>({
  typeDefs: /* GraphQL */ `
    type Query {
      """
      简单的 Hello World 查询，用于测试连接
      """
      hello(name: String!): String!

      """
      与 AI 对话
      """
      chat(message: String!): ChatResponse!
    }

    type ChatResponse {
      """
      AI 的回复内容
      """
      response: String!

      """
      使用的模型名称
      """
      model: String!

      """
      响应时间戳
      """
      timestamp: String!
    }
  `,
  resolvers: {
    Query: {
      hello: (_, { name }) => {
        return `你好, ${name}! 欢迎使用 Cloudflare Workers + GraphQL 🚀`
      },

      chat: async (_, { message }, context: GraphQLContext): Promise<ChatResponse> => {
        const { env } = context
        const provider = env.AI_PROVIDER || 'deepseek'

        try {
          let response: string
          let model: string

          if (provider === 'openai' && env.OPENAI_API_KEY) {
            // 使用 OpenAI
            const result = await callOpenAI(message, env.OPENAI_API_KEY)
            response = result.response
            model = result.model
          } else if (env.DEEPSEEK_API_KEY) {
            // 使用 DeepSeek (默认)
            const result = await callDeepSeek(message, env.DEEPSEEK_API_KEY)
            response = result.response
            model = result.model
          } else {
            throw new Error('未配置 API Key。请在环境变量中设置 DEEPSEEK_API_KEY 或 OPENAI_API_KEY')
          }

          return {
            response,
            model,
            timestamp: new Date().toISOString(),
          }
        } catch (error) {
          console.error('AI 调用错误:', error)
          throw new Error(`AI 调用失败: ${error instanceof Error ? error.message : '未知错误'}`)
        }
      },
    },
  },
})
