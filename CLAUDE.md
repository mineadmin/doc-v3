# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VitePress-powered documentation site for MineAdmin, an enterprise-level admin system based on the Hyperf framework. The documentation is multilingual, supporting Chinese (zh), English (en), Traditional Chinese (Hong Kong - zh-hk), and Traditional Chinese (Taiwan - zh-tw).

## Development Commands

### Core Development Tasks
- `pnpm run dev` - Start VitePress development server
- `pnpm run build` - Build the documentation for production
- `pnpm run preview` - Preview the built documentation locally

### Translation
- `pnpm run docs:translate` - Translate Chinese markdown files to English using OpenAI API (requires `DEEPSEEK_API_KEY` environment variable)

## Architecture and Structure

### Documentation Structure
The project follows a multilingual documentation pattern:
- `/docs/zh/` - Chinese documentation (primary)
- `/docs/en/` - English documentation (translated)
- `/docs/zh-hk/` - Traditional Chinese (Hong Kong)
- `/docs/zh-tw/` - Traditional Chinese (Taiwan)

### VitePress Configuration
- Main config: `.vitepress/config.mts` - Central configuration with locale-specific settings
- Locale configs: `.vitepress/src/{locale}/` containing:
  - `config.ts` - Locale-specific title and description
  - `nav.ts` - Navigation menu structure
  - `sidebars.ts` - Sidebar navigation structure

### Key Components and Features

#### Demo Preview System
- Custom markdown plugin at `.vitepress/plugins/previewPlugin.ts`
- Enables `<DemoPreview dir="path">` syntax to embed Vue component demos
- Automatically imports components and displays code alongside rendered output
- Demo components located in `/docs/demos/`

#### Translation System
- Automated translation via `bin/translate.js` using DeepSeek API
- Supports incremental translation based on `ALL_CHANGED_FILES` environment variable
- Handles both `.md` and `.ts` files with appropriate system prompts

### Content Categories
Documentation is organized into:
- **Guide** - Introduction, installation, deployment
- **Frontend** - Vue.js components, advanced topics, development patterns  
- **Backend** - PHP/Hyperf framework topics, security, data permissions
- **Plugins** - Extension system, development, migration
- **FAQ** - Common questions and troubleshooting

## Technology Stack

- **VitePress** - Static site generator
- **Vue 3** - Component framework for interactive demos
- **TypeScript** - Type safety for configuration
- **Element Plus** - UI component library for demos
- **UnoCSS** - Utility-first CSS framework
- **PlantUML** - Diagram generation support

## Working with Translations

When making changes to Chinese documentation (`/docs/zh/`), run the translation command to update English versions. The system:
1. Detects changed files via git or environment variable
2. Uses AI to translate content while preserving markdown formatting
3. Automatically updates path references from `/zh/` to `/en/`

## Component Development

When working with demo components in `/docs/demos/`:
- Each demo should have an `index.vue` as the main component
- Additional files in the demo directory are automatically included in documentation
- Components have access to Element Plus, Vue 3 ecosystem, and MineAdmin-specific packages