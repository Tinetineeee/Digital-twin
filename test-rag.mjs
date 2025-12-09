import { searchProfile } from './lib/rag-service.ts'

async function testRAG() {
  console.log('Testing improved RAG search...\n')

  const testQueries = [
    'name?',
    'What is your name?',
    'Tell me about yourself',
    'What skills do you have?',
    'What are your design specialties?',
    'Tell me about your projects',
    'What are your career goals?',
    'Where did you study?',
  ]

  for (const query of testQueries) {
    console.log(`\n📝 Query: "${query}"`)
    try {
      const result = await searchProfile(query)
      console.log(`✓ Response: ${result.answer.substring(0, 150)}...`)
      if (result.sources.length > 0) {
        console.log(`📌 Sources: ${result.sources.map((s) => s.title).join(', ')}`)
      }
    } catch (error) {
      console.error(`✗ Error: ${error}`)
    }
  }
}

testRAG()
