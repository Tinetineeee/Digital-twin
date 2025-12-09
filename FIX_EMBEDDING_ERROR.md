# Fix: Enable Embeddings on Your Upstash Vector Index

## The Problem
Your Upstash Vector index was created without an embedding model, so it can't automatically embed text for you.

## The Solution - 2 Options

### Option 1: Quick Fix (Recommended)
1. Go to https://console.upstash.com
2. Click on your vector database
3. Look for **"Embedding Model"** setting
4. If it says "None", click to change it
5. Select **"Upstash Embedding (Default)"** 
6. Save changes
7. Restart dev server: `pnpm dev`

### Option 2: Create a New Index
If Option 1 doesn't work, create a new index:

1. Go to https://console.upstash.com
2. Click **"Create Database"**
3. Select **"Vector"**
4. Fill in:
   - **Name**: `digital-twin`
   - **Region**: Choose closest to you
   - **Dimension**: `384`
   - **Embedding Model**: `Upstash Embedding` ← **IMPORTANT**
   - **Similarity Function**: `Cosine`
5. Click **"Create"**
6. Go to **"REST API"** tab
7. Copy:
   - **UPSTASH_VECTOR_REST_URL** (REST URL)
   - **UPSTASH_VECTOR_REST_TOKEN** (Read-Only Token)
8. Update `.env.local`:
   ```env
   UPSTASH_VECTOR_REST_URL="your-new-url"
   UPSTASH_VECTOR_REST_TOKEN="your-new-token"
   ```
9. Restart: `pnpm dev`

## Verify It Works
After making changes, you should see in the console:
```
✓ Successfully seeded 10 content chunks!
```

Not this error:
```
❌ Failed to seed profile data: Embedding data for this index is not allowed
```

## Still Having Issues?
Make sure you're copying from the **REST API** tab, not the CLI section.
