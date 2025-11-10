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
      chat(message: String!, provider: AIProvider): ChatResponse!
    }

    """
    AI 提供商选择
    """
    enum AIProvider {
      """
      DeepSeek AI（性价比高，中文友好）
      """
      DEEPSEEK

      """
      OpenAI GPT（性能优秀，生态成熟）
      """
      OPENAI
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
      实际使用的 AI 提供商
      """
      provider: String!

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

      chat: async (_, { message, provider }, context: GraphQLContext): Promise<ChatResponse> => {
        const { env } = context

        // 如果用户指定了 provider，使用指定的；否则使用环境变量配置的，默认为 deepseek
        const selectedProvider = provider?.toLowerCase() || env.AI_PROVIDER || 'deepseek'

        try {
          let response: string
          let model: string
          let actualProvider: string

          if (selectedProvider === 'openai') {
            // 使用 OpenAI
            if (!env.OPENAI_API_KEY) {
              throw new Error('未配置 OPENAI_API_KEY。请在环境变量中设置 OpenAI API Key')
            }
            const result = await callOpenAI(message, env.OPENAI_API_KEY)
            response = result.response
            model = result.model
            actualProvider = 'OpenAI'
          } else if (selectedProvider === 'deepseek') {
            // 使用 DeepSeek
            if (!env.DEEPSEEK_API_KEY) {
              throw new Error('未配置 DEEPSEEK_API_KEY。请在环境变量中设置 DeepSeek API Key')
            }
            const result = await callDeepSeek(message, env.DEEPSEEK_API_KEY)
            response = result.response
            model = result.model
            actualProvider = 'DeepSeek'
          } else {
            throw new Error(`不支持的 AI 提供商: ${selectedProvider}。请选择 deepseek 或 openai`)
          }

          return {
            response,
            model,
            provider: actualProvider,
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
