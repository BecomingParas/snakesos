/**
 * Test Backend Connection
 * Run this to verify backend is accessible from frontend
 */

const http = require('http');

console.log('🔍 Testing backend connection...\n');

// Test 1: Health Check
console.log('Test 1: Health Check Endpoint');
const healthRequest = http.get('http://localhost:4000/health', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Health check passed');
      console.log('Response:', data);
    } else {
      console.log('❌ Health check failed');
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
    }
    
    // Test 2: GraphQL Endpoint
    testGraphQL();
  });
});

healthRequest.on('error', (error) => {
  console.log('❌ Backend is not running or not accessible');
  console.log('Error:', error.message);
  console.log('\n💡 Solution: Start the backend with: yarn dev:backend');
  process.exit(1);
});

function testGraphQL() {
  console.log('\nTest 2: GraphQL Endpoint');
  
  const postData = JSON.stringify({
    query: '{ __typename }'
  });
  
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/graphql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Origin': 'http://localhost:4200' // Simulate frontend request
    }
  };
  
  const graphqlRequest = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ GraphQL endpoint is accessible');
        console.log('Response:', data);
      } else {
        console.log('⚠️  GraphQL endpoint returned non-200 status');
        console.log('Status:', res.statusCode);
        console.log('Response:', data);
      }
      
      console.log('\n' + '='.repeat(60));
      console.log('Backend Connection Test Complete');
      console.log('='.repeat(60));
    });
  });
  
  graphqlRequest.on('error', (error) => {
    console.log('❌ GraphQL endpoint is not accessible');
    console.log('Error:', error.message);
  });
  
  graphqlRequest.write(postData);
  graphqlRequest.end();
}
