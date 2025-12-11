'use client'

import { useState, useRef, useEffect } from 'react'
import { queryDigitalTwin } from '@/app/actions/profile'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{ title: string; type: string; score: number }>
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const result = await queryDigitalTwin(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.answer,
        sources: result.sources,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 px-6 py-4 backdrop-blur">
        <h1 className="text-2xl font-bold text-white">
          🤖 Tine's BOT
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Ask me about my skills, experience, projects, and career goals
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-semibold text-white mb-4">
                Welcome! I'm your AI digital twin.
              </p>
              <p className="text-slate-400 mb-6 max-w-md">
                Try asking me questions like:
              </p>
              <div className="space-y-2 text-left max-w-md">
                <button
                  onClick={() => setInput("What are your design specialties?")}
                  className="w-full px-4 py-2 text-left text-slate-300 bg-slate-800/50 hover:bg-slate-700 rounded border border-slate-700 transition"
                >
                  "What are your design specialties?"
                </button>
                <button
                  onClick={() => setInput("Tell me about your education")}
                  className="w-full px-4 py-2 text-left text-slate-300 bg-slate-800/50 hover:bg-slate-700 rounded border border-slate-700 transition"
                >
                  "Tell me about your education"
                </button>
                <button
                  onClick={() => setInput("What are your career goals?")}
                  className="w-full px-4 py-2 text-left text-slate-300 bg-slate-800/50 hover:bg-slate-700 rounded border border-slate-700 transition"
                >
                  "What are your career goals?"
                </button>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-md rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-100'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-600">
                  <p className="text-xs font-semibold text-slate-400 mb-1">
                    Sources:
                  </p>
                  <div className="space-y-1">
                    {message.sources.map((source, idx) => (
                      <div key={idx} className="text-xs text-slate-400">
                        • {source.title} ({source.type}) - {(source.score * 100).toFixed(0)}%
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-700 bg-slate-900/50 backdrop-blur px-6 py-4"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={loading}
            className="flex-1 rounded-lg bg-slate-800 px-4 py-2 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}
