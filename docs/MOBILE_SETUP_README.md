# 📱 Mobile Access Setup - Super Simple Guide

## What This Does
Lets you view your localhost website on your mobile phone while developing.

---

## 🚀 One-Command Setup

### Step 1: Run the Setup Script

**Right-click PowerShell** → **Run as Administrator**

Then run:
```powershell
cd ~/OneDrive/Desktop/snake-rescue
Set-ExecutionPolicy Bypass -Scope Process -Force
.\setup-mobile-access.ps1
```

That's it! The script does EVERYTHING automatically:
- ✅ Finds your computer's IP address
- ✅ Opens firewall ports
- ✅ Updates configuration files
- ✅ Creates mobile environment file

### Step 2: Start Your Server

```bash
npm run dev
```

### Step 3: Open on Mobile

The script will show you a URL like:
```
http://192.168.1.65:4200
```

**Copy that URL** and paste it in your mobile browser!

---

## ⚠️ Requirements

1. **Same Wi-Fi** - Your phone and computer must be on the same Wi-Fi network
2. **Dev Server Running** - Keep `npm run dev` running on your computer
3. **Administrator** - The setup script needs admin access (only once)

---

## 🔧 Manual Steps (If Script Doesn't Work)

### Option 1: Edit project.json manually

Open: `apps/frontend/project.json`

Find the `"serve"` section and add `"hostname": "0.0.0.0"`:

```json
"serve": {
  "executor": "@nx/next:server",
  "options": {
    "buildTarget": "frontend:build",
    "dev": true,
    "port": 4200,
    "hostname": "0.0.0.0"    ← ADD THIS LINE
  }
}
```

### Option 2: Open Firewall Manually

Run as Administrator:
```cmd
netsh advfirewall firewall add rule name="Next.js Dev Server" dir=in action=allow protocol=TCP localport=4200

netsh advfirewall firewall add rule name="Backend GraphQL Server" dir=in action=allow protocol=TCP localport=4000
```

### Option 3: Get Your IP Address

```cmd
ipconfig
```

Look for **"IPv4 Address"** under Wi-Fi adapter.

---

## 🧹 Cleanup (Remove Mobile Access)

When you're done testing on mobile:

```powershell
.\cleanup-mobile-access.ps1
```

---

## ❓ Troubleshooting

### "Can't access from mobile"

1. Check both devices are on **same Wi-Fi**
2. Make sure dev server is **running** (`npm run dev`)
3. Try restarting the dev server
4. Verify IP address hasn't changed (run `ipconfig` again)

### "Firewall script failed"

1. Make sure you ran PowerShell **as Administrator**
2. Try the manual firewall commands above
3. Or use Windows Firewall GUI:
   - Windows Security → Firewall → Advanced Settings
   - New Inbound Rule → Port → TCP → 4200

### "IP keeps changing"

Your router is assigning dynamic IPs. You can:
- Re-run the setup script when IP changes
- Or configure a static IP in your router settings

---

## 📝 Files Created

- `setup-mobile-access.ps1` - Automatic setup script
- `cleanup-mobile-access.ps1` - Cleanup script
- `apps/frontend/.env.mobile` - Mobile environment config
- `MOBILE_ACCESS_INFO.txt` - Your IP and URLs

---

## 🎯 Quick Reference

| What | Where |
|------|-------|
| Your Computer IP | Run `ipconfig` (look for IPv4 under Wi-Fi) |
| Frontend URL | `http://YOUR_IP:4200` |
| Backend URL | `http://YOUR_IP:4000` |
| Start Server | `npm run dev` |
| Same Wi-Fi? | ✅ Required |

---

**That's it! You should now be able to access your app from mobile! 🎉**
