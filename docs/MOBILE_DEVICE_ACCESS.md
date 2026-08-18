# Mobile Device Access Setup Guide

**Date**: January 19, 2025  
**Purpose**: Access your local dev server from mobile devices on the same WiFi network

## Current Setup

- **Frontend**: Port `4200` (already configured for `0.0.0.0` ✅)
- **Backend**: Port `4000` (currently `localhost` only ❌)

## Problem

When you try to access from mobile:
- Frontend works: ✅ `http://YOUR_IP:4200` 
- Backend fails: ❌ Cannot connect to GraphQL at `http://YOUR_IP:4000/graphql`

**Cause**: Backend is bound to `localhost` which only accepts connections from the same machine.

## Solution

### Step 1: Find Your Computer's IP Address

**Windows:**
```cmd
ipconfig
```

Look for **IPv4 Address** under your active network (WiFi or Ethernet):
```
IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

Your IP will be something like: `192.168.1.x` or `192.168.0.x`

### Step 2: Set Backend to Accept External Connections

Create or update `apps/backend/.env.local`:

```env
# Allow backend to accept connections from any network interface
HOST=0.0.0.0
PORT=4000

# Your other env variables...
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
```

**Important**: `HOST=0.0.0.0` means "listen on all network interfaces" - this allows:
- `localhost:4000` (same machine)
- `192.168.1.100:4000` (other devices on same network)

### Step 3: Update CORS Origins

The backend needs to allow requests from your mobile device. In `apps/backend/.env.local`:

```env
# Add your computer's IP to CORS origins
CORS_ORIGINS=http://localhost:3000,http://localhost:4200,http://192.168.1.100:4200
```

Replace `192.168.1.100` with YOUR actual IP address from Step 1.

### Step 4: Update Frontend API URL (if needed)

If your frontend is hardcoded to `localhost:4000`, you need to make it dynamic.

Check `apps/frontend/.env.local`:

```env
# Use localhost when on same machine
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql

# Or use your computer's IP for mobile testing
# NEXT_PUBLIC_GRAPHQL_URL=http://192.168.1.100:4000/graphql
```

**Better approach** - Make it dynamic in `apps/frontend/src/lib/apollo/client.ts`:

```typescript
// Detect if we're running on localhost or remote
const getGraphQLUrl = () => {
  // If browser is accessing via IP, use same IP for backend
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:4000/graphql`;
    }
  }
  // Default to localhost
  return process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
};

const httpLink = new HttpLink({
  uri: getGraphQLUrl(),
  // ... rest of config
});
```

### Step 5: Restart Servers

1. **Stop both servers** (Ctrl+C)

2. **Restart backend**:
   ```bash
   yarn dev:backend
   ```
   
   You should see:
   ```
   🚀 Server ready at http://0.0.0.0:4000
   ```

3. **Restart frontend**:
   ```bash
   yarn dev:frontend
   ```

### Step 6: Access from Mobile

On your mobile device (must be on **same WiFi**):

1. **Open browser**
2. **Go to**: `http://192.168.1.100:4200`
   (Replace with YOUR IP from Step 1)

3. **Test login/signup**

## Troubleshooting

### Mobile can't connect at all

**Check:**
- ✅ Mobile and computer on same WiFi network
- ✅ Windows Firewall allows ports 4000 and 4200
- ✅ Backend shows `0.0.0.0` not `localhost`

**Fix Windows Firewall:**

```powershell
# Run PowerShell as Administrator
New-NetFirewallRule -DisplayName "Node Dev Server 4200" -Direction Inbound -LocalPort 4200 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Node Dev Server 4000" -Direction Inbound -LocalPort 4000 -Protocol TCP -Action Allow
```

### Frontend loads but login fails

**Check:**
- ✅ CORS origins includes your IP
- ✅ Frontend is using correct backend URL
- ✅ Backend logs show requests from mobile IP

**Check backend logs for:**
```
CORS configuration
origins: ["http://localhost:3000","http://192.168.1.100:4200"]
```

### "Network request failed"

This means frontend can't reach backend.

**Fix:** Update frontend to use `http://YOUR_IP:4000/graphql` instead of `http://localhost:4000/graphql`

### CORS errors

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:** Add your IP to `CORS_ORIGINS` in backend `.env.local`

## Testing Checklist

- [ ] Find your computer's IP address
- [ ] Create `apps/backend/.env.local` with `HOST=0.0.0.0`
- [ ] Add IP to `CORS_ORIGINS`
- [ ] Restart both servers
- [ ] Check backend logs show `0.0.0.0:4000`
- [ ] Configure Windows Firewall (if needed)
- [ ] Mobile can load `http://YOUR_IP:4200`
- [ ] Mobile can login/signup successfully
- [ ] Check backend logs show requests from mobile IP

## Files to Create/Modify

### Create: `apps/backend/.env.local`
```env
HOST=0.0.0.0
PORT=4000
DATABASE_URL=your_database_url_here
CORS_ORIGINS=http://localhost:3000,http://localhost:4200,http://192.168.1.100:4200
```

### Modify (optional): `apps/frontend/src/lib/apollo/client.ts`
Add dynamic URL detection for mobile access.

## Security Notes

⚠️ **Development Only**: `HOST=0.0.0.0` is for local development. In production:
- Use proper domain names
- Enable HTTPS
- Restrict CORS to specific origins
- Use environment-specific configs

## Quick Command Reference

```bash
# Find your IP (Windows)
ipconfig

# Find your IP (Mac/Linux)
ifconfig | grep "inet "

# Allow ports in Windows Firewall (as Administrator)
netsh advfirewall firewall add rule name="Dev Port 4200" dir=in action=allow protocol=TCP localport=4200
netsh advfirewall firewall add rule name="Dev Port 4000" dir=in action=allow protocol=TCP localport=4000

# Check if backend is listening on all interfaces
netstat -an | findstr :4000

# Should show:
# TCP    0.0.0.0:4000    LISTENING
# (not TCP    127.0.0.1:4000)
```

## Alternative: Use ngrok (Internet Access)

If same WiFi isn't working, use ngrok to create public URLs:

```bash
# Install ngrok
npm install -g ngrok

# Expose backend
ngrok http 4000

# Expose frontend
ngrok http 4200
```

Ngrok gives you public URLs like `https://abc123.ngrok.io` that work from anywhere.

## Related Documentation

- `apps/backend/src/config/index.ts` - Backend configuration
- `apps/frontend/project.json` - Frontend server config
- `apps/frontend/src/lib/apollo/client.ts` - GraphQL client config
