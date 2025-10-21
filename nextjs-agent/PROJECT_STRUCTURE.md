# Next.js Agent Project Structure

## Overview
This document outlines the folder structure created for the virtual-agent nextjs-agent application.

## Directory Structure

```
nextjs-agent/
├── .husky/                        # Git hooks (placeholder)
├── src/
│   ├── app/                       # Next.js 15 App Router
│   │   ├── api/                   # API Routes
│   │   │   ├── chat/route.ts      # ✓ Chat endpoint (SSE streaming)
│   │   │   ├── session/route.ts   # ✓ Session token management
│   │   │   ├── health/route.ts    # ✓ Health check endpoint
│   │   │   ├── reset/route.ts     # ✓ Reset conversation endpoint
│   │   │   └── config/route.ts    # ✓ Get agent configuration
│   │   ├── chat/page.tsx          # ✓ Standalone chat interface page
│   │   ├── embed/page.tsx         # ✓ Embeddable chat widget page
│   │   ├── layout.tsx             # ✓ Root layout (default from Next.js)
│   │   ├── page.tsx               # ✓ Home page (default from Next.js)
│   │   └── globals.css            # ✓ Global Tailwind CSS with theme vars
│   ├── components/                # React components
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx  # ✓ Main chat UI container
│   │   │   ├── ChatHeader.tsx     # ✓ Chat header with agent info
│   │   │   ├── MessageList.tsx    # ✓ Message list container
│   │   │   ├── MessageBubble.tsx  # ✓ Individual message bubble
│   │   │   ├── MessageInput.tsx   # ✓ User input field
│   │   │   ├── ChatBackground.tsx # ✓ SVG background component
│   │   │   ├── StarterPrompts.tsx # ✓ Suggested questions component
│   │   │   └── TypingIndicator.tsx # ✓ Typing indicator
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── Button.tsx         # ✓ Button component
│   │   │   ├── Avatar.tsx         # ✓ Avatar component
│   │   │   └── Card.tsx           # ✓ Card component
│   │   └── theme/
│   │       └── ThemeProvider.tsx  # ✓ Theme customization provider
│   ├── lib/                       # Utility functions
│   │   ├── langchain/             # LangChain integration
│   │   │   ├── chains.ts          # ✓ LangChain chains setup (placeholder)
│   │   │   ├── models.ts          # ✓ LLM model configurations (placeholder)
│   │   │   ├── prompts.ts         # ✓ Prompt templates
│   │   │   ├── memory.ts          # ✓ Conversation memory (placeholder)
│   │   │   ├── agents/            # Agent definitions (directory created)
│   │   │   ├── tools/             # Agent tools (directory created)
│   │   │   ├── state/             # State schemas (directory created)
│   │   │   └── persistence/       # PostgreSQL checkpointing (directory created)
│   │   ├── vector-db/             # Qdrant integration (directory created)
│   │   ├── embeddings/            # Embedding models (directory created)
│   │   ├── utils/
│   │   │   ├── rate-limiter.ts    # ✓ Rate limiting utility
│   │   │   ├── validation.ts      # ✓ Input validation
│   │   │   └── sanitize.ts        # ✓ Input sanitization
│   │   ├── config/
│   │   │   └── env.ts             # ✓ Environment config validation
│   │   └── db/                    # Database
│   │       ├── client.ts          # ✓ PostgreSQL client (placeholder)
│   │       └── schema.ts          # ✓ Database schema definitions
│   ├── middleware/                # Middleware/Plugin hooks
│   │   ├── pre-message/           # Pre-message hooks (directory created)
│   │   ├── post-message/          # Post-message hooks (directory created)
│   │   ├── on-error/              # Error handling hooks (directory created)
│   │   ├── on-tool-call/          # Tool invocation hooks (directory created)
│   │   └── index.ts               # ✓ Hook registration
│   ├── types/                     # TypeScript types
│   │   └── index.ts               # ✓ Type definitions
│   ├── hooks/                     # React hooks
│   │   ├── useChat.ts             # ✓ Chat state management
│   │   ├── useSSE.ts              # ✓ SSE streaming hook
│   │   └── useAgent.ts            # ✓ Agent config hook
│   └── middleware.ts              # ✓ Next.js middleware
├── public/                        # Static assets
│   ├── images/                    # Images (directory created)
│   ├── backgrounds/               # SVG backgrounds (directory created)
│   └── fonts/                     # Fonts (directory created)
├── tests/                         # Test files (directory created)
├── .env.example                   # ✓ Complete environment variable template
├── .eslintrc.json                 # ✓ ESLint configuration (default)
├── next.config.ts                 # ✓ Next.js configuration (default)
├── postcss.config.mjs             # ✓ PostCSS configuration (Tailwind v4)
├── tsconfig.json                  # ✓ TypeScript configuration (default)
└── package.json                   # ✓ Dependencies and scripts

```

## Status Summary

### ✅ Completed
- [x] Next.js 15 initialization with TypeScript
- [x] All folder structure created per README specification
- [x] All 5 API routes with placeholder implementations
- [x] All 8 chat components
- [x] All 3 UI components  
- [x] Theme provider
- [x] All 3 React hooks (useChat, useSSE, useAgent)
- [x] Middleware system structure
- [x] LangChain library placeholders
- [x] Database schema and client placeholders
- [x] Utilities (validation, sanitization, rate limiting)
- [x] Type definitions
- [x] Complete .env.example with all variables
- [x] Tailwind CSS v4 theme configuration

### 📝 Implementation Needed
The following are placeholder files that need full implementation:
- LangChain integration (models, chains, agents, tools)
- PostgreSQL database client and queries
- Qdrant vector database integration
- Embedding models setup
- SSE streaming implementation
- JWT token generation and validation
- Middleware hooks (pre-message, post-message, etc.)
- Full chat functionality

## Next Steps

1. Install LangChain dependencies:
   ```bash
   npm install langchain @langchain/anthropic @langchain/openai @langchain/google-genai
   ```

2. Install database dependencies:
   ```bash
   npm install pg @qdrant/qdrant-js jsonwebtoken
   ```

3. Install additional utilities:
   ```bash
   npm install zod uuid
   ```

4. Copy .env.example to .env.local and configure:
   ```bash
   cp .env.example .env.local
   ```

5. Implement core functionality based on placeholders

## Notes

- Using Tailwind CSS v4 with @tailwindcss/postcss
- Theme colors configured via CSS variables in globals.css
- All components use 'use client' directive where needed
- Strict TypeScript typing throughout
- Follows Next.js 15 App Router conventions
