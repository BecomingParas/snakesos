#!/bin/bash

# Test Better Auth Sign Up on Production
echo "🧪 Testing Better Auth Sign Up..."

curl -X POST https://snakesos.vercel.app/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@snakesos.com",
    "password": "password123",
    "name": "Test User"
  }' \
  -v

echo ""
echo ""
echo "🧪 Testing Better Auth Sign In..."

curl -X POST https://snakesos.vercel.app/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@snakesos.com",
    "password": "password123"
  }' \
  -v
