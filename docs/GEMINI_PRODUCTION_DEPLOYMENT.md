# Gemini Production Deployment Guide

Complete checklist for deploying Gemini snake identification to production.

## ✅ Pre-Deployment Checklist

### 1. API Key Setup

- [ ] Created production Gemini API key at [Google AI Studio](https://aistudio.google.com/app/apikey)
- [ ] API key stored in production environment variables (NOT in code)
- [ ] API key NOT exposed in any public repositories
- [ ] API key NOT in frontend environment variables
- [ ] Old/test keys deleted from Google AI Studio

### 2. Environment Configuration

```bash
# Production .env
GEMINI_API_KEY=your_production_key_here
GEMINI_MODEL=gemini-1.5-flash
AI_PROVIDER=GEMINI

# Rate limiting (adjust based on expected traffic)
SNAKE_ID_RATE_LIMIT_MAX=20
SNAKE_ID_RATE_LIMIT_WINDOW_MS=900000

# NEVER set SKIP_RATE_LIMIT=true in production
```

### 3. Security Verification

- [ ] API key not in `.env.example` or any committed files
- [ ] Rate limiting enabled and tested
- [ ] Image validation middleware active
- [ ] HTTPS enforced for all image URLs
- [ ] CORS properly configured
- [ ] Error messages don't expose internal details

### 4. Testing

- [ ] Unit tests passing: `npm test -- gemini`
- [ ] Integration test with real Gemini API
- [ ] Rate limit tested (21st request blocked)
- [ ] Error handling tested (network failures, timeouts)
- [ ] Invalid image URLs rejected
- [ ] Non-snake images handled correctly

## 🚀 Deployment Steps

### Step 1: Vercel/Cloud Platform Setup

#### For Vercel:

```bash
# Set environment variables
vercel env add GEMINI_API_KEY
vercel env add GEMINI_MODEL
vercel env add AI_PROVIDER

# Deploy
vercel --prod
```

#### For Other Platforms:

```bash
# Heroku
heroku config:set GEMINI_API_KEY=your_key
heroku config:set AI_PROVIDER=GEMINI

# AWS/Docker
# Add to environment configuration
```

### Step 2: Verify Deployment

```bash
# 1. Check logs for provider selection
curl https://your-api.com/health

# 2. Test identification endpoint
curl -X POST https://your-api.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { identifySnake(input: { imageUrl: \"https://example.com/test-snake.jpg\" }) { species { name } confidence } }"
  }'

# 3. Verify rate limiting
# Make 21 requests - last one should fail with 429
```

### Step 3: Monitoring Setup

Configure alerts for:

- **Error rate** - Alert if > 5% failures
- **Response time** - Alert if > 5 seconds
- **Rate limit hits** - Monitor for abuse
- **API costs** - Alert if daily cost exceeds budget

## 📊 Production Monitoring

### Key Metrics

```typescript
// Log these metrics
{
  provider: 'GEMINI',
  model: 'gemini-1.5-flash',
  requestId: uuid(),
  confidence: 0.91,
  responseTime: 1250, // ms
  imageQuality: 'good',
  species: 'Bungarus caeruleus',
  userId: 'user-123' || 'anonymous',
  timestamp: new Date().toISOString()
}
```

### Recommended Tools

- **Logging**: Datadog, New Relic, or CloudWatch
- **Uptime**: Pingdom, UptimeRobot
- **Errors**: Sentry
- **Costs**: Google Cloud Billing Alerts

### Cost Monitoring

Set up Google Cloud billing alerts:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Billing → Budgets & Alerts
3. Create budget for Gemini API
4. Set alerts at 50%, 75%, 90% of budget

Example daily budgets:
- **Small**: $5/day (5,000 requests)
- **Medium**: $20/day (20,000 requests)
- **Large**: $50/day (50,000 requests)

## 🚨 Incident Response

### API Key Compromised

**Immediate Actions:**
1. **Disable** old key in [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Create** new key
3. **Update** production environment variable
4. **Monitor** for unusual usage on old key
5. **Rotate** all other keys as precaution

### High Error Rate

**Diagnosis:**
```bash
# Check Gemini API status
curl https://generativelanguage.googleapis.com/v1beta/models \
  -H "X-Goog-Api-Key: $GEMINI_API_KEY"

# Check recent errors in logs
grep "Gemini API error" logs/production.log | tail -50

# Check response times
grep "responseTime" logs/production.log | awk '{print $NF}' | sort -n
```

**Common Causes:**
- Gemini API outage → Use fallback provider
- Rate limit exceeded → Increase limits or add Redis
- Invalid image URLs → Add upstream validation
- Network timeout → Increase timeout setting

### Unexpected Costs

**Investigation:**
```bash
# Check request volume
grep "identifySnake" logs/production.log | wc -l

# Check unique IPs
grep "identifySnake" logs/production.log | awk '{print $IP}' | sort | uniq -c | sort -nr

# Check for bot traffic
grep "User-Agent" logs/access.log | grep -i bot
```

**Mitigations:**
- Tighten rate limits
- Add CAPTCHA for anonymous users
- Block abusive IPs
- Require authentication

## 🔄 Rollback Plan

### If Gemini has issues:

```bash
# Option 1: Switch to Python ML
vercel env add AI_PROVIDER PYTHON_ML

# Option 2: Switch to Google Cloud Vision
vercel env add AI_PROVIDER GOOGLE_CLOUD_VISION

# Option 3: Disable AI temporarily
# Use stub provider (returns unknown)
vercel env rm AI_PROVIDER
```

### Database of Provider Configs

Keep this handy for quick switching:

```bash
# Gemini (default)
AI_PROVIDER=GEMINI
GEMINI_API_KEY=<key>
GEMINI_MODEL=gemini-1.5-flash

# Python ML (backup)
AI_PROVIDER=PYTHON_ML
PYTHON_ML_SERVICE_URL=<url>
PYTHON_ML_API_KEY=<key>

# Google Cloud Vision (emergency)
AI_PROVIDER=GOOGLE_CLOUD_VISION
GOOGLE_APPLICATION_CREDENTIALS=<path>
```

## 📈 Performance Optimization

### Image Optimization

Add upstream image resizing before sending to Gemini:

```typescript
// Resize images to max 1024x1024 to reduce cost and latency
const optimizedUrl = imageUrl.replace(
  '/upload/',
  '/upload/w_1024,h_1024,c_limit/'
);
```

### Caching Strategy

Implement Redis caching for duplicate images:

```typescript
// Pseudo-code
const cacheKey = `snake:${imageHash}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const result = await geminiProvider.identify(input);
await redis.setex(cacheKey, 3600, JSON.stringify(result));
return result;
```

### Multi-Region Deployment

For global scale:
- Deploy to multiple regions (US, EU, Asia)
- Route users to nearest region
- Replicate rate limit data (Redis)

## 🔐 Security Hardening

### Production-Only Settings

```bash
# Force HTTPS
NODE_ENV=production

# Strict CSP
HELMET_CSP_DIRECTIVES=...

# Disable debugging
DEBUG=false
LOG_LEVEL=error

# Enable all security features
SKIP_RATE_LIMIT=false
ENABLE_CSRF=true
```

### API Key Rotation Schedule

Rotate Gemini API keys:
- **Quarterly** - Regular rotation
- **Immediately** - If exposure suspected
- **After** - Employee offboarding
- **Before** - Major security audit

### Audit Log

Keep audit trail of:
- API key changes
- Rate limit adjustments
- Provider switches
- Error spikes
- Cost anomalies

## 📋 Maintenance Checklist

### Weekly

- [ ] Review error logs
- [ ] Check API costs vs budget
- [ ] Monitor response times
- [ ] Review rate limit hits

### Monthly

- [ ] Analyze identification accuracy
- [ ] Review user feedback
- [ ] Update confidence thresholds if needed
- [ ] Check for Gemini model updates

### Quarterly

- [ ] Rotate API keys
- [ ] Review and adjust rate limits
- [ ] Audit security configuration
- [ ] Performance optimization review
- [ ] Cost optimization analysis

## 🆘 Support Contacts

### Escalation Path

1. **Level 1** - Check logs and documentation
2. **Level 2** - Team lead review
3. **Level 3** - Google Cloud support (if Gemini API issue)

### Emergency Contacts

- **On-call engineer**: [Phone/Slack]
- **Project lead**: Paras Shrestha
- **Google Cloud Support**: [Account link]

## 📖 Additional Resources

- [Gemini API Status](https://status.cloud.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [AI Studio](https://aistudio.google.com/)
- [Gemini Pricing](https://ai.google.dev/pricing)

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Owner**: SnakeSOS Team
