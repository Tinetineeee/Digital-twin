'use server'

import { searchProfile } from '@/lib/rag-service'

export async function queryDigitalTwin(question: string) {
  try {
    if (!question.trim()) {
      throw new Error('Question cannot be empty')
    }

    const result = await searchProfile(question)
    return result
  } catch (error) {
    console.error('Error in queryDigitalTwin:', error)
    // Return a helpful error response instead of throwing
    return {
      answer: 'I encountered an error processing your question. Please ensure the digital twin data is properly configured and try again.',
      sources: [],
    }
  }
}
