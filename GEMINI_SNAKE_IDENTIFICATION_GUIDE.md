# Gemini Snake Identification System - Complete Guide

## 🔮 Overview

SnakeSOS now supports **Google Gemini Vision AI** for production-ready snake identification. Gemini provides multimodal image understanding with structured JSON output, making it an excellent choice for visual snake classification with built-in safety recommendations.

### Why Gemini?

- ✅ **Production-ready** - No need to train custom models immediately
- ✅ **Multimodal** - Directly processes images with visual reasoning
- ✅ **Structured output** - Returns validated JSON with species, safety, and confidence
- ✅ **Cost-effective** - Pay-per-use pricing without infrastructure overhead
- ✅ **Provider abstraction** - Hot-swappable with Python ML or Google Cloud Vision

---

## 🚀 Quick Start

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** → **"Create API Key"**
4. Copy the generated key

⚠️ **SECURITY WARNING**: If you've previously exposed an API key in screenshots or logs, **DELETE IT IMMEDIATELY** and create a new one.

### 2. Configure Environment Variables

Add to your `.env` file:

```bash
# Google Gemini AI
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Set Gemini as primary AI provider
AI_PROVIDER=GEMINI
```

### 3. Verify Configuration

```bash
# Start the backend
npm run dev:backend

# You should see in logs:
# 🔮 Using Google Gemini Vision AI for snake identification
```

### 4. Test the Integration

Use the GraphQL playground at `http://localhost:4000/graphql`:

```graphql
mutation IdentifySnake {
  identifySnake(input: { 
    imageUrl: "https://res.cloudinary.com/your-cloud/image/upload/v1234/snake.jpg"
  }) {
    id
    species {
      name
      scientificName
      venomous
    }
    confidence
    dangerAssessment
    alternativeMatches {
      species {
        name
        scientificName
      }
      confidence
    }
  }
}
```

---

## 🏗️ Architecture

### Provider Pattern

SnakeSOS uses a **provider abstraction** that allows switching between AI backends:

```
┌─────────────────────────────────────┐
│   Snake Identification Resolver     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  SnakeIdentificationProvider        │
│  (Interface)                        │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┬──────────────┬──────────────────┐
       ▼                ▼              ▼                  ▼
┌─────────────┐  ┌────────────┐  ┌──────────┐  ┌─────────────────┐
│  Gemini     │  │ Python ML  │  │  Google  │  │   Stub/Fallback │
│  Provider   │  │ Provider   │  │  Cloud   │  │   Provider      │
└─────────────┘  └────────────┘  └──────────┘  └─────────────────┘
```

### Provider Selection Priority

1. **Explicit** - `AI_PROVIDER` environment variable
2. **Python ML** - If `PYTHON_ML_SERVICE_URL` is set
3. **Gemini** - If `GEMINI_API_KEY` is set
4. **Google Cloud Vision** - If credentials exist
5. **Stub** - Fallback for development

### Gemini Components

```
libs/backend/modules/src/ai/infrastructure/gemini/
├── gemini.config.ts          # Configuration loading & validation
├── gemini.types.ts            # TypeScript response schemas
├── gemini.client.ts           # API communication & prompt
├── gemini.provider.ts         # Provider implementation
├── index.ts                   # Public exports
├── gemini.config.spec.ts      # Config tests
├── gemini.provider.spec.ts    # Provider tests
```

---

## 🔒 Security Best Practices

### ⚠️ CRITICAL SECURITY RULES

1. **NEVER** expose `GEMINI_API_KEY` in frontend code
2. **NEVER** use `NEXT_PUBLIC_*` prefix for Gemini API key
3. **NEVER** commit real API keys to Git
4. **ALWAYS** keep the key server-side only

### API Key Rotation

If your API key is compromised:

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Delete** the exposed key
3. **Create** a new key
4. Update `.env` with new key
5. Restart your backend server

### Environment Variable Protection

```bash
# ✅ CORRECT - Server-side only
GEMINI_API_KEY=AIza...actual_key

# ❌ WRONG - Would expose to browser
NEXT_PUBLIC_GEMINI_API_KEY=AIza...actual_key  # DON'T DO THIS!
```

### Rate Limiting

The system includes built-in rate limiting:

- **20 requests per 15 minutes** per IP address
- Tracks authenticated users separately
- Configurable via environment variables:

```bash
SNAKE_ID_RATE_LIMIT_MAX=20
SNAKE_ID_RATE_LIMIT_WINDOW_MS=900000
```

To disable in development (not recommended):
```bash
SKIP_RATE_LIMIT=true
```

---

## 📋 Configuration Reference

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | Yes | - | Google Gemini API key from AI Studio |
| `GEMINI_MODEL` | No | `gemini-1.5-flash` | Gemini model version |
| `AI_PROVIDER` | No | Auto-detect | Explicit provider selection |
| `SNAKE_ID_RATE_LIMIT_MAX` | No | `20` | Max requests per window |
| `SNAKE_ID_RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit window (15 min) |
| `SKIP_RATE_LIMIT` | No | `false` | Disable rate limiting (dev only) |

### Provider Selection

```bash
# Use Gemini explicitly
AI_PROVIDER=GEMINI

# Use Python ML explicitly
AI_PROVIDER=PYTHON_ML

# Use Google Cloud Vision explicitly
AI_PROVIDER=GOOGLE_CLOUD_VISION

# Auto-detect (default)
# AI_PROVIDER not set
```

### Gemini Model Options

```bash
# Fast, cost-effective (recommended)
GEMINI_MODEL=gemini-1.5-flash

# More accurate, higher cost
GEMINI_MODEL=gemini-1.5-pro

# Latest experimental
GEMINI_MODEL=gemini-2.0-flash-exp
```

---

## 🧪 Testing

### Run Unit Tests

```bash
# Test Gemini provider
npm test -- gemini.provider.spec.ts

# Test configuration
npm test -- gemini.config.spec.ts

# Test rate limiting
npm test -- rate-limit.helper.spec.ts

# Run all AI tests
npm test -- --testPathPattern=ai/infrastructure
```

### Manual Testing

1. **Valid snake image**:
   ```bash
   curl -X POST http://localhost:4000/graphql \
     -H "Content-Type: application/json" \
     -d '{
       "query": "mutation { identifySnake(input: { imageUrl: \"https://example.com/krait.jpg\" }) { species { name venomous } confidence dangerAssessment } }"
     }'
   ```

2. **Non-snake image**:
   Should return `is_snake: false`

3. **Blurry image**:
   Should return lower confidence and appropriate safety warnings

4. **Rate limit test**:
   Make 21 requests rapidly - 21st should be blocked

---

## 🚨 Troubleshooting

### "Gemini is not configured" Error

**Cause**: Missing or invalid `GEMINI_API_KEY`

**Solution**:
1. Check `.env` file has `GEMINI_API_KEY=your_actual_key`
2. Verify key is not the placeholder `your_gemini_api_key_here`
3. Restart backend server after updating `.env`

### "API timeout" or "Failed to fetch image"

**Cause**: Network issues or invalid image URL

**Solution**:
1. Verify image URL is accessible via HTTPS
2. Check image is hosted on a public domain (e.g., Cloudinary)
3. Increase timeout in `gemini.config.ts` if needed

### Rate Limit Exceeded

**Cause**: Too many identification requests

**Solution**:
1. Wait 15 minutes for rate limit to reset
2. Adjust limits in `.env` if legitimate usage
3. Check for frontend bugs causing excessive requests

### Wrong Provider Being Used

**Cause**: Provider selection priority

**Solution**:
1. Set explicit provider: `AI_PROVIDER=GEMINI`
2. Check provider logs during startup
3. Verify other provider env vars aren't set

### "Invalid response format" Error

**Cause**: Gemini returned unexpected JSON structure

**Solution**:
1. Check Gemini API status
2. Review error logs for actual response
3. Update `gemini.types.ts` if schema changed

---

## 📊 Monitoring & Observability

### Logs to Monitor

```typescript
// Provider selection
console.log('🔮 Using Google Gemini Vision AI for snake identification');

// Rate limiting
console.warn('Snake identification rate limit exceeded', { ip, path });

// Identification results
console.log('🐍 [DEBUG] Gemini raw response:', response);
console.log('🐍 [DEBUG] Transformed provider result:', result);
```

### Key Metrics

Monitor these in production:

- **Identification requests per hour**
- **Average confidence scores**
- **Rate limit hit rate**
- **API error rate**
- **Average response time**
- **Cost per 1000 requests**

### Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| `INVALID_IMAGE` | Missing or invalid URL | Validate image before submitting |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait or increase limits |
| `GEMINI_API_ERROR` | Gemini service issue | Check API status, retry |
| `VALIDATION_ERROR` | Response schema mismatch | Check Gemini response logs |

---

## 💰 Cost Considerations

### Gemini Pricing (as of 2024)

- **gemini-1.5-flash**: ~$0.001 per request (very affordable)
- **gemini-1.5-pro**: ~$0.005 per request

### Cost Optimization

1. **Use Flash model** - 5x cheaper than Pro, sufficient for most cases
2. **Rate limiting** - Prevents abuse and unexpected bills
3. **Image optimization** - Resize large images before sending
4. **Caching** - Cache results for identical images (future enhancement)

### Example Costs

With default rate limits (20 req/15min per user):

- **100 users/day** × 20 requests = 2,000 requests
- **2,000** × $0.001 = **$2.00 per day**
- **Monthly**: ~$60

---

## 🔄 Migration Guide

### From Python ML to Gemini

1. Get Gemini API key
2. Update `.env`:
   ```bash
   AI_PROVIDER=GEMINI
   GEMINI_API_KEY=your_key
   ```
3. Restart backend
4. Test identification endpoint
5. Monitor accuracy compared to Python ML

### From Google Cloud Vision to Gemini

Benefits of switching:
- Better snake-specific reasoning
- Structured JSON output
- Lower latency
- Easier setup (no service account needed)

Steps:
1. Same as above
2. Can remove `GOOGLE_APPLICATION_CREDENTIALS`

### Hybrid Approach

Use both providers for comparison:

```typescript
// In resolver, call both providers
const geminiResult = await geminiProvider.identify(input);
const pythonResult = await pythonProvider.identify(input);

// Log for analysis
console.log('Provider comparison:', {
  gemini: geminiResult.candidates[0],
  python: pythonResult.candidates[0],
});

// Use whichever has higher confidence
return geminiResult.confidence > pythonResult.confidence 
  ? geminiResult 
  : pythonResult;
```

---

## 🔮 Future Enhancements

### Planned Features

1. **Fine-tuning** - Train Gemini on Nepal-specific snake dataset
2. **Caching** - Redis-based result caching for duplicate images
3. **Multi-image analysis** - Analyze multiple photos of same snake
4. **Confidence calibration** - Adjust thresholds based on production data
5. **User feedback loop** - Learn from expert corrections
6. **Geographic context** - Pass GPS coordinates for region-specific identification

### Phase 4: Custom + Gemini Hybrid

```
User uploads image
     ↓
Custom EfficientNet → Species candidates (fast, local)
     ↓
Gemini → Reasoning, safety context, confidence validation
     ↓
Combined result with visual evidence + safety guidance
```

---

## 📚 Additional Resources

- [Google AI Studio](https://aistudio.google.com/app/apikey)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Image Understanding Guide](https://ai.google.dev/gemini-api/docs/image-understanding)
- [Pricing Information](https://ai.google.dev/pricing)

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] Real Gemini API key configured (not placeholder)
- [ ] API key **NOT** exposed in frontend code
- [ ] API key **NOT** committed to Git
- [ ] Rate limiting enabled and tested
- [ ] Image validation middleware active
- [ ] Error handling tested (API failures, timeouts)
- [ ] Logs configured for monitoring
- [ ] Cost alerts set up in Google Cloud
- [ ] Unit tests passing
- [ ] Integration tests with real images passed
- [ ] Documented for team

---

## 🆘 Support

### Issues?

1. Check logs: `npm run dev:backend` and look for 🔮 emoji
2. Verify environment variables: `echo $GEMINI_API_KEY`
3. Test API key directly in [AI Studio](https://aistudio.google.com/)
4. Review error codes in troubleshooting section above

### Contact

- Project Lead: Paras Shrestha
- Repository: SnakeSOS
- Documentation: This file

---

**Built with ❤️ for snake safety in Nepal and beyond.**
