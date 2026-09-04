#!/bin/bash

# Quick script to add environment variables to Vercel
# Run: bash add-vercel-env.sh

echo "🔧 Adding Environment Variables to Vercel..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found!"
    echo "Install with: npm install -g vercel"
    exit 1
fi

echo "Adding PYTHON_ML_SERVICE_URL..."
vercel env add PYTHON_ML_SERVICE_URL production << EOF
https://investing-galaxy-connection-practitioner.trycloudflare.com
EOF

vercel env add PYTHON_ML_SERVICE_URL preview << EOF
https://investing-galaxy-connection-practitioner.trycloudflare.com
EOF

vercel env add PYTHON_ML_SERVICE_URL development << EOF
https://investing-galaxy-connection-practitioner.trycloudflare.com
EOF

echo ""
echo "Adding PYTHON_ML_API_KEY..."
vercel env add PYTHON_ML_API_KEY production << EOF
G_PZBKORR35hxXMI4bFY6s0P8ktIEOHSyYlhprCYU_I
EOF

vercel env add PYTHON_ML_API_KEY preview << EOF
G_PZBKORR35hxXMI4bFY6s0P8ktIEOHSyYlhprCYU_I
EOF

vercel env add PYTHON_ML_API_KEY development << EOF
G_PZBKORR35hxXMI4bFY6s0P8ktIEOHSyYlhprCYU_I
EOF

echo ""
echo "Adding PYTHON_ML_TIMEOUT..."
vercel env add PYTHON_ML_TIMEOUT production << EOF
30000
EOF

vercel env add PYTHON_ML_TIMEOUT preview << EOF
30000
EOF

vercel env add PYTHON_ML_TIMEOUT development << EOF
30000
EOF

echo ""
echo "✅ Environment variables added!"
echo ""
echo "Now redeploy:"
echo "  vercel --prod --force"
