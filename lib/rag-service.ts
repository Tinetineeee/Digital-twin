import { Groq } from 'groq-sdk'
import fs from 'fs'
import path from 'path'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

interface StoredChunk {
  id: string
  title: string
  content: string
  type: string
}

let vectorDatabase: StoredChunk[] = []

// Simple text processing for similarity
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2)
}

// Calculate TF-IDF inspired similarity
function calculateSimilarity(questionTokens: string[], chunkTokens: string[]): number {
  if (questionTokens.length === 0 || chunkTokens.length === 0) return 0

  let matches = 0
  for (const qToken of questionTokens) {
    if (chunkTokens.some((cToken) => cToken === qToken || cToken.includes(qToken) || qToken.includes(cToken))) {
      matches++
    }
  }

  // Use Dice coefficient for better scoring
  return (2 * matches) / (questionTokens.length + chunkTokens.length)
}

// Expand synonyms for better matching
function expandQuery(query: string): string {
  const synonymMap: Record<string, string[]> = {
    design: ['ui', 'ux', 'visual', 'interface', 'layout', 'creative'],
    skill: ['ability', 'expertise', 'proficiency', 'experience'],
    project: ['work', 'portfolio', 'experience', 'achievement'],
    education: ['degree', 'university', 'school', 'learning'],
    goal: ['aspiration', 'objective', 'target', 'career'],
    language: ['programming', 'code', 'technical'],
    tool: ['software', 'platform', 'application'],
  }

  let expandedQuery = query

  for (const [key, synonyms] of Object.entries(synonymMap)) {
    if (query.includes(key)) {
      expandedQuery += ' ' + synonyms.join(' ')
    }
  }

  return expandedQuery
}

export async function initializeVectorDatabase() {
  try {
    console.log('Initializing local vector database...')
    
    let profileData
    
    // Try multiple paths for compatibility
    const possiblePaths = [
      path.join(process.cwd(), 'digitaltwin.json'),
      path.join(process.cwd(), 'public', 'digitaltwin.json'),
    ]
    
    for (const profilePath of possiblePaths) {
      try {
        if (fs.existsSync(profilePath)) {
          console.log(`Loading profile from: ${profilePath}`)
          profileData = JSON.parse(fs.readFileSync(profilePath, 'utf-8'))
          break
        }
      } catch (err) {
        console.log(`Could not load from ${profilePath}`)
      }
    }
    
    if (!profileData) {
      throw new Error('digitaltwin.json not found in any expected location')
    }

    // Create chunks
    const chunks = createContentChunks(profileData)
    
    // Prepare chunks for vector database
    vectorDatabase = chunks.map((chunk) => ({
      id: chunk.id,
      title: chunk.title,
      content: chunk.content,
      type: chunk.type,
    }))
    
    console.log(`✓ Vector database initialized with ${vectorDatabase.length} chunks`)
    return vectorDatabase
  } catch (error) {
    console.error('Failed to initialize vector database:', error)
    throw error
  }
}


function createContentChunks(
  profileData: any
): Array<{ id: string; title: string; content: string; type: string }> {
  const chunks: Array<{ id: string; title: string; content: string; type: string }> = []

  // Personal info
  if (profileData.personal) {
    chunks.push({
      id: 'name',
      title: 'Name and Title',
      content: `My name is ${profileData.personal.name}. I am a ${profileData.personal.title}.`,
      type: 'personal',
    })

    if (profileData.personal.location) {
      chunks.push({
        id: 'location',
        title: 'Location',
        content: `I am based in ${profileData.personal.location}.`,
        type: 'personal',
      })
    }

    chunks.push({
      id: 'summary',
      title: 'Professional Summary',
      content: profileData.personal.summary || '',
      type: 'personal',
    })
    chunks.push({
      id: 'elevator_pitch',
      title: 'Elevator Pitch',
      content: profileData.personal.elevator_pitch || '',
      type: 'personal',
    })

    // Contact information
    if (profileData.personal.contact) {
      chunks.push({
        id: 'contact',
        title: 'Contact Information',
        content: `You can reach me at ${profileData.personal.contact.email}. My LinkedIn is ${profileData.personal.contact.linkedin} and my GitHub is ${profileData.personal.contact.github}.`,
        type: 'personal',
      })
      chunks.push({
        id: 'email',
        title: 'Email',
        content: `My email address is ${profileData.personal.contact.email}.`,
        type: 'personal',
      })
    }
  }

  // Skills
  if (profileData.skills) {
    if (profileData.skills.technical?.design_specialties) {
      chunks.push({
        id: 'design_specialties',
        title: 'Design Specialties',
        content: profileData.skills.technical.design_specialties.join(', '),
        type: 'skills',
      })
    }

    if (profileData.skills.technical?.programming_languages) {
      const langs = profileData.skills.technical.programming_languages
        .map((p: any) => `${p.language} (${p.proficiency})`)
        .join(', ')
      chunks.push({
        id: 'programming_languages',
        title: 'Programming Languages',
        content: langs,
        type: 'skills',
      })
    }

    if (profileData.skills.soft_skills) {
      chunks.push({
        id: 'soft_skills',
        title: 'Soft Skills',
        content: profileData.skills.soft_skills.join(', '),
        type: 'skills',
      })
    }
  }

  // Education
  if (profileData.education) {
    chunks.push({
      id: 'education',
      title: 'Education',
      content: `${profileData.education.degree} from ${profileData.education.university} (${profileData.education.graduation_year})`,
      type: 'education',
    })
  }

  // Projects
  if (profileData.projects_portfolio) {
    profileData.projects_portfolio.forEach((proj: any, idx: number) => {
      chunks.push({
        id: `project_${idx}`,
        title: proj.name || 'Project',
        content: `${proj.description}. Technologies: ${proj.technologies?.join(', ') || ''}`,
        type: 'projects',
      })
    })
  }

  // Career Goals
  if (profileData.career_goals) {
    chunks.push({
      id: 'career_goals',
      title: 'Career Goals',
      content: `Short-term: ${profileData.career_goals.short_term}. Long-term: ${profileData.career_goals.long_term}`,
      type: 'career',
    })
  }

  return chunks
}

export async function searchProfile(question: string) {
  try {
    // Always reinitialize to get fresh data
    vectorDatabase = []
    await initializeVectorDatabase()

    // Expand query with synonyms for better matching
    const expandedQuestion = expandQuery(question)
    const questionTokens = tokenize(expandedQuestion)

    // Calculate similarity scores with improved algorithm
    const similarities = vectorDatabase.map((chunk) => {
      const chunkTokens = tokenize(chunk.title + ' ' + chunk.content)
      const score = calculateSimilarity(questionTokens, chunkTokens)
      return {
        id: chunk.id,
        title: chunk.title,
        content: chunk.content,
        type: chunk.type,
        score,
      }
    })

    // Sort by similarity and get top 3
    const topResults = similarities.sort((a, b) => b.score - a.score).slice(0, 3)

    // More lenient threshold - if we have results, use them
    let context = ''
    let sources: Array<{ title: string; type: string; score: number }> = []

    if (topResults.length > 0 && topResults[0].score > 0) {
      // Use results with any positive score
      sources = topResults
        .filter((r) => r.score > 0)
        .map((result) => ({
          title: result.title,
          type: result.type,
          score: result.score,
        }))

      context = topResults
        .filter((r) => r.score > 0)
        .map((result) => `${result.title}: ${result.content}`)
        .join('\n\n')
    }

    // If no good matches, provide a fallback answer
    if (!context) {
      return {
        answer:
          "I'm not sure about that specific topic. Could you ask me about my skills, projects, education, or career goals?",
        sources: [],
      }
    }

    // Generate response with Groq
    const prompt = `You are Christine Comittan, an AI digital twin. Answer the user's question in first person, naturally and conversationally.

Your Information:
${context}

User Question: ${question}

Answer in 2-3 sentences, being specific and helpful. Sound natural and personable.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'You are Christine Comittan, a database professional. Answer questions about yourself in first person, conversationally and naturally. Be helpful, specific, and personable. Do NOT use any HTML, markdown, or special formatting. Just plain text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    let answer = completion.choices[0]?.message?.content || 'Unable to generate response'
    // Remove any HTML/markdown formatting
    answer = answer.replace(/<[^>]*>/g, '').replace(/\*\*/g, '').replace(/\*/g, '').trim()

    return {
      answer,
      sources,
    }
  } catch (error) {
    console.error('Error in searchProfile:', error)
    return {
      answer: 'Sorry, I encountered an error processing your question. Please try again.',
      sources: [],
    }
  }
}
