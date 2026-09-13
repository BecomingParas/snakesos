# 🧠 Chatbot with RAG Integration

## What is RAG?

**RAG = Retrieval-Augmented Generation**

Your chatbot now uses a **knowledge base** to provide accurate, verified snake safety information instead of relying only on Gemini's training data.

## How It Works

```
User Question
    ↓
1. Search Knowledge Base (PostgreSQL full-text search)
    ↓
2. Find top 3 relevant chunks
    ↓
3. Add context to Gemini prompt
    ↓
4. Gemini generates response using:
   - Your verified knowledge base
   - Its general training
    ↓
5. Return accurate, safety-focused answer
```

## Architecture

###

 Before (What I Initially Built)
```
/api/chat → Gemini API → Response
```

### Now (With RAG Integration)
```
/api/chat → Knowledge Base Search
          ↓
          Find relevant safety docs
          ↓
          → Gemini API (with context)
          ↓
          → Response with verified info
```

## What's in Your Knowledge Base

Your database has these tables:

### `knowledge_documents`
- Snake safety guidelines
- First aid procedures
- Species information
- Emergency protocols
- Rescue procedures

### `knowledge_chunks`
- Small sections of documents
- Optimized for search
- Has `search_vector` column for full-text search
- Ready for `embedding` column (vector search - future)

## Current Search Method

**Full-Text Search** (PostgreSQL tsvector):
- Fast and reliable
- Uses `search_vector` column
- Searches by keywords
- Returns top 3 most relevant chunks

**Future Upgrade** (pgvector - already planned):
- Semantic search with embeddings
- Understands meaning, not just keywords
- More accurate results
- Already have `embedding` column ready!

## Features of RAG-Enhanced Chat

✅ **Accurate Information**: Uses your verified knowledge base  
✅ **Safety-First**: Prioritizes official safety guidelines  
✅ **Up-to-Date**: Knowledge base can be updated anytime  
✅ **Consistent**: Same answers for same questions  
✅ **Traceable**: Responses based on documented sources  
✅ **Context-Aware**: Gemini sees relevant docs before answering  

## Example Flow

**User asks**: "What should I do if I see a cobra?"

**Step 1 - Knowledge Search**:
```sql
Search knowledge_chunks for:
- "cobra"
- "what to do"
- "snake encounter"
```

**Step 2 - Found Context**:
```
Chunk 1: "When encountering a venomous snake like a cobra:
1. Keep distance of at least 6 feet
2. Do not approach or corner the snake
3. Call professional rescuers at 1166"

Chunk 2: "Cobra safety: These snakes can spit venom up to 8 feet.
Maintain safe distance and evacuate the area calmly."

Chunk 3: "Emergency protocol: If snake is in home, isolate the area,
keep children and pets away, contact snake rescue team immediately."
```

**Step 3 - Enhanced Prompt**:
```
User: "What should I do if I see a cobra?"

Knowledge Context: [3 relevant chunks added]

Gemini: Generates response using verified knowledge + training
```

**Result**: Accurate, safety-focused answer based on your official guidelines!

## Database Schema

```prisma
model KnowledgeDocument {
  id          String   @id @default(uuid())
  title       String
  description String?
  content     String   @db.Text
  source      String   // "OFFICIAL", "TRAINING", "RESEARCH"
  category    String   // "SAFETY", "SPECIES", "FIRST_AID"
  visibility  String   // "PUBLIC", "RESCUER", "ADMIN"
  isActive    Boolean
  chunks      KnowledgeChunk[]
}

model KnowledgeChunk {
  id           String    @id @default(uuid())
  documentId   String
  content      String    @db.Text
  chunkIndex   Int
  search_vector Unsupported("tsvector")? // Full-text search
  embedding    Unsupported("vector(768)")? // Future: semantic search
  document     KnowledgeDocument @relation(...)
}
```

## Testing RAG System

### Check if Knowledge Base Has Data

```bash
cd c:/Users/paras/OneDrive/Desktop/snake-rescue

# Check documents
yarn prisma studio
# → Open knowledge_documents table
# → Should see safety documents

# Or via SQL
yarn prisma db execute --stdin <<EOF
SELECT COUNT(*) FROM knowledge_documents WHERE "isActive" = true;
SELECT COUNT(*) FROM knowledge_chunks;
EOF
```

### Test Knowledge Search

```bash
# Run the test script
node scripts/test-rag-system.ts
```

Should show:
```
✅ Ingestion: Working
✅ Chunking: Working
✅ Storage: Working
✅ Retrieval: Working
```

### Test Chat with RAG

```bash
curl http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What should I do if I see a cobra?"}'
```

Check console logs for:
```
📚 Found 3 relevant knowledge chunks
```

## Populating Knowledge Base

### Script to Add Documents

```bash
# Seed initial knowledge
node scripts/seed-knowledge-base.ts
```

### Manual Addition

```typescript
import { prisma } from '@snake-rescue/database';

await prisma.knowledgeDocument.create({
  data: {
    title: 'Snake Encounter Safety Guide',
    content: '... full document text ...',
    source: 'OFFICIAL',
    category: 'SAFETY',
    visibility: 'PUBLIC',
    isActive: true,
    chunks: {
      create: [
        {
          content: 'Chunk 1 text...',
          chunkIndex: 0,
        },
        // ... more chunks
      ],
    },
  },
});
```

## Future Upgrades

### Phase 1: Full-Text Search ✅ (Current)
- Using PostgreSQL tsvector
- Fast keyword search
- Already working!

### Phase 2: Vector Search 🔄 (Ready to Enable)
- Install: `yarn add pgvector`
- Enable: `node scripts/enable-pgvector.ts`
- Uses: Gemini embeddings (768 dimensions)
- Benefits: Semantic understanding

### Phase 3: Hybrid Search 🚀 (Future)
- Combine full-text + vector
- Best of both worlds
- Maximum accuracy

## Environment Variables

No new variables needed! RAG uses existing:

```env
# Already have these
DATABASE_URL=postgresql://...
GEMINI_API_KEY=AQ.XXX...
GEMINI_MODEL=gemini-1.5-flash
```

## Deployment

### Local Testing
```bash
yarn dev
# RAG works automatically!
```

### Vercel Deployment

**Database**: Already connected (Neon PostgreSQL)  
**Knowledge Base**: Accessible from Vercel functions  
**Search**: Works via Prisma raw queries  
**No changes needed!** ✅

Just deploy:
```bash
git add .
git commit -m "Add RAG integration to chatbot"
git push
```

## Monitoring RAG

### Check Logs

```javascript
// In /api/chat route
console.log('📚 Found N relevant knowledge chunks');
```

Look for this in:
- Local: Terminal console
- Vercel: Function logs

### Debug RAG

If knowledge search fails:
1. **Check database**: Do you have documents?
2. **Check search_vector**: Column exists?
3. **Check query**: Valid search terms?
4. **Check logs**: What's the error?

## Benefits Over Simple Gemini Chat

| Feature | Simple Gemini | With RAG |
|---------|--------------|----------|
| **Accuracy** | General knowledge | Your verified docs |
| **Consistency** | May vary | Always same answer |
| **Updates** | Need retraining | Update database |
| **Safety** | AI judgment | Your safety rules |
| **Traceability** | Unknown source | Known documents |
| **Compliance** | Uncertain | Documented |

## Summary

✅ **Your chatbot now has RAG!**  
✅ **Uses knowledge base** for accurate answers  
✅ **Full-text search** working (tsvector)  
✅ **Ready for vector search** (pgvector column exists)  
✅ **No deployment changes** needed  
✅ **Works on Vercel** automatically  

The chatbot will:
1. Search your knowledge base
2. Find relevant safety information
3. Provide Gemini with verified context
4. Generate accurate, safe responses

**Next**: Make sure your knowledge base has content! Run `test-rag-system.ts` to verify.
