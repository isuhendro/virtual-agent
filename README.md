# Virtual Agent

A production-ready boilerplate template for building sophisticated LLM applications with both **RAG (Retrieval-Augmented Generation)** and **Agentic capabilities**. Built with Next.js 15 and SvelteJS, strictly using TailwindCSS for all styling.

## Overview

This project provides a **full-stack boilerplate** for creating working AI agents beyond simple chatbots. It's designed as a foundation for building production LLM applications with:

- **RAG Capabilities**: Vector search, document embeddings, semantic retrieval, and context-aware responses
- **Agentic Workflows**: Single-agent ReAct pattern with tool usage, reasoning, and state management
- **Production-Ready**: Scalable architecture, embeddable widgets, real-time streaming, and multi-provider LLM support

### Key Distinction

**This is NOT a simple chatbot template** - it's a comprehensive boilerplate for building **working LLM agents** that can:
- Retrieve and reason over large document collections (RAG)
- Execute tool-based workflows with memory and state (ReAct Agent)
- Integrate with vector databases for semantic search
- Support multiple LLM providers (Anthropic, OpenAI, Google)
- Stream responses in real-time via Server-Sent Events
- Be embedded anywhere via lightweight SvelteJS widget

### Project Components

1. **Next.js 15 Virtual Agent** - Core AI agent application with LangChain/LangGraph integration
2. **SvelteJS Wrapper** - Embeddable widget for seamless integration into any website

The system is fully customizable through environment variables, allowing adaptation to any use case without code changes.

## Project Structure

```
virtual-agent/
├── nextjs-agent/                      # Next.js 15 virtual agent application
│   ├── .husky/                        # Git hooks
│   │   └── pre-commit                 # Pre-commit hook
│   ├── src/
│   │   ├── app/                       # Next.js 15 App Router
│   │   │   ├── api/                   # API Routes
│   │   │   │   ├── chat/
│   │   │   │   │   └── route.ts       # Chat endpoint (LangChain streaming)
│   │   │   │   ├── health/
│   │   │   │   │   └── route.ts       # Health check endpoint
│   │   │   │   ├── reset/
│   │   │   │   │   └── route.ts       # Reset conversation endpoint
│   │   │   │   └── config/
│   │   │   │       └── route.ts       # Get agent configuration
│   │   │   ├── chat/
│   │   │   │   └── page.tsx           # Chat interface page
│   │   │   ├── embed/
│   │   │   │   └── page.tsx           # Embeddable chat widget (iframe target)
│   │   │   ├── layout.tsx             # Root layout
│   │   │   ├── page.tsx               # Home page
│   │   │   └── globals.css            # Global Tailwind CSS styles
│   │   ├── components/                # React components
│   │   │   ├── chat/
│   │   │   │   ├── ChatInterface.tsx  # Main chat UI
│   │   │   │   ├── MessageList.tsx    # Message display
│   │   │   │   ├── MessageInput.tsx   # User input field
│   │   │   │   └── TypingIndicator.tsx
│   │   │   ├── ui/                    # UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Avatar.tsx
│   │   │   │   └── Card.tsx
│   │   │   └── theme/
│   │   │       └── ThemeProvider.tsx  # Theme customization
│   │   ├── lib/                       # Utility functions
│   │   │   ├── langchain/             # LangChain integration
│   │   │   │   ├── chains.ts          # LangChain chains setup
│   │   │   │   ├── models.ts          # LLM model configurations
│   │   │   │   ├── anthropic.ts       # Anthropic/Claude integration
│   │   │   │   ├── openai.ts          # OpenAI integration
│   │   │   │   ├── prompts.ts         # Prompt templates
│   │   │   │   ├── memory.ts          # Conversation memory
│   │   │   │   └── streaming.ts       # Streaming utilities
│   │   │   ├── utils/
│   │   │   │   ├── rate-limiter.ts    # Rate limiting logic
│   │   │   │   ├── validation.ts      # Input validation
│   │   │   │   └── sanitize.ts        # Input sanitization
│   │   │   ├── config/
│   │   │   │   └── env.ts             # Environment config validation
│   │   │   └── db/                    # Database (optional)
│   │   │       ├── client.ts
│   │   │       └── schema.ts
│   │   ├── types/                     # TypeScript types
│   │   │   ├── chat.ts
│   │   │   ├── agent.ts
│   │   │   ├── langchain.ts           # LangChain type definitions
│   │   │   └── api.ts
│   │   ├── hooks/                     # React hooks
│   │   │   ├── useChat.ts
│   │   │   └── useAgent.ts
│   │   └── middleware.ts              # Next.js middleware (CORS, auth)
│   ├── public/                        # Static assets
│   │   ├── images/
│   │   │   ├── avatar-default.png
│   │   │   └── logo.svg
│   │   └── fonts/
│   ├── tests/                         # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── .env.example                   # Example environment variables
│   ├── .env.local                     # Local environment (git-ignored)
│   ├── .eslintrc.json                 # ESLint configuration
│   ├── .prettierrc                    # Prettier configuration
│   ├── next.config.js                 # Next.js configuration
│   ├── postcss.config.js              # PostCSS configuration
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── package.json
│   └── README.md
│
├── svelte-wrapper/                    # SvelteJS embeddable widget (NO chat logic)
│   ├── .husky/                        # Git hooks
│   │   └── pre-commit                 # Pre-commit hook
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/
│   │   │   │   ├── ChatWidget.svelte  # Main widget container
│   │   │   │   ├── WidgetButton.svelte # Bottom-right chat button
│   │   │   │   ├── WidgetDialog.svelte # Dialog/modal container
│   │   │   │   └── IframeContainer.svelte # iFrame wrapper
│   │   │   ├── stores/
│   │   │   │   ├── widget.ts          # Widget state (open/closed)
│   │   │   │   └── config.ts          # Configuration store
│   │   │   └── utils/
│   │   │       ├── iframe.ts          # iFrame communication utilities
│   │   │       └── position.ts        # Widget positioning logic
│   │   ├── routes/
│   │   │   ├── +page.svelte           # Demo/documentation page
│   │   │   └── +layout.svelte
│   │   ├── app.html
│   │   └── app.css                    # Tailwind CSS imports
│   ├── static/
│   │   └── widget.js                  # Compiled widget bundle
│   ├── .eslintrc.json                 # ESLint configuration
│   ├── .prettierrc                    # Prettier configuration
│   ├── postcss.config.js              # PostCSS configuration
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   ├── svelte.config.js
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
└── README.md                          # This file
```

## Core Features

### LLM & AI Capabilities
- **LangChain/LangGraph Integration**: Production-grade LLM orchestration with graph-based state management
- **Multi-Provider Support**: Seamlessly switch between Anthropic Claude, OpenAI, and Google Gemini
- **RAG Architecture**: Vector embeddings with Qdrant integration for semantic search and retrieval
- **Agentic Workflows**: Multi-step reasoning, tool usage, and autonomous task execution
- **Streaming Responses**: Real-time token streaming for immediate user feedback
- **Conversation Memory**: Context-aware responses with configurable history management
- **Custom Tools**: Extensible tool system for agent capabilities (web scraping, database queries, APIs)

### Frontend & Integration
- **Next.js 15 App Router**: Latest React 19 with Server Components and Server Actions
- **TailwindCSS Only**: Strictly uses TailwindCSS for 100% of styling across both projects
- **No Custom CSS**: All styling done via Tailwind utility classes and configuration
- **Embeddable Widget**: SvelteJS-based widget with iframe architecture for universal integration
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **Widget Customization**: Fully configurable positioning, colors, and behavior via Tailwind

### Backend & Infrastructure
- **Vector Database Ready**: Qdrant integration for embeddings storage and semantic search
- **PostgreSQL Database**: Robust relational database for structured data and state persistence
- **Streaming Responses**: Server-Sent Events (SSE) for real-time AI response streaming
- **Rate Limiting**: Built-in protection against abuse with configurable limits
- **Middleware System**: CORS, authentication, validation, and security headers
- **Environment-Based Config**: Complete customization via environment variables
- **Cloud-Agnostic**: Deployment patterns for any cloud provider (AWS, GCP, Azure) and containerized environments

### Developer Experience
- **TypeScript**: Full type safety across the codebase
- **Code Quality Tools**: ESLint, Prettier, Husky pre-commit hooks
- **File Size Limits**: Enforced maintainability standards (300 lines/file, 100 lines/function)
- **Testing Ready**: Jest configuration with ES modules support
- **Docker Support**: Complete Docker Compose setup for local testing
- **Monorepo Structure**: Clean separation between frontend agent and embeddable widget

## Quick Start

### Prerequisites

- Node.js 18.17+
- npm, yarn, or pnpm
- Git

### Next.js 15 Virtual Agent Setup

1. Navigate to the Next.js agent directory:
```bash
cd nextjs-agent
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create environment configuration:
```bash
cp .env.example .env.local
```

4. Configure your environment variables (see [Configuration](#configuration))

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The agent will be available at `http://localhost:3000`

### SvelteJS Wrapper Setup

1. Navigate to the SvelteJS wrapper directory:
```bash
cd svelte-wrapper
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The wrapper generator will be available at `http://localhost:5173`

## Configuration

The virtual agent is configured entirely through environment variables, making it adaptable to any use case.

### Environment Variables

Create a `.env.local` file in the `nextjs-agent` directory with the following variables:

#### Core Configuration

```env
# ==========================================
# LLM Provider Configuration (LangChain)
# ==========================================
LLM_PROVIDER="anthropic"     # "anthropic" or "openai"

# Anthropic Configuration (Claude)
ANTHROPIC_API_KEY="your-anthropic-api-key"
ANTHROPIC_MODEL="claude-3-5-sonnet-20241022"  # claude-3-5-sonnet-20241022, claude-3-opus-20240229, etc.

# OpenAI Configuration
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4"         # gpt-4, gpt-4-turbo, gpt-3.5-turbo, etc.

# LLM Parameters (applies to both providers)
MAX_TOKENS=1000
TEMPERATURE=0.7
TOP_P=1

# ==========================================
# Agent Behavior
# ==========================================
SYSTEM_PROMPT="You are a helpful virtual assistant..."
AGENT_NAME="Virtual Assistant"
AGENT_ROLE="Customer Support"
AGENT_DESCRIPTION="I'm here to help you with your questions"

# Agent Personality & Tone
AGENT_TONE="professional"  # professional, friendly, casual, formal
AGENT_LANGUAGE="en"        # en, es, fr, de, etc.
AGENT_GREETING="Hello! How can I help you today?"

# Use Case Specific
USE_CASE="customer_support"  # customer_support, sales, technical_support, etc.
BUSINESS_NAME="Your Business"
BUSINESS_CONTEXT="Your business description here"
KNOWLEDGE_BASE_URL=""        # Optional: URL to knowledge base/FAQ
FALLBACK_MESSAGE="I'm sorry, I don't have enough information to answer that. Would you like me to connect you with a human agent?"

# ==========================================
# Conversation Settings
# ==========================================
MAX_CONVERSATION_HISTORY=10  # Number of messages to keep in context
CONVERSATION_TIMEOUT=1800    # seconds (30 minutes)
ENABLE_STREAMING=true        # Enable streaming responses

# ==========================================
# Rate Limiting
# ==========================================
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW=60         # seconds
RATE_LIMIT_ENABLED=true

# ==========================================
# UI Customization
# ==========================================
PRIMARY_COLOR="#007bff"
SECONDARY_COLOR="#6c757d"
BACKGROUND_COLOR="#ffffff"
TEXT_COLOR="#333333"
BRAND_LOGO_URL=""
AGENT_AVATAR_URL=""
FONT_FAMILY="system-ui, sans-serif"

# Widget Settings (for iframe embed)
WIDGET_POSITION="bottom-right"  # bottom-right, bottom-left, top-right, top-left
WIDGET_SIZE="medium"            # small, medium, large
ENABLE_MINIMIZE=true
ENABLE_SOUND=false

# ==========================================
# Integration & Security
# ==========================================
ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"
CORS_ENABLED=true
WEBHOOK_URL=""               # Optional: webhook for conversation logging
WEBHOOK_SECRET=""            # Optional: secret for webhook authentication
ANALYTICS_ENABLED=false
ANALYTICS_ID=""

# ==========================================
# Database (Optional)
# ==========================================
DATABASE_URL=""              # PostgreSQL, MySQL, etc.
ENABLE_CONVERSATION_LOGGING=false

# ==========================================
# Next.js Specific
# ==========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_EMBED_URL="http://localhost:3000/embed"  # URL for iframe embedding
NEXT_PUBLIC_AGENT_NAME="${AGENT_NAME}"
NEXT_PUBLIC_PRIMARY_COLOR="${PRIMARY_COLOR}"
```

#### Example Configurations

**Customer Support Agent with Anthropic Claude:**
```env
LLM_PROVIDER="anthropic"
ANTHROPIC_API_KEY="sk-ant-..."
ANTHROPIC_MODEL="claude-3-5-sonnet-20241022"
SYSTEM_PROMPT="You are a friendly customer support agent for ${BUSINESS_NAME}. Help users with their questions, troubleshoot issues, and escalate complex problems to human agents when needed. Always be polite, patient, and solution-oriented."
AGENT_NAME="SupportBot"
AGENT_ROLE="Customer Support Specialist"
USE_CASE="customer_support"
AGENT_TONE="friendly"
AGENT_GREETING="Hi there! I'm here to help with any questions or issues you might have. How can I assist you today?"
```

**Sales Agent with OpenAI:**
```env
LLM_PROVIDER="openai"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4-turbo"
SYSTEM_PROMPT="You are a knowledgeable sales assistant for ${BUSINESS_NAME}. Help customers find the right products, answer product questions, and guide them through the purchasing process. Be enthusiastic but not pushy."
AGENT_NAME="SalesBot"
AGENT_ROLE="Sales Assistant"
USE_CASE="sales"
AGENT_TONE="professional"
AGENT_GREETING="Welcome! I'd love to help you find what you're looking for. What brings you here today?"
```

**Technical Support with Claude:**
```env
LLM_PROVIDER="anthropic"
ANTHROPIC_API_KEY="sk-ant-..."
ANTHROPIC_MODEL="claude-3-opus-20240229"
SYSTEM_PROMPT="You are a technical support specialist for ${BUSINESS_NAME}. Provide detailed technical assistance, troubleshooting steps, and solutions to technical problems. Use clear, step-by-step instructions and verify user understanding."
AGENT_NAME="TechBot"
AGENT_ROLE="Technical Support Engineer"
USE_CASE="technical_support"
AGENT_TONE="professional"
AGENT_GREETING="Hello! I'm your technical support assistant. Please describe the technical issue you're experiencing."
```

## Next.js 15 Folder Structure Details

### `/src/app` - App Router Structure

Next.js 15 uses the App Router with the following conventions:

- **`layout.tsx`**: Shared layouts for routes. The root layout wraps all pages.
- **`page.tsx`**: Route entry points. Each folder with a page.tsx becomes a route.
- **`route.ts`**: API route handlers (replaces pages/api from old structure)
- **`loading.tsx`**: Loading states (optional)
- **`error.tsx`**: Error handling UI (optional)
- **`not-found.tsx`**: 404 page (optional)

### `/src/app/api` - API Routes

API routes in Next.js 15 use the new Route Handlers:

```typescript
// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Handle chat requests
  const body = await request.json();
  // Process with AI
  return NextResponse.json({ response: '...' });
}
```

### `/src/lib` - Business Logic

Separated by concern:

- **`langchain/`**: LangChain integration for multiple LLM providers
  - **`chains.ts`**: Set up LangChain conversation chains
  - **`models.ts`**: Initialize LLM models based on provider (Anthropic/OpenAI)
  - **`anthropic.ts`**: Anthropic/Claude specific configuration
  - **`openai.ts`**: OpenAI specific configuration
  - **`prompts.ts`**: LangChain prompt templates and management
  - **`memory.ts`**: Conversation memory and context handling
  - **`streaming.ts`**: Streaming response utilities
- **`utils/`**: Helper functions and utilities
- **`config/`**: Configuration and environment validation
- **`db/`**: Database clients and schemas

### `/src/components` - React Components

Organized by feature:

- **`chat/`**: Chat-specific components
- **`ui/`**: Reusable UI components
- **`theme/`**: Theme and styling components

### Key Files Explained

#### Key Implementation Files

**`src/middleware.ts`** - Request processing layer
- CORS handling for cross-origin requests
- Rate limiting to prevent abuse
- Authentication verification
- Request validation and sanitization

**`src/app/api/chat/route.ts`** - Main chat endpoint
- SSE streaming for real-time responses
- Provider-agnostic LLM initialization
- Thread-based conversation management
- Error handling and graceful degradation

**`src/lib/langchain/models.ts`** - LLM initialization
- Multi-provider support (Anthropic, OpenAI, Google)
- Environment-based configuration
- Model parameter management (temperature, tokens)
- Provider switching via environment variables

## Usage

### Embedding the Virtual Agent

The SvelteJS wrapper provides a chat widget that iframes your Next.js virtual agent. The widget includes:
- A floating button positioned at the bottom-right
- Open/close dialog functionality
- An iframe that loads the Next.js `/embed` route
- No chat logic in the Svelte component itself (all chat functionality is in Next.js)

#### Embed the widget on your website:

1. Build the SvelteJS widget:
```bash
cd svelte-wrapper
npm run build
```

2. Copy the compiled `widget.js` to your website and add to your HTML:

```html
<!-- Add this before closing </body> tag -->
<script src="https://your-cdn.com/widget.js"></script>
<script>
  VirtualAgent.init({
    embedUrl: 'https://your-nextjs-agent.com/embed',  // Next.js embed route
    position: 'bottom-right',
    primaryColor: '#007bff',
    agentName: 'Support Assistant'
  });
</script>
```

#### How it works:

1. **SvelteJS Widget**: Provides the UI shell (button, dialog, iframe container)
2. **iFrame**: Loads `https://your-nextjs-agent.com/embed`
3. **Next.js Embed Route**: Contains the full chat interface and LangChain logic
4. **Communication**: Widget and iframe communicate via `postMessage` API

### Customizing for Different Use Cases

Simply update the environment variables and restart the Next.js application:

```bash
# Update .env.local with new configuration
npm run dev
```

No code changes required!

## Code Quality & Linting

Both projects enforce strict code quality standards using ESLint, Prettier, and Git hooks.

### Git Hooks Configuration

Both projects use **Husky** for Git hooks to ensure code quality before commits.

#### Setup Git Hooks

After installing dependencies, initialize Husky:

```bash
# In nextjs-agent directory
cd nextjs-agent
npm install
npm run prepare  # Initializes Husky

# In svelte-wrapper directory
cd svelte-wrapper
npm install
npm run prepare  # Initializes Husky
```

#### Pre-commit Hook Configuration

Create `.husky/pre-commit` in both projects:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint-staged
```

#### Lint-Staged Configuration

**Next.js Agent** - Add to `package.json`:
```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --fix --max-warnings=0",
      "prettier --write"
    ],
    "src/**/*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

**SvelteJS Widget** - Add to `package.json`:
```json
{
  "lint-staged": {
    "src/**/*.{svelte,ts,js}": [
      "eslint --fix --max-warnings=0",
      "prettier --write"
    ],
    "src/**/*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

### ESLint Configuration

#### Next.js Agent - `.eslintrc.json`
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:tailwindcss/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "tailwindcss"],
  "rules": {
    "max-lines": ["error", { "max": 300, "skipBlankLines": true, "skipComments": true }],
    "max-lines-per-function": ["error", { "max": 100, "skipBlankLines": true, "skipComments": true }],
    "complexity": ["error", 10],
    "@typescript-eslint/no-unused-vars": "error",
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/no-custom-classname": "off"
  }
}
```

#### SvelteJS Widget - `.eslintrc.json`
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:svelte/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:tailwindcss/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "extraFileExtensions": [".svelte"]
  },
  "overrides": [
    {
      "files": ["*.svelte"],
      "parser": "svelte-eslint-parser",
      "parserOptions": {
        "parser": "@typescript-eslint/parser"
      }
    }
  ],
  "plugins": ["@typescript-eslint", "tailwindcss"],
  "rules": {
    "max-lines": ["error", { "max": 300, "skipBlankLines": true, "skipComments": true }],
    "max-lines-per-function": ["error", { "max": 100, "skipBlankLines": true, "skipComments": true }],
    "complexity": ["error", 10],
    "@typescript-eslint/no-unused-vars": "error",
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/no-custom-classname": "off"
  }
}
```

### Prettier Configuration

Create `.prettierrc` in both projects:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

For Svelte, also add `prettier-plugin-svelte`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  "pluginSearchDirs": ["."],
  "overrides": [
    {
      "files": "*.svelte",
      "options": {
        "parser": "svelte"
      }
    }
  ]
}
```

### Tailwind CSS Configuration

#### Next.js Agent - `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### SvelteJS Widget - `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### File Size Limits

ESLint is configured to enforce the following limits:

- **Maximum lines per file**: 300 lines (excluding blank lines and comments)
- **Maximum lines per function**: 100 lines (excluding blank lines and comments)
- **Cyclomatic complexity**: Maximum of 10

These rules ensure files remain maintainable and functions stay focused on single responsibilities.

### Running Code Quality Checks

```bash
# Format all files
npm run format

# Lint and fix issues
npm run lint:fix

# Type check (Next.js)
npm run type-check

# Svelte component check (Svelte)
npm run check
```

## Development

### Next.js Agent Development

```bash
cd nextjs-agent
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues automatically
npm run format     # Format code with Prettier
npm run type-check # TypeScript type checking
npm run test       # Run tests
```

### SvelteJS Wrapper Development

```bash
cd svelte-wrapper
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run check      # Check Svelte components with svelte-check
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues automatically
npm run format     # Format code with Prettier
```

## Deployment

### Next.js Agent

Deploy to Vercel (recommended for Next.js 15):

```bash
cd nextjs-agent
vercel
```

Or any Node.js hosting platform:

```bash
npm run build
npm run start
```

### SvelteJS Wrapper

Deploy the built snippet generator:

```bash
cd svelte-wrapper
npm run build
# Deploy the build/ folder to your static hosting
```

## API Endpoints

### Next.js Agent API

- `POST /api/chat` - Send messages to the virtual agent
  - Request: `{ message: string, conversationId?: string }`
  - Response: Streaming or JSON response

- `GET /api/health` - Health check endpoint
  - Response: `{ status: 'ok', timestamp: number }`

- `POST /api/reset` - Reset conversation context
  - Request: `{ conversationId: string }`
  - Response: `{ success: boolean }`

- `GET /api/config` - Get public agent configuration
  - Response: Agent name, greeting, theme colors, etc.

## Security Considerations

- Never commit `.env.local` or `.env` files containing API keys
- Use environment variables for all sensitive data
- Implement rate limiting in production
- Validate and sanitize all user inputs
- Use HTTPS in production
- Configure CORS properly with `ALLOWED_ORIGINS`
- Use Next.js 15 middleware for security headers
- Implement CSP (Content Security Policy) headers
- Regular dependency updates for security patches

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE)

## Support

For issues and questions:
- Open an issue on GitHub
- Contact: support@your-domain.com

## Roadmap

- [ ] Multi-language support with i18n
- [ ] Analytics dashboard
- [ ] Conversation export (CSV, JSON)
- [ ] Custom integrations (Slack, Discord, Teams)
- [ ] Voice support (Speech-to-Text, Text-to-Speech)
- [ ] Advanced personalization with user profiles
- [ ] A/B testing capabilities
- [ ] Enhanced tool ecosystem (more pre-built tools)
- [ ] Plugin system for custom behaviors
- [ ] Mobile app (React Native)

## Architecture Patterns & Best Practices

This boilerplate incorporates production-tested patterns for building scalable LLM applications:

### RAG (Retrieval-Augmented Generation) Architecture

**Vector Database Integration**
- **Qdrant** for high-performance vector storage and similarity search
- **SentenceTransformer embeddings** for semantic document representation
- **Hybrid search patterns**: Combine vector similarity with metadata filtering
- **Chunking strategies**: Intelligent document splitting for optimal retrieval

**Retrieval Pipeline Flow**
1. User Query → Embedding Generation
2. Vector Similarity Search (top-k results)
3. Optional Reranking for relevance
4. Context Assembly from retrieved documents
5. LLM Generation with context

**Key Components**
- `/src/lib/vector-db/` - Vector database operations and management
- `/src/lib/embeddings/` - Embedding model initialization and caching
- `/src/lib/retrieval/` - Query processing and reranking logic
- `/src/lib/langchain/rag-chains.ts` - RAG-specific LangChain chains

### Agentic Workflows with LangGraph

**Graph-Based State Management**
- **LangGraph** for multi-step agent workflows with persistent state
- **State persistence** via PostgreSQL checkpointing
- **Tool integration** for extending agent capabilities
- **Conditional routing** based on agent decisions

**Agent Patterns**:
- **ReAct (Reasoning + Acting)**: Agent that plans, executes tools, and reflects on results
- **Tool Integration**: Extensible system for adding custom capabilities
- **Human-in-the-loop**: Optional approval gates for critical decisions
- **Error Recovery**: Automatic retry and fallback mechanisms

**Key Components**
- `/src/lib/langchain/graph-manager.ts` - LangGraph workflow orchestration
- `/src/lib/langchain/agents/` - Agent definitions and configurations
- `/src/lib/langchain/tools/` - Tool implementations (search, scraping, APIs)
- `/src/lib/langchain/state/` - State schemas and management
- `/src/lib/langchain/persistence/` - PostgreSQL checkpoint implementation

### Streaming Response Patterns

**Server-Sent Events (SSE)**
- **Unidirectional streaming** from server to client for AI responses
- **Built-in reconnection**: Automatic retry with Last-Event-ID
- **HTTP-based**: Works through firewalls and proxies
- **Simple implementation**: Native browser EventSource API
- **Token streaming**: Real-time LLM response delivery

**Request/Response Flow**
- **Chat requests**: Standard HTTP POST to `/api/chat`
- **Response streaming**: SSE connection for token-by-token delivery
- **Connection lifecycle**: Auto-close after response completion
- **Error handling**: Graceful fallback and retry mechanisms

### Database Architecture

**PostgreSQL Primary**
- **UUID-based IDs** for distributed systems compatibility
- **Conversation tables**: `msg_conversations`, `msg_messages`, `msg_conversation_members`
- **Transactional consistency** for message delivery guarantees
- **Indexing strategy**: Optimized for conversation list queries and message retrieval

**Vector Store (Qdrant)**
- **Collections per use case**: Separate collections for different document types
- **Metadata filtering**: Efficient filtering on domain, status, expiry dates
- **Soft delete support**: Mark documents as deleted without removing vectors
- **Expiry management**: Automatic purging of expired documents

### TailwindCSS Styling Strategy

**Strict TailwindCSS Approach**
- **No custom CSS files** except for Tailwind imports and global resets
- **Utility-first classes** for all component styling
- **Tailwind plugins**: Custom utilities via configuration, not separate CSS files
- **Theme extension**: All design tokens defined in `tailwind.config.js`

**Configuration Requirements**
- Dark mode via `class` strategy
- Content paths covering all component files
- Theme extensions for custom colors, animations, z-index
- Custom utilities via plugin functions (no separate CSS files)
- All styling through Tailwind utility classes

**Best Practices**
- Use Tailwind plugins for custom utilities instead of CSS files
- Extend theme for design tokens (colors, spacing, animations)
- Disable third-party CSS-in-JS when using component libraries
- Maintain consistency with `prettier-plugin-tailwindcss` for class sorting

### Environment-Based Configuration

**Multi-Environment Support**
- `.env.development` - Local development configuration
- `.env.production` - Production deployment configuration
- `.env.docker` - Docker container configuration
- Environment variable validation on startup

**Configuration Categories**:
- **LLM Settings**: Provider, model, temperature, token limits
- **Database URLs**: PostgreSQL and Qdrant endpoints
- **API Keys**: Securely managed provider credentials
- **Feature Flags**: Enable/disable specific capabilities
- **UI Customization**: Colors, branding, widget positioning

## Architecture

### Next.js 15 Agent Architecture

```
┌─────────────────────────────────────┐
│    User Interface (React/Next.js)   │
│      - Chat Components              │
│      - Theme Provider               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Next.js 15 App Router          │
│   - Server Components               │
│   - API Routes (Route Handlers)     │
│   - Middleware                      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Environment Configuration         │
│   - System Prompt                   │
│   - Use Case Settings               │
│   - Theme & Branding                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Business Logic Layer           │
│   - Rate Limiting                   │
│   - Input Validation                │
│   - Context Management              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   LangChain LLM Integration         │
│   - Anthropic Claude / OpenAI       │
│   - Streaming Responses             │
│   - Prompt Templates                │
│   - Conversation Memory             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Response Processing & Delivery    │
└─────────────────────────────────────┘
```

### SvelteJS Widget Architecture

```
┌─────────────────────────────────────┐
│   User's Website                    │
│   <script src="widget.js"></script> │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Svelte Widget Components          │
│   - WidgetButton (bottom-right)     │
│   - WidgetDialog (open/close)       │
│   - IframeContainer                 │
│   NO CHAT LOGIC HERE                │
└──────────────┬──────────────────────┘
               │
               │ iFrame loads:
               │ /embed route
               ▼
┌─────────────────────────────────────┐
│   Next.js /embed Route              │
│   - Full Chat Interface             │
│   - LangChain Integration           │
│   - Message Handling                │
│   - Streaming Responses             │
└──────────────┬──────────────────────┘
               │
               │ postMessage API
               ▼
┌─────────────────────────────────────┐
│   Widget ↔ iFrame Communication     │
│   - Resize events                   │
│   - Theme sync                      │
│   - Status updates                  │
└─────────────────────────────────────┘
```

## Technology Stack

### Next.js Agent (Core AI Application)
- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript (full type safety)
- **LLM Orchestration**:
  - LangChain (`langchain`) for LLM abstraction
  - LangGraph for multi-agent workflows and state graphs
  - `@langchain/anthropic` for Claude integration
  - `@langchain/openai` for GPT integration
  - `@langchain/google-genai` for Gemini integration
- **Vector Database**: Qdrant for embeddings storage and semantic search
- **Embeddings**: SentenceTransformer models for document vectorization
- **Database**: PostgreSQL for relational data and conversation state
- **Streaming**: Server-Sent Events (SSE) for real-time AI response streaming
- **Styling**: **TailwindCSS only** (strictly enforced, no custom CSS)
  - TailwindCSS 3.4+ with custom configuration
  - Dark mode support via `class` strategy
  - Custom utilities via Tailwind plugins
  - All components styled exclusively with Tailwind utility classes
- **State Management**:
  - React hooks for local state
  - Zustand for global client state
  - LangGraph for agent state persistence
- **Validation**: Zod for runtime type validation
- **Authentication**: NextAuth.js with OAuth providers
- **Code Quality**:
  - ESLint with Next.js, TypeScript, and Tailwind plugins
  - Prettier with tailwind plugin for class sorting
  - Husky pre-commit hooks
  - lint-staged for incremental checks
- **Testing**: Jest with ES modules support, React Testing Library
- **Build**: Next.js Turbopack for fast development

### SvelteJS Widget (Embeddable Integration)
- **Framework**: Svelte 5 (compiled to standalone widget)
- **Language**: TypeScript
- **Purpose**: Lightweight UI shell (button, dialog, iframe container)
- **Styling**: **TailwindCSS only** (strictly enforced)
  - TailwindCSS 4.0+ via Vite plugin
  - Flowbite components for rapid UI development
  - Flowbite-Svelte for Svelte-specific components
  - No custom CSS beyond Tailwind configuration
- **Build**: Vite 6 for fast bundling and HMR
- **State**: Svelte stores for widget state (open/close, configuration)
- **Communication**: postMessage API for secure iframe communication
- **Code Quality**:
  - ESLint with Svelte and Tailwind plugins
  - Prettier with svelte and tailwind plugins
  - svelte-check for component validation
  - Husky pre-commit hooks
- **Bundle**: Compiles to single `widget.js` file for easy embedding

### Infrastructure & DevOps
- **Containerization**: Docker with multi-stage builds
- **Deployment**:
  - Cloud-agnostic containerized deployment (AWS ECS, GCP Cloud Run, Azure Container Apps)
  - Serverless options (Vercel, Netlify, AWS Lambda)
  - Traditional VPS/VM deployment support
  - Docker Compose for local development and testing
- **Logging**: Structured logging with cloud-agnostic log aggregation
- **Monitoring**: Health check endpoints compatible with any monitoring service
- **Environment**: Multi-environment configuration (.env files)
- **Version Control**: Git with conventional commits
- **CI/CD Ready**: GitHub Actions, GitLab CI, or any CI/CD platform

## Key Dependencies

### Next.js Agent (`package.json`)
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "langchain": "^0.3.0",
    "@langchain/anthropic": "^0.3.0",
    "@langchain/openai": "^0.3.0",
    "@langchain/core": "^0.3.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.0.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-tailwindcss": "^3.15.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "prepare": "husky install"
  }
}
```

### SvelteJS Widget (`package.json`)
```json
{
  "dependencies": {
    "svelte": "^4.0.0"
  },
  "devDependencies": {
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^3.0.0",
    "vite": "^5.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.57.0",
    "eslint-plugin-svelte": "^2.35.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-tailwindcss": "^3.15.0",
    "prettier": "^3.2.0",
    "prettier-plugin-svelte": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "svelte-check": "^3.6.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0"
  },
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-check --tsconfig ./tsconfig.json",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"src/**/*.{svelte,ts,js,json,css,md}\"",
    "prepare": "husky install"
  }
}
```

## Implementation Guide

### RAG (Retrieval-Augmented Generation)

**Vector Database Setup**
- Initialize Qdrant client with collections for document storage
- Configure vector dimensions (384 for SentenceTransformer models)
- Set distance metric (Cosine similarity recommended)

**Document Ingestion Pipeline**
1. **Chunking**: Split documents into 500-token chunks with 50-token overlap
2. **Embedding**: Generate vector embeddings using SentenceTransformer
3. **Storage**: Upsert vectors to Qdrant with metadata (domain, timestamp, etc.)

**RAG Chain Integration**
- Create vector store wrapper around Qdrant client
- Configure retriever with top-k results (typically 5)
- Build LangChain sequence: retrieval → context formatting → LLM generation
- Implement reranking for improved relevance (optional)

### Agentic Workflows

**LangGraph State Management**
- Define agent state schema (messages, documents, tool results)
- Configure state channels with merge strategies
- Implement state persistence via PostgreSQL checkpointer

**Tool Integration**
- Create custom tools using `DynamicTool` from LangChain
- Common tools: document search, web scraping, API calls, database queries
- Each tool needs: name, description, and async function implementation

**ReAct Agent Pattern**
- Use `createReactAgent` from LangGraph prebuilt
- Configure with LLM model and tool array
- Add system message to guide tool usage
- Enable state persistence for conversation continuity

### SSE Streaming

**Server-Side Implementation**
- Create API route that accepts POST requests with message/threadId
- Stream agent responses using `TransformStream` and `TextEncoder`
- Send SSE-formatted chunks: `data: {json}\n\n`
- Send `[DONE]` signal when complete
- Handle errors gracefully in stream

**Client-Side Integration**
- Use Fetch API with streaming body reader
- Parse SSE format: extract data after `data: ` prefix
- Update UI progressively as tokens arrive
- Handle reconnection and errors
- Close stream after `[DONE]` signal

**React Hook Pattern**
- Create `useSSE` hook for reusable streaming logic
- Manage state: response accumulator, streaming status, errors
- Trigger fetch on message change
- Return streaming state and response for UI rendering

### Production Deployment Checklist

**Environment Variables**
- [ ] All LLM API keys configured (Anthropic, OpenAI, Google)
- [ ] Vector database URL and credentials (Qdrant)
- [ ] PostgreSQL connection string
- [ ] SSE endpoint configuration and CORS
- [ ] Authentication secrets (NextAuth)
- [ ] CORS allowed origins

**Database Setup**
- [ ] PostgreSQL migrations run
- [ ] Qdrant collections created
- [ ] Index optimization completed
- [ ] Backup strategy configured

**Security**
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] API keys stored in secure secrets manager
- [ ] HTTPS enforced in production

**Performance**
- [ ] Vector database indexed
- [ ] Connection pooling configured
- [ ] Caching strategy implemented
- [ ] CDN configured for widget assets

**Monitoring**
- [ ] Health check endpoints tested
- [ ] Logging configured and centralized
- [ ] Error tracking service integrated
- [ ] Performance metrics collected

## Acknowledgments

Built with:
- [Next.js 15](https://nextjs.org/)
- [LangChain](https://js.langchain.com/)
- [Anthropic Claude](https://www.anthropic.com/)
- [OpenAI](https://openai.com/)
- [SvelteJS](https://svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
