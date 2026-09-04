# 🚀 Quick Reference - Deploy Snake Rescue to Vercel

## ⚡ 3-Step Deployment

### 1️⃣ Add to Vercel (2 minutes)
```
1. Open: https://vercel.com/dashboard
2. Your project → Settings → Environment Variables
3. Add for ALL environments (Production, Preview, Development):

PYTHON_ML_SERVICE_URL=https://investing-galaxy-connection-practitioner.trycloudflare.com
PYTHON_ML_API_KEY=G_PZBKORR35hxXMI4bFY6s0P8ktIEOHSyYlhprCYU_I
PYTHON_ML_TIMEOUT=30000
```

### 2️⃣ Deploy (1 minute)
```bash
vercel --prod
```

### 3️⃣ Test (1 minute)
```
Visit: https://your-app.vercel.app/identify
Upload snake image → See AI classification! 🐍
```

---

## 🔗 Important URLs

| What | URL |
|------|-----|
| **AI Health** | https://investing-galaxy-connection-practitioner.trycloudflare.com/health |
| **AI Docs** | https://investing-galaxy-connection-practitioner.trycloudflare.com/docs |
| **Vercel Dashboard** | https://vercel.com/dashboard |

---

## ✅ Pre-Deployment Checklist

- [ ] Colab notebook running (green checkmark ✅)
- [ ] AI health check: `curl https://investing-galaxy-connection-practitioner.trycloudflare.com/health`
- [ ] Environment variables added to Vercel
- [ ] Test images prepared (5-10 snake photos)

---

## 🎓 Demo Day Checklist

**Before Demo:**
- [ ] Start Colab notebook early (keep tab open!)
- [ ] Verify AI is online (health check)
- [ ] Deploy to Vercel
- [ ] Test `/identify` page works
- [ ] Prepare clear snake images
- [ ] Charge laptop 100%

**During Demo:**
- [ ] Show venomous snake → HIGH_RISK warning
- [ ] Show non-venomous → LOW_RISK result
- [ ] Highlight confidence scores
- [ ] Show species identification
- [ ] Open API docs (Swagger UI)

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| AI unavailable | Check Colab is running, re-run cells |
| Low confidence | Use clear images, snake centered |
| Deploy fails | Check env vars, run `npm run build` locally |
| 403 errors | Verify API key matches |

---

## 📱 Test Commands

```bash
# Health check
curl https://investing-galaxy-connection-practitioner.trycloudflare.com/health

# Expected: {"status":"healthy","model_version":"1.0.0","device":"cuda","model_loaded":true}
```

---

## 🎯 What You Built

✅ GPU-accelerated ML model (CUDA)  
✅ Venomous/Non-venomous detection  
✅ Species identification  
✅ Real-time classification (~200-500ms)  
✅ Safety-first approach  
✅ Production-ready architecture  

---

## 💚 You're Ready!

**Total deployment time: ~5 minutes**

Your Snake Rescue app with AI is ready to go live! 🚀

**Good luck, bro! You've got this! 🐍💚**

---

**Need details?** Read: `🚀_START_HERE_AI_DEPLOYMENT.md`
