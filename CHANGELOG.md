# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced Security Model with JWT-based client tokens
- Session management endpoint for token generation and refresh
- Domain allowlist for widget authorization
- Token rotation and automatic refresh mechanism
- Session audit logging with PostgreSQL
- Starter Prompts system for guided user engagement
- StarterPrompts component for displaying suggested questions
- Contextual suggestions using post-message hooks
- Category-based prompt organization
- Analytics integration for prompt performance tracking
- Hooks System for middleware/plugin architecture
- Widget SDK with comprehensive JavaScript API
- Typography color configuration (TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED, TEXT_INVERSE)
- Widget playground HTML for testing
- ChatHeader component documentation
- MessageBubble component documentation
- ChatBackground component documentation
- Svelte 5 widget component with runes-based reactivity
- Widget.svelte component with chat dialog and iframe embedding
- Tailwind CSS styling for widget components
- CSS file loading in playground for proper widget styling

### Changed
- Simplified color configuration to PRIMARY_COLOR and SECONDARY_COLOR
- Updated README with code-free component descriptions
- Improved documentation structure with Hooks System, Widget SDK, Enhanced Security, and Starter Prompts sections
- Added security environment variables (JWT_SECRET, SESSION_TOKEN_TTL, ALLOWED_DOMAINS)
- Enhanced API Reference with session endpoint documentation
- Migrated from SvelteKit to standalone Svelte 5 widget with Vite
- Updated widget instantiation to use Svelte 5 mount() API
- Changed component lifecycle to use unmount() instead of $destroy()
- Configured Vite for IIFE library build for easy script tag embedding

### Fixed
- Fixed Svelte 5 component mounting by using mount() instead of new Component()
- Fixed widget styling by adding CSS link in playground.html

### Removed
- Component-specific color variables (USER_BUBBLE_COLOR, AGENT_BUBBLE_COLOR, etc.)
- Code references from README UI Components section
- SvelteKit-specific files (app.d.ts, app.html, routes, .npmrc)

## [0.1.0] - 2025-10-21

### Added
- Initial project boilerplate
- Next.js 15 virtual agent with React 19
- SvelteJS embeddable widget wrapper
- LangChain/LangGraph integration
- Multi-provider LLM support (Anthropic Claude, OpenAI, Google Gemini)
- RAG capabilities with Qdrant vector database
- Agentic workflows with ReAct pattern
- Server-Sent Events (SSE) streaming
- PostgreSQL state persistence
- TailwindCSS styling for all components
- Environment-based configuration
- Rate limiting and security middleware
- TypeScript support across the stack
- ESLint and Prettier code quality tools
- Husky pre-commit hooks
- Docker support
- Comprehensive documentation

[Unreleased]: https://github.com/yourusername/virtual-agent/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/virtual-agent/releases/tag/v0.1.0
