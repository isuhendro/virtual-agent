/**
 * LLM Model Configurations
 * Initialize different LLM providers based on config
 */

import { config } from '@/lib/config/env';
import { ChatAnthropic } from '@langchain/anthropic';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

export function initializeLLM(): BaseChatModel {
  console.log(`Initializing LLM provider: ${config.llmProvider}`);

  if (config.llmProvider === 'anthropic') {
    if (!config.anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY is required for Anthropic provider');
    }

    return new ChatAnthropic({
      anthropicApiKey: config.anthropicApiKey,
      modelName: config.anthropicModel,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      topP: config.topP,
      streaming: true,
    });
  }

  // TODO: Add OpenAI and Google providers
  throw new Error(`Unsupported LLM provider: ${config.llmProvider}`);
}
