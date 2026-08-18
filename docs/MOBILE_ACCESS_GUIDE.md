# Mobile Access Guide - View Localhost on Mobile Device

This guide will help you access the Snake Rescue application from your mobile device while developing locally.

## Your Network Information

- **Computer IP Address:** `192.168.1.65`
- **Frontend Port:** `4200`
- **Backend Port:** `4000`

## Step-by-Step Setup

### 1. Configure Next.js to Accept External Connections

Edit `apps/frontend/project.json` and add `"hostname": "0.0.0.0"`:

```json
{
  "targets": {
    "serve": {
      "executor": "@nx/next:server",
      "options": {
        "buildTarget": "frontend:build",
        "dev": true,
        "port": 4200,
        "hostname": "0.0.0.0"    ← ADD THIS
      }
    }
  }
}
```

### 2. Configure Windows Firewall

**Option A: Using Command Prompt (Quick)**

Run as Administrator:

```cmd
netsh advfirewall firewall add rule name="Next.js Dev Server" dir=in action=allow protocol=TCP localport=4200

netsh advfirewall firewall add rule name="Backend GraphQL Server" dir=in action=allow protocol=TCP localport=4000
```

**Option B: Using GUI**

1. Open **Windows Defender Firewall with Advanced Security**
2. Click **Inbound Rules** → **New Rule**
3. Select **Port** → Next
4. Choose **TCP** and enter port **4200** → Next
5. Select **Allow the connection** → Next
6. Check all profiles (Domain, Private, Public) → Next
7. Name it "Next.js Dev Server" → Finish
8. Repeat for port **4000** (Backend)

### 3. Update Environment Variables (Optional but Recommended)

Create `apps/frontend/.env.mobile` for mobile development:

```env
# Mobile Development Configuration
NEXT_PUBLIC_API_URL=http://192.168.1.65:4000
NEXT_PUBLIC_GRAPHQL_URL=http://192.168.1.65:4000/graphql
NEXT_PUBLIC_AUTH_URL=http://192.168.1.65:4000/api/auth
NEXT_PUBLIC_FRONTEND_URL=http://192.168.1.65:4200
```

**To use mobile config:**
```bash
# Copy mobile config over local config temporarily
cp apps/frontend/.env.mobile apps/frontend/.env.local
```

**To switch back to localhost:**
```bash
# Restore localhost config
git checkout apps/frontend/.env.local
```

### 4. Start Development Servers

```bash
npm run dev
```

This starts both frontend (port 4200) and backend (port 4000).

### 5. Access from Mobile Device

1. **Connect mobile to the same Wi-Fi network** (must be on the same network as your computer)
2. Open browser on mobile
3. Navigate to: **`http://192.168.1.65:4200`**

## URLs Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `http://192.168.1.65:4200` | Main application UI |
| Backend API | `http://192.168.1.65:4000` | GraphQL API endpoint |
| GraphQL Endpoint | `http://192.168.1.65:4000/graphql` | Direct GraphQL access |

## Troubleshooting

### ❌ Can't Access from Mobile

**Check 1: Same Network**
- Verify both devices are on the same Wi-Fi network
- Run `ipconfig` on your computer to confirm IP hasn't changed

**Check 2: Firewall**
```cmd
# Verify firewall rules exist
netsh advfirewall firewall show rule name="Next.js Dev Server"
netsh advfirewall firewall show rule name="Backend GraphQL Server"
```

**Check 3: Server Running**
- Ensure dev server is running on your computer
- Check it works locally first: `http://localhost:4200`

**Check 4: Router AP Isolation**
- Some routers have "AP Isolation" or "Client Isolation" enabled
- This blocks device-to-device communication on the same network
- Check your router settings and disable if enabled

### ❌ Frontend Loads but GraphQL Fails

Update the environment variables to use your IP address instead of localhost:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://192.168.1.65:4000/graphql
```

Then restart the dev server.

### ❌ IP Address Changed

Your IP might change if you disconnect/reconnect to Wi-Fi. Run `ipconfig` again and update:
1. The mobile URL you're accessing
2. The `.env.local` file if using IP-based config

### 🔍 Testing Connectivity

**From your mobile device:**
1. Install a network tool app (like "Fing" or "Network Analyzer")
2. Verify you can see your computer on the network
3. Try pinging `192.168.1.65`

**From your computer:**
```cmd
# Verify server is listening on all interfaces
netstat -an | findstr ":4200"
```

Should show `0.0.0.0:4200` or `[::]:4200` (not `127.0.0.1:4200`)

## QR Code Access (Bonus)

You can generate a QR code for easy mobile access:

1. Visit: https://www.qr-code-generator.com/
2. Enter: `http://192.168.1.65:4200`
3. Generate and scan from mobile

## Security Notes

⚠️ **These configurations expose your dev server to your local network:**

- Only devices on your Wi-Fi can access
- Don't use this configuration in production
- Disable firewall rules when done:

```cmd
netsh advfirewall firewall delete rule name="Next.js Dev Server"
netsh advfirewall firewall delete rule name="Backend GraphQL Server"
```

## Quick Reference Card

```
┌─────────────────────────────────────────┐
│   MOBILE ACCESS QUICK REFERENCE         │
├─────────────────────────────────────────┤
│ Computer IP:   192.168.1.65             │
│ Frontend:      http://192.168.1.65:4200 │
│ Backend:       http://192.168.1.65:4000 │
│                                          │
│ Requirements:                            │
│ ✓ Same Wi-Fi network                    │
│ ✓ Firewall ports 4200, 4000 open       │
│ ✓ hostname: "0.0.0.0" in project.json  │
└─────────────────────────────────────────┘
```

---

**Need Help?** Check the troubleshooting section above or verify each step carefully.
