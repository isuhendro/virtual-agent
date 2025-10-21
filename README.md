# Virtual Agent

A production-ready boilerplate template for building sophisticated LLM applications with both **RAG (Retrieval-Augmented Generation)** and **Agentic capabilities**. Built with Next.js 15 and SvelteJS, strictly using TailwindCSS for all styling.

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [UI Components](#ui-components)
- [Architecture](#architecture)
- [Implementation Guide](#implementation-guide)
- [Development](#development)
- [Deployment](#deployment)
- [Technology Stack](#technology-stack)
- [API Reference](#api-reference)
- [Security](#security)
- [Contributing](#contributing)

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

## Core Features

### LLM & AI Capabilities
- **LangChain/LangGraph Integration**: Production-grade LLM orchestration with graph-based state management
- **Multi-Provider Support**: Seamlessly switch between Anthropic Claude, OpenAI, and Google Gemini
- **RAG Architecture**: Vector embeddings with Qdrant integration for semantic search and retrieval
- **Agentic Workflows**: Single-agent ReAct pattern with tool usage, reasoning, and state management
- **Streaming Responses**: Real-time token streaming via Server-Sent Events (SSE)
- **Conversation Memory**: Context-aware responses with configurable history management
- **Custom Tools**: Extensible tool system for agent capabilities (web scraping, database queries, APIs)

### Frontend & Integration
- **Next.js 15 App Router**: Latest React 19 with Server Components and Server Actions
- **TailwindCSS Only**: Strictly uses TailwindCSS for 100% of styling across both projects
- **No Custom CSS**: All styling done via Tailwind utility classes and configuration
- **Embeddable Widget**: SvelteJS-based widget with iframe architecture for universal integration
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **Customizable UI**: Message bubbles, backgrounds, colors, and themes fully configurable

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
- PostgreSQL (optional, for state persistence)
- Qdrant (optional, for RAG capabilities)

### Next.js 15 Virtual Agent Setup

1. Navigate to the Next.js agent directory:
```bash
cd nextjs-agent
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env.local
```

4. Configure your environment variables (see [Configuration](#configuration))

5. Run the development server:
```bash
npm run dev
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

3. Add SVG icons (choose one approach):

**Option A: Using `src/lib/assets/` (Imported in components)**
```
src/lib/assets/
├── bot-icon.svg
├── close-icon.svg
└── minimize-icon.svg
```

**Option B: Using `static/icons/` (Direct URLs)**
```
static/icons/
└── bot-default.svg
```

4. Run the development server:
```bash
npm run dev
```

The wrapper generator will be available at `http://localhost:5173`

### Widget Playground Setup

A playground HTML page is provided in the root directory for testing the compiled widget:

1. Build the Svelte widget:
```bash
cd svelte-wrapper
npm run build
```

2. Copy the compiled widget to root:
```bash
cp svelte-wrapper/static/widget.js ./widget.js
```

3. Start the Next.js agent:
```bash
cd nextjs-agent
npm run dev
```

4. Open the playground in your browser:
```bash
open playground.html
```

The playground provides:
- Interactive widget testing environment
- Visual status indicators
- Configuration examples
- Setup instructions
- Testing checklist

## Project Structure

```
virtual-agent/
├── nextjs-agent/                      # Next.js 15 virtual agent application
│   ├── .husky/                        # Git hooks
│   ├── src/
│   │   ├── app/                       # Next.js 15 App Router
│   │   │   ├── api/                   # API Routes
│   │   │   │   ├── chat/route.ts      # Chat endpoint (SSE streaming)
│   │   │   │   ├── health/route.ts    # Health check endpoint
│   │   │   │   ├── reset/route.ts     # Reset conversation endpoint
│   │   │   │   └── config/route.ts    # Get agent configuration
│   │   │   ├── chat/page.tsx          # Chat interface page
│   │   │   ├── embed/page.tsx         # Embeddable chat widget
│   │   │   ├── layout.tsx             # Root layout
│   │   │   ├── page.tsx               # Home page
│   │   │   └── globals.css            # Global Tailwind CSS styles
│   │   ├── components/                # React components
│   │   │   ├── chat/
│   │   │   │   ├── ChatInterface.tsx  # Main chat UI container
│   │   │   │   ├── MessageList.tsx    # Message list container
│   │   │   │   ├── MessageBubble.tsx  # Individual message bubble
│   │   │   │   ├── MessageInput.tsx   # User input field
│   │   │   │   ├── ChatBackground.tsx # SVG background component
│   │   │   │   └── TypingIndicator.tsx # Typing indicator
│   │   │   ├── ui/                    # Reusable UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Avatar.tsx
│   │   │   │   └── Card.tsx
│   │   │   └── theme/
│   │   │       └── ThemeProvider.tsx  # Theme customization
│   │   ├── lib/                       # Utility functions
│   │   │   ├── langchain/             # LangChain integration
│   │   │   │   ├── chains.ts          # LangChain chains setup
│   │   │   │   ├── models.ts          # LLM model configurations
│   │   │   │   ├── agents/            # Agent definitions
│   │   │   │   ├── tools/             # Agent tools
│   │   │   │   ├── state/             # State schemas
│   │   │   │   ├── persistence/       # PostgreSQL checkpointing
│   │   │   │   ├── prompts.ts         # Prompt templates
│   │   │   │   └── memory.ts          # Conversation memory
│   │   │   ├── vector-db/             # Qdrant integration
│   │   │   ├── embeddings/            # Embedding models
│   │   │   ├── utils/
│   │   │   │   ├── rate-limiter.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── sanitize.ts
│   │   │   ├── config/
│   │   │   │   └── env.ts             # Environment config validation
│   │   │   └── db/                    # Database
│   │   │       ├── client.ts
│   │   │       └── schema.ts
│   │   ├── types/                     # TypeScript types
│   │   ├── hooks/                     # React hooks
│   │   │   ├── useChat.ts
│   │   │   ├── useSSE.ts              # SSE streaming hook
│   │   │   └── useAgent.ts
│   │   └── middleware.ts              # Next.js middleware
│   ├── public/                        # Static assets
│   │   ├── images/
│   │   │   ├── avatar-default.png
│   │   │   └── logo.svg
│   │   ├── backgrounds/               # SVG backgrounds
│   │   │   ├── default.svg
│   │   │   ├── gradient-1.svg
│   │   │   └── pattern-1.svg
│   │   └── fonts/
│   ├── tests/                         # Test files
│   ├── .env.example                   # Example environment variables
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── next.config.js
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   ├── tsconfig.json
│   └── package.json
│
├── svelte-wrapper/                    # SvelteJS embeddable widget
│   ├── .husky/                        # Git hooks
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/
│   │   │   │   ├── ChatWidget.svelte  # Main widget container
│   │   │   │   ├── WidgetButton.svelte # Bottom-right chat button
│   │   │   │   ├── WidgetDialog.svelte # Dialog/modal container
│   │   │   │   └── IframeContainer.svelte # iFrame wrapper
│   │   │   ├── stores/
│   │   │   │   ├── widget.ts          # Widget state
│   │   │   │   └── config.ts          # Configuration store
│   │   │   ├── assets/                # SVG icons and images
│   │   │   │   ├── bot-icon.svg       # Default bot/chat icon
│   │   │   │   ├── close-icon.svg     # Close button icon
│   │   │   │   └── minimize-icon.svg  # Minimize button icon
│   │   │   └── utils/
│   │   │       ├── iframe.ts          # iFrame communication
│   │   │       └── position.ts        # Widget positioning
│   │   ├── routes/
│   │   │   ├── +page.svelte           # Demo page
│   │   │   └── +layout.svelte
│   │   ├── app.html
│   │   └── app.css                    # Tailwind CSS imports
│   ├── static/
│   │   ├── icons/                     # Alternative: Static SVG icons
│   │   │   └── bot-default.svg        # Can be referenced directly
│   │   └── widget.js                  # Compiled widget bundle
│   ├── .eslintrc.json
│   ├── tailwind.config.js
│   ├── svelte.config.js
│   ├── vite.config.js
│   └── package.json
│
├── playground.html                    # Widget testing playground
├── widget.js                          # Compiled widget (copy from svelte-wrapper/static/)
└── README.md                          # This file
```

## Configuration

The virtual agent is configured entirely through environment variables, making it adaptable to any use case.

### Core Configuration

Create a `.env.local` file in the `nextjs-agent` directory:

```env
# =========================
# LLM Provider Configuration
# =========================
LLM_PROVIDER="anthropic"              # "anthropic", "openai", or "google"

# Anthropic Configuration (Claude)
ANTHROPIC_API_KEY="your-anthropic-api-key"
ANTHROPIC_MODEL="claude-3-5-sonnet-20241022"

# OpenAI Configuration
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4-turbo"

# Google Configuration
GOOGLE_API_KEY="your-google-api-key"
GOOGLE_MODEL="gemini-pro"

# LLM Parameters
MAX_TOKENS=1000
TEMPERATURE=0.7
TOP_P=1

# =========================
# Agent Behavior
# =========================
SYSTEM_PROMPT="You are a helpful virtual assistant..."
AGENT_NAME="Virtual Assistant"
AGENT_ROLE="Customer Support"
AGENT_GREETING="Hello! How can I help you today?"
USE_CASE="customer_support"

# =========================
# UI Customization
# =========================
PRIMARY_COLOR="#007bff"
SECONDARY_COLOR="#6c757d"
BACKGROUND_COLOR="#ffffff"
TEXT_COLOR="#333333"
CHAT_BACKGROUND_SVG="default"         # Name of SVG file in public/backgrounds/
BRAND_LOGO_URL=""
AGENT_AVATAR_URL=""

# Message Bubble Styling
USER_BUBBLE_COLOR="#007bff"
USER_BUBBLE_TEXT_COLOR="#ffffff"
AGENT_BUBBLE_COLOR="#f1f3f5"
AGENT_BUBBLE_TEXT_COLOR="#212529"
BUBBLE_BORDER_RADIUS="16"             # Border radius in pixels

# =========================
# Database Configuration
# =========================
DATABASE_URL="postgresql://user:password@localhost:5432/virtual_agent"
QDRANT_URL="http://localhost:6333"
QDRANT_API_KEY=""

# =========================
# Widget Settings
# =========================
WIDGET_POSITION="bottom-right"
WIDGET_SIZE="medium"
ENABLE_MINIMIZE=true

# =========================
# Security
# =========================
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW=60
ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"
CORS_ENABLED=true

# =========================
# Next.js Specific
# =========================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_EMBED_URL="http://localhost:3000/embed"
```

## UI Components

### Message Bubble Component (To Be Implemented)

The `MessageBubble.tsx` component should be created to display individual chat messages with full TailwindCSS customization.

**Current State:**
- Currently, `MessageList.tsx` renders all messages
- Need to extract individual message rendering into `MessageBubble.tsx` component
- This provides better separation of concerns and reusability

**Component Responsibilities:**

**`MessageList.tsx`** (Container):
- Manages array of messages
- Handles scrolling behavior
- Auto-scroll to bottom on new messages
- Renders list of `MessageBubble` components

**`MessageBubble.tsx`** (Individual Message):
- Renders single message with styling
- User vs Agent differentiation
- Avatar support
- Timestamp display
- Markdown rendering
- Streaming text support
- Customizable colors and border radius

**Recommended Implementation:**

**Styling via Environment Variables:**
```env
USER_BUBBLE_COLOR="#007bff"
USER_BUBBLE_TEXT_COLOR="#ffffff"
AGENT_BUBBLE_COLOR="#f1f3f5"
AGENT_BUBBLE_TEXT_COLOR="#212529"
BUBBLE_BORDER_RADIUS="16"
```

**Component Structure:**
```tsx
// MessageBubble.tsx
interface MessageBubbleProps {
  message: {
    role: 'user' | 'agent';
    content: string;
    timestamp: Date;
    avatar?: string;
  };
  isStreaming?: boolean;
}

// Visual Structure:
MessageBubble/
├── Container (flex row/row-reverse based on role)
│   ├── Avatar (optional, left for agent, right for user)
│   └── Bubble Content
│       ├── Message Text (Markdown support)
│       ├── Timestamp
│       └── Tail/Pointer (speech bubble style)
```

**TailwindCSS Classes to Use:**
- `rounded-{size}` - Bubble border radius (e.g., `rounded-2xl`)
- `bg-{color}` - Background color (`bg-blue-500` for user, `bg-gray-100` for agent)
- `text-{color}` - Text color
- `shadow-{size}` - Shadow depth (`shadow-md` or `shadow-lg`)
- `p-{size}` - Padding (`p-3` or `p-4`)
- `max-w-{size}` - Maximum width (`max-w-md` or `max-w-lg`)
- `ml-auto` / `mr-auto` - Alignment (user messages on right, agent on left)

**Example Usage:**
```tsx
// In MessageList.tsx
{messages.map((msg, index) => (
  <MessageBubble
    key={index}
    message={msg}
    isStreaming={index === messages.length - 1 && streaming}
  />
))}
```

### Chat Background Component (To Be Implemented)

The `ChatBackground.tsx` component should be created to support **customizable SVG backgrounds** for visual branding.

**Background Location:**
```
public/backgrounds/
├── default.svg          # Default geometric pattern
├── gradient-1.svg       # Gradient background
├── gradient-2.svg       # Alternate gradient
├── pattern-1.svg        # Dot pattern
├── pattern-2.svg        # Grid pattern
└── custom.svg           # Your custom SVG
```

**Configuration:**
```env
# Use SVG filename without extension
CHAT_BACKGROUND_SVG="gradient-1"

# Or use custom SVG
CHAT_BACKGROUND_SVG="custom"
```

**SVG Best Practices:**
- Use `viewBox` for scalability
- Keep file size under 50KB
- Use subtle patterns for readability
- Consider dark mode compatibility
- Test on mobile devices

**Example SVG Structure:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.1" />
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg-gradient)"/>
</svg>
```

**Recommended Implementation:**

Create `ChatBackground.tsx` component that loads SVG backgrounds dynamically:

```tsx
// src/components/chat/ChatBackground.tsx
interface ChatBackgroundProps {
  backgroundName?: string;
  opacity?: number;
}

export function ChatBackground({
  backgroundName = 'default',
  opacity = 0.5
}: ChatBackgroundProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url(/backgrounds/${backgroundName}.svg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: opacity
      }}
    />
  );
}

// Usage in ChatInterface.tsx
<div className="relative h-full">
  <ChatBackground
    backgroundName={process.env.CHAT_BACKGROUND_SVG || 'default'}
  />
  <MessageList messages={messages} />
</div>
```

### Svelte Widget Icons

The SvelteJS widget uses SVG icons for the chat button and controls. You have two options for storing and referencing icons:

**Option A: Import from `src/lib/assets/` (Recommended)**

Store icons in `src/lib/assets/` and import them directly in components:

```svelte
<!-- WidgetButton.svelte -->
<script>
  import BotIcon from '$lib/assets/bot-icon.svg';
</script>

<button class="...">
  <img src={BotIcon} alt="Chat" class="w-6 h-6" />
</button>
```

**Advantages:**
- Icons are bundled with the widget
- Type-safe imports
- Vite optimizes and inlines small SVGs
- Works offline

**Option B: Reference from `static/icons/` (Public URLs)**

Store icons in `static/icons/` and reference via public URLs:

```svelte
<!-- WidgetButton.svelte -->
<button class="...">
  <img src="/icons/bot-default.svg" alt="Chat" class="w-6 h-6" />
</button>
```

**Advantages:**
- Easy to swap icons without rebuilding
- Can be customized via configuration
- Smaller bundle size

**Recommended Icons:**
```
src/lib/assets/  (or static/icons/)
├── bot-icon.svg       # Main chat button icon
├── close-icon.svg     # Close dialog button
├── minimize-icon.svg  # Minimize dialog button
└── send-icon.svg      # Send message button (optional)
```

**Icon Best Practices:**
- Use `viewBox` for scalability
- Keep file size under 5KB per icon
- Use single color with `currentColor` for theme compatibility
- Size: 24x24px is standard

**Example SVG Icon:**
```svg
<!-- bot-icon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
  <circle cx="12" cy="12" r="3"/>
</svg>
```

**Dynamic Icon Configuration:**

Allow users to customize the bot icon via widget initialization:

```html
<script>
  VirtualAgent.init({
    embedUrl: 'https://your-agent.com/embed',
    botIconUrl: '/icons/custom-bot.svg',  // Custom icon
    position: 'bottom-right'
  });
</script>
```

### Theme Customization

**TailwindCSS Theme Extension:**
```javascript
// tailwind.config.js (Next.js Agent)
module.exports = {
  theme: {
    extend: {
      colors: {
        'user-bubble': process.env.USER_BUBBLE_COLOR || '#007bff',
        'agent-bubble': process.env.AGENT_BUBBLE_COLOR || '#f1f3f5',
      },
      borderRadius: {
        'bubble': `${process.env.BUBBLE_BORDER_RADIUS || 16}px`,
      }
    }
  }
}
```

## Architecture

### System Architecture Overview

```
┌─────────────────────────────────────┐
│         User Interface              │
│   - Chat Components (TailwindCSS)   │
│   - Message Bubbles                 │
│   - SVG Backgrounds                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Next.js 15 App Router          │
│   - Server Components               │
│   - API Routes (SSE Streaming)      │
│   - Middleware (CORS, Rate Limit)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Environment Configuration         │
│   - System Prompts                  │
│   - UI Customization                │
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
         ┌─────┴─────┐
         │           │
┌────────▼────┐ ┌────▼──────────┐
│  LangChain  │ │ Vector DB     │
│  - Claude   │ │ (Qdrant)      │
│  - OpenAI   │ │ - Embeddings  │
│  - Gemini   │ │ - RAG         │
└─────────────┘ └───────────────┘
```

### RAG Architecture

**Vector Database Integration:**
- Qdrant for high-performance vector storage
- SentenceTransformer embeddings for semantic representation
- Hybrid search patterns with metadata filtering
- Intelligent document chunking strategies

**Retrieval Pipeline:**
1. User Query → Embedding Generation
2. Vector Similarity Search (top-k results)
3. Optional Reranking for relevance
4. Context Assembly from retrieved documents
5. LLM Generation with context

**Key Components:**
- `/src/lib/vector-db/` - Vector database operations
- `/src/lib/embeddings/` - Embedding model initialization
- `/src/lib/retrieval/` - Query processing and reranking
- `/src/lib/langchain/rag-chains.ts` - RAG-specific chains

### Agentic Workflows

**LangGraph State Management:**
- Multi-step agent workflows with persistent state
- PostgreSQL checkpointing for state persistence
- Tool integration for extending capabilities
- Conditional routing based on agent decisions

**ReAct Agent Pattern:**
- Agent that plans, executes tools, and reflects on results
- Extensible tool system for custom capabilities
- Human-in-the-loop approval gates (optional)
- Automatic error recovery and fallback mechanisms

**Key Components:**
- `/src/lib/langchain/graph-manager.ts` - LangGraph orchestration
- `/src/lib/langchain/agents/` - Agent definitions
- `/src/lib/langchain/tools/` - Tool implementations
- `/src/lib/langchain/state/` - State schemas
- `/src/lib/langchain/persistence/` - PostgreSQL checkpointing

### Streaming Response Architecture

**Server-Sent Events (SSE):**
- Unidirectional streaming from server to client
- Built-in reconnection with Last-Event-ID
- HTTP-based for firewall/proxy compatibility
- Native browser EventSource API support
- Real-time token-by-token delivery

**Request/Response Flow:**
1. Client sends POST to `/api/chat`
2. Server initiates SSE connection
3. Tokens stream in real-time
4. Connection closes after `[DONE]`
5. Automatic error handling and retry

## Implementation Guide

### RAG Implementation

**1. Vector Database Setup**
- Initialize Qdrant client with collections
- Configure vector dimensions (384 for SentenceTransformer)
- Set distance metric (Cosine similarity recommended)

**2. Document Ingestion Pipeline**
- **Chunking**: Split documents into 500-token chunks with 50-token overlap
- **Embedding**: Generate vectors using SentenceTransformer
- **Storage**: Upsert vectors to Qdrant with metadata

**3. RAG Chain Integration**
- Create vector store wrapper around Qdrant
- Configure retriever with top-k results (typically 5)
- Build LangChain sequence: retrieval → formatting → generation
- Implement optional reranking for improved relevance

### Agentic Workflow Implementation

**1. LangGraph State Management**
- Define agent state schema (messages, documents, tool results)
- Configure state channels with merge strategies
- Implement PostgreSQL checkpointing for persistence

**2. Tool Integration**
- Create custom tools using `DynamicTool` from LangChain
- Common tools: document search, web scraping, API calls
- Each tool needs: name, description, async function

**3. ReAct Agent Pattern**
- Use `createReactAgent` from LangGraph prebuilt
- Configure with LLM model and tool array
- Add system message to guide tool usage
- Enable state persistence for conversation continuity

### SSE Streaming Implementation

**Server-Side:**
- Create API route accepting POST with message/threadId
- Stream agent responses using `TransformStream` and `TextEncoder`
- Send SSE-formatted chunks: `data: {json}\n\n`
- Send `[DONE]` signal when complete
- Handle errors gracefully in stream

**Client-Side:**
- Use Fetch API with streaming body reader
- Parse SSE format: extract data after `data: ` prefix
- Update UI progressively as tokens arrive
- Handle reconnection and errors
- Close stream after `[DONE]` signal

**React Hook Pattern:**
- Create `useSSE` hook for reusable streaming logic
- Manage state: response accumulator, streaming status, errors
- Trigger fetch on message change
- Return streaming state and response for UI rendering

## Development

### Next.js Agent Development

```bash
cd nextjs-agent
npm run dev        # Start development server (localhost:3000)
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run format     # Format code with Prettier
npm run type-check # TypeScript type checking
npm run test       # Run tests
```

### SvelteJS Wrapper Development

```bash
cd svelte-wrapper
npm run dev        # Start development server (localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
npm run check      # Check Svelte components
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run format     # Format code with Prettier
```

### Code Quality

Both projects enforce strict code quality standards:

**File Size Limits:**
- Maximum lines per file: 300 (excluding blank lines and comments)
- Maximum lines per function: 100 (excluding blank lines and comments)
- Cyclomatic complexity: Maximum of 10

**Pre-commit Hooks:**
- ESLint with auto-fix
- Prettier formatting
- TypeScript type checking
- Svelte component validation (for svelte-wrapper)

## Deployment

### Production Deployment Checklist

**Environment Variables:**
- [ ] All LLM API keys configured
- [ ] Vector database URL and credentials
- [ ] PostgreSQL connection string
- [ ] SSE endpoint configuration and CORS
- [ ] Authentication secrets
- [ ] CORS allowed origins

**Database Setup:**
- [ ] PostgreSQL migrations run
- [ ] Qdrant collections created
- [ ] Index optimization completed
- [ ] Backup strategy configured

**Security:**
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] API keys stored in secure secrets manager
- [ ] HTTPS enforced in production

**Performance:**
- [ ] Vector database indexed
- [ ] Connection pooling configured
- [ ] Caching strategy implemented
- [ ] CDN configured for widget assets

**Monitoring:**
- [ ] Health check endpoints tested
- [ ] Logging configured and centralized
- [ ] Error tracking service integrated
- [ ] Performance metrics collected

### Deployment Options

**Cloud-Agnostic Containerized Deployment:**
- AWS ECS / Fargate
- GCP Cloud Run
- Azure Container Apps
- Any Kubernetes cluster

**Serverless Deployment:**
- Vercel (recommended for Next.js)
- Netlify
- AWS Lambda with API Gateway

**Traditional Deployment:**
- VPS / VM with Docker
- Docker Compose for multi-service setup

## Technology Stack

### Next.js Agent (Core AI Application)
- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript (full type safety)
- **LLM Orchestration**:
  - LangChain for LLM abstraction
  - LangGraph for agent workflows
  - `@langchain/anthropic` for Claude
  - `@langchain/openai` for GPT
  - `@langchain/google-genai` for Gemini
- **Vector Database**: Qdrant for embeddings
- **Embeddings**: SentenceTransformer models
- **Database**: PostgreSQL for relational data
- **Streaming**: Server-Sent Events (SSE)
- **Styling**: TailwindCSS only (strictly enforced)
- **State Management**: React hooks, Zustand, LangGraph
- **Validation**: Zod for runtime type validation
- **Authentication**: NextAuth.js with OAuth
- **Code Quality**: ESLint, Prettier, Husky, lint-staged
- **Testing**: Jest, React Testing Library
- **Build**: Next.js Turbopack

### SvelteJS Widget (Embeddable Integration)
- **Framework**: Svelte 5 (compiled to standalone widget)
- **Language**: TypeScript
- **Purpose**: Lightweight UI shell (button, dialog, iframe)
- **Styling**: TailwindCSS only (strictly enforced)
- **Build**: Vite 6 for fast bundling
- **State**: Svelte stores for widget state
- **Communication**: postMessage API for iframe
- **Code Quality**: ESLint, Prettier, svelte-check, Husky
- **Bundle**: Compiles to single `widget.js` file

### Infrastructure & DevOps
- **Containerization**: Docker with multi-stage builds
- **Deployment**: Cloud-agnostic (AWS, GCP, Azure, Vercel, etc.)
- **Logging**: Structured logging with cloud-agnostic aggregation
- **Monitoring**: Health check endpoints for any monitoring service
- **Environment**: Multi-environment configuration (.env files)
- **Version Control**: Git with conventional commits
- **CI/CD Ready**: GitHub Actions, GitLab CI, or any CI/CD platform

## API Reference

### Next.js Agent API Endpoints

**POST /api/chat**
- Send messages to the virtual agent
- Request: `{ message: string, threadId?: string }`
- Response: SSE stream with token-by-token delivery

**GET /api/health**
- Health check endpoint
- Response: `{ status: 'ok', timestamp: number }`

**POST /api/reset**
- Reset conversation context
- Request: `{ threadId: string }`
- Response: `{ success: boolean }`

**GET /api/config**
- Get public agent configuration
- Response: Agent name, greeting, theme colors, etc.

### Widget Embedding

**Local Testing (Playground):**

1. Build and test locally using the playground:
```bash
# Build widget
cd svelte-wrapper && npm run build

# Copy to root
cp static/widget.js ../widget.js

# Open playground
open ../playground.html
```

**Production Deployment:**

1. Build the widget:
```bash
cd svelte-wrapper
npm run build
```

2. Upload `widget.js` to your CDN/hosting

3. Embed on your website:
```html
<script src="https://your-cdn.com/widget.js"></script>
<script>
  VirtualAgent.init({
    embedUrl: 'https://your-nextjs-agent.com/embed',
    position: 'bottom-right',
    primaryColor: '#007bff',
    agentName: 'Support Assistant'
  });
</script>
```

**Widget Configuration Options:**

```javascript
VirtualAgent.init({
  // Required
  embedUrl: 'https://your-agent.com/embed',

  // Optional
  position: 'bottom-right',        // bottom-right, bottom-left, top-right, top-left
  primaryColor: '#667eea',         // Widget theme color
  agentName: 'Virtual Assistant',  // Display name
  botIconUrl: '/icons/bot.svg',    // Custom bot icon
  size: 'medium',                  // small, medium, large
  enableMinimize: true,            // Show minimize button
  enableSound: false               // Sound notifications
});
```

**Dynamic Updates:**

Update widget configuration at runtime:
```javascript
// Change position
VirtualAgent.updateConfig({ position: 'bottom-left' });

// Change colors
VirtualAgent.updateConfig({ primaryColor: '#764ba2' });

// Open/close programmatically
VirtualAgent.open();
VirtualAgent.close();
```

## Security

### Best Practices

- Never commit `.env.local` or `.env` files containing API keys
- Use environment variables for all sensitive data
- Implement rate limiting in production
- Validate and sanitize all user inputs
- Use HTTPS in production
- Configure CORS properly with `ALLOWED_ORIGINS`
- Use Next.js 15 middleware for security headers
- Implement CSP (Content Security Policy) headers
- Regular dependency updates for security patches
- Store API keys in secure secrets manager

### Rate Limiting

Configure via environment variables:
```env
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW=60
RATE_LIMIT_ENABLED=true
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow ESLint and Prettier configurations
- Maintain file size limits (300 lines/file, 100 lines/function)
- Use TailwindCSS for all styling
- Write tests for new features
- Update documentation as needed

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

## Acknowledgments

Built with:
- [Next.js 15](https://nextjs.org/)
- [LangChain](https://js.langchain.com/)
- [Anthropic Claude](https://www.anthropic.com/)
- [OpenAI](https://openai.com/)
- [SvelteJS](https://svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
