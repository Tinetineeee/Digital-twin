$ErrorActionPreference = "Stop"

# Extract the API token from the current REST token
# The token format is: Authorization header value
$restToken = "ABoFMGluZm9ybWVkLXdpbGRjYXQtMTg2MjctdXMxYWRtaW5NMlk0WmpKaFpHWXRNelE1TnkwMFltVmpMV0l6Tm1NdFlURTJaRGMxT0RCaVpUa3g="

# Upstash API endpoint for creating vector databases
$apiUrl = "https://api.upstash.com/v2/vector/databases"

# Create the headers with authorization
$headers = @{
    "Authorization" = "Bearer $restToken"
    "Content-Type" = "application/json"
}

# Create the request body
$body = @{
    name = "digital-twin-$(Get-Random -Minimum 1000 -Maximum 9999)"
    region = "us-east-1"
    type = "fixed"
    dimension = 384
    similarity_function = "cosine"
} | ConvertTo-Json

Write-Host "📡 Creating new Upstash Vector Database with embeddings..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $apiUrl `
        -Method POST `
        -Headers $headers `
        -Body $body -Verbose
    
    Write-Host "✅ Database created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Database Information:" -ForegroundColor Yellow
    Write-Host "  Name: $($response.database_name)" 
    Write-Host "  ID: $($response.database_id)"
    Write-Host "  Region: $($response.region)"
    Write-Host ""
    
    Write-Host "REST API Credentials:" -ForegroundColor Yellow
    $endpoint = $response.endpoint
    $readToken = $response.read_only_token
    
    Write-Host "  Endpoint: $endpoint"
    Write-Host "  Token: $($readToken.Substring(0, 20))..." 
    Write-Host ""
    
    # Create the new .env.local content
    $envContent = @"
# Upstash Vector Database (NEW INDEX WITH EMBEDDINGS)
UPSTASH_VECTOR_REST_URL="$endpoint"
UPSTASH_VECTOR_REST_TOKEN="$readToken"

# Groq API Configuration
GROQ_API_KEY=<your-groq-api-key>

# Profile Data Source
NEXT_PUBLIC_PROFILE_SOURCE=digitaltwin.json
"@

    # Write to .env.local
    $envLocalPath = ".\.env.local"
    $envContent | Set-Content -Path $envLocalPath
    
    Write-Host "📝 Updated .env.local with new credentials" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run: pnpm dev" -ForegroundColor White
    Write-Host "  2. Wait for 'Successfully seeded X content chunks!' message" -ForegroundColor White
    Write-Host "  3. Open http://localhost:3000 in your browser" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "❌ Error creating database:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  - Make sure your Upstash account has database creation quota" -ForegroundColor Gray
    Write-Host "  - Check https://console.upstash.com to verify" -ForegroundColor Gray
}
