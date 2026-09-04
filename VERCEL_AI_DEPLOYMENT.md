# 🚀 Deploy Snake Rescue to Vercel with AI Model

## ✅ Quick Start - Deploy in 5 Minutes

Your Snake Rescue app is ready to deploy to Vercel with the AI model integrated!

---

## 📋 Pre-Deployment Checklist

- [x] ✅ AI Model is running (Colab + Cloudflare tunnel)
- [x] ✅ Backend supports Python ML classifier
- [x] ✅ Environment variables configured
- [ ] 🔄 Vercel project connected
- [ ] 🔄 Environment variables added to Vercel
- [ ] 🔄 Deploy and test

---

## 🎯 Step 1: Connect to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Setup and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? (No if first time, Yes if updating)
# - What's the name? snake-rescue
# - In which directory is your code located? ./
# - Override settings? No (uses vercel.json)
```

### Option B: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Connect your GitHub/GitLab account
4. Select `snake-rescue` repository
5. Vercel will auto-detect Next.js configuration
6. Click **Deploy** (we'll add env vars after first deployment)

---

## 🔧 Step 2: Configure Environment Variables

### Go to Vercel Dashboard

1. Open your project: https://vercel.com/dashboard
2. Select your `snake-rescue` project
3. Click **Settings** → **Environment Variables**

### Add These Variables (All Environments)

Click **Add New** and select **Production, Preview, Development** for each:

#### **🐍 AI Model Configuration (CRITICAL)**

```bash
PYTHON_ML_SERVICE_URL=https://investing-galaxy-connection-practitioner.trycloudflare.com
PYTHON_ML_API_KEY=G_PZBKORR35hxXMI4bFY6s0P8ktIEOHSyYlhprCYU_I
PYTHON_ML_TIMEOUT=30000
```

#### **🗄️ Database (Neon PostgreSQL)**

Get from your Neon dashboard:

```bash
DATABASE_URL=postgresql://user:password@ep-xxx-pooler.us-east-2.aws.neon.tech/snake_rescue?sslmode=require
DIRECT_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/snake_rescue?sslmode=require
```

#### **🔐 Authentication & Security**

Generate secrets with: `openssl rand -base64 32`

```bash
BETTER_AUTH_URL=https://your-app.vercel.app/api/auth
CSRF_SECRET=<generate-random-32-chars>
JWT_SECRET=<generate-random-32-chars>
CORS_ORIGINS=https://your-app.vercel.app
```

#### **📧 Email (Brevo SMTP)**

```bash
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email
SMTP_PASSWORD=your-brevo-api-key
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=SnakeSOS Platform
```

#### **☁️ Cloudinary (Media Storage)**

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### **🗺️ Google Maps**

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

#### **💳 Stripe (Payments - Use Live Keys for Production)**

```bash
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PAYMENT_ACTIVE_PROVIDER=STRIPE
STRIPE_SUCCESS_URL=https://your-app.vercel.app/payment/success
STRIPE_CANCEL_URL=https://your-app.vercel.app/payment/cancelled
```

#### **🌐 Application URLs**

```bash
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_GRAPHQL_URL=https://your-app.vercel.app/api/graphql
NEXT_PUBLIC_AUTH_URL=https://your-app.vercel.app/api/auth
NODE_ENV=production
APP_NAME=SnakeSOS
```

---

## 🔄 Step 3: Redeploy

After adding environment variables:

### Via CLI:
```bash
vercel --prod
```

### Via Dashboard:
1. Go to **Deployments** tab
2. Click **⋯** on latest deployment
3. Click **Redeploy**
4. Check **Use existing Build Cache** (optional)
5. Click **Redeploy**

---

## ✅ Step 4: Verify Deployment

### 1. Check Deployment Logs

In Vercel Dashboard → **Deployments** → click your deployment → check for:

```
✓ Building...
✓ Running build command...
✓ Detected Next.js project
✓ Deploying...
✅ Deployment Ready
```

### 2. Test AI Integration

Visit your deployed app and test the AI classifier:

```
https://your-app.vercel.app/identify
```

Upload a snake image and verify:
- ✅ Image uploads successfully
- ✅ AI classification returns results
- ✅ Venomous/non-venomous detection works
- ✅ Confidence scores display correctly
- ✅ Safety warnings appear

### 3. Check Backend Logs

In Vercel Dashboard → **Deployments** → **Functions** tab → click any function → check logs for:

```
🐍 Using Python ML classification service for snake identification
```

If you see this, **your AI is connected!** 🎉

### 4. Test GraphQL API

Visit: `https://your-app.vercel.app/api/graphql`

Run this mutation:

```graphql
mutation TestAI {
  identifySnake(input: { 
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Indian_cobra_%28Naja_naja%29.jpg/800px-Indian_cobra_%28Naja_naja%29.jpg"
  }) {
    id
    confidence
    dangerAssessment
    venomousDetected
    species {
      name
      venomous
    }
    provider
    model
  }
}
```

Expected response:
```json
{
  "data": {
    "identifySnake": {
      "provider": "LOCAL",
      "model": "1.0.0",
      "confidence": 0.87,
      "dangerAssessment": "HIGH_RISK",
      "venomousDetected": true
    }
  }
}
```

---

## 🎓 Demo Day Checklist

Before your presentation:

### ✅ Pre-Demo Setup (Night Before)

- [ ] Start Google Colab notebook
- [ ] Verify Cloudflare tunnel is running
- [ ] Test AI model health: `curl https://investing-galaxy-connection-practitioner.trycloudflare.com/health`
- [ ] Verify Vercel deployment is live
- [ ] Test `/identify` page with multiple snake images
- [ ] Prepare 5-10 test images (venomous & non-venomous)
- [ ] Screenshot successful classifications
- [ ] Test on mobile device
- [ ] Charge laptop fully!

### ✅ During Demo

1. **Show the Architecture**
   - Frontend (Next.js on Vercel)
   - Backend (GraphQL API on Vercel)
   - AI Model (Python FastAPI on Colab + GPU)

2. **Live Demo Flow**
   - Open `/identify` page
   - Upload venomous snake (e.g., cobra)
   - Show HIGH_RISK warning
   - Show confidence score
   - Upload non-venomous snake
   - Show LOW_RISK result
   - Highlight species identification

3. **Show Technical Details**
   - Open Swagger docs: `https://investing-galaxy-connection-practitioner.trycloudflare.com/docs`
   - Show GPU acceleration (CUDA enabled)
   - Display API response JSON
   - Show GraphQL playground

4. **Highlight Safety Features**
   - Confidence threshold (0.60)
   - "Requires human verification" flag
   - Safety messages
   - Emergency contact integration

---

## 🚨 Troubleshooting

### Problem: "Failed to connect to Python ML service"

**Check:**
1. Is Colab notebook running?
2. Is Cloudflare tunnel active?
3. Test health endpoint manually
4. Check Vercel logs for error details

**Quick Fix:**
```bash
# Re-run all cells in Colab notebook
# Check tunnel URL hasn't changed
# Update PYTHON_ML_SERVICE_URL in Vercel if URL changed
```

### Problem: "Image not found" or "403 Forbidden"

**Check:**
1. Cloudinary images are publicly accessible
2. CORS is configured correctly
3. Image URLs are valid

**Fix:**
In Cloudinary dashboard → Settings → Security:
- Enable "Resource list" (for listing)
- Set "Delivery type" to "Public"

### Problem: Deployment fails with "Build Error"

**Common causes:**
1. Missing environment variables
2. TypeScript errors
3. Package dependency issues

**Fix:**
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run type-check

# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Problem: AI returns low confidence

**This is NORMAL!** The model uses a 0.60 threshold for safety.

**For demo:**
- Use clear, well-lit images
- Ensure snake is centered and visible
- Use high-resolution images
- Try multiple angles if confidence is low

---

## 📊 Monitoring Production

### Check AI Model Status

```bash
# Health check
curl https://investing-galaxy-connection-practitioner.trycloudflare.com/health

# Expected response:
{
  "status": "healthy",
  "model_loaded": true,
  "model_version": "1.0.0",
  "device": "cuda"
}
```

### Monitor Vercel Deployment

- **Dashboard:** https://vercel.com/dashboard
- **Analytics:** Check request counts, errors, response times
- **Logs:** Real-time function logs
- **Alerts:** Set up email notifications for errors

---

## 🎯 Post-Demo: Production Considerations

Your current setup (Colab + Cloudflare) is **perfect for demos**, but for real production:

### Option 1: Dedicated GPU Server ($20-50/month)
- **Vast.ai**, **RunPod**, or **Lambda Labs**
- Permanent, reliable, scalable
- Full control over infrastructure

### Option 2: Serverless GPU (Pay-per-use)
- **Replicate** (~$0.001-0.01 per inference)
- **Hugging Face Inference**
- **Banana.dev**
- No server management

### Option 3: Cloud Platform (Enterprise)
- **AWS SageMaker**
- **Google Cloud AI Platform**
- **Azure Machine Learning**
- Auto-scaling, high availability

**But for now:** Your Colab setup is **PERFECT** for your college project! 🎉

---

## 🎉 You're Ready!

Your Snake Rescue app is deployed with AI classification! 🐍🚀

**Test Everything:**
- ✅ Visit your app: https://your-app.vercel.app
- ✅ Test identify page: https://your-app.vercel.app/identify
- ✅ Check AI model: https://investing-galaxy-connection-practitioner.trycloudflare.com/docs

**Good luck with your presentation! You've built something incredible! 💚**

---

## 📞 Quick Reference

| Resource | URL |
|----------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| AI Model Docs | https://investing-galaxy-connection-practitioner.trycloudflare.com/docs |
| AI Model Health | https://investing-galaxy-connection-practitioner.trycloudflare.com/health |
| GraphQL Playground | https://your-app.vercel.app/api/graphql |
| Production App | https://your-app.vercel.app |
| Setup Guide | `SNAKE_AI_PRODUCTION_SETUP.md` |

---

**Need help during demo?** Keep this file open! 📖
