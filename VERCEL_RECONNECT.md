# 🔗 How to Connect Vercel to Correct GitHub Repo

## Problem
Your Vercel project `snakesos` is connected to the wrong GitHub repo, so pushes don't trigger deployments.

## Solution: Reconnect Vercel to GitHub

### Step 1: Go to Vercel Project Settings
1. Open https://vercel.com/dashboard
2. Click on your project: **snakesos** (or whatever it's called)
3. Click **Settings** tab at the top
4. Click **Git** in the left sidebar

### Step 2: Check Current Connection
You'll see:
```
Connected Repository: github.com/BecomingParas/XXXXX
Production Branch: main
```

**If `XXXXX` is NOT `snakesos`**, you need to reconnect!

### Step 3: Disconnect Current Repo
1. Scroll down to "Git Repository"
2. Click **"Disconnect"** button
3. Confirm the disconnection

### Step 4: Reconnect Correct Repo
1. After disconnecting, you'll see **"Connect Git Repository"** button
2. Click it
3. Select **GitHub** as provider
4. Find and select: **BecomingParas/snakesos**
5. Select branch: **main**
6. Click **"Connect"**

### Step 5: Verify Connection
1. Go back to **Settings → Git**
2. Should now show:
   ```
   Connected Repository: github.com/BecomingParas/snakesos
   Production Branch: main
   ```

### Step 6: Test Auto-Deploy
1. Make a small change in your code
2. Commit and push to GitHub
3. Check Vercel dashboard - should auto-deploy!

---

## Alternative: Create New Vercel Project

If reconnecting doesn't work, create a fresh project:

### Step 1: Delete Old Project (Optional)
1. Go to **Settings → Advanced**
2. Scroll to bottom
3. Click **"Delete Project"**
4. Type project name to confirm

### Step 2: Import from GitHub
1. Go to https://vercel.com/new
2. Click **"Import Project"**
3. Select **GitHub**
4. Find **BecomingParas/snakesos**
5. Click **"Import"**

### Step 3: Configure Build
Vercel will auto-detect `vercel.json` settings. Just verify:
- ✅ Framework: Next.js
- ✅ Root Directory: `./`
- ✅ Build Command: (from vercel.json)
- ✅ Output Directory: (from vercel.json)

### Step 4: Add Environment Variables
1. Don't deploy yet!
2. Click **"Environment Variables"** tab
3. Paste contents from `.env.production` file
4. Click **"Add"**

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 3-5 minutes
3. Test your app!

---

## How to Check Which Repo is Connected

Run this in your terminal:
```bash
cd /c/Users/paras/OneDrive/Desktop/snake-rescue
git remote -v
```

Output should be:
```
origin  https://github.com/BecomingParas/snakesos.git (fetch)
origin  https://github.com/BecomingParas/snakesos.git (push)
```

Then check Vercel Settings → Git matches this repo.

---

## Troubleshooting

### Issue: "Cannot connect repository"
**Solution:** Make sure you granted Vercel access to your GitHub repos in GitHub settings

### Issue: "Repository already connected to another project"
**Solution:** 
1. Find the other Vercel project
2. Disconnect it from the repo
3. Then connect to your current project

### Issue: Multiple Vercel projects, confused
**Solution:**
1. List all your Vercel projects
2. Delete unused ones
3. Keep only the one you want (with production URL)

---

## Quick Commands

### Check your Git remote:
```bash
git remote -v
```

### Check recent commits:
```bash
git log --oneline -5
```

### Force push (if needed):
```bash
git push origin main --force
```

---

**Once connected, every Git push will automatically trigger a Vercel deployment!** 🚀
