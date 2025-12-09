# Manual API Call for Creating Upstash Vector Database

## Get Your API Token

You need your Upstash API token (not the REST token):

1. Go to https://console.upstash.com
2. Click your **profile icon** (top right)
3. Click **"API Keys"** 
4. Copy your **API Token** (it starts with `ey...`)

## Create Database via PowerShell

Replace `YOUR_API_TOKEN` in this script:

```powershell
$apiToken = "YOUR_API_TOKEN"

$headers = @{
    "Authorization" = "Bearer $apiToken"
    "Content-Type" = "application/json"
}

$body = @{
    name = "digital-twin-$(Get-Random -Minimum 1000 -Maximum 9999)"
    region = "us-east-1"
    type = "fixed"
    dimension = 384
    similarity_function = "cosine"
} | ConvertTo-Json

Write-Host "Creating database..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "https://api.upstash.com/v2/vector/databases" `
        -Method POST `
        -Headers $headers `
        -Body $body
    
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Endpoint: $($response.endpoint)" -ForegroundColor Yellow
    Write-Host "Token: $($response.read_only_token)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Update .env.local with:" -ForegroundColor Cyan
    Write-Host "UPSTASH_VECTOR_REST_URL=`"$($response.endpoint)`"" 
    Write-Host "UPSTASH_VECTOR_REST_TOKEN=`"$($response.read_only_token)`""
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

## Save Response & Update .env.local

Once you get the response, update `.env.local`:

```env
UPSTASH_VECTOR_REST_URL="https://your-endpoint-vector.upstash.io"
UPSTASH_VECTOR_REST_TOKEN="your-read-only-token"
GROQ_API_KEY=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
NEXT_PUBLIC_PROFILE_SOURCE=digitaltwin.json
```

Then restart: `pnpm dev`

---

**Alternative: Create via Web UI**
If the API doesn't work, go to https://console.upstash.com/vector and click "Create Database"
