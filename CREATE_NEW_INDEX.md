# Step-by-Step: Create New Upstash Vector Index with Embeddings

## Step 1: Get Your API Token
1. Go to https://console.upstash.com
2. Click on your profile icon (top right)
3. Select **"Account"**
4. Scroll to **"API Keys"**
5. Copy your **API Token** (keep this private!)

## Step 2: Create New Vector Database via REST API
Run this command in PowerShell (replace `YOUR_API_TOKEN`):

```powershell
$apiToken = "YOUR_API_TOKEN"
$headers = @{
    "Authorization" = "Bearer $apiToken"
    "Content-Type" = "application/json"
}

$body = @{
    name = "digital-twin"
    region = "us-east-1"
    type = "fixed"
    dimension = 384
    similarity_function = "cosine"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://api.upstash.com/v2/vector/databases" `
    -Method POST -Headers $headers -Body $body

Write-Output $response | ConvertTo-Json
```

## Step 3: Extract Credentials from Response
From the response, copy:
- **endpoint**: Your REST URL
- **read_only_token**: Your authentication token

## Step 4: Update .env.local
Update your `.env.local` with the new credentials:
```env
UPSTASH_VECTOR_REST_URL="https://your-new-endpoint.upstash.io"
UPSTASH_VECTOR_REST_TOKEN="your-new-token"
GROQ_API_KEY="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"
NEXT_PUBLIC_PROFILE_SOURCE="digitaltwin.json"
```

## Step 5: Restart Dev Server
```powershell
pnpm dev
```

## Success Signs
You should see:
```
✅ Connected to Upstash!
✅ Successfully seeded 10 content chunks!
```

---

## Alternative: Manual Web UI Creation
If you prefer using the web interface:

1. Go to https://console.upstash.com/vector
2. Click **"Create Database"**
3. Fill in:
   - **Database Name**: `digital-twin`
   - **Region**: Select your closest region
   - **Type**: Fixed
   - **Dimensions**: 384
   - **Similarity Function**: Cosine
4. Click **"Create Database"**
5. Wait for it to be created
6. Click on the database
7. Go to **"REST API"** tab
8. Copy the credentials and add to `.env.local`
9. Restart dev server

---

**Need help?** If the API call doesn't work, use the manual web UI method instead.
