# 🚀 Quick Start: Free AI Coding with OpenRouter

## ✅ You're All Set!

Your OpenRouter connection is working. You have **13 free NVIDIA Nemotron models** available.

---

## 🎯 Best Model for Coding

**Recommended:** `nvidia/nemotron-3-ultra-550b-a55b:free`
- 550B parameters (Mixture of Experts)
- **1 MILLION token context** (read entire codebases!)
- **100% FREE** ($0 input/output)
- Perfect for: Complex coding, long sessions, multi-file analysis

---

## 🔧 3 Ways to Use It

### 1️⃣ In VS Code (Easiest)

**With Continue Extension:**
```bash
# Install Continue from VS Code marketplace
# Then add to ~/.continue/config.json:
```

```json
{
  "models": [{
    "title": "Nemotron 1M",
    "provider": "openai",
    "model": "nvidia/nemotron-3-ultra-550b-a55b:free",
    "apiBase": "https://openrouter.ai/api/v1",
    "apiKey": "YOUR_KEY"
  }]
}
```

**With Cline Extension:**
- Install Cline
- Settings → OpenRouter
- Paste your key
- Select model: `nvidia/nemotron-3-ultra-550b-a55b:free`

---

### 2️⃣ In Your Terminal

**Quick test:**
```bash
node test-openrouter.js
```

**Interactive usage:**
```bash
node openrouter-client.ts
```

---

### 3️⃣ In Your Code

**TypeScript/JavaScript:**
```typescript
import { OpenRouterClient } from './openrouter-client';

const ai = new OpenRouterClient(process.env.OPENROUTER_API_KEY);

// Generate code
const code = await ai.generateCode(
  'Create a REST API endpoint for user authentication'
);

// Explain code
const explanation = await ai.explainCode(myComplexFunction);

// Review code
const review = await ai.reviewCode(myCode, 'TypeScript');

// Generate tests
const tests = await ai.generateTests(myFunction, 'Jest');
```

**Python:**
```python
import os
import requests

def ai_complete(prompt):
    return requests.post(
        'https://openrouter.ai/api/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {os.environ["OPENROUTER_API_KEY"]}',
            'Content-Type': 'application/json'
        },
        json={
            'model': 'nvidia/nemotron-3-ultra-550b-a55b:free',
            'messages': [{'role': 'user', 'content': prompt}]
        }
    ).json()
```

---

## 🔐 Secure Your Key

**Add to `.env` (NEVER commit this file!):**
```bash
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
OPENROUTER_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
```

**Load in code:**
```typescript
// Node.js
require('dotenv').config();
const apiKey = process.env.OPENROUTER_API_KEY;
```

---

## 💡 Power User Tips

### 1. Use the Full 1M Context
```typescript
// Send your ENTIRE codebase if needed!
const hugePrompt = `
Here are 50 files from my project:
${file1Content}
${file2Content}
... up to 1 million tokens!

Now help me refactor the authentication system.
`;
```

### 2. Compare Models
```bash
# Try different models for different tasks:

# Ultra (best for complex logic)
nvidia/nemotron-3-ultra-550b-a55b:free

# Lightning (fastest)
nvidia/nemotron-3.5-lightning:free

# Super (balanced)
nvidia/nemotron-3-super-120b-a12b:free
```

### 3. Stream Responses
```typescript
const response = await ai.complete({
  messages: [...],
  stream: true  // Get tokens as they're generated
});
```

---

## 📊 Free Model Comparison

| Model | Context | Speed | Best For |
|-------|---------|-------|----------|
| **Ultra** 🏆 | 1M | Medium | Complex reasoning, large codebases |
| **Lightning** ⚡ | 1M | Fast | Quick iterations, chat |
| **Super** 💪 | 262K | Medium | Balanced tasks |
| **Nano** 🐜 | 256K | Fast | Simple tasks, low latency |

---

## 🐛 Troubleshooting

**"401 Unauthorized"**
- Check your API key in `.env`
- Make sure you didn't commit the old exposed key

**"Model not found"**
- Use exact model ID: `nvidia/nemotron-3-ultra-550b-a55b:free`
- Check available models: `node test-openrouter.js`

**Slow responses**
- Normal for 1M context models
- Use Lightning model for faster responses
- Start with smaller prompts

**Rate limits**
- Free tier has limits
- Check dashboard: https://openrouter.ai/dashboard
- Spread out requests or upgrade if needed

---

## 🎓 Example Use Cases

### Code Generation
```typescript
const api = await ai.generateCode(
  'Create a GraphQL mutation for updating user profile',
  { language: 'TypeScript', context: 'Using NestJS and Prisma' }
);
```

### Code Review
```typescript
const review = await ai.reviewCode(myPullRequest, 'TypeScript');
console.log(review); // Get detailed feedback
```

### Debugging Help
```typescript
const solution = await ai.complete({
  messages: [
    { role: 'system', content: 'You are a debugging expert.' },
    { role: 'user', content: `I'm getting this error:\n${errorMessage}\n\nHere's my code:\n${code}` }
  ]
});
```

### Documentation
```typescript
const docs = await ai.complete({
  messages: [
    { role: 'user', content: `Generate API documentation for:\n${apiCode}` }
  ]
});
```

---

## 📚 Next Steps

1. ✅ **Test connection** → `node test-openrouter.js`
2. 🔐 **Secure your key** → Add to `.env`, add `.env` to `.gitignore`
3. 🎨 **Choose integration:**
   - VS Code extension (Continue/Cline)
   - Terminal client (`openrouter-client.ts`)
   - Custom integration in your app
4. 🚀 **Start coding** with 1M token context!

---

## 🔗 Resources

- **Full Setup Guide:** `OPENROUTER_SETUP.md`
- **TypeScript Client:** `openrouter-client.ts`
- **Test Script:** `test-openrouter.js`
- **OpenRouter Dashboard:** https://openrouter.ai/dashboard
- **API Docs:** https://openrouter.ai/docs

---

## ⚡ TL;DR

```bash
# 1. Add to .env
echo "OPENROUTER_API_KEY=your_key" >> .env

# 2. Test it
node test-openrouter.js

# 3. Use it in VS Code
# Install Continue/Cline → Configure with OpenRouter

# 4. Or use in code
import { OpenRouterClient } from './openrouter-client';
const ai = new OpenRouterClient();
const code = await ai.generateCode('your prompt');
```

**That's it! You now have free access to state-of-the-art AI with 1M token context. 🎉**
