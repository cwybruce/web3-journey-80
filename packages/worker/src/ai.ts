import type { DeepSeekRequest, DeepSeekResponse, OpenAIRequest, OpenAIResponse } from './types'

/**
 * 调用 DeepSeek API
 */
export async function callDeepSeek(
  message: string,
  apiKey: string
): Promise<{ response: string; model: string }> {
  const url = 'https://api.deepseek.com/v1/chat/completions'

  const requestBody: DeepSeekRequest = {
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: '你是一个友好、专业的 AI 助手。请用简洁、准确的方式回答用户的问题。',
      },
      {
        role: 'user',
        content: message,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`DeepSeek API 错误 (${response.status}): ${errorText}`)
    }

    const data: DeepSeekResponse = await response.json()

    if (!data.choices || data.choices.length === 0) {
      throw new Error('DeepSeek API 返回了空响应')
    }

    return {
      response: data.choices[0].message.content,
      model: data.model,
    }
  } catch (error) {
    console.error('DeepSeek API 调用失败:', error)
    throw error
  }
}

/**
 * 调用 OpenAI API
 */
export async function callOpenAI(
  message: string,
  apiKey: string
): Promise<{ response: string; model: string }> {
  const url = 'https://api.openai.com/v1/chat/completions'

  const requestBody: OpenAIRequest = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: '你是一个友好、专业的 AI 助手。请用简洁、准确的方式回答用户的问题。',
      },
      {
        role: 'user',
        content: message,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API 错误 (${response.status}): ${errorText}`)
    }

    const data: OpenAIResponse = await response.json()

    if (!data.choices || data.choices.length === 0) {
      throw new Error('OpenAI API 返回了空响应')
    }

    return {
      response: data.choices[0].message.content,
      model: data.model,
    }
  } catch (error) {
    console.error('OpenAI API 调用失败:', error)
    throw error
  }
}
