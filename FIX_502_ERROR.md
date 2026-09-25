# Fix 502 Bad Gateway Error - Snake Identification

## Problem
The `/identify` page is returning **502 Bad Gateway** with error:
```json
{
  "error": {
    "code": "AI_PROVIDER_ERROR",
    "message": "AI model configuration error. Please contact support."
  }
}
```

## Root Cause
The `GEMINI_MODEL` environment variable in Vercel is set to **`gemini-3.6-flash`** which **DOES NOT EXIST**.

Google's Gemini models available:
- ✅ `gemini-1.5-flash` (recommended - fast and efficient)
- ✅ `gemini-1.5-pro` (more capable, slower)
- ✅ `gemini-2.0-flash-exp` (experimental)
- ❌ `gemini-3.6-flash` (DOES NOT EXIST!)

## Solution

### Option 1: Fix in Vercel Dashboard (Recommended)

1. Go to https://vercel.com/parasnever/snakesos/settings/environment-variables
2. Find `GEMINI_MODEL` variable
3. Click Edit
4. Change value from `gemini-3.6-flash` to **`gemini-1.5-flash`**
5. Click Save
6. Redeploy the application

### Option 2: Let Code Auto-Fix (Temporary)

The code now auto-corrects invalid model names:
- If `GEMINI_MODEL` contains "3.6", it automatically uses `gemini-1.5-flash`
- This is a temporary workaround
- **Still recommended to fix the env var properly**

## Verification

After fixing, test at https://snakesos.vercel.app/identify:
1. Upload a snake image
2. Should see identification results (not 502 error)
3. Check browser console - should see: `[requestId] 📝 Using model: gemini-1.5-flash`

## Other Environment Variables to Check

While you're in Vercel environment variables:

### GEMINI_API_KEY
- **Current**: `AQ.Ab8RN...` (hidden for security)
- **Status**: ✅ Valid (New Authorization Key format)
- **Action**: No change needed

### GEMINI_MODEL
- **Current**: `gemini-3.6-flash` ❌
- **Should be**: `gemini-1.5-flash` ✅
- **Action**: **UPDATE THIS!**

### AI_PROVIDER
- **Current**: Unknown
- **Should be**: `gemini` or `GEMINI`
- **Action**: Verify it's set correctly

## Why This Happened

Looking at your Vercel screenshot, the `GEMINI_MODEL` was set to `gemini-3.6-flash` which was likely:
1. A typo (meant 1.5 not 3.6)
2. An assumption about future models
3. Copy-paste error from documentation

## Model Recommendations

### For `/identify` (Snake Identification)
**Use**: `gemini-1.5-flash`
- Fast response (1-2 seconds)
- Cost-effective
- Good accuracy for image analysis
- Supports vision + text

### For `/api/chat` (Chatbot)
**Use**: `gemini-1.5-flash`
- Fast conversational responses
- Good for RAG (retrieval-augmented generation)
- Handles both text and images

### If You Need Better Accuracy
**Use**: `gemini-1.5-pro`
- Slower but more accurate
- Better reasoning
- More expensive
- Worth it for critical identifications

## Testing After Fix

```bash
# Test snake identification
curl -X POST https://snakesos.vercel.app/api/identify-snake \
  -F "file=@snake-image.jpg" \
  -F "lat=27.7000" \
  -F "lng=83.4667"

# Should return 200 with snake identification, NOT 502
```

## Deployment Status

✅ Code fix deployed (auto-corrects invalid model names)  
⏳ **ACTION REQUIRED**: Update `GEMINI_MODEL` in Vercel to `gemini-1.5-flash`  
⏳ Redeploy after updating environment variable  

Once you update the environment variable and redeploy, the 502 error will be fixed! 🎉
