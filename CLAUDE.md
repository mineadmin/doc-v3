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
- `pnpm run docs:translate` - Translate Chinese markdown files to English using DeepSeek API (requires `DEEPSEEK_API_KEY` environment variable)
- `pnpm run docs:translate:enhanced` - Enhanced translation tool supporting multiple languages (English and Japanese by default)
- `pnpm run docs:translate:full` - Force translate all files to all configured languages

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
- **Core Library**: `bin/lib/translation-core.ts` - Shared TypeScript library with strong typing
- **Basic Translation**: `bin/translate.ts` - Simple English translation tool
- **Enhanced Translation**: `bin/translate-enhanced.ts` - Multi-language translation with advanced features
- **Supported Languages**: English (en), Japanese (ja), Korean (ko), Spanish (es), French (fr), German (de), Russian (ru)
- **API Integration**: DeepSeek API for high-quality translations
- **Features**:
  - Concurrent translation processing with rate limiting
  - Incremental translation based on changed files
  - Strong TypeScript typing for code stability
  - Comprehensive error handling and retry mechanisms
  - Progress tracking and detailed statistics
- **Configuration**:
  - `DEEPSEEK_API_KEY` - Required API key
  - `TARGET_LANGUAGES` - Comma-separated language codes (default: "en,ja")
  - `MAX_CONCURRENT` - Maximum concurrent translations (default: 10)
  - `FORCE_TRANSLATE_ALL` - Force translate all files (default: false)
  - `ALL_CHANGED_FILES` - Specific files to translate (used by CI/CD)

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

The translation system has been upgraded to TypeScript with enhanced features:

### Quick Commands
```bash
# Basic English translation
pnpm run docs:translate

# Multi-language translation (English + Japanese)
pnpm run docs:translate:enhanced

# Force translate all files to all languages
pnpm run docs:translate:full

# Custom language selection
TARGET_LANGUAGES="en,ja,ko" pnpm run docs:translate:enhanced

# High concurrency translation
MAX_CONCURRENT=20 pnpm run docs:translate:enhanced
```

### Translation Process
1. **File Detection**: Automatically detects changed files via git or `ALL_CHANGED_FILES` environment variable
2. **Language Processing**: Translates to multiple languages concurrently with rate limiting
3. **Content Preservation**: Maintains markdown formatting and updates path references
4. **Error Handling**: Implements retry mechanisms and detailed error reporting
5. **Statistics**: Provides comprehensive translation statistics and performance metrics

### Language Support
The system supports the following languages out-of-the-box:
- English (en) - `/en/`
- Japanese (ja) - `/ja/`
- Korean (ko) - `/ko/`
- Spanish (es) - `/es/`
- French (fr) - `/fr/`
- German (de) - `/de/`
- Russian (ru) - `/ru/`

Additional languages can be added by extending the `LanguageConfigFactory` in `bin/lib/translation-core.ts`.

## Component Development

When working with demo components in `/docs/demos/`:
- Each demo should have an `index.vue` as the main component
- Additional files in the demo directory are automatically included in documentation
- Components have access to Element Plus, Vue 3 ecosystem, and MineAdmin-specific packages