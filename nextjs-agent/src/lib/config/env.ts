/**
 * Environment Configuration
 * Validates and exports environment variables
 */

export const config = {
  // LLM Provider
  llmProvider: process.env.LLM_PROVIDER || 'anthropic',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4-turbo',
  googleApiKey: process.env.GOOGLE_API_KEY || '',
  googleModel: process.env.GOOGLE_MODEL || 'gemini-pro',

  // LLM Parameters
  maxTokens: parseInt(process.env.MAX_TOKENS || '1000'),
  temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
  topP: parseFloat(process.env.TOP_P || '1'),

  // Agent Behavior
  systemPrompt: process.env.SYSTEM_PROMPT || 'You are a helpful virtual assistant...',
  agentName: process.env.AGENT_NAME || 'Virtual Assistant',
  agentRole: process.env.AGENT_ROLE || 'Customer Support',
  agentGreeting: process.env.AGENT_GREETING || 'Hello! How can I help you today?',
  agentTagline: process.env.AGENT_TAGLINE || 'Always here to help',
  useCase: process.env.USE_CASE || 'customer_support',

  // Starter Prompts
  starterPrompts: JSON.parse(process.env.STARTER_PROMPTS || '[]') as string[],

  // UI Customization
  primaryColor: process.env.PRIMARY_COLOR || '#007bff',
  secondaryColor: process.env.SECONDARY_COLOR || '#6c757d',
  backgroundColor: process.env.BACKGROUND_COLOR || '#ffffff',
  textColor: process.env.TEXT_COLOR || '#333333',
  chatBackgroundSvg: process.env.CHAT_BACKGROUND_SVG || 'default',
  brandLogoUrl: process.env.BRAND_LOGO_URL || '',
  agentAvatarUrl: process.env.AGENT_AVATAR_URL || '',
  showStatusIndicator: process.env.SHOW_STATUS_INDICATOR === 'true',
  bubbleBorderRadius: parseInt(process.env.BUBBLE_BORDER_RADIUS || '16'),

  // Typography Colors
  textPrimary: process.env.TEXT_PRIMARY || '#1e293b',
  textSecondary: process.env.TEXT_SECONDARY || '#64748b',
  textMuted: process.env.TEXT_MUTED || '#94a3b8',
  textInverse: process.env.TEXT_INVERSE || '#ffffff',

  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  qdrantUrl: process.env.QDRANT_URL || 'http://localhost:6333',
  qdrantApiKey: process.env.QDRANT_API_KEY || '',
  qdrantCollectionName: process.env.QDRANT_COLLECTION_NAME || 'knowledge_base',

  // RAG Configuration
  ragEnabled: process.env.RAG_ENABLED === 'true',
  ragTopK: parseInt(process.env.RAG_TOP_K || '5'),
  ragScoreThreshold: parseFloat(process.env.RAG_SCORE_THRESHOLD || '0.7'),
  ragUseReranking: process.env.RAG_USE_RERANKING !== 'false', // Default to true

  // Embedding Configuration (Local/Free using Transformers.js)
  embeddingProvider: process.env.EMBEDDING_PROVIDER || 'transformers', // 'transformers', 'openai', 'voyage'
  embeddingModel: process.env.EMBEDDING_MODEL || 'Xenova/all-MiniLM-L6-v2',
  rerankerModel: process.env.RERANKER_MODEL || 'Xenova/ms-marco-MiniLM-L-6-v2',

  // Security & Authentication
  jwtSecret: process.env.JWT_SECRET || '',
  sessionTokenTtl: parseInt(process.env.SESSION_TOKEN_TTL || '1800'),
  sessionRefreshThreshold: parseInt(process.env.SESSION_REFRESH_THRESHOLD || '180'),
  allowedDomains: process.env.ALLOWED_DOMAINS?.split(',') || [],
  enableTokenRotation: process.env.ENABLE_TOKEN_ROTATION === 'true',
  maxSessionsPerUser: parseInt(process.env.MAX_SESSIONS_PER_USER || '5'),
  sessionAuditEnabled: process.env.SESSION_AUDIT_ENABLED === 'true',

  // Rate Limiting
  rateLimitRequests: parseInt(process.env.RATE_LIMIT_REQUESTS || '10'),
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60'),
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
  corsEnabled: process.env.CORS_ENABLED === 'true',

  // Next.js
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  embedUrl: process.env.NEXT_PUBLIC_EMBED_URL || 'http://localhost:5000/embed',
};
