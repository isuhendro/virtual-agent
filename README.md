# Virtual Agent

A production-ready boilerplate template for building sophisticated LLM applications with both **RAG (Retrieval-Augmented Generation)** and **Agentic capabilities**. Built with Next.js 15 and SvelteJS, strictly using TailwindCSS for all styling.



## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)

### Getting Started
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)

### Architecture & Concepts
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)

### Features & Customization
- [UI Components](#ui-components)
- [Starter Prompts](#starter-prompts)
- [Hooks System](#hooks-system)
- [Widget SDK](#widget-sdk)
- [Enhanced Security Model](#enhanced-security-model)

### Development & Implementation
- [Implementation Guide](#implementation-guide)
- [Development](#development)
- [API Reference](#api-reference)

### Production & Deployment
- [Security](#security)
- [Deployment](#deployment)

### Community & Resources
- [Contributing](#contributing)
- [Changelog](#changelog)
- [Roadmap](#roadmap)
- [Support](#support)
- [License](#license)
- [Acknowledgments](#acknowledgments)


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
│   │   │   │   ├── session/route.ts   # Session token management
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
│   │   │   │   ├── StarterPrompts.tsx # Suggested questions component
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
│   │   ├── middleware/                # Middleware/Plugin hooks
│   │   │   ├── pre-message/           # Pre-message hooks
│   │   │   ├── post-message/          # Post-message hooks
│   │   │   ├── on-error/              # Error handling hooks
│   │   │   ├── on-tool-call/          # Tool invocation hooks
│   │   │   └── index.ts               # Hook registration
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

# Starter Prompts (JSON array of suggested questions)
STARTER_PROMPTS='["How can I track my order?","What are your business hours?","Tell me about your return policy","Get started with a demo"]'

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
# Security & Authentication
# =========================
# Token-based Authentication
JWT_SECRET="your-secure-random-secret-minimum-32-characters"
SESSION_TOKEN_TTL=1800                # Token TTL in seconds (30 minutes)
SESSION_REFRESH_THRESHOLD=180          # Refresh tokens 3 minutes before expiry
ALLOWED_DOMAINS="localhost:3000,yourdomain.com,*.yourdomain.com"
ENABLE_TOKEN_ROTATION=true
MAX_SESSIONS_PER_USER=5
SESSION_AUDIT_ENABLED=true

# Rate Limiting & CORS
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



## UI Components

### Chat Header Component

The `ChatHeader.tsx` component displays agent information, status, and action buttons at the top of the chat interface.

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

### Message Bubble Component

The `MessageBubble.tsx` component displays individual chat messages with full TailwindCSS customization.

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

### Chat Background Component

The `ChatBackground.tsx` component supports **customizable SVG backgrounds** for visual branding.

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



## Starter Prompts

Starter Prompts provide users with suggested questions or actions when the chat interface first loads, reducing friction and guiding users toward valuable interactions.

### Purpose and Benefits

**Reduce Cognitive Load:**
Users often don't know what to ask or what the agent can do. Starter prompts provide immediate examples of capabilities. They eliminate the "blank canvas" problem of empty chat interfaces. They guide users toward high-value use cases quickly.

**Improve Engagement:**
Users are more likely to interact when presented with clear options. Suggested questions have higher conversion rates than empty states. They reduce time-to-first-message significantly. They help users discover features they might not know about.

**Use Case Discovery:**
Showcase the agent's capabilities through examples. Highlight unique or powerful features. Guide users through common workflows. Educate users on what types of questions work best.

### Configuration

Starter prompts are configured via environment variables as JSON arrays.

**Environment Variable Structure:**
Add `STARTER_PROMPTS` to your `.env.local` file as a JSON-encoded array of strings. Each string represents one suggested question or action. Limit to 3-4 prompts for optimal visual design. Update prompts based on user analytics and feedback.

**Important: LLM Prompt Transformation:**
Starter prompts displayed to users should be transformed into optimized LLM prompts before sending to the agent. The displayed prompt is user-facing and conversational, while the actual prompt sent to the LLM can be more detailed with context and instructions. For example, a user-facing prompt "Track my order" might be transformed to "I need help tracking my recent order. Can you help me find the status?" before being sent to the agent.

**Example Configuration:**
```env
STARTER_PROMPTS='["How can I track my order?","What are your business hours?","Tell me about your return policy","Get started with a demo"]'
```

**Category-Based Prompts:**
For more sophisticated implementations, structure prompts by category using JSON objects with category and prompts fields. This allows grouping related suggestions under category headers like "Support", "Sales", "Technical".

### UI Component Implementation

Create a `StarterPrompts.tsx` component to display suggestions in the chat interface.

**Component Location:**
Place the component at `/nextjs-agent/src/components/chat/StarterPrompts.tsx`. Import and render it in `ChatInterface.tsx` when the message list is empty. Hide the component once the user sends their first message. Re-show prompts when conversation is reset.

**Visual Design:**
Display prompts as clickable chips or cards arranged in a grid layout. Use PRIMARY_COLOR for hover states and selection feedback. Include subtle icons to indicate interactivity (arrow, sparkle, or chat bubble). Apply smooth hover transitions and click animations for tactile feedback. Ensure mobile-responsive layout with proper touch targets (minimum 44x44px).

**Styling Approach:**
Use Tailwind utility classes exclusively: `bg-secondary/10`, `hover:bg-primary`, `text-primary`, `rounded-lg`, `p-3`, `cursor-pointer`. Apply flex or grid layout for responsive arrangement. Add transition classes for smooth interactions. Use TEXT_SECONDARY color for prompt text with TEXT_PRIMARY on hover.

**Prompt Transformation Logic:**
When a user clicks a starter prompt, implement a transformation layer that converts the short, user-friendly prompt into a more contextual LLM prompt. This can include adding user context, session information, or expanding abbreviated prompts into complete questions. The transformation ensures better LLM responses while keeping the UI clean and concise. Store prompt mappings in a configuration file or implement a simple transformation function that enriches the prompt before sending.

### Contextual Suggestions

Beyond static starter prompts, implement dynamic suggestions based on conversation context.

**Post-Message Suggestions:**
Use a Post-Message hook to analyze agent responses and generate relevant follow-up questions. The LLM can suggest 2-3 contextual next questions based on the current conversation. Display these as chips below the agent's message. Track which suggestions users click to improve relevance over time.

**Implementation Pattern:**
Create a post-message hook at `/nextjs-agent/src/middleware/post-message/suggestion-generator.ts`. Use the LLM with a specific prompt asking for follow-up suggestions. Return suggestions as metadata attached to the agent response. Render suggestions in `MessageBubble.tsx` as interactive buttons. Send clicked suggestions as new user messages.

**Suggestion Prompt Template:**
Ask the LLM: "Based on this conversation, suggest 2-3 relevant follow-up questions the user might ask. Return only the questions as a JSON array." Parse the LLM response and validate the JSON structure. Fall back to empty array if parsing fails. Cache suggestions to avoid redundant LLM calls.

### Category Organization

Group starter prompts by use case category for better user navigation.

**Category Structure:**
Define categories like "Getting Started", "Account Help", "Product Information", and "Technical Support". Assign 2-3 prompts to each category. Display categories as tabs or expandable sections. Allow users to browse categories to find relevant prompts.

**Configuration Format:**
Use a JSON object with category names as keys and prompt arrays as values. Store in environment variable or separate JSON configuration file. Example: `{"Support": ["Track order", "Return item"], "Sales": ["View products", "Request quote"]}`

**UI Implementation:**
Create a tabbed interface or accordion layout for categories. Apply active state styling to the selected category. Lazy-load category prompts to improve initial render performance. Remember the user's last-selected category for returning visitors.

### Analytics and Optimization

Track starter prompt performance to optimize engagement.

**Metrics to Track:**
Click-through rate for each prompt (clicks / impressions). Conversion rate from prompt click to successful conversation. Time from page load to first interaction (with vs without prompts). Which prompts lead to highest user satisfaction scores.

**Implementation:**
Use the Widget SDK's `VirtualAgent.track()` method to send events. Track `starter_prompt_shown` when prompts are displayed. Track `starter_prompt_clicked` with the prompt text as a property. Include prompt position and category in event properties. Send events to your analytics platform (Mixpanel, Google Analytics, etc.).

**Optimization Loop:**
Review analytics monthly to identify low-performing prompts. A/B test different prompt variations to find optimal phrasing. Update prompts based on seasonal trends or new features. Remove prompts with <5% click-through rate. Promote high-performing prompts to more prominent positions.

### Best Practices

**Writing Effective Prompts:**
- Use action-oriented language ("Track my order" not "Order tracking")
- Keep prompts concise (5-8 words maximum) for UI display
- Make prompts specific rather than generic
- Address common user pain points
- Use natural, conversational language
- Avoid jargon or technical terms
- Design prompts with transformation in mind - short display text, detailed LLM prompt
- Map user-facing prompts to optimized LLM instructions for better responses

**Visual Design:**
- Limit to 3-4 prompts to avoid overwhelming users
- Use consistent sizing and spacing
- Ensure sufficient color contrast for accessibility
- Provide clear hover and focus states
- Make prompts visually distinct from messages
- Test on mobile devices for touch usability

**User Experience:**
- Show prompts immediately on load (no delay)
- Hide prompts after first user message
- Restore prompts when conversation is reset
- Don't auto-send prompts (require explicit click)
- Provide visual feedback on click
- Ensure prompts work with keyboard navigation

### Integration with Widget SDK

Extend the Widget SDK to support programmatic prompt management.

**New SDK Methods:**
Add `VirtualAgent.showSuggestions(prompts)` to display custom suggestions dynamically. Add `VirtualAgent.hideSuggestions()` to remove suggestions from view. Add `VirtualAgent.setSuggestions(prompts)` to update the default starter prompts. Support callback parameter to track which suggestion was clicked.

**Example Usage:**
```javascript
// Show custom suggestions after specific user action
VirtualAgent.showSuggestions([
  'Learn more about this feature',
  'See a demo',
  'Contact support'
]);

// Track which suggestion was clicked
VirtualAgent.on('suggestion-clicked', (data) => {
  console.log('User clicked:', data.suggestion);
});
```

**Implementation Location:**
Add methods to the Widget SDK in `/svelte-wrapper/src/lib/utils/widget-api.ts`. Use postMessage to communicate suggestions to the iframe. Store suggestions in the widget's Svelte store. Render suggestions using the `StarterPrompts.tsx` component.




## Hooks System

The Hooks System provides a middleware/plugin architecture for intercepting and transforming agent behavior at key points in the request lifecycle. This allows you to extend functionality without modifying core agent code.

### Hook Types

The system supports four primary hook types:

**Pre-Message Hooks** - Execute before messages are sent to the LLM. Use cases include input validation, content filtering, user authentication checks, rate limiting enforcement, message preprocessing and augmentation, and adding context from external systems.

**Post-Message Hooks** - Execute after the LLM generates a response but before sending to the client. Use cases include response filtering for sensitive data, content moderation, adding citations or sources, logging and analytics, response transformation, and custom formatting.

**On-Error Hooks** - Execute when errors occur during agent processing. Use cases include custom error messages, fallback responses, error logging to monitoring services, user notification, graceful degradation, and retry logic.

**On-Tool-Call Hooks** - Execute before and after agent tool invocations. Use cases include tool usage authorization, parameter validation, result transformation, tool call logging, cost tracking, and custom tool routing.

### Hook File Structure

Hooks are organized in the `/nextjs-agent/src/hooks/` directory with the following structure:

```
src/hooks/
├── pre-message/
│   ├── rate-limiter.ts
│   ├── profanity-filter.ts
│   └── context-enricher.ts
├── post-message/
│   ├── citation-adder.ts
│   ├── pii-filter.ts
│   └── analytics.ts
├── on-error/
│   ├── friendly-error.ts
│   └── error-logger.ts
├── on-tool-call/
│   ├── tool-authorizer.ts
│   └── cost-tracker.ts
└── index.ts
```

### Creating Custom Hooks

Each hook is a TypeScript module that exports an async function with a specific signature.

**Pre-Message Hook Interface:**
- Input: User message string, optional user context object
- Output: Modified message string or original if no changes
- Can throw errors to prevent message processing
- Executes in registration order

**Post-Message Hook Interface:**
- Input: LLM response string, original user message, optional metadata
- Output: Modified response string or original if no changes
- Can add metadata to be included in client response
- Executes in registration order

**On-Error Hook Interface:**
- Input: Error object, user message, optional context
- Output: Custom error response object with message and optional recovery action
- Can transform error into user-friendly messages
- First hook to return a response wins

**On-Tool-Call Hook Interface:**
- Input: Tool name, tool arguments object, optional execution context
- Output: Modified arguments or validation result
- Can prevent tool execution by throwing error
- Executes before tool is invoked

### Hook Registration

Register hooks in `/nextjs-agent/src/hooks/index.ts` by importing hook functions and adding them to the appropriate arrays (preMessageHooks, postMessageHooks, onErrorHooks, onToolCallHooks). Hooks execute in array order, so order matters for dependencies.

### Hook Execution Order

The agent processes hooks in the following sequence: Pre-Message hooks execute first in registration order, then the message is sent to the LLM. If tools are called, On-Tool-Call hooks execute before each tool invocation. After LLM generates response, Post-Message hooks execute in registration order. If any error occurs, On-Error hooks execute until one returns a response.

### Implementation Guidelines

**Performance Considerations:**
- Keep hook execution fast (under 100ms recommended)
- Use async operations efficiently
- Consider caching for expensive operations
- Avoid blocking I/O in critical path

**Error Handling:**
- Always catch and handle errors within hooks
- Provide meaningful error messages
- Consider graceful degradation
- Log errors for debugging

**Best Practices:**
- Keep hooks focused on single responsibility
- Make hooks reusable across different agents
- Use environment variables for configuration
- Document hook behavior clearly
- Write unit tests for hook logic

### Example Use Cases

**Content Moderation:** Use Pre-Message hooks to filter inappropriate content before LLM processing. Use Post-Message hooks to ensure agent responses meet content guidelines.

**Analytics and Monitoring:** Use Post-Message hooks to log conversation metrics. Use On-Tool-Call hooks to track tool usage patterns and costs.

**Personalization:** Use Pre-Message hooks to enrich messages with user preferences. Use Post-Message hooks to format responses based on user settings.

**Security and Compliance:** Use Pre-Message hooks for authentication and authorization. Use Post-Message hooks to redact PII from responses.

**Error Recovery:** Use On-Error hooks to provide friendly error messages. Use On-Error hooks to implement automatic retry logic.



## Widget SDK

The Widget SDK provides a comprehensive JavaScript API for controlling the embedded chat widget, tracking user interactions, and customizing behavior at runtime.

### Core API Methods

**Initialization:**

The `VirtualAgent.init(config)` method initializes the widget with configuration options. It must be called before any other methods. Configuration includes embedUrl (required), position, primaryColor, agentName, and other optional settings. Returns a Promise that resolves when widget is ready.

**Visibility Control:**

The `VirtualAgent.open()` method opens the chat dialog and optionally accepts a callback parameter that executes when dialog is fully opened. The `VirtualAgent.close()` method closes the chat dialog and also accepts an optional callback. The `VirtualAgent.toggle()` method toggles between open and closed states. The `VirtualAgent.isOpen()` method returns a boolean indicating current dialog state.

**Configuration Updates:**

The `VirtualAgent.updateConfig(partialConfig)` method updates widget configuration at runtime. Only specified properties are updated, others remain unchanged. Updates are applied immediately without reloading the widget.

**User Identification:**

The `VirtualAgent.identify(userId, userInfo)` method associates a user ID with the current session. The userInfo parameter is optional and can include name, email, avatar URL, and custom metadata. This enables personalized experiences and conversation history.

**Conversation Management:**

The `VirtualAgent.reset()` method clears current conversation and starts fresh. The `VirtualAgent.prefill(message)` method pre-fills the input field with a message (useful for suggested questions). The `VirtualAgent.send(message)` method sends a message programmatically without user interaction.

**Event Listeners:**

The `VirtualAgent.on(eventName, callback)` method registers event listeners. Supported events include 'open' (dialog opened), 'close' (dialog closed), 'message-sent' (user sent message), 'message-received' (agent responded), 'error' (error occurred), and 'ready' (widget initialized). The `VirtualAgent.off(eventName, callback)` method removes previously registered event listeners.

**Locale and Internationalization:**

The `VirtualAgent.setLocale(locale)` method sets the widget language (e.g., 'en', 'es', 'fr'). The widget automatically translates UI elements based on locale. Supported locales depend on your i18n configuration.

**Analytics Integration:**

The `VirtualAgent.track(eventName, properties)` method sends custom analytics events. Useful for tracking user engagement, feature usage, and conversion metrics. Integrates with your analytics platform (Google Analytics, Mixpanel, Segment, etc.).

**Widget State:**

The `VirtualAgent.getState()` method returns current widget state including conversation history, user info, configuration, and connection status. The `VirtualAgent.destroy()` method completely removes the widget from the page and cleans up all event listeners.

### Event System

The Widget SDK uses a standard event emitter pattern for real-time updates.

**Event Handler Pattern:**

Register listeners using the on method with event name and callback function. Callbacks receive an event object containing relevant data. Remove listeners using the off method when no longer needed to prevent memory leaks.

**Common Events:**

The 'ready' event fires when widget is fully initialized and ready for use. The 'open' event fires when dialog opens. The 'close' event fires when dialog closes. The 'message-sent' event fires when user sends a message, with data containing message text and timestamp. The 'message-received' event fires when agent responds, with data containing response text and timestamp. The 'error' event fires when errors occur, with data containing error message and code. The 'connection-change' event fires when connection status changes, with data indicating connected/disconnected state.

### Advanced Configuration

**Custom Styling:**

Beyond basic color customization, you can inject custom CSS using the customStyles configuration option. This accepts CSS string that will be injected into the widget iframe. Use this for advanced theming, custom fonts, or brand-specific styling.

**Custom Triggers:**

The widget can be triggered by custom events beyond the default chat button. Use the hideDefaultButton configuration option to hide the built-in button, then call VirtualAgent.open() from your own UI elements.

**Session Management:**

The widget automatically persists conversation state using localStorage. Configure session persistence using the persistConversation option (defaults to true). Clear sessions manually using VirtualAgent.reset() method.

**Security Options:**

Configure CORS and CSP settings using the security configuration object. Options include allowedOrigins array, enableCSP boolean, and nonce for inline scripts. These settings help protect against XSS and other security vulnerabilities.

### Integration Patterns

**React Integration:**

Create a React component that initializes the widget in useEffect hook. Clean up on unmount using VirtualAgent.destroy(). Use state to control widget visibility and configuration.

**Vue Integration:**

Initialize widget in mounted lifecycle hook. Use reactive refs to bind widget state to Vue component state. Clean up in beforeUnmount hook.

**Vanilla JavaScript:**

Initialize widget after DOM content loaded event. Use event delegation for custom trigger buttons. No framework-specific cleanup needed.

**Analytics Integration:**

Use the track method to send events to your analytics platform. Common events to track include widget opened, message sent, conversation completed, and user identified. Integrate with Google Analytics, Mixpanel, Segment, or custom analytics.

### Best Practices

**Performance:**
- Initialize widget only once per page load
- Use event delegation instead of multiple listeners
- Debounce frequent configuration updates
- Lazy load widget on user interaction for better initial page load

**User Experience:**
- Provide visual feedback when widget is loading
- Handle errors gracefully with user-friendly messages
- Prefill common questions for quick starts
- Respect user's preferred language and locale

**Security:**
- Never expose API keys in frontend code
- Validate user inputs before sending
- Use identify method to associate conversations securely
- Configure CORS properly to prevent unauthorized access

**Accessibility:**
- Ensure widget is keyboard navigable
- Provide ARIA labels for screen readers
- Support high contrast modes
- Test with assistive technologies



## Enhanced Security Model

The Virtual Agent implements a token-based security model inspired by OpenAI's ChatKit, ensuring API keys remain secure on the server while providing seamless client authentication.

### Client Token System

Instead of exposing API keys in the frontend, the system uses short-lived client tokens generated server-side.

**Token Lifecycle:**
The backend generates JWT tokens with 15-30 minute expiration when clients request sessions. These tokens are cryptographically signed and include user identification and permission scopes. The widget receives the token and uses it for all API communications. Before expiration, the widget automatically requests a new token using the refresh mechanism.

**Security Benefits:**
API keys never leave the server environment, reducing exposure risk. Short-lived tokens minimize damage if compromised. Token rotation provides audit trails for security monitoring. Revocation is immediate without changing API keys. Per-user scopes enable fine-grained permission control.

### Session Management Endpoint

Create a dedicated session endpoint that generates and refreshes client tokens.

**Endpoint Structure:**
The POST endpoint at `/api/session` accepts optional existing token for refresh. It validates the request origin against domain allowlist. The server generates a new JWT token with user context, expiration timestamp, and permission scopes. It returns the client secret token with expiration time and session metadata.

**Implementation Location:**
Create the endpoint at `/nextjs-agent/src/app/api/session/route.ts` using Next.js 15 App Router patterns. Use the `jsonwebtoken` library for token generation and validation. Store session metadata in PostgreSQL for audit trails. Include rate limiting to prevent token generation abuse.

### Domain Allowlist

Protect against unauthorized widget usage by validating request origins.

**Configuration:**
Add `ALLOWED_DOMAINS` to environment variables as a comma-separated list. The middleware checks the request Origin header against the allowlist. Reject requests from unauthorized domains with 403 Forbidden status. Support wildcard patterns for subdomain flexibility (e.g., `*.yourdomain.com`).

**Implementation Approach:**
Create domain validation middleware in `/nextjs-agent/src/middleware.ts`. Parse the Origin header from incoming requests. Compare against the configured allowlist with pattern matching. Log rejected requests for security monitoring. Allow localhost and development URLs in non-production environments.

### Token Refresh Mechanism

Implement automatic token refresh in the widget to maintain seamless user experience.

**Client-Side Logic:**
The widget SDK includes a `getClientSecret()` method that accepts an existing token parameter. When the current token approaches expiration (2-3 minutes before), automatically request a new token. The server validates the existing token and issues a fresh one if valid. The widget updates its internal token and continues operation without interruption.

**Frontend Implementation:**
Extend the Widget SDK initialization to include token management. Add a token expiration monitor that checks remaining validity. Implement exponential backoff for failed refresh attempts. Store tokens securely in memory (not localStorage) to prevent XSS access. Clear tokens immediately when the widget is closed or destroyed.

### Environment Variables

Add security-related configuration to the environment variables section.

**Required Variables:**
- `JWT_SECRET` - Secret key for signing tokens (minimum 32 characters)
- `SESSION_TOKEN_TTL` - Token time-to-live in seconds (default: 1800 for 30 minutes)
- `ALLOWED_DOMAINS` - Comma-separated list of authorized domains
- `SESSION_REFRESH_THRESHOLD` - Seconds before expiration to trigger refresh (default: 180)

**Optional Security Variables:**
- `ENABLE_TOKEN_ROTATION` - Rotate tokens on each refresh (default: true)
- `MAX_SESSIONS_PER_USER` - Limit concurrent sessions per user (default: 5)
- `SESSION_AUDIT_ENABLED` - Log session events to database (default: true)

### Database Schema

Store session metadata for audit trails and security monitoring.

**Session Table Structure:**
Create a sessions table with columns for session_id (UUID primary key), user_id (optional identifier), client_token_hash (hashed token for lookup), created_at (session start timestamp), expires_at (token expiration time), last_refreshed_at (most recent refresh), ip_address (client IP for security), user_agent (browser/device info), and is_revoked (manual revocation flag).

**Benefits:**
Track active sessions per user for security limits. Provide audit trails for compliance requirements. Enable manual session revocation for compromised accounts. Monitor suspicious patterns like excessive refresh attempts. Support analytics on session duration and usage patterns.

### Best Practices

**Token Security:**
- Never log complete tokens (only log hashed versions)
- Use cryptographically secure random values for JWT secrets
- Rotate JWT_SECRET periodically in production
- Set appropriate token TTL based on risk tolerance
- Implement token blacklisting for logout functionality

**Domain Security:**
- Keep ALLOWED_DOMAINS as restrictive as possible
- Use HTTPS-only in production to prevent token interception
- Implement Content Security Policy (CSP) headers
- Monitor and alert on requests from unauthorized domains
- Regularly audit domain allowlist for outdated entries

**Session Monitoring:**
- Track failed authentication attempts
- Alert on unusual session patterns (rapid creation, geographic anomalies)
- Implement rate limiting on session creation endpoint
- Log all token refresh events for forensics
- Set up automated session cleanup for expired tokens

### Migration from Basic Auth

If migrating from basic authentication, follow this approach:

**Phase 1 - Dual Support:**
Support both API key and token-based authentication temporarily. Add a feature flag to gradually roll out token auth. Monitor both authentication methods in parallel. Identify and migrate high-value users first.

**Phase 2 - Token Enforcement:**
Deprecate API key authentication with advance notice. Enforce token-based auth for all new sessions. Provide migration guides and support for existing integrations. Set sunset date for legacy authentication.

**Phase 3 - Cleanup:**
Remove API key authentication code paths. Update documentation to reflect token-only approach. Audit codebase for any remaining API key references. Enhance monitoring with token-specific metrics.



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



## API Reference

### Next.js Agent API Endpoints

**POST /api/chat**
- Send messages to the virtual agent
- Request: `{ message: string, threadId?: string, clientToken: string }`
- Response: SSE stream with token-by-token delivery
- Authentication: Requires valid client token

**POST /api/session**
- Create or refresh client authentication token
- Request: `{ existingToken?: string }`
- Response: `{ client_secret: string, expires_at: number, session_id: string }`
- Used by widget for token-based authentication

**GET /api/health**
- Health check endpoint
- Response: `{ status: 'ok', timestamp: number }`

**POST /api/reset**
- Reset conversation context
- Request: `{ threadId: string }`
- Response: `{ success: boolean }`

**GET /api/config**
- Get public agent configuration
- Response: Agent name, greeting, theme colors, starter prompts, etc.

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



## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes, updates, and version releases.

### Recent Updates

**Version 0.1.0** (2025-10-21)
- Initial project release with Next.js 15 and Svelte 5
- LangChain/LangGraph integration with multi-provider LLM support
- RAG capabilities and agentic workflows
- Embeddable widget with playground
- Comprehensive hooks system and Widget SDK
- Typography color system and simplified theming

For complete version history and detailed changes, please refer to the [CHANGELOG.md](CHANGELOG.md) file.



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



## Support

For issues and questions:
- Open an issue on GitHub
- Contact: support@your-domain.com



## License

[MIT License](LICENSE)



## Acknowledgments

Built with:
- [Next.js 15](https://nextjs.org/)
- [LangChain](https://js.langchain.com/)
- [Anthropic Claude](https://www.anthropic.com/)
- [OpenAI](https://openai.com/)
- [SvelteJS](https://svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
