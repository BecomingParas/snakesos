# Visual Verification Guide - AI Chatbot

## How to See the Chatbot NOW

### Step 1: Open Browser
Navigate to: **http://localhost:4200/login**

### Step 2: Login
Use these credentials:
- **Email**: `admin@snakerescue.com`
- **Password**: `password123`

### Step 3: Look for the Floating Button
After login, you'll land on the dashboard. Look at the **bottom-right corner** of your screen.

You should see:
- 🟢 **Green gradient circular button**
- ✨ **Sparkles icon** in the center
- 💫 **Subtle pulse animation** on hover
- Fixed position (always visible when scrolling)

### Step 4: Click the Button
Click the floating button to open the chatbot window.

---

## What You Should See

### On Desktop (Width > 768px)
- Chatbot slides in from bottom-right
- **Size**: 400px wide × 600px tall
- **Position**: Fixed, 24px from right and bottom edges
- **Style**: Glassmorphism with backdrop blur

### On Mobile (Width < 768px)
- Chatbot slides up from bottom
- **Size**: Full screen
- **Style**: Glassmorphism overlay

---

## Chatbot Interface Components

### 1. Header (Top)
```
┌─────────────────────────────────┐
│ 🤖 SnakeSOS AI • Admin          │
│                    [🗑️] [✕]     │
└─────────────────────────────────┘
```
- Shows "SnakeSOS AI"
- Displays your role (Public/Rescuer/Admin)
- Clear chat button (trash icon)
- Close button (X)

### 2. Welcome Screen (Initial State)
```
┌─────────────────────────────────┐
│  ✨ Welcome to SnakeSOS AI      │
│                                 │
│  I'm here to help with snake    │
│  rescue operations...           │
│                                 │
│  💊 Emergency Protocols         │
│  📊 View Dashboard Stats        │
│  👥 Manage Rescue Teams         │
└─────────────────────────────────┘
```
- Friendly welcome message
- Suggestion chips (click to send)
- Different suggestions based on your role

### 3. Message List (After Sending)
```
┌─────────────────────────────────┐
│ 👤  What are the emergency      │
│     protocols?                  │
│                                 │
│                                 │
│ ✨  Here are the key emergency  │
│     protocols for snake         │
│     rescues...                  │
└─────────────────────────────────┘
```
- User messages: right side, blue/purple gradient
- AI messages: left side, white/emerald gradient
- Avatars for each message
- Auto-scrolls to latest

### 4. Composer (Bottom)
```
┌─────────────────────────────────┐
│ [🖼️] [Type your message...]  [➤]│
│  Press Enter to send • Shift+...│
└─────────────────────────────────┘
```
- Image attachment button (left)
- Auto-resizing textarea
- Send button (right, green gradient)
- Hint text below

---

## Expected Behavior

### ✅ Interactions
1. **Click floating button** → Window opens
2. **Click suggestion chip** → Sends message automatically
3. **Type message + Enter** → Sends message
4. **Click image icon** → Opens file picker
5. **Select image** → Shows preview above input
6. **Click send** → Shows loading (3 animated dots)
7. **AI responds** → New message appears with animation
8. **Click close** → Window closes smoothly

### ✅ Visual Effects
- Smooth slide-in/out animations
- Message fade-ins with stagger effect
- Button hover scales (grows slightly)
- Loading dots pulse in sequence
- Glassmorphism blur on backgrounds

---

## Troubleshooting

### Can't See Floating Button?
**Check**:
1. Is frontend running? (http://localhost:4200)
2. Are you logged in? (redirects to /dashboard)
3. Look at **bottom-right corner**
4. Try scrolling down on the page
5. Check browser console for errors (F12)

### Button Visible But Won't Click?
**Check**:
1. Is it behind another element? (z-index issue)
2. Browser console errors? (F12 → Console tab)
3. Try refreshing the page (Ctrl+R)

### Window Opens But No Content?
**Check**:
1. Browser console for errors
2. Network tab for failed GraphQL requests
3. Is backend running? (http://localhost:4000/graphql)

### Can Send But No Response?
**Check**:
1. Backend GraphQL server running?
2. AI mutation configured correctly?
3. Check backend logs for errors
4. Verify GEMINI_API_KEY in .env

---

## Quick Visual Test

### Mobile Test (Resize Browser)
1. Open Dev Tools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select iPhone or Android device
4. Chatbot should be full-screen overlay

### Desktop Test
1. Normal browser window (> 768px width)
2. Chatbot should be floating panel in corner
3. Page content should still be visible behind

---

## Current URLs

- **Frontend**: http://localhost:4200
- **Login Page**: http://localhost:4200/login
- **Dashboard**: http://localhost:4200/dashboard
- **Backend GraphQL**: http://localhost:4000/graphql

---

## Next: Try These Commands

### In the chatbot, type:
1. "What are the emergency protocols?"
2. "Show me active rescues"
3. "How do I identify a cobra?"
4. "What should I do if bitten?"

### Click these suggestion chips:
- Emergency Protocols
- View Dashboard Stats
- Manage Rescue Teams
- System Settings

---

## Screenshots Expected

### Desktop View
```
┌──────────────────────────────────────────┐
│  Dashboard Content                       │
│                                          │
│                                          │
│                              ┌──────┐    │
│                              │  🟢  │ ← Floating Button
│                              └──────┘    │
└──────────────────────────────────────────┘
```

### Desktop - Chatbot Open
```
┌──────────────────────────────────────────┐
│  Dashboard Content (slightly dimmed)     │
│                         ┌─────────────┐  │
│                         │ Chat Window │  │
│                         │             │  │
│                         │  Messages   │  │
│                         │             │  │
│                         └─────────────┘  │
└──────────────────────────────────────────┘
```

### Mobile View - Chatbot Open
```
┌──────────────┐
│ Chat Header  │
│──────────────│
│              │
│   Messages   │
│              │
│              │
│──────────────│
│ Input Area   │
└──────────────┘
(Full screen overlay)
```

---

## 🎉 You Should Now See

✅ Green sparkles button (bottom-right)
✅ Smooth animations on click
✅ Beautiful glassmorphism design
✅ Context-aware welcome message
✅ Working message send/receive
✅ Responsive on all screen sizes

**Congratulations!** The chatbot is live and integrated! 🚀
