/**
 * OpenRouter AI Client for NVIDIA Nemotron Models
 * 
 * Simple TypeScript client for making AI completion requests
 * with support for 1M token context windows.
 */

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionOptions {
  model?: string;
  messages: Message[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
}

export interface CompletionResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: Message;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor(
    apiKey: string = process.env.OPENROUTER_API_KEY || '',
    options: {
      baseUrl?: string;
      defaultModel?: string;
    } = {}
  ) {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required. Set OPENROUTER_API_KEY environment variable.');
    }

    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || 'https://openrouter.ai/api/v1';
    this.defaultModel = options.defaultModel || 'nvidia/nemotron-3-ultra-550b-a55b:free';
  }

  /**
   * Make a chat completion request
   */
  async complete(options: CompletionOptions): Promise<CompletionResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/snake-rescue', // Optional: for OpenRouter stats
      },
      body: JSON.stringify({
        model: options.model || this.defaultModel,
        messages: options.messages,
        max_tokens: options.maxTokens,
        temperature: options.temperature ?? 0.7,
        top_p: options.topP ?? 1,
        stream: options.stream ?? false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  /**
   * List available models
   */
  async listModels(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/models`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Helper: Generate code from a prompt
   */
  async generateCode(prompt: string, options?: { language?: string; context?: string }): Promise<string> {
    const systemPrompt = options?.language
      ? `You are an expert ${options.language} developer. Generate clean, well-documented code.`
      : 'You are an expert software developer. Generate clean, well-documented code.';

    const userPrompt = options?.context
      ? `${options.context}\n\n${prompt}`
      : prompt;

    const response = await this.complete({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // Lower temperature for more consistent code generation
    });

    return response.choices[0].message.content;
  }

  /**
   * Helper: Explain code
   */
  async explainCode(code: string, context?: string): Promise<string> {
    const prompt = context
      ? `${context}\n\nExplain this code:\n\n${code}`
      : `Explain this code:\n\n${code}`;

    const response = await this.complete({
      messages: [
        { role: 'system', content: 'You are a helpful coding assistant that explains code clearly.' },
        { role: 'user', content: prompt },
      ],
    });

    return response.choices[0].message.content;
  }

  /**
   * Helper: Review code and suggest improvements
   */
  async reviewCode(code: string, language?: string): Promise<string> {
    const systemPrompt = language
      ? `You are an expert ${language} code reviewer. Review the code for best practices, potential bugs, and improvements.`
      : 'You are an expert code reviewer. Review the code for best practices, potential bugs, and improvements.';

    const response = await this.complete({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Review this code:\n\n${code}` },
      ],
    });

    return response.choices[0].message.content;
  }

  /**
   * Helper: Refactor code
   */
  async refactorCode(code: string, instructions: string): Promise<string> {
    const response = await this.complete({
      messages: [
        { role: 'system', content: 'You are an expert software developer skilled at refactoring code.' },
        { role: 'user', content: `Refactor this code according to these instructions: ${instructions}\n\nCode:\n${code}` },
      ],
      temperature: 0.3,
    });

    return response.choices[0].message.content;
  }

  /**
   * Helper: Generate tests
   */
  async generateTests(code: string, framework?: string): Promise<string> {
    const systemPrompt = framework
      ? `You are an expert at writing tests using ${framework}.`
      : 'You are an expert at writing comprehensive unit tests.';

    const response = await this.complete({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate tests for this code:\n\n${code}` },
      ],
      temperature: 0.4,
    });

    return response.choices[0].message.content;
  }
}

// Example usage
if (require.main === module) {
  (async () => {
    try {
      const client = new OpenRouterClient();

      console.log('Testing OpenRouter client...\n');

      // Test 1: Simple completion
      console.log('1. Testing simple completion...');
      const response = await client.complete({
        messages: [
          { role: 'user', content: 'Say "Hello from OpenRouter!" and nothing else.' },
        ],
        maxTokens: 50,
      });
      console.log('Response:', response.choices[0].message.content);
      console.log('Tokens used:', response.usage.total_tokens, '\n');

      // Test 2: Generate code
      console.log('2. Testing code generation...');
      const code = await client.generateCode(
        'Create a TypeScript function that calculates factorial',
        { language: 'TypeScript' }
      );
      console.log('Generated code:');
      console.log(code, '\n');

      // Test 3: List available models
      console.log('3. Listing available Nemotron models...');
      const models = await client.listModels();
      const nemotronModels = models.data.filter((m: any) =>
        m.id.toLowerCase().includes('nemotron')
      );
      console.log(`Found ${nemotronModels.length} Nemotron models`);
      nemotronModels.slice(0, 5).forEach((m: any) => {
        console.log(`  - ${m.id} (${m.context_length?.toLocaleString()} tokens)`);
      });

    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  })();
}

export default OpenRouterClient;
