# 🚀 Production Deployment Guide

## Current Build Status

✅ **TypeScript Compilation**: Complete - all code compiles without errors
✅ **Development Mode**: Fully functional - `yarn dev:frontend` works perfectly
⚠️ **Static Export Build**: Not compatible with Apollo Client in layouts

## Why Static Export Fails

The dashboard pages use Apollo Client hooks in their layout component. Apollo Client requires:
- React context (not available during build-time SSG)
- Browser APIs (not available in Node.js build environment)
- Runtime initialization (can't happen at build time)

Next.js 16 with Turbopack attempts to pre-render ALL pages during build, even with `export const dynamic = 'force-dynamic'`. This creates an incompatibility with Apollo Client.

## ✅ RECOMMENDED: Node.js Server Deployment

Next.js is designed to run as a Node.js server for dynamic applications. This is the standard approach for apps with authentication and real-time data.

### Build and Run

```bash
# Navigate to frontend directory
cd apps/frontend

# Build the production bundle
npx next build

# Start the production server
npx next start -p 4200
```

### Using PM2 (Process Manager)

For production environments, use PM2 to manage the Node.js process:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
cd apps/frontend
pm2 start npm --name "snake-rescue-frontend" -- start

# View logs
pm2 logs snake-rescue-frontend

# Stop the application
pm2 stop snake-rescue-frontend

# Restart the application
pm2 restart snake-rescue-frontend

# Set to start on system boot
pm2 startup
pm2 save
```

### Docker Deployment

Create `Dockerfile` in `apps/frontend`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy application files
COPY . .

# Build the application
RUN npx next build

# Expose port
EXPOSE 4200

# Start the server
CMD ["npx", "next", "start", "-p", "4200"]
```

Build and run:

```bash
docker build -t snake-rescue-frontend .
docker run -p 4200:4200 snake-rescue-frontend
```

## Deployment Platforms

### 1. Vercel (Recommended for Next.js)

Vercel automatically handles Next.js server deployment:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd apps/frontend
vercel
```

### 2. Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway up
```

### 3. Render

1. Connect your GitHub repository
2. Set build command: `cd apps/frontend && npx next build`
3. Set start command: `cd apps/frontend && npx next start -p 4200`

### 4. AWS/DigitalOcean/Other VPS

Use PM2 with nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4200;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

Ensure these are set in production:

```bash
# Backend API
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_GRAPHQL_URL=https://api.your-domain.com/graphql
NEXT_PUBLIC_AUTH_URL=https://api.your-domain.com/api/auth

# Frontend
NEXT_PUBLIC_FRONTEND_URL=https://your-domain.com

# Environment
NODE_ENV=production
```

## Alternative: Separate Static and Dynamic Apps

If you need static hosting for public pages:

### Option A: Two Deployments
- **Static site** (Netlify/Cloudflare Pages): Public pages only (/, /about, /identify, /gallery)
- **Node.js app** (Vercel/Railway): Dashboard with authentication

### Option B: Downgrade to Next.js 14

Next.js 14 had better control over SSG before Turbopack became default:

```bash
# In package.json, change next version
"next": "14.2.18"

# Reinstall
yarn install

# Try building again
yarn build:frontend
```

## Quick Reference Commands

```bash
# Development (Always Works)
yarn dev:frontend

# Production Build
cd apps/frontend
npx next build

# Production Server
npx next start -p 4200

# With PM2
pm2 start npm --name "frontend" -- start

# Check if build succeeded
ls -la .next

# Test production build locally
npx next start -p 4200
# Then open http://localhost:4200
```

## Testing Production Build Locally

```bash
# Terminal 1: Start backend
yarn dev:backend

# Terminal 2: Build and start frontend
cd apps/frontend
npx next build
npx next start -p 4200

# Open browser
# http://localhost:4200
```

## Troubleshooting

### "Cannot read properties of null"
- This is the SSG error
- Solution: Don't use static export, use Node.js server mode

### "Address already in use"
- Another process is using port 4200
- Solution: `npx kill-port 4200` or change port with `-p 3000`

### Build succeeds but app doesn't work
- Check environment variables
- Ensure backend is running
- Check browser console for errors

## Performance Optimization

Once deployed as a Node.js server, you can still optimize:

1. **Enable ISR** (Incremental Static Regeneration) for public pages
2. **Add caching headers** for static assets
3. **Use CDN** for static files
4. **Enable compression** in production

## Summary

✅ **Best Practice**: Deploy as Node.js server (Vercel, Railway, Render, etc.)
✅ **Fallback**: Use PM2 + nginx on VPS
⚠️ **Avoid**: Static export for apps with authentication

The application is **production-ready** for Node.js deployment!

---

**Need Help?**
- Development mode: `yarn dev:frontend` (always works)
- Production build: `cd apps/frontend && npx next build && npx next start`
- Check logs: Look for TypeScript errors first, then runtime errors
