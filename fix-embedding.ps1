$ErrorActionPreference = "Stop"

Write-Host "Fixing Upstash Vector Index - Creating New Index with Embeddings" -ForegroundColor Cyan
Write-Host ""

# Step 1: Manual Web UI Instructions
Write-Host "IMPORTANT: You need to create a NEW Vector Database with embeddings enabled." -ForegroundColor Yellow
Write-Host ""
Write-Host "Follow these steps:" -ForegroundColor Green
Write-Host "1. Go to https://console.upstash.com/vector" -ForegroundColor White
Write-Host "2. Click 'Create Database'" -ForegroundColor White
Write-Host "3. Configure it as follows:" -ForegroundColor White
Write-Host "   - Name: digital-twin-v2" -ForegroundColor Gray
Write-Host "   - Region: us-east-1 (or your preferred region)" -ForegroundColor Gray
Write-Host "   - Dimension: 384" -ForegroundColor Gray
Write-Host "   - Similarity Function: Cosine" -ForegroundColor Gray
Write-Host ""
Write-Host "4. After creation, go to the 'REST API' tab" -ForegroundColor White
Write-Host "5. Copy the Endpoint URL" -ForegroundColor White
Write-Host "6. Copy the Token" -ForegroundColor White
Write-Host ""

# Step 2: Get user input
$endpoint = Read-Host "Enter your NEW Upstash Endpoint URL"
$token = Read-Host "Enter your NEW Upstash Token"

if ([string]::IsNullOrWhiteSpace($endpoint) -or [string]::IsNullOrWhiteSpace($token)) {
    Write-Host "Both endpoint and token are required!" -ForegroundColor Red
    exit 1
}

# Step 3: Update .env.local
$envLocalPath = ".\.env.local"
$groqKey = "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"

$envContent = @"
# Upstash Vector Database (NEW INDEX WITH EMBEDDINGS ENABLED)
UPSTASH_VECTOR_REST_URL="$endpoint"
UPSTASH_VECTOR_REST_TOKEN="$token"

# Groq API Configuration
GROQ_API_KEY="$groqKey"

# Profile Data Source
NEXT_PUBLIC_PROFILE_SOURCE="digitaltwin.json"
"@

$envContent | Set-Content -Path $envLocalPath

Write-Host ""
Write-Host "Updated .env.local with new credentials" -ForegroundColor Green
Write-Host ""
Write-Host "Verifying connection..." -ForegroundColor Cyan

# Test the connection
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$endpoint/info" `
        -Method GET `
        -Headers $headers `
        -TimeoutSec 5
    
    Write-Host "Successfully connected to Upstash Vector Database!" -ForegroundColor Green
    Write-Host "Vector Count: $($response.vector_count)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "Could not verify connection (this may be normal)" -ForegroundColor Yellow
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: pnpm dev" -ForegroundColor White
Write-Host "2. The app will automatically seed your profile data" -ForegroundColor White
Write-Host "3. Try asking a question!" -ForegroundColor White
Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
