/**
 * LangChain Chains Setup
 * Configure LLM chains for different use cases
 */

import { initializeLLM } from './models';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { BufferMemory } from 'langchain/memory';
import { CHAT_PROMPT_TEMPLATE } from './prompts';
import { config } from '@/lib/config/env';
import { BaseMessage, HumanMessage, AIMessage } from '@langchain/core/messages';

export interface ChatChainInput {
  input: string;
  chatHistory?: BaseMessage[];
}

export function createChatChain() {
  const llm = initializeLLM();

  // Create prompt template with chat history
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', config.systemPrompt],
    new MessagesPlaceholder('chatHistory'),
    ['human', '{input}'],
  ]);

  // Create chain without built-in memory (we'll manage it manually)
  const chain = RunnableSequence.from([prompt, llm]);

  return chain;
}

export interface RAGChainInput {
  question: string;
  chatHistory?: BaseMessage[];
  collectionName: string;
  topK?: number;
  scoreThreshold?: number;
}

export function createRAGChain() {
  const llm = initializeLLM();

  // Create RAG prompt template with context in system message
  // Anthropic only allows ONE system message, and it must be first
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', `${config.systemPrompt}

Retrieved Context from Knowledge Base:
{context}

Use the above context to help answer the user's question. If the context doesn't contain relevant information, you can still answer based on your general knowledge, but mention that the specific information wasn't found in the knowledge base.`],
    new MessagesPlaceholder('chatHistory'),
    ['human', '{question}'],
  ]);

  // Create chain
  const chain = RunnableSequence.from([prompt, llm]);

  return chain;
}
