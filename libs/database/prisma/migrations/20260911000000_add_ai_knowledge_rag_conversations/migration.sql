-- AlterTable: Add AI relations to users table (already has the fields in schema)
-- No changes needed for users table

-- CreateTable: knowledge_documents
CREATE TABLE IF NOT EXISTS "knowledge_documents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "version" TEXT NOT NULL DEFAULT '1.0',
    "isLatest" BOOLEAN NOT NULL DEFAULT true,
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "language" TEXT NOT NULL DEFAULT 'en',
    "author" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable: knowledge_chunks
CREATE TABLE IF NOT EXISTS "knowledge_chunks" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "tokenCount" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ai_conversations
CREATE TABLE IF NOT EXISTS "ai_conversations" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "context" TEXT NOT NULL DEFAULT 'PUBLIC',
    "role" TEXT,
    "title" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ai_messages
CREATE TABLE IF NOT EXISTS "ai_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "toolName" TEXT,
    "toolArguments" JSONB,
    "toolResult" JSONB,
    "toolSuccess" BOOLEAN,
    "toolError" TEXT,
    "metadata" JSONB,
    "tokenCount" INTEGER,
    "responseTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ai_audit_logs
CREATE TABLE IF NOT EXISTS "ai_audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "conversationId" TEXT,
    "actionType" TEXT NOT NULL,
    "toolName" TEXT,
    "arguments" JSONB,
    "result" JSONB,
    "success" BOOLEAN NOT NULL,
    "error" TEXT,
    "errorCode" TEXT,
    "executionTimeMs" INTEGER,
    "userRole" TEXT,
    "permissions" TEXT[],
    "authorized" BOOLEAN NOT NULL DEFAULT true,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "knowledge_documents_category_visibility_idx" ON "knowledge_documents"("category", "visibility");
CREATE INDEX IF NOT EXISTS "knowledge_documents_isActive_isLatest_idx" ON "knowledge_documents"("isActive", "isLatest");
CREATE INDEX IF NOT EXISTS "knowledge_documents_source_idx" ON "knowledge_documents"("source");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "knowledge_chunks_documentId_idx" ON "knowledge_chunks"("documentId");
CREATE UNIQUE INDEX IF NOT EXISTS "knowledge_chunks_documentId_chunkIndex_key" ON "knowledge_chunks"("documentId", "chunkIndex");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ai_conversations_userId_idx" ON "ai_conversations"("userId");
CREATE INDEX IF NOT EXISTS "ai_conversations_context_isActive_idx" ON "ai_conversations"("context", "isActive");
CREATE INDEX IF NOT EXISTS "ai_conversations_createdAt_idx" ON "ai_conversations"("createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ai_messages_conversationId_createdAt_idx" ON "ai_messages"("conversationId", "createdAt");
CREATE INDEX IF NOT EXISTS "ai_messages_role_idx" ON "ai_messages"("role");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ai_audit_logs_userId_createdAt_idx" ON "ai_audit_logs"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "ai_audit_logs_conversationId_idx" ON "ai_audit_logs"("conversationId");
CREATE INDEX IF NOT EXISTS "ai_audit_logs_actionType_success_idx" ON "ai_audit_logs"("actionType", "success");
CREATE INDEX IF NOT EXISTS "ai_audit_logs_toolName_idx" ON "ai_audit_logs"("toolName");
CREATE INDEX IF NOT EXISTS "ai_audit_logs_createdAt_idx" ON "ai_audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "knowledge_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_audit_logs" ADD CONSTRAINT "ai_audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_audit_logs" ADD CONSTRAINT "ai_audit_logs_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
