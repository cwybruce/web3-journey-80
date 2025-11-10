// Cloudflare Workers 环境类型定义
export interface Env {
  // AI Provider 选择
  AI_PROVIDER?: string

  // DeepSeek API Key
  DEEPSEEK_API_KEY?: string

  // OpenAI API Key
  OPENAI_API_KEY?: string
}

// GraphQL Context 类型
export interface GraphQLContext {
  request: Request
  env: Env
}

// AI 聊天响应类型
export interface ChatResponse {
  response: string
  model: string
  timestamp: string
}

// DeepSeek API 请求/响应类型
export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface DeepSeekRequest {
  model: string
  messages: DeepSeekMessage[]
  temperature?: number
  max_tokens?: number
}

export interface DeepSeekResponse {
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// OpenAI API 类型 (与 DeepSeek 类似)
export type OpenAIMessage = DeepSeekMessage
export type OpenAIRequest = DeepSeekRequest
export type OpenAIResponse = DeepSeekResponse
