'use server'

import { searchProfile } from '@/lib/rag-service'

export async function queryDigitalTwin(question: string) {
  try {
    if (!question || !question.trim()) {
      return {
        answer: 'Please ask me a question!',
        sources: [],
      }
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY environment variable is not set')
      return {
        answer: 'The chat service is not configured. Please check that the GROQ_API_KEY environment variable is set.',
        sources: [],
      }
    }

    const result = await searchProfile(question)
    return result
  } catch (error) {
    console.error('Error in queryDigitalTwin:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      answer: `Error: ${errorMessage}. Please try again.`,
      sources: [],
    }
  }
}
