.PHONY: help clean install dev preview build build-all build-zh build-en build-ja build-zh-hk build-zh-tw translate test

# Default target
help:
	@echo "📚 MineAdmin Documentation Build System"
	@echo "========================================"
	@echo ""
	@echo "🎯 Unified Architecture: Chinese as default, other languages as sub-paths"
	@echo "  • docs/zh     → .vitepress/dist/         (Chinese - default root)"
	@echo "  • docs/en     → .vitepress/dist/en/      (English - /en/)"
	@echo "  • docs/ja     → .vitepress/dist/ja/      (Japanese - /ja/)"
	@echo "  • docs/zh-hk  → .vitepress/dist/zh-hk/   (Traditional Chinese HK - /zh-hk/)"
	@echo "  • docs/zh-tw  → .vitepress/dist/zh-tw/   (Traditional Chinese TW - /zh-tw/)"
	@echo ""
	@echo "🔧 Setup Commands:"
	@echo "  install         - Install dependencies"
	@echo "  dev             - Start development server (Chinese)"
	@echo "  dev-en          - Start development server (English)"
	@echo "  dev-ja          - Start development server (Japanese)"
	@echo "  dev-zh-hk       - Start development server (Traditional Chinese HK)"
	@echo "  dev-zh-tw       - Start development server (Traditional Chinese TW)"
	@echo "  preview         - Preview built documentation"
	@echo "  clean           - Clean all build artifacts"
	@echo ""
	@echo "🏗️  Build Commands:"
	@echo "  build           - Build all languages step by step (recommended)"
	@echo "  build-slow      - Memory-efficient build with pauses"
	@echo "  build-ultra-safe- Ultra memory-efficient build with garbage collection"
	@echo "  build-all       - Build all languages in parallel (memory intensive)"
	@echo ""
	@echo "🌍 Language-specific Builds:"
	@echo "  build-zh        - Build Chinese documentation → dist/"
	@echo "  build-en        - Build English documentation → dist/en/"
	@echo "  build-ja        - Build Japanese documentation → dist/ja/"
	@echo "  build-zh-hk     - Build Traditional Chinese (HK) → dist/zh-hk/"
	@echo "  build-zh-tw     - Build Traditional Chinese (TW) → dist/zh-tw/"
	@echo ""
	@echo "🔒 Memory-Safe Builds (for low-memory systems):"
	@echo "  build-zh-safe   - Build Chinese with 2GB memory optimization"
	@echo "  build-en-safe   - Build English with 2GB memory optimization"
	@echo "  build-ja-safe   - Build Japanese with 2GB memory optimization"
	@echo "  build-zh-hk-safe- Build Traditional Chinese (HK) with 2GB memory optimization"
	@echo "  build-zh-tw-safe- Build Traditional Chinese (TW) with 2GB memory optimization"
	@echo ""
	@echo "🔒 Ultra Low Memory Builds (for <2GB RAM systems):"
	@echo "  build-zh-tiny   - Build Chinese with 1GB memory limit"
	@echo "  build-en-tiny   - Build English with 1GB memory limit"
	@echo "  build-ja-tiny   - Build Japanese with 1GB memory limit"
	@echo "  build-zh-hk-tiny- Build Traditional Chinese (HK) with 1GB memory limit"
	@echo "  build-zh-tw-tiny- Build Traditional Chinese (TW) with 1GB memory limit"
	@echo ""
	@echo "🚀 Quick Commands:"
	@echo "  quick-zh        - Quick Chinese build"
	@echo "  quick-en        - Quick English build"
	@echo "  quick-ja        - Quick Japanese build"
	@echo "  build-changed   - Build specific language (Usage: make build-changed LANG=zh)"
	@echo ""
	@echo "🔍 Utility Commands:"
	@echo "  translate       - Translate documentation"
	@echo "  test            - Test build process"
	@echo "  check-build     - Check build status"
	@echo ""
	@echo "💡 Recommended usage for different memory constraints:"
	@echo "  make build           # Standard step-by-step build (8GB+ RAM)"
	@echo "  make build-slow      # For moderate memory systems (4-8GB RAM)"
	@echo "  make build-ultra-safe# For very low memory systems (<4GB RAM)"
	@echo "  make build-zh-safe   # Single language with memory optimization"

# Install dependencies
install:
	pnpm install

# Development servers
dev:
	pnpm exec vitepress dev --config .vitepress/config.zh.mts

dev-en:
	pnpm exec vitepress dev --config .vitepress/config.en.mts

dev-ja:
	pnpm exec vitepress dev --config .vitepress/config.ja.mts

dev-zh-hk:
	pnpm exec vitepress dev --config .vitepress/config.zh-hk.mts

dev-zh-tw:
	pnpm exec vitepress dev --config .vitepress/config.zh-tw.mts

# Preview built documentation
preview:
	pnpm run preview

# Clean build artifacts
clean:
	rm -rf .vitepress/dist
	rm -rf .vitepress/cache
	rm -rf .vitepress/.temp

# Build all languages using original multi-locale config (memory intensive)
build-all: clean
	@echo "Building all languages using original config..."
	NODE_OPTIONS="--max-old-space-size=16192" pnpm run build

# Build Chinese documentation only (default output)
build-zh:
	@echo "Building Chinese documentation → .vitepress/dist/"
	NODE_OPTIONS="--max-old-space-size=16192" pnpm exec vitepress build --config .vitepress/config.zh.mts

# Build English documentation only
build-en:
	@echo "Building English documentation → .vitepress/dist-en/"
	NODE_OPTIONS="--max-old-space-size=16192" pnpm exec vitepress build --config .vitepress/config.en.mts

# Build Japanese documentation only
build-ja:
	@echo "Building Japanese documentation → .vitepress/dist-ja/"
	NODE_OPTIONS="--max-old-space-size=16192" pnpm exec vitepress build --config .vitepress/config.ja.mts

# Build Traditional Chinese (Hong Kong) documentation only
build-zh-hk:
	@echo "Building Traditional Chinese (Hong Kong) documentation → .vitepress/dist-zh-hk/"
	NODE_OPTIONS="--max-old-space-size=16192" pnpm exec vitepress build --config .vitepress/config.zh-hk.mts

# Build Traditional Chinese (Taiwan) documentation only
build-zh-tw:
	@echo "Building Traditional Chinese (Taiwan) documentation → .vitepress/dist-zh-tw/"
	NODE_OPTIONS="--max-old-space-size=16192" pnpm exec vitepress build --config .vitepress/config.zh-tw.mts

# Step-by-step build (recommended for memory management)
build: clean
	@echo "Starting step-by-step build process..."
	@echo "Step 1/5: Building Chinese documentation → dist/"
	@$(MAKE) build-zh
	@echo "Step 2/5: Building English documentation → dist-en/"
	@$(MAKE) build-en
	@echo "Step 3/5: Building Japanese documentation → dist-ja/"
	@$(MAKE) build-ja
	@echo "Step 4/5: Building Traditional Chinese (Hong Kong) → dist-zh-hk/"
	@$(MAKE) build-zh-hk
	@echo "Step 5/5: Building Traditional Chinese (Taiwan) → dist-zh-tw/"
	@$(MAKE) build-zh-tw
	@echo "✅ All language projects built successfully!"
	@echo "📁 Unified output structure:"
	@echo "  • Chinese (root):    .vitepress/dist/"
	@echo "  • English:           .vitepress/dist/en/"
	@echo "  • Japanese:          .vitepress/dist/ja/"
	@echo "  • Traditional (HK):  .vitepress/dist/zh-hk/"
	@echo "  • Traditional (TW):  .vitepress/dist/zh-tw/"

# Translation
translate:
	pnpm run docs:translate

# Test build process (build Chinese only for testing)
test:
	@echo "Testing build process with Chinese documentation..."
	@$(MAKE) build-zh
	@echo "Test build completed successfully!"

# Quick commands for development
quick-zh:
	@$(MAKE) build-zh

quick-en:
	@$(MAKE) build-en

quick-ja:
	@$(MAKE) build-ja

# Build only changed language (useful for CI/CD)
build-changed:
	@echo "Building only changed documentation..."
	@if [ -n "$(LANG)" ]; then \
		echo "Building $(LANG) documentation..."; \
		$(MAKE) build-$(LANG); \
	else \
		echo "Usage: make build-changed LANG=zh|en|ja|zh-hk|zh-tw"; \
		exit 1; \
	fi

# Memory-efficient build with pause between builds
build-slow: clean
	@echo "Starting memory-efficient build process..."
	@echo "Step 1/5: Building Chinese documentation..."
	@$(MAKE) build-zh
	@echo "Waiting 5 seconds for memory cleanup..."
	@sleep 5
	@echo "Step 2/5: Building English documentation..."
	@$(MAKE) build-en
	@echo "Waiting 5 seconds for memory cleanup..."
	@sleep 5
	@echo "Step 3/5: Building Japanese documentation..."
	@$(MAKE) build-ja
	@echo "Waiting 5 seconds for memory cleanup..."
	@sleep 5
	@echo "Step 4/5: Building Traditional Chinese (Hong Kong) documentation..."
	@$(MAKE) build-zh-hk
	@echo "Waiting 5 seconds for memory cleanup..."
	@sleep 5
	@echo "Step 5/5: Building Traditional Chinese (Taiwan) documentation..."
	@$(MAKE) build-zh-tw
	@echo "✅ Memory-efficient build completed successfully!"

# Check if build files exist
check-build:
	@echo "Checking build status for unified language projects..."
	@if [ -d ".vitepress/dist" ] && [ -f ".vitepress/dist/index.html" ]; then \
		echo "✅ Chinese (zh): Built → dist/ (root)"; \
	else \
		echo "❌ Chinese (zh): Not built"; \
	fi
	@if [ -d ".vitepress/dist/en" ]; then \
		echo "✅ English (en): Built → dist/en/"; \
	else \
		echo "❌ English (en): Not built"; \
	fi
	@if [ -d ".vitepress/dist/ja" ]; then \
		echo "✅ Japanese (ja): Built → dist/ja/"; \
	else \
		echo "❌ Japanese (ja): Not built"; \
	fi
	@if [ -d ".vitepress/dist/zh-hk" ]; then \
		echo "✅ Traditional Chinese HK (zh-hk): Built → dist/zh-hk/"; \
	else \
		echo "❌ Traditional Chinese HK (zh-hk): Not built"; \
	fi
	@if [ -d ".vitepress/dist/zh-tw" ]; then \
		echo "✅ Traditional Chinese TW (zh-tw): Built → dist/zh-tw/"; \
	else \
		echo "❌ Traditional Chinese TW (zh-tw): Not built"; \
	fi

# Memory-safe individual builds (2GB limit)
build-zh-safe:
	@echo "Building Chinese documentation with memory optimization → dist/"
	NODE_OPTIONS="--max-old-space-size=2048" pnpm exec vitepress build --config .vitepress/config.zh.mts

build-en-safe:
	@echo "Building English documentation with memory optimization → dist/en/"
	NODE_OPTIONS="--max-old-space-size=2048" pnpm exec vitepress build --config .vitepress/config.en.mts

build-ja-safe:
	@echo "Building Japanese documentation with memory optimization → dist/ja/"
	NODE_OPTIONS="--max-old-space-size=2048" pnpm exec vitepress build --config .vitepress/config.ja.mts

build-zh-hk-safe:
	@echo "Building Traditional Chinese (Hong Kong) with memory optimization → dist/zh-hk/"
	NODE_OPTIONS="--max-old-space-size=2048" pnpm exec vitepress build --config .vitepress/config.zh-hk.mts

build-zh-tw-safe:
	@echo "Building Traditional Chinese (Taiwan) with memory optimization → dist/zh-tw/"
	NODE_OPTIONS="--max-old-space-size=2048" pnpm exec vitepress build --config .vitepress/config.zh-tw.mts

# Ultra low memory builds (1GB limit)
build-zh-tiny:
	@echo "Building Chinese documentation with 1GB memory limit → dist/"
	NODE_OPTIONS="--max-old-space-size=1024" pnpm exec vitepress build --config .vitepress/config.zh.mts

build-en-tiny:
	@echo "Building English documentation with 1GB memory limit → dist/en/"
	NODE_OPTIONS="--max-old-space-size=1024" pnpm exec vitepress build --config .vitepress/config.en.mts

build-ja-tiny:
	@echo "Building Japanese documentation with 1GB memory limit → dist/ja/"
	NODE_OPTIONS="--max-old-space-size=1024" pnpm exec vitepress build --config .vitepress/config.ja.mts

build-zh-hk-tiny:
	@echo "Building Traditional Chinese (Hong Kong) with 1GB memory limit → dist/zh-hk/"
	NODE_OPTIONS="--max-old-space-size=1024" pnpm exec vitepress build --config .vitepress/config.zh-hk.mts

build-zh-tw-tiny:
	@echo "Building Traditional Chinese (Taiwan) with 1GB memory limit → dist/zh-tw/"
	NODE_OPTIONS="--max-old-space-size=1024" pnpm exec vitepress build --config .vitepress/config.zh-tw.mts

# Ultra memory-efficient build with garbage collection
build-ultra-safe: clean
	@echo "Starting ultra-memory-efficient build process..."
	@echo "Step 1/5: Building Chinese documentation → dist/"
	@$(MAKE) build-zh-safe
	@echo "Forcing garbage collection and waiting..."
	@sleep 10
	@echo "Step 2/5: Building English documentation → dist/en/"
	@$(MAKE) build-en-safe
	@echo "Forcing garbage collection and waiting..."
	@sleep 10
	@echo "Step 3/5: Building Japanese documentation → dist/ja/"
	@$(MAKE) build-ja-safe
	@echo "Forcing garbage collection and waiting..."
	@sleep 10
	@echo "Step 4/5: Building Traditional Chinese (Hong Kong) → dist/zh-hk/"
	@$(MAKE) build-zh-hk-safe
	@echo "Forcing garbage collection and waiting..."
	@sleep 10
	@echo "Step 5/5: Building Traditional Chinese (Taiwan) → dist/zh-tw/"
	@$(MAKE) build-zh-tw-safe
	@echo "✅ Ultra-safe unified builds completed successfully!"
	@echo "📁 Unified structure: Chinese at root, other languages as sub-paths"