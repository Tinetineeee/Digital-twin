'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader, Trash2 } from 'lucide-react'
import { queryDigitalTwin } from '@/app/actions/profile'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const SAMPLE_QUESTIONS = [
  "What's your name and title?",
  "How can I contact you?",
  "What are your main database skills?",
  "Tell me about your projects",
  "What are your career goals?",
  "What's your educational background?",
]

const STORAGE_KEY = 'christine-chat-history'

export default function ChatDialog({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi! I'm Christine's AI digital twin. Ask me anything about my database expertise, skills, experience, projects, or career goals!",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load conversation history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY)
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory)
        if (Array.isArray(history) && history.length > 0) {
          setMessages(history)
        }
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    }
  }, [])

  // Save conversation history whenever messages change
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

  const handleClearHistory = () => {
    setShowClearConfirm(true)
  }

  const confirmClearHistory = () => {
    const initialMessage: Message = {
      id: '0',
      role: 'assistant',
      content: "Hi! I'm Christine's AI digital twin. Ask me anything about my database expertise, skills, experience, projects, or career goals!",
    }
    setMessages([initialMessage])
    localStorage.removeItem(STORAGE_KEY)
    setShowClearConfirm(false)
  }

  const cancelClearHistory = () => {
    setShowClearConfirm(false)
  }

  const handleSampleQuestion = (question: string) => {
    setInput(question)
    setShowSuggestions(false)
  }

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
    setShowSuggestions(false)
    setLoading(true)

    try {
      const result = await queryDigitalTwin(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.answer,
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
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Chat Window */}
      <div className="relative w-full max-w-md h-96 md:h-[32rem] bg-white rounded-xl border border-gray-200 shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h3 className="font-semibold text-gray-900">Christine's AI Twin</h3>
            <p className="text-xs text-green-600 font-medium">● Online</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="text-gray-400 hover:text-red-600 transition p-1"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Sample Questions - Show only when there are no user messages yet */}
          {showSuggestions && messages.length === 1 && (
            <div className="space-y-2 mt-4">
              <p className="text-xs text-gray-500 font-medium px-4">Suggested questions:</p>
              {SAMPLE_QUESTIONS.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleQuestion(question)}
                  className="w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded-lg transition border border-blue-200"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 rounded-lg px-4 py-2 border border-gray-200">
                <Loader className="w-4 h-4 animate-spin text-gray-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-gray-200 flex gap-2 bg-white"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me something..."
            disabled={loading}
            className="flex-1 bg-gray-100 text-gray-900 rounded-lg px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg p-2 transition flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={cancelClearHistory} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-auto z-50" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Clear Chat History?</h3>
              <p className="text-sm text-gray-600">
                This will permanently delete all your previous conversations. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelClearHistory}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearHistory}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
