# SnakeSOS AI Agent - Quick Start Guide

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** 2026-09-11

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Quick Start](#quick-start)
3. [Using the AI Chat](#using-the-ai-chat)
4. [Available Tools](#available-tools)
5. [Write Operations & Confirmations](#write-operations--confirmations)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)

---

## System Overview

The SnakeSOS AI Agent is a production-grade chatbot powered by Google Gemini with:

- **RAG (Retrieval-Augmented Generation)** - Knowledge base with full-text search
- **Tool Calling** - Structured function execution via Gemini
- **Role-Based Access** - Different tools for public, rescuer, admin
- **Write Confirmation** - User approval required for database modifications
- **Audit Logging** - Complete history of all AI interactions

### Architecture

```
User → React UI → GraphQL → AI Agent → Gemini API
                                  ↓
                          Tool Registry
                                  ↓
                    ┌─────────────┴─────────────┐
                    ↓                           ↓
              Read Tools                   Write Tools
          (no confirmation)            (requires confirmation)
                    ↓                           ↓
            Application Services
                    ↓
            Prisma → PostgreSQL
```

---

## Quick Start

### 1. Environment Setup

Ensure these variables are in your `.env`:

```env
# Required
DATABASE_URL=postgresql://user:pass@localhost:5433/snakesos
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
GEMINI_MODEL=gemini-2.0-flash-exp  # Default model
NODE_ENV=development
```

### 2. Database Migration

```bash
# Run migrations (if not already done)
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### 3. Seed Knowledge Base (Optional)

```bash
# Run the knowledge ingestion script
npx tsx scripts/test-rag-system.ts
```

This seeds initial snake safety knowledge.

### 4. Start Backend

```bash
# Development
npm run dev

# Production
npm run build
npm run start
```

Backend runs on: `http://localhost:4000/graphql`

### 5. Start Frontend

```bash
# Development
cd apps/frontend
npm run dev
```

Frontend runs on: `http://localhost:3000`

### 6. Access AI Chat

**Public Chat Page:**  
`http://localhost:3000/ai-chat`

**Dashboard Widget:**  
Available on `/dashboard` and `/rescuer/dashboard` when logged in.

---

## Using the AI Chat

### Public Users (No Login Required)

**Available Actions:**
- Ask snake safety questions
- Get first aid information
- Learn about snake species
- Find nearby rescuers (no personal data stored)
- Find nearby hospitals

**Example Queries:**
```
"What should I do if I see a cobra?"
"How can I identify a venomous snake?"
"What are the symptoms of a snake bite?"
"Find snake rescuers near Bangkok"
"Where is the nearest hospital with antivenom?"
```

### Authenticated Users (Logged In)

**Additional Actions:**
- Create rescue requests (requires confirmation)
- View your rescue request history
- Update personal location
- Receive personalized recommendations

**Example Queries:**
```
"I need help with a snake in my house"
"Create a rescue request"
"Show my active rescue requests"
```

### Rescuers

**Additional Tools:**
- View assigned requests
- Update request status
- Access rescuer-specific knowledge

### Admins

**Additional Tools:**
- View all conversations
- Access audit logs
- Manage knowledge base
- View AI statistics

---

## Available Tools

### 1. searchKnowledge (Read)

**Description:** Searches the knowledge base using RAG

**Parameters:**
- `query` (string, required) - Search query

**Example:**
```
User: "What is the first aid for snake bites?"
AI: [Searches knowledge base → Returns relevant information]
```

**No confirmation required** ✅

---

### 2. findNearestRescuer (Read)

**Description:** Finds nearby snake rescuers

**Parameters:**
- `latitude` (number, required)
- `longitude` (number, required)
- `maxDistance` (number, optional, default: 50km)
- `limit` (number, optional, default: 5)

**Example:**
```
User: "Find rescuers near me"
AI: [Uses your location → Returns top 5 rescuers with distances]
```

**No confirmation required** ✅

---

### 3. findNearbyHospitals (Read)

**Description:** Finds nearby hospitals with antivenom

**Parameters:**
- `latitude` (number, required)
- `longitude` (number, required)
- `maxDistance` (number, optional, default: 50km)
- `hasAntivenom` (boolean, optional)

**Example:**
```
User: "Where is the nearest hospital with antivenom?"
AI: [Uses your location → Returns hospitals sorted by distance]
```

**No confirmation required** ✅

---

### 4. createRescueRequest (Write)

**Description:** Creates a new rescue request

**Parameters:**
- `latitude` (number, required)
- `longitude` (number, required)
- `description` (string, required)
- `phone` (string, required)
- `urgencyLevel` (string, optional: LOW, MEDIUM, HIGH, CRITICAL)

**Example:**
```
User: "I need help with a cobra in my backyard"

AI: "I can create a rescue request for you. Please confirm..."

[Confirmation Dialog Shows]
Tool: createRescueRequest
Location: 13.7563, 100.5018
Description: "Cobra in backyard"
Phone: +66812345678
Urgency: HIGH

[User clicks "Confirm & Execute"]

AI: "Rescue request #12345 created successfully! A rescuer will contact you shortly."
```

**Confirmation required** 🔒

---

## Write Operations & Confirmations

### Why Confirmations?

Write operations modify the database and can:
- Create rescue requests (notify rescuers)
- Update user data
- Send notifications
- Trigger SMS/email

To prevent accidental or malicious actions, **user approval is required**.

### Confirmation Flow

```
1. User: "Create a rescue request"
   ↓
2. AI analyzes intent → proposes createRescueRequest tool
   ↓
3. AI returns: { requiresConfirmation: true, confirmationRequest: {...} }
   ↓
4. Frontend displays confirmation dialog
   ↓
5. User sees:
   • Tool name
   • Action description
   • All parameters
   • Risks/warnings
   • Reversibility
   ↓
6. User chooses:
   • "Confirm & Execute" → Tool runs → Database modified
   • "Cancel" → Tool doesn't run → Conversation continues
```

### What Users See

```
╔════════════════════════════════════════════════╗
║  ⚠️  Confirm Action                            ║
╟────────────────────────────────────────────────╢
║  The AI assistant wants to perform:            ║
║                                                ║
║  Tool: createRescueRequest                     ║
║  Action: Create Rescue Request                 ║
║                                                ║
║  Parameters:                                   ║
║    latitude: 13.7563                           ║
║    longitude: 100.5018                         ║
║    description: "Cobra in backyard"            ║
║    phone: "+66812345678"                       ║
║    urgencyLevel: "HIGH"                        ║
║                                                ║
║  ⚠️ This will notify rescuers immediately      ║
║                                                ║
║  Do you want to allow this action?             ║
║                                                ║
║  [Cancel]  [Confirm & Execute]                 ║
╚════════════════════════════════════════════════╝
```

---

## API Reference

### GraphQL Mutation: aiChat

```graphql
mutation AiChat($input: AiChatInput!) {
  aiChat(input: $input) {
    conversationId
    messageId
    response
    toolsUsed
    responseTime
    requiresConfirmation
    confirmationRequest {
      toolName
      action
      description
      arguments
      risks
      reversible
    }
  }
}
```

**Input:**
```typescript
{
  message: string;              // User's message
  conversationId?: string;      // Optional, for continuing conversation
  context?: {
    location?: {
      latitude: number;
      longitude: number;
    }
  }
}
```

**Response:**
```typescript
{
  conversationId: string;       // Conversation ID (for follow-ups)
  messageId: string;            // Unique message ID
  response: string;             // AI's text response
  toolsUsed: string[];          // Tools executed
  responseTime: number;         // Milliseconds
  requiresConfirmation: boolean; // If true, show confirmation dialog
  confirmationRequest?: {       // Present if requiresConfirmation = true
    toolName: string;
    action: string;
    description: string;
    arguments: Record<string, any>;
    risks: string[];
    reversible: boolean;
  }
}
```

### GraphQL Query: myAiConversations

```graphql
query MyAiConversations($limit: Int) {
  myAiConversations(limit: $limit) {
    id
    title
    context
    updatedAt
    messages {
      id
      role
      content
      createdAt
    }
  }
}
```

**Response:**
```typescript
{
  id: string;
  title: string;
  context: 'public' | 'rescuer' | 'admin';
  updatedAt: Date;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: Date;
  }>;
}
```

---

## Troubleshooting

### Issue: "AI not responding"

**Check:**
1. `GEMINI_API_KEY` is set correctly
2. Backend server is running
3. Network connection to Gemini API
4. Check backend logs for Gemini API errors

**Solution:**
```bash
# Test Gemini API
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

### Issue: "Tool not found"

**Check:**
1. Tool is registered in `initialize-tools.ts`
2. User has correct role for the tool
3. Backend server restarted after adding tool

**Solution:**
```typescript
// In initialize-tools.ts
registry.register(new YourNewTool());
```

### Issue: "Confirmation not showing"

**Check:**
1. Tool has `requiresConfirmation = true`
2. Frontend AIChat component includes confirmation logic
3. GraphQL response includes `confirmationRequest`

**Debug:**
```typescript
console.log('Confirmation required:', response.requiresConfirmation);
console.log('Confirmation request:', response.confirmationRequest);
```

### Issue: "Database errors"

**Check:**
1. PostgreSQL is running
2. Migrations are applied
3. `DATABASE_URL` is correct

**Solution:**
```bash
# Check database connection
npx prisma db push

# View database
npx prisma studio
```

### Issue: "Knowledge base returns no results"

**Check:**
1. Knowledge documents are seeded
2. Full-text search indexes exist

**Solution:**
```bash
# Seed knowledge base
npx tsx scripts/test-rag-system.ts

# Check documents
npx prisma studio → knowledge_documents table
```

---

## Performance Tips

### 1. Cache Conversations

Store conversation history in PostgreSQL (already implemented):

```typescript
const conversations = await prisma.aiConversation.findMany({
  where: { userId },
  orderBy: { updatedAt: 'desc' },
  take: 10,
});
```

### 2. Limit Tool Execution

Don't let AI execute too many tools in one response:

```typescript
// In AIAgentService
const MAX_TOOL_CALLS = 5;
```

### 3. Rate Limiting

Add rate limiting to GraphQL mutations:

```typescript
// Example with express-rate-limit
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
});

app.use('/graphql', limiter);
```

### 4. Monitor Gemini API Usage

Track API calls to avoid quota limits:

```typescript
// Log in AIAgentService
logger.info('Gemini API call', {
  userId,
  conversationId,
  tokensUsed: response.usage?.totalTokens,
});
```

---

## Security Best Practices

1. **Never expose Gemini API key to frontend**
   - Keep in backend `.env` only
   - Use GraphQL as proxy

2. **Validate all user inputs**
   - Already done in GraphQL resolvers
   - Tool parameters validated

3. **Audit all write operations**
   - Already logging to `ai_audit_logs`
   - Review logs regularly

4. **Require confirmation for writes**
   - Already implemented
   - Never auto-execute database writes

5. **Role-based access control**
   - Already enforced
   - Check user role before tool execution

---

## Support

**Documentation:**
- `PHASE_1_COMPLETE.md` - RAG Foundation
- `PHASE_2_COMPLETE.md` - AI Agent & Tools
- `PHASE_3_COMPLETE.md` - Integration & UI
- `AI_IMPLEMENTATION_SUMMARY.md` - Complete overview

**Test Scripts:**
- `scripts/test-rag-system.ts` - Test knowledge base
- `scripts/test-ai-agent.ts` - Test AI agent
- `scripts/test-ai-chat-integration.ts` - End-to-end tests

**Need Help?**
Check the audit logs in `ai_audit_logs` table for debugging.

---

**Happy Chatting!** 🐍🤖

