# Gemini Migration Guide: gemini-2.5-flash → gemini-3.6-flash

**Migration Date:** September 8, 2026  
**Status:** ✅ Complete  
**Impact:** Snake identification API endpoint

---

## 🔍 Root Cause

The SnakeSOS snake identification feature was failing with a 404 error:

```
[GoogleGenerativeAI Error]: models/gemini-2.5-flash is not found for API version v1beta
```

**Why?** Google deprecated and shut down `gemini-2.5-flash` on June 1, 2026. The error message explicitly recommended migrating to `gemini-3.6-flash`.

---

## ✅ What Was Fixed

### 1. **Model Migration**
- ❌ Old: `gemini-2.5-flash` (deprecated, returns 404)
- ✅ New: `gemini-3.6-flash` (current stable model)

### 2. **Structured JSON Output Implementation**
**Before:** Manual JSON parsing with fragile markdown stripping
```typescript
// Old approach - fragile and error-prone
let cleanJson = responseText.trim();
if (cleanJson.startsWith('```json')) {
  cleanJson = cleanJson.slice(7);
}
parsed = JSON.parse(cleanJson.trim());
```

**After:** Native Gemini structured output with schema validation
```typescript
// New approach - structured and validated
const model = genAI.getGenerativeModel({
  model: 'gemini-3.6-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: GEMINI_RESPONSE_SCHEMA, // Enforced by Gemini
  },
});

// Validate with Zod
const validation = GeminiSnakeIdentificationSchema.safeParse(parsed);
```

### 3. **Comprehensive Error Handling**
Added proper HTTP status codes and error messages:

| Error Code | HTTP Status | User Message |
|-----------|-------------|--------------|
| `AI_RATE_LIMITED` | 429 | "Too many requests. Please wait..." |
| `INVALID_IMAGE` | 400 | "Please upload a valid image file." |
| `INVALID_IMAGE_TYPE` | 400 | "Invalid file type. Use JPEG, PNG, or WebP." |
| `IMAGE_TOO_LARGE` | 413 | "File too large. Maximum: 10MB" |
| `AI_INVALID_RESPONSE` | 422 | "AI returned invalid response. Try again." |
| `AI_PROVIDER_TIMEOUT` | 504 | "AI took too long to respond. Try again." |
| `AI_PROVIDER_RATE_LIMITED` | 429 | "High demand. Try again in a few minutes." |
| `AI_PROVIDER_ERROR` | 502 | "AI service error. Contact support." |
| `SNAKE_IDENTIFICATION_FAILED` | 500 | "Failed to identify. Try clearer image." |

### 4. **Rate Limiting**
Implemented in-memory rate limiter:
- Default: 20 requests per 15 minutes per IP
- Configurable via environment variables
- Can be disabled in development with `SKIP_RATE_LIMIT=true`

### 5. **Request Timeout**
- Default: 30 seconds
- Configurable via `GEMINI_TIMEOUT_MS`
- Prevents hanging requests

### 6. **Enhanced Frontend UX**
- Specific error messages for each error type
- Display AI safety guidance from structured response
- Show medical warnings in highlighted box
- Display visual features detected by AI
- Show AI reasoning summary
- Handle `insufficient_image` and `not_a_snake` states

---

## 📝 Files Changed

### Core Implementation
1. **`apps/frontend/src/app/api/identify-snake/route.ts`**
   - Migrated to `gemini-3.6-flash`
   - Added structured JSON output with `responseSchema`
   - Implemented comprehensive error handling
   - Added rate limiting and timeout
   - Improved logging with request IDs

2. **`apps/frontend/src/lib/gemini/snake-identification-schema.ts`** *(NEW)*
   - Zod schema for validation
   - Type-safe response parsing
   - Ensures data integrity

3. **`apps/frontend/src/lib/gemini/prompts.ts`** *(NEW)*
   - Expert wildlife analysis prompt
   - Detailed safety guidelines
   - Conservative venomous classification
   - Geographic context support

4. **`apps/frontend/src/app/(public)/identify/page.tsx`**
   - Updated to handle new API response format
   - Error code mapping to user-friendly messages
   - Display safety messages, medical warnings
   - Show visual features and AI reasoning

### Configuration
5. **`.env`**
   - `GEMINI_MODEL=gemini-3.6-flash`
   - Added `GEMINI_TIMEOUT_MS=30000`

6. **`.env.example`**
   - Updated default model to `gemini-3.6-flash`

### Backend Fallbacks
7. **`libs/backend/modules/src/ai/infrastructure/gemini/gemini.config.ts`**
   - Default model: `gemini-3.6-flash`

8. **`libs/backend/modules/src/ai/infrastructure/graphql/snake-identification.resolver.ts`**
   - Fallback model: `gemini-3.6-flash`

9. **`libs/backend/modules/src/ai/README.md`**
   - Documentation updated

---

## 🧪 Testing Checklist

### ✅ Completed Verification
- [x] No `gemini-2.5-flash` references in active code
- [x] No `gemini-1.5-flash` references in active code
- [x] Model defaults to `gemini-3.6-flash`
- [x] Structured JSON output implemented
- [x] Zod schema validation added
- [x] Comprehensive error handling
- [x] Rate limiting implemented
- [x] Request timeout configured
- [x] Frontend error messages updated
- [x] Backend fallbacks updated
- [x] Documentation updated

### 🔄 Manual Testing Required
- [ ] Upload valid snake image → should identify
- [ ] Upload non-snake image → should return "not_a_snake"
- [ ] Upload blurry image → should return "insufficient_image"
- [ ] Upload invalid file type → should return 400 error
- [ ] Upload oversized image → should return 413 error
- [ ] Exceed rate limit → should return 429 error
- [ ] Test with actual Gemini API key
- [ ] Verify Cloudinary upload works
- [ ] Check safety messages display correctly
- [ ] Verify medical warnings appear when present

---

## 🚀 Deployment Steps

### Local Development
1. Update `.env` with your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-3.6-flash
   ```

2. Restart the development server:
   ```bash
   npm run dev
   ```

3. Test the identification endpoint:
   - Navigate to `/identify`
   - Upload a snake image
   - Verify identification works

### Vercel Production Deployment

1. **Update Environment Variables**
   Go to Vercel Project Settings → Environment Variables:
   
   - `GEMINI_API_KEY` = `your_actual_gemini_api_key_here` ⚠️ **KEEP SECURE**
   - `GEMINI_MODEL` = `gemini-3.6-flash` ⚠️ **UPDATE THIS**
   - `GEMINI_TIMEOUT_MS` = `30000` (optional)

2. **Deploy**
   ```bash
   git push origin main
   ```
   
   Or trigger manual deployment in Vercel dashboard.

3. **Verify**
   - Test on production URL: `https://snakesos.vercel.app/identify`
   - Check browser console for any errors
   - Verify snake identification returns results

---

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://cloudinary.com/...",
    "is_snake": true,
    "image_quality": "good",
    "identification_status": "identified",
    "species": {
      "name": "Common Krait",
      "scientificName": "Bungarus caeruleus",
      "venomous": true,
      "venomousStatus": "venomous"
    },
    "confidence": 0.87,
    "visualFeatures": [
      "Blue-black body coloration",
      "White crossbands",
      "Smooth glossy scales"
    ],
    "alternativeMatches": [...],
    "geographicContext": {...},
    "safety": {
      "riskLevel": "high",
      "handlingAdvice": "Do not approach...",
      "publicSafetyMessage": "Extremely dangerous..."
    },
    "medicalWarning": "If bitten, seek emergency care...",
    "reasoning": "Identification based on distinctive..."
  },
  "meta": {
    "model": "gemini-3.6-flash",
    "processing_time_ms": 2341,
    "request_id": "abc123"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "AI_INVALID_RESPONSE",
    "message": "AI returned invalid response. Please try again."
  },
  "meta": {
    "request_id": "xyz789",
    "processing_time_ms": 1523
  }
}
```

---

## 🔐 Security Considerations

✅ **Implemented:**
- API key never exposed in frontend code
- Server-side only Gemini calls
- Rate limiting to prevent abuse
- Request timeout to prevent hanging
- Input validation (file type, size)
- Zod schema validation on responses

⚠️ **Important:**
- The Gemini API key in `.env` should be rotated if exposed
- Never commit real API keys to Git
- Use environment variables for all secrets
- Monitor rate limits in production

---

## 📚 Additional Resources

- [Gemini Model Documentation](https://ai.google.dev/gemini-api/docs/models)
- [Gemini API Reference](https://ai.google.dev/api)
- [Get Gemini API Key](https://aistudio.google.com/app/apikey)
- [Gemini Structured Output Guide](https://ai.google.dev/gemini-api/docs/json-mode)

---

## 🎯 Key Takeaways

1. **Model Lifecycle Management**: Always check Google's model status and deprecation schedule
2. **Structured Outputs**: Use native JSON schema validation instead of manual parsing
3. **Error Handling**: Provide specific, user-friendly error messages
4. **Rate Limiting**: Protect against abuse and control costs
5. **Safety First**: Conservative snake identification with clear medical warnings

---

## ✉️ Support

If you encounter issues:
1. Check Vercel logs for server-side errors
2. Check browser console for client-side errors
3. Verify `GEMINI_API_KEY` is valid at [Google AI Studio](https://aistudio.google.com/app/apikey)
4. Confirm `GEMINI_MODEL=gemini-3.6-flash` in Vercel environment variables
5. Test with a different image (clear, well-lit, close-up of snake)

---

**Migration completed successfully! 🎉**
