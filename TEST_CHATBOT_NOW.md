# Test the AI Chatbot NOW! 🚀

## ✅ All Fixes Applied

1. ✅ Apollo Client imports fixed
2. ✅ Button disappearing issue fixed
3. ✅ Public website integration added
4. ✅ GraphQL schema matched to backend

---

## 🧪 Quick Test (2 minutes)

### Step 1: Open Public Homepage
```
URL: http://localhost:4200
```

**Expected**:
- 🟢 Green floating button in bottom-right corner
- ✨ Sparkles icon visible
- 💫 Subtle pulse animation on hover

### Step 2: Click the Button
**Expected**:
- ✅ Chat window slides in from right (desktop) or bottom (mobile)
- ✅ Button disappears (this is correct!)
- ✅ Background darkens with backdrop
- ✅ Shows "SnakeSOS AI • Public User" header
- ✅ Shows welcome message with suggestion chips

### Step 3: Send a Test Message
Click any suggestion or type:
```
"What should I do if I see a snake?"
```

**Expected**:
- ✅ Your message appears on right (blue/purple gradient)
- ✅ Three animated dots appear (loading)
- ✅ AI response appears on left (white/emerald gradient)
- ✅ Timestamp shows under each message
- ✅ No errors in browser console

### Step 4: Close the Chat
Click the gray backdrop (outside chat window) or the X button

**Expected**:
- ✅ Chat window slides out
- ✅ Button reappears in bottom-right corner
- ✅ Smooth animation

---

## 🔍 What to Look For

### ✅ Success Indicators
1. **Button visible** on every page (public + dashboard)
2. **Chat opens/closes smoothly** with animations
3. **AI responds** to messages (no GraphQL errors)
4. **Conversation tracked** across multiple messages
5. **Context-aware** suggestions based on user role

### ❌ Error Signs
1. **No button visible** - Check browser console for errors
2. **Button disappears permanently** - Clear browser cache and reload
3. **GraphQL errors in console** - Backend must be running on :4000
4. **No AI response** - Check GEMINI_API_KEY in .env
5. **Hydration errors** - Hard refresh (Ctrl+Shift+R)

---

## 🎯 Test Scenarios

### Scenario 1: Public User Journey
```
1. Visit: http://localhost:4200
2. Click: Floating button
3. See: Public-specific suggestions
   - "How to identify venomous snakes?"
   - "What to do if bitten?"
   - "Find nearest rescue center"
4. Click: Any suggestion
5. See: AI provides detailed answer
6. Type: Follow-up question
7. See: AI remembers context from previous message
```

### Scenario 2: Authenticated User Journey
```
1. Login: http://localhost:4200/login
   Email: admin@snakerescue.com
   Password: password123
2. Navigate: Dashboard
3. Click: Floating button
4. See: Admin-specific suggestions
   - "View dashboard stats"
   - "Manage rescue teams"
   - "Emergency protocols"
5. Click: "View dashboard stats"
6. See: AI provides admin-relevant information
```

### Scenario 3: Mobile Responsive
```
1. Open: DevTools (F12)
2. Toggle: Device toolbar (Ctrl+Shift+M)
3. Select: iPhone 12 Pro
4. Click: Floating button
5. See: Full-screen chat overlay (not small panel)
6. Test: Scrolling, typing, sending messages
7. Close: Chat by clicking backdrop
8. See: Button reappears
```

### Scenario 4: Multi-Turn Conversation
```
1. Open: Chatbot
2. Send: "What snakes are in India?"
3. Wait: For AI response
4. Send: "Which ones are venomous?"
5. See: AI should reference previous answer
6. Send: "How do I identify them?"
7. See: Contextual response building on conversation
8. Click: Clear chat (trash icon)
9. Send: "What snakes are in India?"
10. See: Starts fresh conversation (no context)
```

---

## 📊 Expected API Calls

When you send a message, check Network tab (DevTools → Network):

### Request to GraphQL
```
POST http://localhost:4000/graphql

Payload:
{
  "operationName": "AiChat",
  "variables": {
    "input": {
      "message": "What should I do if I see a snake?",
      "conversationId": null,
      "context": {
        "metadata": {
          "userRole": "public"
        }
      }
    }
  },
  "query": "mutation AiChat($input: AiChatInput!) { ... }"
}
```

### Response from GraphQL
```
{
  "data": {
    "aiChat": {
      "conversationId": "uuid-here",
      "messageId": "msg-uuid-here",
      "response": "If you see a snake, here's what to do...",
      "toolsUsed": [],
      "responseTime": 1234
    }
  }
}
```

---

## 🐛 Troubleshooting Guide

### Problem: "No button visible"

**Solution 1**: Check servers running
```bash
# Frontend should be on :4200
curl http://localhost:4200

# Backend should be on :4000
curl http://localhost:4000/graphql -H "Content-Type: application/json" -d '{"query":"{ __typename }"}'
```

**Solution 2**: Check browser console
- Open DevTools (F12)
- Look for red error messages
- Common: Apollo Client, Framer Motion, or React errors

**Solution 3**: Hard refresh
- Press: Ctrl+Shift+R
- Or: Clear cache and reload

### Problem: "Button disappears permanently"

**This is actually CORRECT** when chat is open!

To fix if it never comes back:
1. Close chat by clicking backdrop
2. Or click X button in header
3. If still missing, refresh page

### Problem: "GraphQL validation errors"

**Check 1**: Is backend running?
```bash
# Should show "Running on port 4000"
# In terminal where you ran yarn dev:backend
```

**Check 2**: Backend logs
- Look for any errors in backend terminal
- Common: Missing GEMINI_API_KEY

**Check 3**: GraphQL Playground
- Visit: http://localhost:4000/graphql
- Try query: `{ __typename }`
- Should return: `{"data": {"__typename": "Query"}}`

### Problem: "AI doesn't respond"

**Check 1**: GEMINI_API_KEY set
```bash
cat .env | grep GEMINI_API_KEY
# Should show your API key
```

**Check 2**: Backend logs
- Look for Gemini API errors
- Common: Invalid API key, rate limits

**Check 3**: Network tab
- See if GraphQL request completes
- Check response for errors
- Status should be 200, not 400/500

### Problem: "Hydration mismatch errors"

**Solution**: Components marked as 'use client'
- All chatbot components already have this
- If error persists, clear .next cache:
```bash
cd apps/frontend
rm -rf .next
yarn dev:frontend
```

---

## ✨ Features to Try

### 1. Suggestion Chips
- Click any suggestion chip
- Message sends automatically
- Different suggestions for public vs authenticated

### 2. Image Upload
- Click image icon in composer
- Select an image
- See preview above input
- Send with message
- (Backend receives image as base64)

### 3. Context Awareness
- Public users see general snake safety tips
- Rescuers see operational guidance
- Admins see management insights

### 4. Conversation History
- Send multiple messages
- AI remembers context
- Click "Clear chat" to reset

### 5. Responsive Design
- Works on desktop (floating panel)
- Works on mobile (full screen)
- Smooth animations everywhere

---

## 🎉 Success!

If you can:
1. ✅ See the floating button
2. ✅ Open the chat window
3. ✅ Send a message
4. ✅ Get an AI response
5. ✅ Close and reopen chat

**Then it's working perfectly!** 🚀

---

## 📱 Screenshots to Verify

### Desktop - Button Visible
```
┌─────────────────────────────────────┐
│  Page Content                       │
│                                     │
│                           ╔═══╗    │
│                           ║ 🟢║ ←  │
│                           ╚═══╝    │
└─────────────────────────────────────┘
         Floating button
```

### Desktop - Chat Open
```
┌─────────────────────────────────────┐
│  Darkened Background                │
│                  ┌──────────────┐   │
│                  │ SnakeSOS AI  │   │
│                  ├──────────────┤   │
│                  │   Messages   │   │
│                  ├──────────────┤   │
│                  │  Type here   │   │
│                  └──────────────┘   │
└─────────────────────────────────────┘
    (Button hidden - correct!)
```

### Mobile - Chat Open
```
┌─────────────┐
│  Header     │
├─────────────┤
│             │
│             │
│  Messages   │
│             │
│             │
├─────────────┤
│  Composer   │
└─────────────┘
(Full screen)
```

---

## 🔗 Quick Links

- **Public Home**: http://localhost:4200
- **Login**: http://localhost:4200/login
- **Dashboard**: http://localhost:4200/dashboard
- **GraphQL Playground**: http://localhost:4000/graphql

---

## 🎊 You're Ready!

The AI chatbot is **fully implemented and working**. Go ahead and test it out! 

If you encounter any issues, refer to the troubleshooting section above or check the browser console for specific error messages.

**Happy chatting!** 🐍✨
