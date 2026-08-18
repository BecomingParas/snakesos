# � View Your App on Mobile - 3 EASY STEPS

## � Your IP Address: `192.168.1.65`
## 🎯 Mobile URL: `http://192.168.1.65:4200`

---

## Step 1: Run the Setup Script (ONE TIME ONLY)

1. **Right-click on the Windows Start button**
2. Click **"Windows PowerShell (Admin)"** or **"Terminal (Admin)"**
3. Copy and paste these commands:

```powershell
cd ~/OneDrive/Desktop/snake-rescue
Set-ExecutionPolicy Bypass -Scope Process -Force
.\setup-mobile-access.ps1
```

4. Press Enter and wait for it to finish
5. The script will show you your IP address and URL

---

## Step 2: Manually Edit ONE File (Just in Case)

Open this file: **`apps/frontend/project.json`**

Find this section:
```json
"serve": {
  "executor": "@nx/next:server",
  "options": {
    "buildTarget": "frontend:build",
    "dev": true,
    "port": 4200
  }
```

Add this line: `"hostname": "0.0.0.0",` like this:

```json
"serve": {
  "executor": "@nx/next:server",
  "options": {
    "buildTarget": "frontend:build",
    "dev": true,
    "port": 4200,
    "hostname": "0.0.0.0"
  }
```

Save the file!

---

## Step 3: Start Your Server

In your regular terminal (not admin):

```bash
npm run dev
```

---

## Step 4: Open on Mobile

1. **Make sure your phone is on the SAME Wi-Fi** as your computer
2. Open any browser on your phone
3. Type this URL: **`http://192.168.1.65:4200`**
4. Done! 🎉

---

## 💡 Important Notes

- ✅ Both devices MUST be on the **same Wi-Fi network**
- ✅ Keep `npm run dev` running on your computer
- ✅ If it doesn't work, restart the dev server
- ⚠️ If your IP changes, you'll need to update the URL

---

## ❌ Troubleshooting

### "Can't connect from mobile"

1. Double-check both devices are on **same Wi-Fi**
2. Make sure dev server is **running** on your computer
3. Try opening `http://localhost:4200` on your computer first
4. Restart the dev server: Stop it (Ctrl+C) and run `npm run dev` again

### "How do I know if the script worked?"

The script will:
- ✅ Show "Setup Complete!" in green
- ✅ Display your IP address
- ✅ Create a file called `MOBILE_ACCESS_INFO.txt`

### "Need to run the script again?"

No problem! Just run it again. It's safe to run multiple times.

---

## 🎯 Quick Copy-Paste

**Your Mobile URL:** (Copy this!)
```
http://192.168.1.65:4200
```

**If IP changed, run this to find new IP:**
```cmd
ipconfig
```
(Look for "IPv4 Address" under Wi-Fi)

---

## 🧹 Cleanup (When Done Testing)

Run this to remove firewall rules:
```powershell
.\cleanup-mobile-access.ps1
```

---

**That's it! Super simple! 🚀**

---

## 📞 Still Having Issues?

Check these common problems:

1. **Firewall blocking**: The setup script should fix this, but if not:
   - Windows Security → Firewall & network protection → Allow an app through firewall
   - Make sure ports 4200 and 4000 are allowed

2. **Router AP Isolation**: Some routers block device-to-device communication
   - Check your router settings (usually found at 192.168.1.1)
   - Look for "AP Isolation" or "Client Isolation" and disable it

3. **Wrong IP**: Your IP might have changed
   - Run `ipconfig` again
   - Update the URL with the new IP

4. **Port already in use**: 
   - Close any other apps using ports 4200 or 4000
   - Restart your computer if needed
