-- Enable pgvector extension for vector similarity search
-- Required for RAG (Retrieval-Augmented Generation) knowledge base

CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to knowledge_chunks table
-- Using 768 dimensions for Gemini embedding-001 model (optimized dimension)
ALTER TABLE "knowledge_chunks" 
ADD COLUMN IF NOT EXISTS "embedding" vector(768);

-- Create index for fast vector similarity search (IVFFlat for better performance)
-- Will be created after data is populated, for now just the column
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS "knowledge_chunk_embedding_idx" 
-- ON "knowledge_chunks" USING ivfflat ("embedding" vector_cosine_ops)
-- WITH (lists = 100);

-- For now, create a simple index that will work immediately
CREATE INDEX IF NOT EXISTS "knowledge_chunk_embedding_idx" 
ON "knowledge_chunks" USING ivfflat ("embedding" vector_cosine_ops)
WITH (lists = 10);
