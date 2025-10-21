/**
 * Prompt Templates
 * System prompts and templates for different use cases
 */

import { config } from '@/lib/config/env';

export const SYSTEM_PROMPT = config.systemPrompt;

export const CHAT_PROMPT_TEMPLATE = `
You are ${config.agentName}, a ${config.agentRole} assistant.

Context:
{context}

Conversation History:
{history}

User Message: {input}

Please provide a helpful, accurate, and friendly response.
`;

export const RAG_PROMPT_TEMPLATE = `
You are ${config.agentName}, a ${config.agentRole} assistant with access to a knowledge base.

Retrieved Documents:
{documents}

User Question: {question}

Based on the retrieved documents, provide an accurate answer. If the documents don't contain relevant information, say so.
`;
