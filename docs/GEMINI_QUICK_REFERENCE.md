# Gemini Snake ID - Quick Reference

## ⚡ Setup (2 minutes)

```bash
# 1. Get API key
# Visit: https://aistudio.google.com/app/apikey

# 2. Add to .env
GEMINI_API_KEY=your_actual_key_here
GEMINI_MODEL=gemini-1.5-flash
AI_PROVIDER=GEMINI

# 3. Restart
npm run dev:backend
```

## 🔐 Security Rules

- ✅ Server-side only (never in frontend)
- ✅ Not in Git (use .env, not .env.example)
- ✅ Rotate if exposed
- ❌ Never use `NEXT_PUBLIC_GEMINI_API_KEY`

## 🧪 Quick Test

```graphql
mutation {
  identifySnake(input: { 
    imageUrl: "https://your-image-url.jpg"
  }) {
    species { name venomous }
    confidence
    dangerAssessment
  }
}
```

## 🚨 Common Issues

| Problem | Solution |
|---------|----------|
| "Not configured" | Check `GEMINI_API_KEY` in `.env` |
| Wrong provider | Set `AI_PROVIDER=GEMINI` |
| Rate limited | Wait 15 min or adjust limits |
| API timeout | Check image URL is public/HTTPS |

## 📁 Key Files

```
libs/backend/modules/src/ai/infrastructure/gemini/
├── gemini.provider.ts     # Main implementation
├── gemini.client.ts       # API communication
├── gemini.config.ts       # Configuration
└── gemini.types.ts        # Response schemas
```

## 🔄 Provider Switch

```bash
# Use Gemini
AI_PROVIDER=GEMINI

# Use Python ML
AI_PROVIDER=PYTHON_ML

# Auto-detect (default)
# Comment out AI_PROVIDER
```

## 💰 Cost

- **Flash model**: ~$0.001/request (~$60/month for 2K daily requests)
- **Pro model**: ~$0.005/request (5x more expensive)

## 📊 Monitoring

```bash
# Check logs for:
🔮 Using Google Gemini Vision AI
🐍 [DEBUG] Gemini raw response
⚠️ Snake identification rate limit exceeded
```

## 🧪 Testing

```bash
# Run tests
npm test -- gemini.provider.spec.ts

# Rate limit test
# Make 21 rapid requests → 21st should fail
```

## 🔧 Environment Variables

```bash
GEMINI_API_KEY=required
GEMINI_MODEL=gemini-1.5-flash
AI_PROVIDER=GEMINI
SNAKE_ID_RATE_LIMIT_MAX=20
SNAKE_ID_RATE_LIMIT_WINDOW_MS=900000
SKIP_RATE_LIMIT=false
```

## 📖 Full Documentation

See `GEMINI_SNAKE_IDENTIFICATION_GUIDE.md` for complete guide.
