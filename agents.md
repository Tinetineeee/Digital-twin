# Digital Twin MCP Server Project Instructions

## Project Overview
Build an MCP server using the roll dice pattern to create a digital twin assistant that can answer questions about a person's professional profile using RAG (Retrieval-Augmented Generation).

## Reference Repositories
- **Your Project Repository**: https://github.com/jedeee-ei/Digital-twin-workshop.git
  - Main RAG solution repository with MCP server implementation
- **Pattern Reference**: https://github.com/gocallum/rolldice-mcpserver.git
  - Roll dice MCP server - use same technology and pattern for MCP server
- **Logic Reference**: https://github.com/gocallum/binal_digital-twin_py.git
  - Python code using Upstash Vector for RAG search with Groq and LLaMA for generations

## Core Functionality
- MCP server accepts user questions about Jhon Danver's professional background
- Server actions search Upstash Vector database using semantic similarity
- RAG pipeline: Query embeddings -> Retrieve top-k relevant chunks -> Generate response via Groq
- Profile data includes: skills (HTML, CSS, design tools), education (BSIT 2026), projects, career goals
- Response should be in first-person perspective of the digital twin
- Support questions about: design specialties, career goals, education, projects, technical skills

## Environment Variables (.env.local)
```
# Upstash Vector Database
UPSTASH_VECTOR_REST_URL=https://api.upstash.io/v1/vectors
UPSTASH_VECTOR_REST_TOKEN=<your-upstash-token>

# Groq API Configuration
GROQ_API_KEY=<your-groq-api-key>

# Digital Twin Data Source
NEXT_PUBLIC_PROFILE_SOURCE=digitaltwin.json
```

## Technical Requirements
- **Framework**: Next.js 15.5.3+ (use latest available)
- **Package Manager**: Always use pnpm (never npm or yarn)
- **Commands**: Always use Windows PowerShell commands
- **Type Safety**: Enforce strong TypeScript type safety throughout
- **Architecture**: Always use server actions where possible
- **Styling**: Use globals.css instead of inline styling
- **UI Framework**: ShadCN with dark mode theme
- **Focus**: Prioritize MCP functionality over UI - UI is primarily for MCP server configuration

## Setup Commands
```bash
pnpm dlx shadcn@latest init
```
Reference: https://ui.shadcn.com/docs/installation/next

## Project-Specific Requirements

### Business Logic & Constraints
- **User Profile**: Jhon Danver C. Abogado - HTML/CSS Developer from Saint Paul University Philippines
- **Specialization**: Web design, poster design, UI/UX design, responsive web design
- **Education**: BS Information Technology (graduating 2026) with thesis on "Scholarship Monitoring System"
- **Response Style**: Always answer as the person (first person), professional and personable tone
- **Vector Embeddings**: Use Upstash's built-in embeddings (default model)
- **Search Strategy**: Retrieve top 3 most relevant chunks for context
- **Generation Model**: Groq's llama-3.1-8b-instant for fast inference

### API Endpoints & Database Schemas

#### Upstash Vector Database
- **Endpoint**: REST API via UPSTASH_VECTOR_REST_URL
- **Vector Dimensions**: 384 (default embedding model)
- **Metadata Schema**:
  ```json
  {
    "title": "string",
    "type": "personal|skills|education|projects|career",
    "content": "string",
    "category": "optional string"
  }
  ```

#### Profile Data Structure (digitaltwin.json)
```json
{
  "personal": { "name", "title", "location", "summary", "contact" },
  "skills": { "technical": { "programming_languages", "design_tools", "design_specialties" }, "soft_skills" },
  "education": { "university", "degree", "graduation_year", "thesis_project" },
  "projects_portfolio": [{ "name", "description", "technologies" }],
  "career_goals": { "short_term", "long_term", "learning_focus" }
}
```

#### Groq API Configuration
- **Model**: llama-3.1-8b-instant
- **Temperature**: 0.7
- **Max Tokens**: 500
- **System Prompt**: "You are an AI digital twin. Answer as the person in first person."

### Server Actions Pattern
```typescript
'use server'

import { Index } from '@upstash/vector'
import { Groq } from 'groq-sdk'

export async function searchProfile(question: string) {
  // 1. Query vector database for semantically similar chunks
  // 2. Extract relevant content from top-k results
  // 3. Generate response using Groq with context
  // 4. Return formatted response
}
```

## Upstash Vector Integration

### Key Documentation
- Getting Started: https://upstash.com/docs/vector/overall/getstarted
- Embedding Models: https://upstash.com/docs/vector/features/embeddingmodels
- TypeScript SDK: https://upstash.com/docs/vector/sdks/ts/getting-started

### Example Implementation
```typescript
import { Index } from "@upstash/vector"

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
})

// RAG search example
await index.query({
  data: "What is Upstash?",
  topK: 3,
  includeMetadata: true,
})
```

## Additional Useful Resources
- **MCP Protocol**: https://modelcontextprotocol.io/
- **Upstash Vector TypeScript SDK**: https://upstash.com/docs/vector/sdks/ts/getting-started
- **Groq API Docs**: https://console.groq.com/docs
- **Next.js Server Actions**: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
- **ShadCN UI Components**: https://ui.shadcn.com/
- **Your GitHub Repository**: https://github.com/jedeee-ei/Digital-twin-workshop

---

**Note**: This file provides context for GitHub Copilot to generate accurate, project-specific code suggestions. Update as requirements evolve.

