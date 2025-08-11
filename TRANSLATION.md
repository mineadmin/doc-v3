# Translation System

This document describes the enhanced translation system for the MineAdmin documentation.

## Overview

The translation system supports multiple languages and provides both incremental and full translation modes.

## Supported Languages

| Language | Code | Status |
|----------|------|--------|
| Chinese (Simplified) | `zh` | Source language |
| English | `en` | ✅ Supported |
| Japanese | `ja` | ✅ Supported |
| Traditional Chinese (Hong Kong) | `zh-hk` | ✅ Supported (via PHP script) |
| Traditional Chinese (Taiwan) | `zh-tw` | ✅ Supported (via PHP script) |

## Translation Scripts

### 1. Enhanced Translation Script (`bin/translate-enhanced.js`)

This is the main translation script that supports multiple languages and modes.

#### Features:
- Multi-language support (English and Japanese)
- Incremental translation (only changed files)
- Full translation mode (all files)
- Batch processing with concurrency control
- Retry mechanism for API failures
- Detailed progress reporting

#### Environment Variables:
- `DEEPSEEK_API_KEY` (required): API key for DeepSeek translation service
- `TARGET_LANGUAGES` (optional): Comma-separated list of target languages (default: "en,ja")
- `FORCE_TRANSLATE_ALL` (optional): Set to "true" to translate all files regardless of changes
- `ALL_CHANGED_FILES` (optional): Space-separated list of changed files for incremental mode
- `MAX_CONCURRENT` (optional): Maximum number of parallel translation tasks (default: 10)

### 2. Legacy Translation Script (`bin/translate.js`)

The original script that only supports English translation. Still maintained for compatibility.

## NPM Scripts

```bash
# Legacy English-only translation (incremental mode)
pnpm run docs:translate

# Enhanced multi-language translation (incremental mode)
pnpm run docs:translate:enhanced

# Full translation of all files to all supported languages
pnpm run docs:translate:full
```

## GitHub Actions Workflows

### 1. Auto Translation (`auto-translate.yml`)

- **Trigger**: Pull requests that modify Chinese documentation
- **Mode**: Incremental (only changed files)
- **Languages**: English and Japanese
- **Process**: 
  1. Detects changed markdown files
  2. Translates only modified files
  3. Commits translations back to the PR branch

### 2. Full Translation (`full-translate.yml`)

- **Trigger**: Manual workflow dispatch
- **Mode**: Full translation (all files)
- **Languages**: Configurable (default: English and Japanese)
- **Process**:
  1. Translates all documentation files
  2. Supports language selection via workflow input
  3. Option to force translation of all files

#### How to Run Full Translation:

1. Go to GitHub Actions tab
2. Select "Full Document Translation" workflow
3. Click "Run workflow"
4. Configure options:
   - **Target languages**: `en,ja` (or any subset)
   - **Force translate all files**: `true` (recommended for new language additions)

## Usage Examples

### Incremental Translation (Development)

```bash
# Set up environment
export DEEPSEEK_API_KEY="your-api-key-here"

# Translate only changed files to English and Japanese (default 10 parallel tasks)
export ALL_CHANGED_FILES="docs/zh/guide/start.md docs/zh/backend/index.md"
pnpm run docs:translate:enhanced

# Increase concurrency for faster processing
export MAX_CONCURRENT=20
pnpm run docs:translate:enhanced
```

### Full Translation (New Language Support)

```bash
# Set up environment
export DEEPSEEK_API_KEY="your-api-key-here"

# Translate all files to all supported languages (default 10 parallel tasks)
pnpm run docs:translate:full

# High-performance translation with increased concurrency
export MAX_CONCURRENT=20
pnpm run docs:translate:full

# Or translate to specific languages with custom settings
export TARGET_LANGUAGES="en"
export FORCE_TRANSLATE_ALL="true"
export MAX_CONCURRENT=15
pnpm run docs:translate:enhanced
```

### Adding a New Language

To add support for a new language (e.g., Korean `ko`):

1. **Create VitePress configuration files**:
   ```
   .vitepress/src/ko/config.ts
   .vitepress/src/ko/nav.ts
   .vitepress/src/ko/sidebars.ts
   ```

2. **Update main VitePress config** (`.vitepress/config.mts`):
   - Import Korean config files
   - Add Korean locale configuration
   - Add Korean search translations

3. **Update translation script** (`bin/translate-enhanced.js`):
   - Add Korean language configuration in `languageConfigs`
   - Include system prompts for Korean translation

4. **Update workflows**:
   - Add Korean to `TARGET_LANGUAGES` in GitHub Actions
   - Update default language lists

5. **Run full translation**:
   ```bash
   export TARGET_LANGUAGES="en,ja,ko"
   export FORCE_TRANSLATE_ALL="true"
   pnpm run docs:translate:enhanced
   ```

## File Structure

```
docs/
├── zh/           # Chinese source files
├── en/           # English translations
├── ja/           # Japanese translations
├── zh-hk/        # Traditional Chinese (Hong Kong)
└── zh-tw/        # Traditional Chinese (Taiwan)

.vitepress/src/
├── zh/           # Chinese VitePress config
├── en/           # English VitePress config
├── ja/           # Japanese VitePress config
├── zh-hk/        # Traditional Chinese (Hong Kong) config
└── zh-tw/        # Traditional Chinese (Taiwan) config
```

## Best Practices

1. **Always test translations locally** before deploying
2. **Use incremental mode** for regular updates to save API costs
3. **Use full translation mode** when adding new languages or major restructuring
4. **Review generated translations** for technical accuracy
5. **Update navigation and sidebar** configurations when adding new content

## Troubleshooting

### Common Issues:

1. **API Rate Limits**: The script includes retry mechanisms and concurrency limits
2. **Missing API Key**: Ensure `DEEPSEEK_API_KEY` is set in your environment
3. **File Path Issues**: Check that source files exist and paths are correct
4. **Translation Quality**: Review generated content, especially technical terms

### Debug Mode:

Set environment variables for debugging:
```bash
export DEBUG=true
export MAX_CONCURRENT=1  # Reduce concurrency for debugging
```

## Contributing

When contributing translations:

1. Test your changes locally first
2. Use the incremental translation mode for small changes
3. Update this documentation when adding new features
4. Follow the existing code style and patterns