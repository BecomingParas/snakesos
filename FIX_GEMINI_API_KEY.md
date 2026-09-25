# Fix Gemini API Key Issue - 502 Error Persists

## Current Problem

Even with correct model name (`gemini-1.5-flash`), still getting 502 error:
```json
{
  "code": "AI_PROVIDER_ERROR",
  "message": "AI model configuration error. Please contact support.",
  "meta": {
    "model": "gemini-1.5-flash"
  }
}
```

## Root Cause

The **GEMINI_API_KEY** is either:
1. **Invalid** - Not a valid Gemini API key
2. **Expired** - Key has been revoked or expired
3. **Wrong permissions** - Key doesn't have Gemini API access
4. **Rate limited** - Exceeded quota

## Solution: Get a Valid Gemini API Key

### Step 1: Go to Google AI Studio
Visit: https://aistudio.google.com/app/apikey

### Step 2: Create API Key
1. Click **"Get API Key"** or **"Create API Key"**
2. Select or create a Google Cloud project
3. Click **"Create API key in new project"** or use existing project
4. Copy the API key (starts with `AIza...`)

### Step 3: Enable Gemini API (if needed)
1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Click **"Enable"**
3. Wait for activation (~1 minute)

### Step 4: Update Vercel Environment Variable
1. Go to: https://vercel.com/parasnever/snakesos/settings/environment-variables
2. Find: `GEMINI_API_KEY`
3. Edit and paste your new API key
4. Save
5. **Redeploy** the application

## API Key Formats

### ✅ Valid Formats:
- `AIzaSy...` (40 characters) - **Standard API Key** (recommended)
- `AQ.` prefix - **Authorization Key** (newer format, works too)

### ❌ Invalid:
- Keys shorter than 30 characters
- Keys without `AIza` or `AQ.` prefix
- Empty or placeholder values

## Testing the New Key

### Test in Browser Console (Quick Check):
```javascript
fetch('https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY')
  .then(r => r.json())
  .then(console.log)
```

Should return a list of available models, not an error.

### Test with curl:
```bash
curl "https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY"
```

Expected response:
```json
{
  "models": [
    {
      "name": "models/gemini-1.5-flash",
      ...
    }
  ]
}
```

## Common Issues

### Issue 1: "API key not found"
**Solution**: Make sure you copied the full key, including all characters

### Issue 2: "API not enabled"
**Solution**: Enable Gemini API in Google Cloud Console (link above)

### Issue 3: "Permission denied"
**Solution**: 
1. Check Google Cloud project billing is enabled
2. Verify API is enabled for the project
3. Regenerate API key if old project

### Issue 4: "Quota exceeded"
**Solution**: 
1. Check quota at: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
2. Increase quota or wait for reset
3. Consider upgrading to paid tier

## Free Tier Limits

Google Gemini API Free Tier:
- **15 requests per minute** (RPM)
- **1 million tokens per day**
- **1,500 requests per day**

If you're hitting limits, consider:
1. Implementing better rate limiting
2. Upgrading to paid tier
3. Using caching for repeated queries

## Vercel Environment Variables to Update

### Required:
```
GEMINI_API_KEY=AIzaSy... (your new key)
GEMINI_MODEL=gemini-1.5-flash
```

### Optional (for better performance):
```
GEMINI_TIMEOUT_MS=30000
SKIP_RATE_LIMIT=false
SNAKE_ID_RATE_LIMIT_MAX=20
SNAKE_ID_RATE_LIMIT_WINDOW_MS=900000
```

## After Updating

1. ✅ Update `GEMINI_API_KEY` in Vercel
2. ✅ Verify `GEMINI_MODEL=gemini-1.5-flash`
3. ✅ **Save** changes
4. ✅ **Redeploy** (or wait for auto-deploy)
5. ✅ Test at https://snakesos.vercel.app/identify
6. ✅ Check Vercel logs for error details

## Debugging

Once deployed, check Vercel function logs:
1. Go to: https://vercel.com/parasnever/snakesos/logs
2. Filter by: `/api/identify-snake`
3. Look for: `🔧 ENV CHECK` log
4. Should show: `hasGeminiKey: true`, `geminiKeyLength: 39-40`

If you see errors like:
- `"API key not valid"` → Get new key
- `"models/gemini-1.5-flash is not found"` → Already fixed (model name)
- `"User location denied"` → Normal (not critical, just no hospital/rescuer data)

## Next Steps

1. **Get new Gemini API key** from Google AI Studio
2. **Update Vercel environment variable**
3. **Redeploy**
4. **Test snake identification**
5. **Monitor Vercel logs** for any errors

Once you update the API key, the 502 error should disappear and snake identification will work! 🐍✨
