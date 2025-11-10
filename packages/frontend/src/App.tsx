import { useState } from 'react'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
import './App.css'

// GraphQL 查询定义
const HELLO_QUERY = gql`
  query Hello($name: String!) {
    hello(name: $name)
  }
`

const CHAT_QUERY = gql`
  query Chat($message: String!, $provider: AIProvider) {
    chat(message: $message, provider: $provider) {
      response
      model
      provider
      timestamp
    }
  }
`

type AIProvider = 'DEEPSEEK' | 'OPENAI'

function App() {
  const [name, setName] = useState('World')
  const [message, setMessage] = useState('')
  const [aiProvider, setAiProvider] = useState<AIProvider>('DEEPSEEK')
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string; provider?: string; model?: string }>>([])

  // Hello 查询
  const { data: helloData, loading: helloLoading } = useQuery(HELLO_QUERY, {
    variables: { name },
  })

  // Chat 查询（懒加载）
  const [executeChat, { loading: chatLoading }] = useLazyQuery(CHAT_QUERY, {
    onCompleted: (data) => {
      if (data?.chat) {
        setChatHistory(prev => [
          ...prev,
          { role: 'user', content: message },
          { role: 'assistant', content: data.chat.response, provider: data.chat.provider, model: data.chat.model }
        ])
        setMessage('')
      }
    },
  })

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      executeChat({ variables: { message, provider: aiProvider } })
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Web3 Journey</h1>
        <p>Cloudflare Pages + Workers + GraphQL Demo</p>
      </header>

      <main>
        {/* Hello 测试区域 */}
        <section className="section">
          <h2>📡 GraphQL 连接测试</h2>
          <div className="input-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入你的名字"
              className="input"
            />
          </div>
          <div className="result">
            {helloLoading ? (
              <p>加载中...</p>
            ) : (
              <p className="greeting">{helloData?.hello || '等待响应...'}</p>
            )}
          </div>
        </section>

        {/* AI 聊天区域 */}
        <section className="section">
          <div className="section-header">
            <h2>🤖 AI 聊天</h2>
            <div className="ai-selector">
              <label htmlFor="ai-provider">选择 AI:</label>
              <select
                id="ai-provider"
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value as AIProvider)}
                className="select"
              >
                <option value="DEEPSEEK">🚀 DeepSeek（性价比高，中文友好）</option>
                <option value="OPENAI">🤖 OpenAI GPT（性能优秀，生态成熟）</option>
              </select>
            </div>
          </div>

          <div className="chat-container">
            <div className="chat-messages">
              {chatHistory.length === 0 ? (
                <p className="empty-state">开始和 AI 对话吧！</p>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}`}>
                    <div className="message-header">
                      <strong>{msg.role === 'user' ? '你' : 'AI'}</strong>
                      {msg.provider && (
                        <span className="provider-badge" title={msg.model}>
                          {msg.provider}
                        </span>
                      )}
                    </div>
                    <p>{msg.content}</p>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="message assistant">
                  <div className="message-header">
                    <strong>AI</strong>
                  </div>
                  <p className="loading">思考中...</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="输入消息..."
                className="input chat-input"
                disabled={chatLoading}
              />
              <button
                type="submit"
                className="button"
                disabled={chatLoading || !message.trim()}
              >
                发送
              </button>
            </form>
          </div>
        </section>

        {/* 技术栈说明 */}
        <section className="section tech-stack">
          <h2>🛠️ 技术栈</h2>
          <ul>
            <li><strong>前端:</strong> React + TypeScript + Vite</li>
            <li><strong>API:</strong> GraphQL (Apollo Client)</li>
            <li><strong>后端:</strong> Cloudflare Workers</li>
            <li><strong>AI:</strong> DeepSeek / OpenAI（可切换）</li>
            <li><strong>部署:</strong> Cloudflare Pages + Workers</li>
          </ul>
        </section>
      </main>

      <footer>
        <p>Powered by Cloudflare ⚡</p>
      </footer>
    </div>
  )
}

export default App
