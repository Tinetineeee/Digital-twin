'use server'

import { searchProfile } from '@/lib/rag-service'

export async function queryDigitalTwin(question: string) {
  if (!question.trim()) {
    throw new Error('Question cannot be empty')
  }

  return await searchProfile(question)
}
