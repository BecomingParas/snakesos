# 🔍 Debug Chat Component

## The Chat You're Seeing

The chat interface showing "Sorry, something went wrong" is the **SnakeSOS AI chatbot** that appears on all public pages (floating button bottom-right).

## Why It's Not Working Yet

You're seeing the **old version** from before the fix. The new code is:
- ✅ Committed to GitHub
- ✅ Pushed successfully  
- ⏳ **Needs Vercel to finish deploying**

## Check Deployment Status

### Step 1: Check Vercel Dashboard
Go to: https://vercel.com/becomingparas/snakesos

Look for the deployment with commit:
```
"Fix chatbot - use API routes instead of GraphQL"
```

**Status should be**:
- ⏳ Building... (wait)
- ⏳ Deploying... (wait)
- ✅ Ready (test now!)

### Step 2: Once "Ready", Test Locally First

```bash
cd c:/Users/paras/OneDrive/Desktop/snake-rescue
yarn dev
```

Then:
1. Open http://localhost:3000
2. Click chatbot button (bottom right)
3. Send: "What should I do if I see a snake?"
4. **Should work locally!** ✅

### Step 3: Clear Cache and Test Production

After Vercel shows "Ready":

1. **Hard refresh** your browser:
   - Windows: `Ctrl + Shift + R`
   - Or: Clear cache in DevTools

2. **Go to**: https://snakesos.vercel.app

3. **Click**: Chatbot button (bottom right)

4. **Send**: A test message

5. **Should work!** ✅

## Debug If Still Not Working

### Check Browser Console

1. Press `F12` to open DevTools
2. Go to **Console** tab
3. Click chatbot and send a message
4. Look for errors (red text)

**Common errors:**

**Error: `Failed to fetch`**
- Cause: Network issue or API route not deployed
- Fix: Check Vercel deployment completed

**Error: `404 Not Found: /api/chat`**
- Cause: API route file not deployed yet
- Fix: Wait for Vercel deployment, then hard refresh

**Error: `500 Internal Server Error`**
- Cause: Server-side error in chat API
- Fix: Check Vercel function logs (see below)

### Check Network Tab

1. Press `F12` → **Network** tab
2. Click chatbot and send message
3. Look for `/api/chat` request
4. Click on it to see:
   - **Status**: Should be `200 OK`
   - **Response**: Should have `{success: true, data: {...}}`

### Check Vercel Function Logs

1. Go to: https://vercel.com/becomingparas/snakesos
2. Click latest deployment
3. Click **"Functions"** tab
4. Look for `/api/chat` function
5. Check logs for errors

## Test the API Directly

### Test with curl (works immediately):

```bash
# Replace with your actual domain
curl https://snakesos.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, test message!"}'
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "response": "AI response here...",
    "conversationId": "abc123"
  },
  "meta": {
    "model": "gemini-1.5-flash",
    "processing_time_ms": 1234,
    "request_id": "xyz789"
  }
}
```

**If you get error:**
```json
{
  "success": false,
  "error": {
    "code": "AI_SERVICE_NOT_CONFIGURED",
    "message": "AI service not configured"
  }
}
```

This means `GEMINI_API_KEY` is not set in Vercel. Check environment variables!

## Environment Variables Check

Go to: **Vercel Dashboard → Settings → Environment Variables**

**Must have these:**

| Variable | Value | Environment |
|----------|-------|-------------|
| `GEMINI_API_KEY` | `AQ.Ab8...` (your actual key) | Production, Preview |
| `GEMINI_MODEL` | `gemini-1.5-flash` | Production, Preview |

If missing, add them and **redeploy**!

## Timeline

### Normal deployment:
```
Commit → Push → Vercel detects → Build (2-3 min) → Deploy → Ready
```

### Your deployment:
```
✅ Commit: Done (dc53b9c / 2123fe6)
✅ Push: Done
⏳ Vercel: Check dashboard
⏳ Build: Wait 2-3 minutes
⏳ Deploy: Wait
⏳ Ready: Test!
```

## Quick Checklist

Before testing:
- [ ] Vercel deployment shows "Ready"
- [ ] Hard refresh browser (`Ctrl + Shift + R`)
- [ ] Check `GEMINI_API_KEY` exists in Vercel
- [ ] Check `GEMINI_MODEL` = `gemini-1.5-flash`
- [ ] Clear browser cache if needed

## Still Not Working?

### Try these in order:

1. **Wait longer** - Deployments take 2-5 minutes
2. **Hard refresh** - Clear browser cache
3. **Check console** - Look for JavaScript errors
4. **Test API** - Use curl command above
5. **Check logs** - Look at Vercel function logs
6. **Verify env vars** - Make sure they're set in Vercel

## Expected Behavior After Fix

### Before Fix (Current):
```
User types message
  → Chatbot tries GraphQL
    → Backend not running
      → Error: "Sorry, something went wrong"
```

### After Fix (Once Deployed):
```
User types message
  → Chatbot calls /api/chat
    → API calls Gemini
      → Returns AI response
        → User sees response! ✅
```

---

**Next Step**: Wait for Vercel deployment to show "Ready", then test!
