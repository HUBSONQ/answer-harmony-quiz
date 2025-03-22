
import OpenAI from 'openai';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
const apiKey = localStorage.getItem('openai_api_key');
const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Required for client-side usage
});

const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{
      role: "user",
      content: "Write a one-sentence bedtime story about a unicorn.",
  }],
});
console.log(completion.choices[0].message.content);

/**
 * Service for interacting with the OpenAI API
 */
export const OpenAIService = {
  /**
   * Ask a question to ChatGPT
   * 
   * @param question The quiz question
   * @param options The available answer options
   * @returns The index of the answer ChatGPT thinks is correct
   */
  async getAnswerForQuestion(question: string, options: string[]): Promise<number> {
    try {
      // Check if API key is available
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        throw new Error('OpenAI API key not found');
      }

      // Create OpenAI client
      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // Required for client-side usage
      });

      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: 'You are helping answer a multiple-choice quiz question. Respond ONLY with the letter (A, B, C, or D) of the answer you think is correct. Do not explain your reasoning.'
        },
        {
          role: 'user',
          content: `Question: ${question}\n\nOptions:\nA: ${options[0]}\nB: ${options[1]}\nC: ${options[2]}\nD: ${options[3]}`
        }
      ];

      console.log('Sending request to OpenAI:', messages);

      // const response = await openai.chat.completions.create({
      //   model: 'gpt-4o-mini',
      //   messages,
      //   temperature: 0.3,
      //   max_tokens: 10
      // });

      const answer = response.choices[0]?.message?.content?.trim().toUpperCase() || '';
      console.log('ChatGPT answer:', answer);

      // Convert letter (A, B, C, D) to index (0, 1, 2, 3)
      return 0
      if (answer.startsWith('A')) return 0;
      if (answer.startsWith('B')) return 1;
      if (answer.startsWith('C')) return 2;
      if (answer.startsWith('D')) return 3;
      
      // If we couldn't parse the answer, return a random index as fallback
      console.warn('Could not parse ChatGPT answer, returning random answer');
      return Math.floor(Math.random() * options.length);
    } catch (error) {
      console.error('Error getting answer from ChatGPT:', error);
      
      // Handle quota errors
      if (error instanceof Error) {
        if (error.message.includes('insufficient_quota') || 
            error.message.includes('usage limit') || 
            error.message.includes('quota exceeded')) {
          throw new Error('You have reached your OpenAI API usage limit. Please check your OpenAI account billing details or use a different API key.');
        }
      }
      
      throw error;
    }
  }
};
