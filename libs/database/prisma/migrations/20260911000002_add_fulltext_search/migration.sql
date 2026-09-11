-- Add full-text search support to knowledge_chunks
-- This serves as a fallback until pgvector is available

-- Add tsvector column for full-text search
ALTER TABLE "knowledge_chunks" 
ADD COLUMN IF NOT EXISTS "search_vector" tsvector
GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS "knowledge_chunk_search_idx" 
ON "knowledge_chunks" USING gin("search_vector");

-- Add helpful comment
COMMENT ON COLUMN "knowledge_chunks"."search_vector" IS 'Full-text search vector (fallback until pgvector is available)';
