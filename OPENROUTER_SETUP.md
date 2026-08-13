# OpenRouter NVIDIA Nemotron Setup Guide

## ✅ Connection Verified!

Your OpenRouter API key is working. You have access to **13 NVIDIA Nemotron models**, including several with **1M token context windows** that are **completely free**.

## 🎯 Recommended Free Models for Coding

### Best for Long Coding Sessions (1M Context)
- **`nvidia/nemotron-3-ultra-550b-a55b:free`**
  - 550B MoE model
  - 1M token context window
  - Free ($0 input/output)
  - Best for: Complex codebases, long agent workflows

- **`nvidia/nemotron-3.5-lightning:free`**
  - 1M token context window  
  - Free ($0 input/output)
  - Best for: Fast iterations, quick coding tasks

### Other Capable Free Models
- **`nvidia/nemotron-3-super-120b-a12b:free`** - 262K context
- **`nvidia/nemotron-3-nano-30b-a3b:free`** - 256K context

---

## 🔧 Integration Options

### Option 1: Use with VS Code Extensions

#### **Continue** (Recommended)
1. Install Continue extension from VS Code marketplace
2. Open Continue settings (Ctrl+Shift+P → "Continue: Open config.json")
3. Add this configuration:

```json
{
  "models": [
    {
      "title": "Nemotron Ultra 1M",
      "provider": "openai",
      "model": "nvidia/nemotron-3-ultra-550b-a55b:free",
      "apiBase": "https://openrouter.ai/api/v1",
      "apiKey": "YOUR_OPENROUTER_KEY"
    }
  ]
}
```

#### **Cline** (formerly Claude Dev)
1. Install Cline extension
2. Settings → API Provider → "OpenRouter"
3. Configure:
   - API Key: `YOUR_OPENROUTER_KEY`
   - Model: `nvidia/nemotron-3-ultra-550b-a55b:free`

#### **Cursor**
1. Settings → Models → Custom Models
2. Add:
   - Provider: OpenAI Compatible
   - Base URL: `https://openrouter.ai/api/v1`
   - API Key: `YOUR_OPENROUTER_KEY`
   - Model: `nvidia/nemotron-3-ultra-550b-a55b:free`

---

### Option 2: Use in Your Snake Rescue Project

I've created helper utilities for integrating OpenRouter into your backend/frontend.

#### Backend Integration (NestJS)

See `libs/ai-client/` for the OpenRouter client module.

```typescript
import { OpenRouterService } from '@snake-rescue/ai-client';

// Generate code suggestions
const response = await openRouterService.complete({
  model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
  messages: [
    { role: 'system', content: 'You are a helpful coding assistant.' },
    { role: 'user', content: 'Generate a TypeScript function for...' }
  ]
});
```

#### Frontend Integration (Next.js)

API route available at `/api/ai/complete` for client-side AI features.

---

### Option 3: Direct API Usage

#### Node.js/TypeScript
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    messages: [
      { role: 'user', content: 'Your prompt here' }
    ]
  })
});
```

#### Python
```python
import os
import requests

response = requests.post(
    'https://openrouter.ai/api/v1/chat/completions',
    headers={
        'Authorization': f'Bearer {os.environ["OPENROUTER_API_KEY"]}',
        'Content-Type': 'application/json'
    },
    json={
        'model': 'nvidia/nemotron-3-ultra-550b-a55b:free',
        'messages': [
            {'role': 'user', 'content': 'Your prompt here'}
        ]
    }
)
```

---

## 🔐 Security Best Practices

### ⚠️ NEVER commit your API key to version control!

Add to `.env` (already added to `.gitignore`):
```bash
OPENROUTER_API_KEY=your_key_here
```

For production:
- Use environment variables
- Rotate keys regularly
- Use per-project keys if possible
- Monitor usage on OpenRouter dashboard

---

## 📊 Model Comparison

| Model | Context | Cost | Best For |
|-------|---------|------|----------|
| **Nemotron 3 Ultra (free)** | 1M | Free | Complex codebases, long sessions |
| **Nemotron 3.5 Lightning (free)** | 1M | Free | Fast iterations |
| **Nemotron 3 Super (free)** | 262K | Free | Balanced performance |
| Nemotron 3 Ultra (batch) | 512K | $0.0000003/1M in | Batch processing |

---

## 🚀 Quick Start Commands

### Test Connection
```bash
node test-openrouter.js
```

### List All Available Models
```bash
node -e "fetch('https://openrouter.ai/api/v1/models', {headers: {'Authorization': 'Bearer YOUR_KEY'}}).then(r=>r.json()).then(d=>console.log(JSON.stringify(d,null,2)))"
```

---

## 📚 Additional Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [NVIDIA Nemotron Overview](https://developer.nvidia.com/nemotron)
- [OpenRouter Dashboard](https://openrouter.ai/dashboard) - Monitor usage and credits

---

## 🐛 Troubleshooting

### 401 Unauthorized
- Verify your API key is correct
- Check if key was revoked
- Regenerate a new key if exposed

### 404 Model Not Found
- Use exact model ID from the list above
- Check model availability in your OpenRouter account

### Rate Limits
- Free tier has rate limits
- Check OpenRouter dashboard for quota
- Consider upgrading if hitting limits frequently

### Large Context Issues
- 1M context models may have higher latency
- Start with smaller prompts and scale up
- Use chunking for extremely large inputs

---

## 💡 Pro Tips

1. **Use the :free versions** - They have 1M context and $0 cost
2. **Leverage the huge context** - Send entire files or multiple files at once
3. **Batch similar requests** - Use the batch models for cost savings
4. **Monitor your usage** - Check OpenRouter dashboard regularly
5. **Test locally first** - Use `test-openrouter.js` before integrating

---

## Next Steps

1. ✅ Connection tested successfully
2. 📝 Choose your integration method above
3. 🔧 Set up environment variables
4. 🚀 Start coding with 1M token context!
