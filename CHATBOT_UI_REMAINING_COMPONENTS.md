# SnakeSOS AI Chatbot - Remaining Components

## Components Created ✅
1. AIFloatingButton.tsx - Entry point with animations
2. AIChatWindow.tsx - Main container with mobile/desktop support
3. AIChatHeader.tsx - Premium header
4. AIWelcome.tsx - Context-aware welcome screen
5. types.ts - Complete type system

## Critical Components Needed

### Message Display
- **AIMessageList.tsx** - Scrollable message container
- **AIMessage.tsx** - Individual message renderer  
- **AITypingIndicator.tsx** - Streaming/loading state

### Input
- **AIComposer.tsx** - Text input with image upload

### Blocks (Structured Content)
- **AIBlockRenderer.tsx** - Router for block types
- **AIAlertBlock.tsx** - Safety warnings
- **AISnakeCard.tsx** - Snake identification results
- **AIRescuerCard.tsx** - Rescuer information
- **AIHospitalCard.tsx** - Hospital cards
- **AIRescueRequestCard.tsx** - Request status with timeline

### Integration
- **index.ts** - Export all components
- Update existing AIChat.tsx to use new system
- Add floating button to dashboard layouts

## Quick Implementation Guide

The user wants to see the chatbot UI working. Here's the fastest path:

### Step 1: Create AIMessageList + AIMessage + AIComposer
These are the minimum needed for a working chat.

### Step 2: Create AIBlockRenderer with at least:
- Text blocks
- Alert blocks  
- Snake cards

### Step 3: Update Integration
- Export from index.ts
- Add AIFloatingButton to dashboard layout
- Wire up to existing GraphQL

### Step 4: Test
- Public page: /ai-chat
- Dashboard: floating button
- Mobile responsiveness

## Design Guidelines

### Colors
- Primary: Snake rescue brand (from theme)
- Success: #10b981 (green)
- Warning: #f59e0b (amber)
- Danger: #ef4444 (red)

### Spacing
- Container padding: 1rem (16px)
- Message gap: 1rem
- Compact gap: 0.5rem (8px)

### Typography
- Message: text-sm (14px)
- Labels: text-xs (12px)
- Headings: text-lg (18px)

### Animations
- Message appear: fade + slide up, 200ms
- Button hover: scale 1.02, 150ms
- Window open: spring animation
- Typing: 3 dots pulsing

### Mobile
- Full screen takeover
- Safe area padding
- Large touch targets (44px)
- Bottom sheet style

## Backend Response Format

The UI expects:
```json
{
  "conversationId": "uuid",
  "messageId": "uuid",
  "response": "text content",
  "toolsUsed": ["searchKnowledge"],
  "responseTime": 1200,
  "blocks": [
    {
      "id": "1",
      "type": "text",
      "content": "Here's what I found..."
    },
    {
      "id": "2",
      "type": "snake-card",
      "species": {
        "id": "...",
        "name": "Common Rat Snake",
        "venomous": false
      },
      "confidence": 0.94
    }
  ]
}
```

## Integration Points

### Existing Code to Reuse
- `/components/ai-chat/AIChat.tsx` - has GraphQL setup
- `/components/ai-chat/AIConfirmationDialog.tsx` - confirmation UI
- `/lib/apollo/client.ts` - Apollo setup
- `/components/ui/*` - shadcn components

### Pages to Add Chatbot
1. Public: Already has `/ai-chat` page
2. Dashboard: Add `<AIFloatingButton />` to layout
3. Rescuer: Same floating button with context='rescuer'

### GraphQL Mutations Already Defined
```graphql
mutation AiChat($input: AiChatInput!) {
  aiChat(input: $input) {
    conversationId
    messageId
    response
    toolsUsed
    responseTime
    requiresConfirmation
    confirmationRequest { ... }
  }
}
```

## Priority Order

1. **AIMessageList** - Can't have chat without messages
2. **AIMessage** - Renders each message
3. **AIComposer** - User input
4. **AIBlockRenderer** - For rich content
5. **AITypingIndicator** - Loading state
6. **Integration** - Wire everything up
7. **Polish** - Animations, error states, etc.

The user needs to see a working chatbot NOW, so focus on core functionality first, polish later.

## Testing Checklist
- [ ] Can open/close chatbot
- [ ] Can send message
- [ ] See AI response
- [ ] Works on mobile
- [ ] Confirmation dialog works
- [ ] Context switching works
- [ ] Suggestions clickable
- [ ] Keyboard shortcuts work

---

**Next Action**: Create AIMessageList, AIMessage, AIComposer, then integrate.
