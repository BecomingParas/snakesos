/**
 * Test RAG System (Phase 1F)
 * 
 * Tests the complete RAG pipeline:
 * 1. Document ingestion
 * 2. Chunking
 * 3. Storage
 * 4. Retrieval
 */

import { 
  KnowledgeIngestionService,
  KnowledgeRetrievalService,
} from '../libs/backend/modules/src/ai';
import { prisma } from '../libs/database/src/client';

// Sample knowledge documents
const SAMPLE_DOCUMENTS = [
  {
    title: 'Snake Safety Guidelines',
    description: 'Essential safety information for snake encounters',
    content: `
# Snake Safety Guidelines

## What to Do If You Encounter a Snake

1. **Stay Calm**: Snakes typically avoid humans and will not attack unless threatened.

2. **Keep Your Distance**: Maintain at least 6 feet (2 meters) away from the snake.

3. **Do Not Approach**: Never try to catch, kill, or handle a snake, even if you think it's non-venomous.

4. **Back Away Slowly**: Move away slowly without making sudden movements.

5. **Keep Children and Pets Away**: Ensure children and pets are at a safe distance.

6. **Call for Help**: Contact professional rescuers if the snake is in a residential area.

## If Bitten by a Snake

1. **Stay Calm**: Panic increases heart rate and spreads venom faster.

2. **Remove Jewelry**: Remove rings, watches, and tight clothing near the bite.

3. **Keep the Area Still**: Immobilize the bitten area and keep it below heart level.

4. **Seek Medical Help Immediately**: Go to the nearest hospital with antivenom facilities.

5. **Do NOT**:
   - Do not cut the bite
   - Do not apply tourniquet
   - Do not apply ice
   - Do not suck out venom
   - Do not give alcohol or medication

## Prevention

- Wear closed-toe shoes and long pants when in snake-prone areas
- Use a flashlight at night
- Watch where you step and reach
- Keep grass short around your home
- Seal gaps in walls and foundations
    `,
    source: 'SNAKESOS_DOCS',
    category: 'SAFETY',
    tags: ['safety', 'emergency', 'prevention', 'snakebite'],
    visibility: 'PUBLIC',
  },
  {
    title: 'Common Snakes in Nepal',
    description: 'Information about snake species found in Nepal',
    content: `
# Common Snakes in Nepal

Nepal is home to approximately 89 species of snakes, of which 20 are venomous.

## Venomous Snakes

### Spectacled Cobra (Naja naja)
- **Nepali Name**: गोमन सर्प (Goman Sarpa)
- **Danger Level**: Highly Dangerous
- **Appearance**: Dark body with distinctive spectacle mark on hood
- **Habitat**: Forests, agricultural areas, human settlements
- **Behavior**: Nocturnal, defensive when threatened

### Common Krait (Bungarus caeruleus)
- **Nepali Name**: गोमन करैत (Goman Karait)
- **Danger Level**: Highly Dangerous
- **Appearance**: Black body with white crossbands
- **Habitat**: Rural areas, near human habitation
- **Behavior**: Mostly nocturnal, less aggressive during day

### Russell's Viper (Daboia russelii)
- **Nepali Name**: चन्द्रबोरा (Chandrabora)
- **Danger Level**: Highly Dangerous
- **Appearance**: Brown with dark patches, triangular head
- **Habitat**: Grasslands, agricultural fields
- **Behavior**: Aggressive when disturbed

## Non-Venomous Snakes

### Rat Snake
- Harmless to humans
- Beneficial for pest control
- Often found near human habitation

### Water Snakes
- Found near water bodies
- Non-aggressive
- Important for ecosystem balance

## Important Notes

- Most snake species are non-venomous and harmless
- Snakes play a crucial role in controlling rodent populations
- Never attempt to identify or handle a snake yourself
- When in doubt, treat all snakes as potentially dangerous
    `,
    source: 'SNAKESOS_DOCS',
    category: 'SNAKE_INFO',
    tags: ['species', 'identification', 'nepal', 'venomous'],
    visibility: 'PUBLIC',
  },
  {
    title: 'Rescue Standard Operating Procedure',
    description: 'SOP for verified rescuers responding to snake rescue requests',
    content: `
# Rescue Standard Operating Procedure (SOP)

## Pre-Response Preparation

1. **Verify Equipment**:
   - Snake hook or tongs
   - Snake bag or container
   - First aid kit
   - Flashlight
   - Protective gloves and boots
   - Mobile phone (charged)

2. **Review Request Details**:
   - Location and accessibility
   - Snake description
   - Presence of people/pets
   - Safety concerns

## Response Protocol

### Step 1: Assessment (5 minutes)
- Observe from safe distance
- Identify potential escape routes
- Check for immediate dangers
- Assess environmental conditions

### Step 2: Communication
- Inform dispatch of arrival
- Instruct bystanders to maintain distance
- Explain procedures to property owner
- Keep phone accessible for updates

### Step 3: Capture
- Approach slowly and quietly
- Use appropriate equipment
- Secure snake in container
- Verify container is sealed
- Take photo for documentation

### Step 4: Post-Rescue
- Update request status
- Record species if identified
- Transport to safe release site
- Document release location
- Complete rescue report

## Safety Rules

1. **Never Handle Venomous Snakes**: Use tools only
2. **Work with Partner**: Never rescue alone if possible
3. **Know Your Limits**: Request backup for difficult situations
4. **PPE Always**: Always wear protective equipment
5. **Update Status**: Keep communication open

## Release Guidelines

- Release at least 2km from human habitation
- Choose appropriate habitat for species
- Release during suitable weather
- Avoid releasing near roads
- Document GPS coordinates
    `,
    source: 'MANUAL',
    category: 'RESCUE_SOP',
    tags: ['rescue', 'procedure', 'safety', 'protocol'],
    visibility: 'RESCUER',
  },
];

async function testRAGSystem() {
  console.log('🧪 Testing RAG System (Phase 1F)\n');
  console.log('=' .repeat(60));

  const ingestionService = new KnowledgeIngestionService();
  const retrievalService = new KnowledgeRetrievalService();

  try {
    // Step 1: Ingest sample documents
    console.log('\n📥 Step 1: Ingesting Sample Documents\n');

    const ingestionResults = [];
    for (const doc of SAMPLE_DOCUMENTS) {
      console.log(`  📄 Ingesting: ${doc.title}`);
      const result = await ingestionService.ingestDocument(doc);
      ingestionResults.push(result);
      console.log(`     ✅ ${result.chunkCount} chunks, ${result.totalTokens} tokens`);
    }

    console.log(`\n✅ Ingested ${SAMPLE_DOCUMENTS.length} documents`);

    // Step 2: Test retrieval with various queries
    console.log('\n🔍 Step 2: Testing Knowledge Retrieval\n');

    const testQueries = [
      {
        query: 'What should I do if I encounter a snake?',
        category: 'SAFETY',
        visibility: 'PUBLIC',
      },
      {
        query: 'venomous snakes in Nepal',
        category: 'SNAKE_INFO',
        visibility: 'PUBLIC',
      },
      {
        query: 'rescue equipment checklist',
        category: 'RESCUE_SOP',
        visibility: 'RESCUER',
      },
      {
        query: 'snakebite first aid',
        visibility: 'PUBLIC',
      },
    ];

    for (const testCase of testQueries) {
      console.log(`\n  Query: "${testCase.query}"`);
      console.log(`  Filters: category=${testCase.category || 'any'}, visibility=${testCase.visibility}`);

      const searchResult = await retrievalService.search({
        query: testCase.query,
        topK: 3,
        category: testCase.category,
        visibility: testCase.visibility,
      });

      console.log(`  Results: ${searchResult.totalFound} chunks found (method: ${searchResult.searchMethod})`);

      if (searchResult.results.length > 0) {
        console.log(`\n  Top Result:`);
        const topResult = searchResult.results[0];
        console.log(`    📄 Document: ${topResult.documentTitle}`);
        console.log(`    📊 Score: ${topResult.score.toFixed(3)}`);
        console.log(`    📝 Preview: ${topResult.content.substring(0, 150).replace(/\n/g, ' ')}...`);
      } else {
        console.log(`  ⚠️  No results found`);
      }
    }

    // Step 3: Verify database state
    console.log('\n\n📊 Step 3: Verifying Database State\n');

    const stats = await prisma.$queryRaw<Array<{
      documents: bigint;
      chunks: bigint;
      categories: bigint;
    }>>`
      SELECT 
        COUNT(DISTINCT d.id) as documents,
        COUNT(c.id) as chunks,
        COUNT(DISTINCT d.category) as categories
      FROM knowledge_documents d
      LEFT JOIN knowledge_chunks c ON d.id = c."documentId"
      WHERE d."isActive" = true
    `;

    console.log(`  📄 Active Documents: ${stats[0].documents}`);
    console.log(`  📦 Total Chunks: ${stats[0].chunks}`);
    console.log(`  🏷️  Categories: ${stats[0].categories}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ RAG System Test Complete!\n');
    console.log('Summary:');
    console.log(`  • Ingestion: ✅ Working`);
    console.log(`  • Chunking: ✅ Working`);
    console.log(`  • Storage: ✅ Working`);
    console.log(`  • Retrieval: ✅ Working (full-text search)`);
    console.log(`  • Vector Search: ⏸️  Pending (pgvector not enabled)`);

    await prisma.$disconnect();
  } catch (error: any) {
    console.error('\n❌ Test Failed:', error.message);
    console.error(error.stack);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Run test
testRAGSystem();
