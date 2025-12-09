# Fix Upstash Embedding Error

Your Upstash Vector index was created **WITHOUT** embedding model enabled.

## Quick Fix (3 Steps)

### Step 1: Create New Index with Embeddings
1. Go to https://console.upstash.com
2. Click **"Create Index"** in the Vector section
3. Fill the form:
   - **Name:** `digital-twin`
   - **Region:** `us-east-1` (or your preferred region)
   - **Embedding Model:** ✅ **Enable this!** Select "Default (multilingual-e5-small)"
4. Click **"Create"**

### Step 2: Copy New Credentials
After creation, copy:
- **REST URL** → `UPSTASH_VECTOR_REST_URL`
- **REST TOKEN** → `UPSTASH_VECTOR_REST_TOKEN`

### Step 3: Update .env.local
Replace your current `.env.local` with:
```
UPSTASH_VECTOR_REST_URL="https://your-new-url"
UPSTASH_VECTOR_REST_TOKEN="your-new-token"
GROQ_API_KEY="<your-groq-api-key>"
NEXT_PUBLIC_PROFILE_SOURCE="digitaltwin.json"
```

### Step 4: Restart Dev Server
```powershell
Stop-Process -Name node -Force 2>$null
pnpm dev
```

## Why This Happened

Upstash Vector requires embeddings to be enabled at index creation time. Your current index doesn't have this enabled, so it rejects embedding requests.

## Done!

Your digital twin should now work with the new index!
