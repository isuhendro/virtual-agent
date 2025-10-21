# Virtual Agent

A customizable virtual agent system with a Next.js 15-based bot backend and SvelteJS wrapper for easy integration.

## Overview

This project consists of two main components:

1. **Next.js 15 Virtual Agent** - The core chatbot/virtual agent application
2. **SvelteJS Wrapper** - A snippet generator that wraps and embeds the Next.js virtual agent into any website

The virtual agent is fully customizable through environment variables, allowing you to adapt it for any use case without code changes.

## Project Structure

```
virtual-agent/
├── nextjs-agent/                      # Next.js 15 virtual agent application
│   ├── src/
│   │   ├── app/                       # Next.js 15 App Router
│   │   │   ├── api/                   # API Routes
│   │   │   │   ├── chat/
│   │   │   │   │   └── route.ts       # Chat endpoint
│   │   │   │   ├── health/
│   │   │   │   │   └── route.ts       # Health check endpoint
│   │   │   │   ├── reset/
│   │   │   │   │   └── route.ts       # Reset conversation endpoint
│   │   │   │   └── config/
│   │   │   │       └── route.ts       # Get agent configuration
│   │   │   ├── chat/
│   │   │   │   └── page.tsx           # Chat interface page
│   │   │   ├── embed/
│   │   │   │   └── page.tsx           # Embeddable chat widget
│   │   │   ├── layout.tsx             # Root layout
│   │   │   ├── page.tsx               # Home page
│   │   │   └── globals.css            # Global styles
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
│   │   │   ├── ai/
│   │   │   │   ├── openai.ts          # OpenAI integration
│   │   │   │   ├── prompts.ts         # Prompt management
│   │   │   │   └── context.ts         # Conversation context
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
│   ├── next.config.js                 # Next.js configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── tailwind.config.js             # Tailwind CSS config (optional)
│   ├── package.json
│   └── README.md
│
├── svelte-wrapper/                    # SvelteJS snippet generator/wrapper
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/
│   │   │   │   ├── ConfigForm.svelte  # Configuration form
│   │   │   │   ├── SnippetGenerator.svelte
│   │   │   │   ├── Preview.svelte     # Live preview
│   │   │   │   └── CodeDisplay.svelte # Generated code display
│   │   │   ├── stores/
│   │   │   │   └── config.ts          # Svelte stores
│   │   │   └── utils/
│   │   │       └── snippet-builder.ts # Snippet generation logic
│   │   ├── routes/
│   │   │   ├── +page.svelte           # Main page
│   │   │   └── +layout.svelte
│   │   ├── app.html
│   │   └── app.css
│   ├── static/
│   │   └── widget/
│   │       └── virtual-agent.js       # Generated widget script
│   ├── package.json
│   ├── svelte.config.js
│   ├── vite.config.js
│   └── README.md
│
└── README.md                          # This file
```

## Features

- **Next.js 15 App Router**: Leverages the latest Next.js features including Server Components and Server Actions
- **Customizable System Prompts**: Configure agent behavior via environment variables
- **Multi-use Case Support**: Adapt the agent for customer service, sales, support, etc.
- **Easy Integration**: Generate embeddable snippets with the SvelteJS wrapper
- **Modern Stack**: Built with Next.js 15 and SvelteJS for optimal performance
- **TypeScript**: Full type safety across the codebase
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Streaming Responses**: Real-time AI responses using Next.js streaming
- **Rate Limiting**: Built-in protection against abuse
- **Middleware Support**: CORS, authentication, and request validation

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
# Agent Behavior
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

# AI/LLM Configuration
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4"         # gpt-4, gpt-4-turbo, gpt-3.5-turbo, etc.
MAX_TOKENS=1000
TEMPERATURE=0.7
TOP_P=1
FREQUENCY_PENALTY=0
PRESENCE_PENALTY=0

# Conversation Settings
MAX_CONVERSATION_HISTORY=10  # Number of messages to keep in context
CONVERSATION_TIMEOUT=1800    # seconds (30 minutes)

# Rate Limiting
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW=60         # seconds
RATE_LIMIT_ENABLED=true

# UI Customization
PRIMARY_COLOR="#007bff"
SECONDARY_COLOR="#6c757d"
BACKGROUND_COLOR="#ffffff"
TEXT_COLOR="#333333"
BRAND_LOGO_URL=""
AGENT_AVATAR_URL=""
FONT_FAMILY="system-ui, sans-serif"

# Widget Settings
WIDGET_POSITION="bottom-right"  # bottom-right, bottom-left, top-right, top-left
WIDGET_SIZE="medium"            # small, medium, large
ENABLE_MINIMIZE=true
ENABLE_SOUND=false

# Integration & Security
ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"
CORS_ENABLED=true
WEBHOOK_URL=""               # Optional: webhook for conversation logging
WEBHOOK_SECRET=""            # Optional: secret for webhook authentication
ANALYTICS_ENABLED=false
ANALYTICS_ID=""

# Database (Optional)
DATABASE_URL=""              # PostgreSQL, MySQL, etc.
ENABLE_CONVERSATION_LOGGING=false

# Next.js Specific
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_AGENT_NAME="${AGENT_NAME}"
NEXT_PUBLIC_PRIMARY_COLOR="${PRIMARY_COLOR}"
```

#### Example Configurations

**Customer Support Agent:**
```env
SYSTEM_PROMPT="You are a friendly customer support agent for ${BUSINESS_NAME}. Help users with their questions, troubleshoot issues, and escalate complex problems to human agents when needed. Always be polite, patient, and solution-oriented."
AGENT_NAME="SupportBot"
AGENT_ROLE="Customer Support Specialist"
USE_CASE="customer_support"
AGENT_TONE="friendly"
AGENT_GREETING="Hi there! I'm here to help with any questions or issues you might have. How can I assist you today?"
```

**Sales Agent:**
```env
SYSTEM_PROMPT="You are a knowledgeable sales assistant for ${BUSINESS_NAME}. Help customers find the right products, answer product questions, and guide them through the purchasing process. Be enthusiastic but not pushy."
AGENT_NAME="SalesBot"
AGENT_ROLE="Sales Assistant"
USE_CASE="sales"
AGENT_TONE="professional"
AGENT_GREETING="Welcome! I'd love to help you find what you're looking for. What brings you here today?"
```

**Technical Support:**
```env
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

- **`ai/`**: All AI-related logic (OpenAI integration, prompt engineering)
- **`utils/`**: Helper functions and utilities
- **`config/`**: Configuration and environment validation
- **`db/`**: Database clients and schemas

### `/src/components` - React Components

Organized by feature:

- **`chat/`**: Chat-specific components
- **`ui/`**: Reusable UI components
- **`theme/`**: Theme and styling components

### Key Files Explained

#### `src/middleware.ts`
Next.js 15 middleware for request processing:
```typescript
export function middleware(request: NextRequest) {
  // CORS handling
  // Rate limiting
  // Authentication
  // Request validation
}
```

#### `src/app/api/chat/route.ts`
Main chat endpoint with streaming support:
```typescript
export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  // Stream AI responses back to client
}
```

## Usage

### Embedding the Virtual Agent

Use the SvelteJS wrapper to generate an embeddable snippet:

1. Configure your agent settings in the wrapper UI
2. Generate the snippet code
3. Copy and paste into your website's HTML:

```html
<!-- Add this before closing </body> tag -->
<script src="https://your-domain.com/virtual-agent-snippet.js"></script>
<script>
  VirtualAgent.init({
    agentUrl: 'https://your-nextjs-agent-url.com',
    position: 'bottom-right',
    theme: 'light',
    primaryColor: '#007bff'
  });
</script>
```

### Customizing for Different Use Cases

Simply update the environment variables and restart the Next.js application:

```bash
# Update .env.local with new configuration
npm run dev
```

No code changes required!

## Development

### Next.js Agent Development

```bash
cd nextjs-agent
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run type-check # TypeScript type checking
npm run test      # Run tests
```

### SvelteJS Wrapper Development

```bash
cd svelte-wrapper
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run check     # Check Svelte components
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
- [ ] Multi-agent orchestration
- [ ] Plugin system for custom behaviors
- [ ] Mobile app (React Native)

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
│      LLM Integration (OpenAI)       │
│   - Streaming Responses             │
│   - Prompt Engineering              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Response Processing & Delivery    │
└─────────────────────────────────────┘
```

### SvelteJS Wrapper Flow

```
┌─────────────────────────────────────┐
│   Configuration UI (Svelte)         │
│   - Agent Settings Form             │
│   - Theme Customization             │
│   - Preview Component               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Snippet Code Generator            │
│   - JavaScript Builder              │
│   - CSS Injection                   │
│   - Configuration Embedding         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Embeddable Widget Script          │
│   → Loads Next.js Agent iFrame      │
│   → Handles Communication           │
│   → Applies Custom Styling          │
└─────────────────────────────────────┘
```

## Technology Stack

### Next.js Agent
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / CSS Modules
- **AI**: OpenAI API
- **State**: React hooks / Zustand
- **Validation**: Zod
- **Testing**: Jest, React Testing Library

### SvelteJS Wrapper
- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: Svelte scoped styles
- **Build**: Vite
- **State**: Svelte stores

## Acknowledgments

Built with:
- [Next.js 15](https://nextjs.org/)
- [SvelteJS](https://svelte.dev/)
- [OpenAI](https://openai.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
