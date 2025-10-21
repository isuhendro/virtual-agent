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
│   │   │   │   ├── ChatHeader.tsx     # Chat header with agent info
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
AGENT_TAGLINE="Always here to help"
USE_CASE="customer_support"

# =========================
# UI Customization
# =========================
PRIMARY_COLOR="#007bff"               # Used for user bubbles, buttons, highlights
SECONDARY_COLOR="#6c757d"             # Used for agent bubbles, secondary elements
BACKGROUND_COLOR="#ffffff"
TEXT_COLOR="#333333"
CHAT_BACKGROUND_SVG="default"         # Name of SVG file in public/backgrounds/
BRAND_LOGO_URL=""
AGENT_AVATAR_URL=""
SHOW_STATUS_INDICATOR=true
BUBBLE_BORDER_RADIUS="16"             # Border radius in pixels for message bubbles

# Typography Colors
TEXT_PRIMARY="#1e293b"                # Primary text color (headings, important text)
TEXT_SECONDARY="#64748b"              # Secondary text color (descriptions, metadata)
TEXT_MUTED="#94a3b8"                  # Muted text color (timestamps, placeholders)
TEXT_INVERSE="#ffffff"                # Inverse text color (text on dark backgrounds)

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

### Chat Header Component (To Be Implemented)

The `ChatHeader.tsx` component should be created to display agent information, status, and action buttons at the top of the chat interface.

**Component Responsibilities:**
- Display agent name and avatar
- Show online/offline status indicator with colored dot
- Display optional tagline or description
- Include action buttons (close, minimize, settings)
- Support theming via environment variables
- Sticky positioning at top of chat

**Environment Variables:**
- AGENT_NAME - Display name
- AGENT_AVATAR_URL - Avatar image path
- AGENT_TAGLINE - Optional subtitle
- TEXT_PRIMARY - Primary text color for agent name
- TEXT_SECONDARY - Secondary text color for tagline
- SHOW_STATUS_INDICATOR - Toggle status display

**Visual Structure:**
- Left Section: Agent avatar (rounded), agent name using TEXT_PRIMARY color, status indicator with green/gray dot, optional tagline using TEXT_SECONDARY color
- Right Section: Action buttons (settings, minimize, close) with hover states
- Bottom border separator for visual distinction
- Subtle shadow for depth

**Styling Approach:**
- Use sticky positioning to keep header visible while scrolling
- Flex layout with space-between for left/right sections
- Rounded avatar with appropriate sizing
- Icon buttons with hover states and smooth transitions
- Online status shown with green dot (bg-green-500), offline with gray dot (bg-gray-400)
- Support custom background and text colors via environment variables
- Agent name uses TEXT_PRIMARY color for importance
- Tagline uses TEXT_SECONDARY color for subtle contrast
- Minimum 44x44px touch targets for accessibility

**Responsive Considerations:**
- Reduce padding and font sizes on mobile
- Consider hiding tagline on very small screens
- Ensure touch targets remain at least 44x44px
- Stack action buttons if needed

**Accessibility:**
- Use semantic header element
- Provide aria-labels for icon buttons
- Ensure sufficient color contrast (TEXT_PRIMARY vs background)
- Support keyboard navigation

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
- Timestamp display using TEXT_MUTED color
- Markdown rendering
- Streaming text support
- Customizable colors and border radius

**Environment Variables:**
- PRIMARY_COLOR - Background color for user message bubbles
- SECONDARY_COLOR - Background color for agent message bubbles
- TEXT_INVERSE - Text color for user bubbles (white on colored background)
- TEXT_PRIMARY - Text color for agent bubbles
- TEXT_MUTED - Color for timestamps and metadata
- BUBBLE_BORDER_RADIUS - Border radius in pixels for rounded corners

**Visual Structure:**
The component uses flex layout that reverses direction based on the message role. User messages appear on the right with PRIMARY_COLOR background and TEXT_INVERSE text. Agent messages appear on the left with SECONDARY_COLOR background and TEXT_PRIMARY text. Optional avatar displays on the left for agent messages. Bubble content contains the message text with Markdown support, timestamp in TEXT_MUTED color, and optional speech bubble tail pointer.

**Styling Approach:**
- User bubbles: PRIMARY_COLOR background, TEXT_INVERSE text, aligned right
- Agent bubbles: SECONDARY_COLOR background, TEXT_PRIMARY text, aligned left
- Timestamps: TEXT_MUTED color for subtle appearance
- Border radius configurable via BUBBLE_BORDER_RADIUS environment variable
- Shadow depth for visual elevation
- Padding for comfortable reading
- Maximum width constraint for readability
- Proper alignment using margin auto classes

**Typography Colors Usage:**
- Message content uses TEXT_PRIMARY (agent) or TEXT_INVERSE (user)
- Timestamps use TEXT_MUTED for reduced visual weight
- Metadata uses TEXT_SECONDARY when needed

### Chat Background Component (To Be Implemented)

The `ChatBackground.tsx` component should be created to support **customizable SVG backgrounds** for visual branding.

**Background Location:**

Store SVG background files in the `public/backgrounds/` directory with filenames like:
- `default.svg` - Default geometric pattern
- `gradient-1.svg` - Gradient background
- `gradient-2.svg` - Alternate gradient
- `pattern-1.svg` - Dot pattern
- `pattern-2.svg` - Grid pattern
- `custom.svg` - Your custom SVG

**Configuration:**

Use the `CHAT_BACKGROUND_SVG` environment variable to specify the SVG filename without extension (e.g., "gradient-1" or "custom").

**SVG Best Practices:**
- Use `viewBox` for scalability
- Keep file size under 50KB
- Use subtle patterns for readability
- Consider dark mode compatibility
- Test on mobile devices

**Implementation Guidance:**

Create a ChatBackground component that accepts backgroundName and opacity props (defaulting to "default" and 0.5 respectively). The component should render an absolutely positioned div that covers the entire container using inset-0 classes with pointer-events disabled. Use inline styles to set the background image URL from the public/backgrounds directory, background size to cover, centered background position, and the specified opacity. This allows dynamic loading of SVG backgrounds based on the CHAT_BACKGROUND_SVG environment variable configuration.

### Svelte Widget Icons

The SvelteJS widget uses SVG icons for the chat button and controls. You have two options for storing and referencing icons:

**Option A: Import from `src/lib/assets/` (Recommended)**

Store icons in `src/lib/assets/` and import them directly in Svelte components using the $lib/assets/ path alias, then reference in img tag's src attribute with appropriate size classes (w-6 h-6).

**Advantages:**
- Icons are bundled with the widget
- Type-safe imports
- Vite optimizes and inlines small SVGs
- Works offline

**Option B: Reference from `static/icons/` (Public URLs)**

Store icons in `static/icons/` and reference via public URLs directly in img src attributes (e.g., "/icons/bot-default.svg").

**Advantages:**
- Easy to swap icons without rebuilding
- Can be customized via configuration
- Smaller bundle size

**Recommended Icons:**

Your icons directory should contain:
- `bot-icon.svg` - Main chat button icon
- `close-icon.svg` - Close dialog button
- `minimize-icon.svg` - Minimize dialog button
- `send-icon.svg` - Send message button (optional)

**Icon Best Practices:**
- Use `viewBox` for scalability
- Keep file size under 5KB per icon
- Use single color with `currentColor` for theme compatibility
- Size: 24x24px is standard

**Dynamic Icon Configuration:**

Allow users to customize the bot icon via widget initialization by accepting a `botIconUrl` parameter in the VirtualAgent.init() configuration object, which should point to a custom SVG file path.

### Theme Customization

**TailwindCSS Theme Extension:**

Extend your Tailwind configuration by adding custom color variables under the theme.extend.colors section. Map environment variables to color properties:
- `primary` - from PRIMARY_COLOR (defaulting to '#007bff')
- `secondary` - from SECONDARY_COLOR (defaulting to '#6c757d')
- `background` - from BACKGROUND_COLOR (defaulting to '#ffffff')
- `text-primary` - from TEXT_PRIMARY (defaulting to '#1e293b')
- `text-secondary` - from TEXT_SECONDARY (defaulting to '#64748b')
- `text-muted` - from TEXT_MUTED (defaulting to '#94a3b8')
- `text-inverse` - from TEXT_INVERSE (defaulting to '#ffffff')

Also extend borderRadius with a 'bubble' key that uses the BUBBLE_BORDER_RADIUS environment variable (defaulting to 16 pixels).

**Using Theme Colors in Components:**

Apply theme colors using Tailwind classes:
- User message bubbles: `bg-primary text-inverse rounded-bubble p-4`
- Agent message bubbles: `bg-secondary text-primary rounded-bubble p-4`
- Headers and agent names: `text-primary`
- Taglines and descriptions: `text-secondary`
- Timestamps and placeholders: `text-muted`
- Text on colored backgrounds: `text-inverse`
- Container backgrounds: `bg-background`

This approach ensures consistent theming across the application by referencing the extended Tailwind theme values instead of hardcoding colors. All typography elements use the appropriate semantic color (primary, secondary, muted, inverse) based on their importance and context.


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
