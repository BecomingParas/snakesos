#!/bin/bash

# 🚀 Deploy Snake Rescue to Vercel with AI Model
# This script helps you deploy your app to Vercel production

echo "🐍 Snake Rescue - Vercel Deployment Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found!"
    echo ""
    echo "Install it with:"
    echo "  npm install -g vercel"
    echo ""
    exit 1
fi

echo "✅ Vercel CLI found!"
echo ""

# Show AI model status
echo "📊 Checking AI Model Status..."
echo ""

AI_URL="https://investing-galaxy-connection-practitioner.trycloudflare.com"

# Try to check health
if curl -s --connect-timeout 5 "$AI_URL/health" > /dev/null 2>&1; then
    echo "✅ AI Model is ONLINE"
    curl -s "$AI_URL/health" | python -m json.tool 2>/dev/null || curl -s "$AI_URL/health"
    echo ""
else
    echo "⚠️  WARNING: AI Model appears to be offline!"
    echo "   Make sure your Google Colab notebook is running"
    echo "   URL: $AI_URL"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

# Remind about environment variables
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  IMPORTANT: Environment Variables"
echo ""
echo "Make sure you've added these to Vercel Dashboard:"
echo ""
echo "1. PYTHON_ML_SERVICE_URL=$AI_URL"
echo "2. PYTHON_ML_API_KEY=G_PZBKORR35hxXMI4bFY6s0P8ktIEOHSyYlhprCYU_I"
echo "3. PYTHON_ML_TIMEOUT=30000"
echo ""
echo "Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables"
echo ""
read -p "Have you added these variables? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Please add the environment variables first, then run this script again."
    echo ""
    echo "Quick link: https://vercel.com/dashboard"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Deploying to Vercel Production..."
echo ""

# Deploy
vercel --prod

# Check deployment status
if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. Test your app: https://your-app.vercel.app/identify"
    echo "2. Upload a snake image"
    echo "3. Verify AI classification works"
    echo "4. Check logs in Vercel Dashboard"
    echo ""
    echo "🐍 Your Snake Rescue app is LIVE with AI! 🚀"
    echo ""
else
    echo ""
    echo "❌ Deployment failed!"
    echo ""
    echo "Check the error messages above and try again."
    echo ""
    echo "Common issues:"
    echo "- Missing environment variables"
    echo "- Build errors (run 'npm run build' locally first)"
    echo "- Network connectivity"
    echo ""
fi
