/**
 * TypeScript Type Definitions
 */

export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Thread {
  threadId: string;
  userId?: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  sessionId: string;
  clientToken: string;
  expiresAt: number;
  userId?: string;
}

export interface AgentConfig {
  agentName: string;
  agentRole: string;
  agentGreeting: string;
  agentTagline: string;
  primaryColor: string;
  secondaryColor: string;
  starterPrompts: string[];
  showStatusIndicator: boolean;
}

export interface ChatRequest {
  message: string;
  threadId?: string;
  clientToken: string;
}

export interface ChatResponse {
  content: string;
  threadId: string;
  messageId: string;
}

export type LLMProvider = 'anthropic' | 'openai' | 'google';

export type HookType = 'pre-message' | 'post-message' | 'on-error' | 'on-tool-call';
