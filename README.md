# MineAdmin Documentation

This is a VitePress-powered documentation site for MineAdmin, an enterprise-level admin system based on the Hyperf framework. The documentation is multilingual, supporting Chinese (zh), English (en), Traditional Chinese (Hong Kong - zh-hk), and Traditional Chinese (Taiwan - zh-tw).

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

### Using Makefile

The project includes a comprehensive Makefile for efficient build management and memory optimization:

```bash
# Show all available commands with descriptions
make help

# Setup and development
make install         # Install dependencies
make dev             # Start Chinese development server
make dev-en          # Start English development server
make dev-ja          # Start Japanese development server
make preview         # Preview built documentation
make clean           # Clean all build artifacts

# Build commands (recommended order by memory usage)
make build           # Build all languages step-by-step (recommended, 8GB+ RAM)
make build-slow      # Memory-efficient build with pauses (4-8GB RAM)
make build-ultra-safe# Ultra memory-efficient build (<4GB RAM)
make build-all       # Build all languages in parallel (memory intensive)

# Individual language builds
make build-zh        # Build Chinese → dist/
make build-en        # Build English → dist-en/
make build-ja        # Build Japanese → dist-ja/
make build-zh-hk     # Build Traditional Chinese (HK) → dist-zh-hk/
make build-zh-tw     # Build Traditional Chinese (TW) → dist-zh-tw/

# Memory-optimized builds (2GB limit)
make build-zh-safe   # Build Chinese with memory optimization
make build-en-safe   # Build English with memory optimization
# (Similar commands available for all languages)

# Ultra low memory builds (1GB limit)
make build-zh-tiny   # Build Chinese with 1GB memory limit
make build-en-tiny   # Build English with 1GB memory limit
# (Similar commands available for all languages)

# Quick commands
make quick-zh        # Quick Chinese build
make quick-en        # Quick English build
make quick-ja        # Quick Japanese build

# Utility commands
make translate       # Translate documentation
make test           # Test build process with Chinese docs
make check-build    # Check build status for all languages
make build-changed LANG=zh  # Build specific language only
```

### Translation

```bash
# Basic English translation
pnpm run docs:translate

# Multi-language translation (English + Japanese by default)
pnpm run docs:translate:enhanced

# Force translate all files to all languages
pnpm run docs:translate:full
```

## Project Structure

```
docs/
├── zh/          # Chinese documentation (primary)
├── en/          # English documentation
├── zh-hk/       # Traditional Chinese (Hong Kong)
├── zh-tw/       # Traditional Chinese (Taiwan)
└── demos/       # Vue component demos

.vitepress/
├── config.mts   # Main VitePress configuration
├── src/         # Locale-specific configurations
└── plugins/     # Custom markdown plugins

bin/
├── lib/         # Translation core library
├── translate.ts # Basic translation tool
└── translate-enhanced.ts # Advanced translation tool
```

## Features

- **Multilingual Support**: 8+ languages with automated translation system
- **Interactive Demos**: Vue 3 components with live preview and code display
- **TypeScript**: Full type safety for configuration and translation tools
- **Modern Stack**: VitePress, Vue 3, Element Plus, UnoCSS
- **Translation System**: DeepSeek API integration with concurrent processing

## Content Categories

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

## Environment Variables

- `DEEPSEEK_API_KEY` - Required for translation features
- `TARGET_LANGUAGES` - Comma-separated language codes (default: "en,ja")
- `MAX_CONCURRENT` - Maximum concurrent translations (default: 10)
- `FORCE_TRANSLATE_ALL` - Force translate all files (default: false)

## Contributing

1. Write documentation in Chinese (`/docs/zh/`)
2. Use the translation tools to generate other language versions
3. Create interactive demos in `/docs/demos/` for complex features
4. Follow the existing VitePress configuration patterns

## License

This documentation project is part of the MineAdmin ecosystem.
