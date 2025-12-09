# Upstash Vector Database Setup Guide

## Quick Start: Get Your Credentials

### Step 1: Create Upstash Account
1. Go to https://upstash.com
2. Sign up (free tier available)
3. Verify your email

### Step 2: Create a Vector Database
1. Login to https://console.upstash.com
2. Click **"Create Database"** → Select **"Vector"**
3. Choose:
   - **Name**: `digital-twin` (or any name)
   - **Region**: Choose closest to you
   - **Embedding Model**: `default` (384 dimensions)
4. Click **"Create"**

### Step 3: Get Your REST API Credentials
1. After creation, click on your database
2. Go to **"REST API"** tab
3. Copy these two values:
   - **UPSTASH_VECTOR_REST_URL**: Copy the full URL
   - **UPSTASH_VECTOR_REST_TOKEN**: Copy your token

### Step 4: Update .env.local
Edit `.env.local` and replace the placeholders:

```env
UPSTASH_VECTOR_REST_URL="<paste-your-url-here>"
UPSTASH_VECTOR_REST_TOKEN="<paste-your-token-here>"
GROQ_API_KEY="<your-groq-api-key>"
```

### Step 5: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart it:
pnpm dev
```

## How It Works

When you start the app:
1. ✅ Connects to your Upstash Vector database
2. ✅ Checks if vectors exist (first time: empty)
3. ✅ Automatically seeds your profile data (`digitaltwin.json`)
4. ✅ Creates embeddings for all profile sections
5. ✅ Ready for semantic search!

## Testing the Setup

### Manual Test (Optional)
```bash
# Test the RAG service directly
node -e "
const { initializeVectorDatabase } = require('./lib/rag-service.ts');
initializeVectorDatabase().then(() => console.log('Connected!'));
"
```

### Via Web Interface
1. Open http://localhost:3000
2. Ask: "What are your design specialties?"
3. Should see response with sources cited

## Troubleshooting

### Error: "Vector database not initialized"
- Check `.env.local` has correct credentials
- Restart development server

### Error: "Failed to seed profile data"
- Ensure `digitaltwin.json` exists in root directory
- Check JSON syntax is valid

### Error: "Query failed"
- Verify Upstash database is active (check console.upstash.com)
- Ensure vectors have been seeded (should see logs on startup)

## Vector Database Structure

Your profile data is automatically organized:
- **Personal**: Summary and elevator pitch
- **Skills**: Design specialties, programming languages, soft skills
- **Education**: Degree, university, graduation year
- **Projects**: Portfolio items with descriptions
- **Career**: Short-term and long-term goals

Each chunk is embedded and searchable using semantic similarity.

---

**Need help?** Check the agents.md for more details or the Upstash docs: https://upstash.com/docs/vector/
