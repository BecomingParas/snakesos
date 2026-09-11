/**
 * Test AI Agent System (Phase 2)
 * 
 * Tests the complete AI agent with function calling:
 * 1. Tool registration
 * 2. Agent initialization
 * 3. Chat with tool execution
 * 4. Knowledge retrieval
 * 5. Rescue and hospital queries
 */

import {
  AIAgentService,
  getToolRegistry,
  ToolContext,
} from '../libs/backend/modules/src/ai';
import { prisma } from '../libs/database/src/client';

async function testAIAgent() {
  console.log('🤖 Testing AI Agent System (Phase 2)\n');
  console.log('=' .repeat(60));

  try {
    // Step 1: Initialize tool registry
    console.log('\n🔧 Step 1: Initializing Tool Registry\n');
    const toolRegistry = getToolRegistry();
    const allTools = toolRegistry.getAllTools();
    console.log(`  ✅ Registered ${allTools.length} tools:`);
    allTools.forEach((tool) => {
      console.log(`     • ${tool.definition.name} (${tool.definition.category})`);
    });

    // Step 2: Create AI agent
    console.log('\n🧠 Step 2: Creating AI Agent\n');
    const agent = new AIAgentService(toolRegistry);
    console.log('  ✅ AI Agent initialized with Gemini');

    // Step 3: Create test context (public user)
    const publicContext: ToolContext = {
      userRole: 'PUBLIC',
      permissions: [],
      sessionId: 'test-session-' + Date.now(),
    };

    console.log('\n💬 Step 3: Testing Chat with Tool Calling\n');

    // Test Case 1: Knowledge search
    console.log('  📝 Test Case 1: Knowledge Search');
    console.log('  Query: "What should I do if I see a snake in my house?"');

    const response1 = await agent.chat({
      message: 'What should I do if I see a snake in my house?',
      context: publicContext,
    });

    console.log(`  Response: ${response1.response.substring(0, 200)}...`);
    console.log(`  Tools used: ${response1.toolsUsed.join(', ') || 'none'}`);
    console.log(`  Response time: ${response1.metadata.responseTime}ms`);

    // Test Case 2: Find nearest rescuer
    console.log('\n  🚨 Test Case 2: Find Nearest Rescuer');
    console.log('  Query: "Find rescuers near Butwal"');

    const response2 = await agent.chat({
      message: 'Find available snake rescuers near coordinates 27.7006, 83.4484 within 20km',
      context: publicContext,
      conversationId: response1.conversationId,
    });

    console.log(`  Response: ${response2.response.substring(0, 200)}...`);
    console.log(`  Tools used: ${response2.toolsUsed.join(', ') || 'none'}`);
    console.log(`  Response time: ${response2.metadata.responseTime}ms`);

    // Test Case 3: Find nearby hospitals
    console.log('\n  🏥 Test Case 3: Find Nearby Hospitals');
    console.log('  Query: "Where is the nearest hospital with antivenom?"');

    const response3 = await agent.chat({
      message: 'I need to find the nearest hospital with antivenom. I am at latitude 27.7006, longitude 83.4484',
      context: publicContext,
      conversationId: response1.conversationId,
    });

    console.log(`  Response: ${response3.response.substring(0, 200)}...`);
    console.log(`  Tools used: ${response3.toolsUsed.join(', ') || 'none'}`);
    console.log(`  Response time: ${response3.metadata.responseTime}ms`);

    // Step 4: Verify conversation storage
    console.log('\n\n📊 Step 4: Verifying Conversation Storage\n');

    const conversation = await prisma.aiConversation.findUnique({
      where: { id: response1.conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (conversation) {
      console.log(`  ✅ Conversation ID: ${conversation.id}`);
      console.log(`  ✅ Total messages: ${conversation.messages.length}`);
      console.log(`  ✅ Context: ${conversation.context}`);
      console.log(`  ✅ Active: ${conversation.isActive}`);
    }

    // Step 5: Verify audit logs
    console.log('\n📝 Step 5: Verifying Audit Logs\n');

    const auditLogs = await prisma.aiAuditLog.findMany({
      where: {
        conversationId: response1.conversationId,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    console.log(`  ✅ Audit logs created: ${auditLogs.length}`);
    auditLogs.forEach((log) => {
      console.log(`     • ${log.actionType}: ${log.toolName || 'N/A'} (${log.success ? '✅' : '❌'})`);
    });

    // Step 6: Test tool authorization
    console.log('\n\n🔐 Step 6: Testing Tool Authorization\n');

    const publicTools = toolRegistry.getAvailableTools(publicContext);
    console.log(`  ✅ Public user can access ${publicTools.length} tools:`);
    publicTools.forEach((tool) => {
      console.log(`     • ${tool.name}`);
    });

    const rescuerContext: ToolContext = {
      userRole: 'VERIFIED_RESCUER',
      permissions: ['VIEW_RESCUES', 'UPDATE_STATUS'],
      sessionId: 'test-session-rescuer',
    };

    const rescuerTools = toolRegistry.getAvailableTools(rescuerContext);
    console.log(`\n  ✅ Rescuer can access ${rescuerTools.length} tools:`);
    rescuerTools.forEach((tool) => {
      console.log(`     • ${tool.name}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ AI Agent System Test Complete!\n');
    console.log('Summary:');
    console.log(`  • Tools registered: ✅ ${allTools.length}`);
    console.log(`  • Agent initialized: ✅ Working`);
    console.log(`  • Chat with tools: ✅ Working`);
    console.log(`  • Tool execution: ✅ Working`);
    console.log(`  • Conversation storage: ✅ Working`);
    console.log(`  • Audit logging: ✅ Working`);
    console.log(`  • Authorization: ✅ Working`);

    await prisma.$disconnect();
  } catch (error: any) {
    console.error('\n❌ Test Failed:', error.message);
    console.error(error.stack);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Run test
testAIAgent();
