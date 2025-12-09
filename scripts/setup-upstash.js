#!/usr/bin/env node

/**
 * Quick script to help set up Upstash Vector database
 * This creates an index with embeddings enabled
 */

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('🚀 Digital Twin - Upstash Vector Setup\n');

  const token = await question('Enter your Upstash API token (from https://console.upstash.com/account/api): ');
  const indexName = await question('Enter index name (default: "digital-twin"): ') || 'digital-twin';
  const region = await question('Enter region (default: "us-east-1"): ') || 'us-east-1';

  console.log('\n📍 Creating index with embeddings enabled...\n');

  try {
    const result = await createVectorIndex(token, indexName, region);
    console.log('✅ Index created successfully!\n');
    console.log('📝 Add these to your .env.local:\n');
    console.log(`UPSTASH_VECTOR_REST_URL="${result.endpoint}"`);
    console.log(`UPSTASH_VECTOR_REST_TOKEN="${result.read_only_token}"`);
    console.log('\n🔄 Then restart your dev server:\n');
    console.log('pnpm dev\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  rl.close();
}

function createVectorIndex(apiToken, indexName, region) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      name: indexName,
      region: region,
      type: 'fixed',
      dimension: 384,
      similarity_function: 'cosine',
    });

    const options = {
      hostname: 'api.upstash.com',
      port: 443,
      path: '/v2/vector/databases',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 201 || res.statusCode === 200) {
            resolve({
              endpoint: response.endpoint,
              read_only_token: response.read_only_token,
            });
          } else {
            reject(new Error(response.error || 'Failed to create index'));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

main().catch(console.error);
