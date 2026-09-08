# SnakeSOS AI Module

Production-ready snake identification system with pluggable AI providers.

## 🎯 Overview

This module provides snake image identification using multiple AI providers:

- **Gemini** - Google's multimodal AI (production-ready, no training needed)
- **Python ML** - Custom trained model (species-specific for Nepal)
- **Google Cloud Vision** - Enterprise vision AI
- **Stub** - Development fallback

## 🏗️ Architecture

```
Application Layer
├── snake-identification.service.ts    # Business logic
└── Provider abstraction

Infrastructure Layer
├── gemini/                            # Google Gemini provider
│   ├── gemini.provider.ts
│   ├── gemini.client.ts
│   ├── gemini.config.ts
│   └── gemini.types.ts
├── python-ml.provider.ts              # Custom Python ML
├── google-cloud-vision.provider.ts    # Google Cloud Vision
├── vision-ai.provider.ts              # Stub fallback
├── provider.types.ts                  # Common interfaces
└── graphql/
    ├── snake-identification.resolver.ts
    └── rate-limit.helper.ts
```

## 🚀 Quick Start

### Using Gemini (Recommended)

```bash
# .env
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-3.6-flash
AI_PROVIDER=GEMINI
```

### Using Python ML

```bash
# .env
PYTHON_ML_SERVICE_URL=https://your-model-url.com
PYTHON_ML_API_KEY=your_api_key
AI_PROVIDER=PYTHON_ML
```

### Auto-Detection

If `AI_PROVIDER` is not set, the system auto-detects based on available configuration:

1. Python ML (if `PYTHON_ML_SERVICE_URL` exists)
2. Gemini (if `GEMINI_API_KEY` exists)
3. Google Cloud Vision (if credentials exist)
4. Stub (fallback)

## 📋 Provider Interface

All providers implement `SnakeIdentificationProvider`:

```typescript
interface SnakeIdentificationProvider {
  identify(
    input: SnakeIdentificationInput
  ): Promise<SnakeIdentificationProviderResult>;
}

interface SnakeIdentificationInput {
  imageUrl: string;
  imagePublicId?: string;
  mimeType?: string;
  fileSizeBytes?: number;
}

interface SnakeIdentificationProviderResult {
  candidates: SnakeIdentificationCandidate[];
  isSnakeDetected: boolean;
  imageQuality: {
    score: number;
    sufficient: boolean;
    reasons: string[];
  };
}
```

## 🔌 Adding a New Provider

1. **Create provider class**:

```typescript
// my-provider.ts
export class MySnakeIdentificationProvider 
  implements SnakeIdentificationProvider {
  
  async identify(input: SnakeIdentificationInput) {
    // Call your AI service
    const result = await myAI.classify(input.imageUrl);
    
    // Transform to standard format
    return {
      candidates: [...],
      isSnakeDetected: true,
      imageQuality: { ... }
    };
  }
}
```

2. **Update provider selection**:

```typescript
// snake-identification.resolver.ts
const getProvider = () => {
  if (process.env.MY_AI_ENABLED) {
    return new MySnakeIdentificationProvider();
  }
  // ... existing providers
};
```

3. **Add tests**:

```typescript
// my-provider.spec.ts
describe('MySnakeIdentificationProvider', () => {
  it('should identify snake', async () => {
    // Test implementation
  });
});
```

## 🧪 Testing

```bash
# Run all AI tests
npm test -- --testPathPattern=ai

# Test specific provider
npm test -- gemini.provider.spec.ts
npm test -- python-ml.provider.spec.ts

# Test rate limiting
npm test -- rate-limit.helper.spec.ts
```

## 🔒 Security

### Rate Limiting

Built-in rate limiting prevents abuse:

- **20 requests per 15 minutes** per IP/user
- Configurable via environment variables
- Tracks authenticated users separately

```typescript
// Automatically applied in resolver
checkSnakeIdentificationRateLimit(context);
```

### API Key Protection

- Keys stored in environment variables only
- Never exposed to frontend
- Validated on startup
- Rotatable without code changes

### Image Validation

See `apps/backend/src/middleware/image-upload-validation.middleware.ts`:

- MIME type validation
- File signature verification (magic bytes)
- Size limits (10MB)
- Suspicious pattern detection

## 📊 Response Format

All providers return standardized format:

```typescript
{
  candidates: [
    {
      commonName: "Common Krait",
      scientificName: "Bungarus caeruleus",
      confidence: 0.91,
      observations: [
        "Dark body coloration",
        "Distinctive banding pattern",
        "Body/head morphology"
      ]
    }
  ],
  isSnakeDetected: true,
  imageQuality: {
    score: 0.85,
    sufficient: true,
    reasons: [
      "Image quality is sufficient for analysis",
      "Species identified with high confidence"
    ]
  }
}
```

## 🎯 Confidence Levels

The service classifies confidence into levels:

| Confidence | Level | Meaning |
|------------|-------|---------|
| ≥ 0.85 | HIGH_CONFIDENCE | Strong identification |
| 0.65 - 0.84 | MEDIUM_CONFIDENCE | Probable match |
| 0.40 - 0.64 | LOW_CONFIDENCE | Uncertain |
| < 0.40 | UNCERTAIN | Poor confidence |

## 🛡️ Safety Levels

Computed based on venomous status and confidence:

| Level | Meaning |
|-------|---------|
| HIGH_RISK | Venomous or potentially dangerous |
| CAUTION | Unknown or uncertain |
| LOW_RISK | Non-venomous with high confidence |
| UNKNOWN | Cannot determine |

## 🔄 Provider Comparison

| Feature | Gemini | Python ML | Google Cloud Vision |
|---------|--------|-----------|---------------------|
| Setup time | 5 minutes | Complex | Moderate |
| Cost | $0.001/request | Infrastructure | $1.50/1K images |
| Training | Not needed | Required | Not needed |
| Accuracy | High (general) | Very high (Nepal) | Moderate |
| Latency | Low (~1-2s) | Very low (<500ms) | Moderate (~2-3s) |
| Species-specific | No | Yes | No |
| Safety reasoning | Yes | Basic | No |

## 📈 Performance

### Optimization Tips

1. **Image optimization** - Resize before sending
2. **Caching** - Cache results for duplicate images
3. **Parallel calls** - Run multiple providers simultaneously
4. **Lazy loading** - Load providers on first use

### Monitoring

```typescript
// Provider selection logged on startup
console.log('🔮 Using Google Gemini Vision AI');

// Request timing
console.log('Response time:', responseTime, 'ms');

// Confidence distribution
console.log('Confidence:', confidence, 'Level:', confidenceLevel);
```

## 🚨 Error Handling

Providers handle errors gracefully:

```typescript
try {
  const result = await provider.identify(input);
} catch (error) {
  // Logs error, returns fallback result
  return {
    candidates: [{
      commonName: 'Unknown Snake Species',
      scientificName: 'Unknown',
      confidence: 0.01,
      observations: ['AI service unavailable']
    }],
    isSnakeDetected: false,
    imageQuality: { score: 0.1, sufficient: false, reasons: ['Service error'] }
  };
}
```

## 📚 Documentation

- **Gemini Setup**: See `/GEMINI_SNAKE_IDENTIFICATION_GUIDE.md`
- **Quick Reference**: See `/docs/GEMINI_QUICK_REFERENCE.md`
- **API Docs**: GraphQL schema in `/libs/contracts/`

## 🤝 Contributing

### Adding Features

1. Implement in provider class
2. Add unit tests
3. Update resolver if needed
4. Document changes

### Code Style

- Use TypeScript strict mode
- Follow existing patterns
- Add JSDoc comments
- Write tests first (TDD)

## 🔮 Roadmap

- [ ] Fine-tuned Gemini for Nepal snakes
- [ ] Redis-based rate limiting (multi-server)
- [ ] Result caching layer
- [ ] Multi-image analysis
- [ ] Confidence calibration
- [ ] User feedback integration
- [ ] A/B testing framework
- [ ] Provider health monitoring

---

**Questions?** See main project README or contact maintainers.
