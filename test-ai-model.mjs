#!/usr/bin/env node
/**
 * 🐍 Test Snake AI Model Connection
 * 
 * This script tests your Python ML snake classifier API
 * to ensure it's working before deploying to production.
 * 
 * Usage:
 *   node test-ai-model.mjs
 */

import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const AI_MODEL_URL = process.env.PYTHON_ML_SERVICE_URL || 'https://investing-galaxy-connection-practitioner.trycloudflare.com';
const API_KEY = process.env.PYTHON_ML_API_KEY || 'G_PZBKORR35hxXMI4bFY6s0P8ktIEOHSyYlhprCYU_I';

console.log('🐍 Snake AI Model Connection Test\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test 1: Health Check
async function testHealthCheck() {
  console.log('📊 Test 1: Health Check');
  console.log(`   URL: ${AI_MODEL_URL}/health\n`);

  try {
    const response = await axios.get(`${AI_MODEL_URL}/health`, {
      timeout: 10000,
    });

    console.log('✅ Health Check Passed!');
    console.log('   Response:', JSON.stringify(response.data, null, 2));
    console.log();
    return true;
  } catch (error) {
    console.error('❌ Health Check Failed!');
    console.error('   Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    console.log();
    return false;
  }
}

// Test 2: Predict with Sample Image URL
async function testPredictWithUrl() {
  console.log('🖼️  Test 2: Predict with Image URL');
  
  // Using a public cobra image from Wikimedia
  const testImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Indian_cobra_%28Naja_naja%29.jpg/800px-Indian_cobra_%28Naja_naja%29.jpg';
  
  console.log(`   Image: ${testImageUrl}\n`);

  try {
    // Download the image
    console.log('   📥 Downloading image...');
    const imageResponse = await axios.get(testImageUrl, {
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const buffer = Buffer.from(imageResponse.data);
    console.log(`   ✅ Downloaded ${buffer.length} bytes\n`);

    // Create form data
    const formData = new FormData();
    formData.append('file', buffer, 'test-snake.jpg');

    // Send to AI model
    console.log('   🤖 Sending to AI model...');
    const headers = {
      ...formData.getHeaders(),
    };

    // Add API key if configured
    if (API_KEY) {
      headers['X-API-Key'] = API_KEY;
    }

    const response = await axios.post(
      `${AI_MODEL_URL}/api/v1/predict`,
      formData,
      {
        headers,
        timeout: 30000,
      }
    );

    console.log('✅ Prediction Successful!\n');
    console.log('   📋 Results:');
    console.log('   ─────────────────────────────────────────');
    
    const data = response.data;
    
    if (data.success) {
      console.log(`   Model Version: ${data.model_version}`);
      console.log(`   Prediction: ${data.prediction?.label?.toUpperCase() || 'N/A'}`);
      console.log(`   Confidence: ${((data.prediction?.confidence || 0) * 100).toFixed(1)}%`);
      console.log(`   Status: ${data.status?.toUpperCase() || 'N/A'}`);
      console.log(`   Confident: ${data.confident ? 'YES' : 'NO'}`);
      console.log(`   Requires Verification: ${data.requires_human_verification ? 'YES' : 'NO'}`);
      
      if (data.safety_message) {
        console.log(`\n   ⚠️  Safety: ${data.safety_message}`);
      }
      
      if (data.species) {
        console.log(`\n   🐍 Species Identified:`);
        console.log(`      Common Name: ${data.species.common_name}`);
        console.log(`      Scientific: ${data.species.scientific_name}`);
        console.log(`      Venomous: ${data.species.venomous ? 'YES ☠️' : 'NO ✅'}`);
        console.log(`      Region: ${data.species.region}`);
        console.log(`      Confidence: ${(data.species.confidence * 100).toFixed(1)}%`);
      }
      
      if (data.top_species && data.top_species.length > 0) {
        console.log(`\n   📊 Alternative Matches:`);
        data.top_species.slice(0, 3).forEach((sp, idx) => {
          console.log(`      ${idx + 1}. ${sp.common_name} (${(sp.confidence * 100).toFixed(1)}%)`);
        });
      }
    } else {
      console.log(`   ❌ Classification failed: ${data.error || 'Unknown error'}`);
    }
    
    console.log('   ─────────────────────────────────────────\n');
    
    // Show full response for debugging
    console.log('   🔍 Full Response (for debugging):');
    console.log(JSON.stringify(data, null, 2));
    console.log();
    
    return true;
  } catch (error) {
    console.error('❌ Prediction Failed!');
    console.error('   Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    console.log();
    return false;
  }
}

// Test 3: Check API Documentation
async function testApiDocs() {
  console.log('📚 Test 3: API Documentation Check');
  console.log(`   URL: ${AI_MODEL_URL}/docs\n`);

  try {
    const response = await axios.get(`${AI_MODEL_URL}/docs`, {
      timeout: 10000,
    });

    console.log('✅ API Documentation Available!');
    console.log(`   Status: ${response.status}`);
    console.log(`   Visit: ${AI_MODEL_URL}/docs in your browser\n`);
    return true;
  } catch (error) {
    console.error('❌ API Documentation Check Failed!');
    console.error('   Error:', error.message);
    console.log();
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Tests...\n');
  console.log(`Configuration:`);
  console.log(`   AI Model URL: ${AI_MODEL_URL}`);
  console.log(`   API Key: ${API_KEY ? '***' + API_KEY.slice(-8) : 'Not configured'}`);
  console.log();
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const results = {
    healthCheck: false,
    prediction: false,
    apiDocs: false,
  };

  results.healthCheck = await testHealthCheck();
  
  if (results.healthCheck) {
    results.prediction = await testPredictWithUrl();
    results.apiDocs = await testApiDocs();
  } else {
    console.log('⚠️  Skipping remaining tests due to health check failure\n');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 Test Summary:\n');
  console.log(`   Health Check:      ${results.healthCheck ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`   Prediction Test:   ${results.prediction ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`   API Docs:          ${results.apiDocs ? '✅ PASSED' : '❌ FAILED'}`);
  console.log();

  const allPassed = results.healthCheck && results.prediction && results.apiDocs;
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Your AI model is ready for production! 🚀\n');
    console.log('Next steps:');
    console.log('1. Add PYTHON_ML_SERVICE_URL to Vercel environment variables');
    console.log('2. Add PYTHON_ML_API_KEY to Vercel environment variables');
    console.log('3. Deploy to Vercel with: vercel --prod');
    console.log('4. Test /identify page on your deployed app\n');
  } else {
    console.log('⚠️  SOME TESTS FAILED. Please check:\n');
    console.log('1. Is your Google Colab notebook running?');
    console.log('2. Is the Cloudflare tunnel active?');
    console.log('3. Is the URL correct?');
    console.log('4. Check Colab output for errors\n');
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
