# Frontend Configuration Guide

MineAdmin frontend is built on Vite, offering a flexible environment variable configuration system that supports personalized settings for development, testing, production, and other environments.

## Environment Variable Configuration

### Configuration File Overview

The project provides the following environment configuration files by default:

- `.env.development` - Development environment configuration
- `.env.production` - Production environment configuration

You can create additional environment configuration files as needed, such as:
- `.env.test` - Test environment
- `.env.staging` - Pre-release environment
- `.env.local` - Local development specific (will be ignored by git)

::: tip Tip
Environment variable configuration follows Vite's conventions. For details, please refer to [Vite - Environment Variables and Modes](https://vitejs.dev/guide/env-and-mode.html)
:::

### Development Environment Configuration (.env.development)

Development environment configuration is mainly used for local development debugging and includes debug tools and proxy settings.

::: code-group

```env [.env.development]
# ================================
# Basic Application Configuration
# ================================
# Page title - displayed in browser tab and page title
VITE_APP_TITLE = MineAdmin

# Development server port
VITE_APP_PORT = 2888

# Application root path - modify when deploying to a subdirectory
VITE_APP_ROOT_BASE = /

# ================================
# API Interface Configuration
# ================================
# Backend API URL - development environment usually points to a local backend service
VITE_APP_API_BASEURL = http://127.0.0.1:9501

# ================================
# Route Configuration
# ================================
# Route mode: hash | history
# hash: Route mode with #, good compatibility
# history: HTML5 History API, requires server support
VITE_APP_ROUTE_MODE = hash

# ================================
# Storage Configuration
# ================================
# Local storage prefix - avoids storage conflicts between multiple projects
VITE_APP_STORAGE_PREFIX = mine_

# ================================
# Proxy Configuration
# ================================
# Enable development proxy - solves cross-origin issues in the development environment
VITE_OPEN_PROXY = true

# Proxy prefix - used to identify requests that need proxying
VITE_PROXY_PREFIX = /dev

# ================================
# Debugging Tools
# ================================
# Enable vConsole - mobile debugging tool
VITE_OPEN_vCONSOLE = false

# Enable Vue DevTools - Vue developer tools
VITE_OPEN_DEVTOOLS = false
```

:::

### Production Environment Configuration (.env.production)

Production environment configuration focuses on performance and security, removes debugging features, and optimizes build options.

::: code-group

```env [.env.production]
# ================================
# Basic Application Configuration
# ================================
# Page title
VITE_APP_TITLE = MineAdmin

# Application root path - adjust according to the actual deployment path
VITE_APP_ROOT_BASE = /

# ================================
# API Interface Configuration
# ================================
# Production environment API URL - usually uses a relative path or full domain name
VITE_APP_API_BASEURL = /

# ================================
# Route Configuration
# ================================
# Production environment route mode
VITE_APP_ROUTE_MODE = hash

# ================================
# Storage Configuration
# ================================
# Storage prefix
VITE_APP_STORAGE_PREFIX = mine_

# ================================
# Proxy Configuration (usually not needed in production)
# ================================
VITE_OPEN_PROXY = false
VITE_PROXY_PREFIX = /prod

# ================================
# Build Configuration
# ================================
# Enable Mock when packaging - recommended to disable in production
VITE_BUILD_MOCK = false

# Generate source map - affects build size and debugging capabilities
VITE_BUILD_SOURCEMAP = false

# Build compression method - supports gzip, brotli
VITE_BUILD_COMPRESS = gzip,brotli

# Generate archive after build - supports zip, tar
VITE_BUILD_ARCHIVE =
```

:::

## Detailed Configuration Item Description

### Basic Configuration Items

| Configuration Item | Type | Default Value | Description |
|--------|------|--------|------|
| `VITE_APP_TITLE` | string | MineAdmin | Application title, displayed in the browser tab |
| `VITE_APP_PORT` | number | 2888 | Development server port (development environment only) |
| `VITE_APP_ROOT_BASE` | string | / | Base path for application deployment |

### API Interface Configuration

| Configuration Item | Type | Description | Example |
|--------|------|------|------|
| `VITE_APP_API_BASEURL` | string | Backend API base URL | `http://api.example.com` |

::: warning Note
Pay special attention to the API URL configuration for the production environment:
- If the frontend and backend are deployed under the same domain, use the relative path `/`
- If deployed cross-origin, configure the full API URL
- Ensure the API server has CORS configured correctly
:::

### Route Configuration

| Configuration Item | Optional Values | Description |
|--------|--------|------|
| `VITE_APP_ROUTE_MODE` | `hash` \| `history` | Route mode selection |

**Route Mode Comparison:**

| Mode | Advantages | Disadvantages | Applicable Scenarios |
|------|------|------|----------|
| `hash` | Good compatibility, no server configuration needed | URL contains #, not SEO-friendly | Traditional deployment environments |
| `history` | Clean URL, SEO-friendly | Requires server support, complex configuration | Modern deployment environments |

### Storage Configuration

| Configuration Item | Description | Recommended Value |
|--------|------|--------|
| `VITE_APP_STORAGE_PREFIX` | Local storage prefix | Project unique identifier |

### Proxy Configuration

| Configuration Item | Type | Description |
|--------|------|------|
| `VITE_OPEN_PROXY` | boolean | Enable development proxy |
| `VITE_PROXY_PREFIX` | string | Proxy request prefix identifier |

### Build Configuration

| Configuration Item | Type | Description |
|--------|------|------|
| `VITE_BUILD_MOCK` | boolean | Include Mock functionality during build |
| `VITE_BUILD_SOURCEMAP` | boolean | Generate source map |
| `VITE_BUILD_COMPRESS` | string | Compression algorithm, multiple separated by commas |
| `VITE_BUILD_ARCHIVE` | string | Archive format generated after build |

## Deployment Scenario Configuration

### Scenario 1: Subdirectory Deployment

If you need to deploy the application to a subdirectory of the server (e.g., `https://example.com/admin/`):

```env
# Set the base path
VITE_APP_ROOT_BASE = /admin/

# Adjust the API URL accordingly
VITE_APP_API_BASEURL = /admin/api/
```

### Scenario 2: CDN Deployment

Use CDN to accelerate static resources:

```env
# Set base path to CDN URL
VITE_APP_ROOT_BASE = https://cdn.example.com/admin/

# Keep the API URL as the original domain
VITE_APP_API_BASEURL = https://api.example.com/
```

### Scenario 3: Docker Deployment

Docker containerized deployment configuration:

```env
# Use environment variable placeholders
VITE_APP_API_BASEURL = ${API_BASE_URL}
VITE_APP_TITLE = ${APP_TITLE:-MineAdmin}
```

### Scenario 4: Frontend-Backend Separation Deployment

Deployment architecture with fully separate frontend and backend:

```env
# Frontend independent domain
VITE_APP_ROOT_BASE = /

# Full backend API URL
VITE_APP_API_BASEURL = https://api.example.com/v1/

# Use history route mode (requires Nginx configuration support)
VITE_APP_ROUTE_MODE = history
```

## Best Practices

### 1. Environment Variable Naming Conventions

- All environment variables must start with `VITE_` to be accessible by the client
- Use all uppercase letters and underscores for naming
- Group and name them by functional module

### 2. Security Considerations

::: danger Security Reminder
- Do not store sensitive information in environment variables (such as keys, passwords)
- Production environment configuration files should not contain development debug information
- Regularly check and clean up unused configuration items
:::

### 3. Performance Optimization

```env
# Recommended configuration for production environment
VITE_BUILD_SOURCEMAP = false          # Reduce package size
VITE_BUILD_COMPRESS = gzip,brotli      # Enable compression
VITE_OPEN_vCONSOLE = false            # Disable debugging tools
VITE_OPEN_DEVTOOLS = false            # Disable developer tools
```

### 4. Multi-Environment Management

Create `.env.staging` for the pre-release environment:

```env
# Pre-release environment configuration
VITE_APP_TITLE = MineAdmin (Staging)
VITE_APP_API_BASEURL = https://staging-api.example.com/
VITE_BUILD_SOURCEMAP = true           # Keep source map for debugging
```

## Common Questions

### Q: Modifying environment variables doesn't take effect?

**A:** Please ensure:
1. Restart the development server
2. The environment variable name starts with `VITE_`
3. The syntax format is correct (no extra spaces)

### Q: Production environment API requests fail?

**A:** Check the following configurations:
1. Is `VITE_APP_API_BASEURL` correct?
2. Is the backend service configured with correct CORS?
3. Does the network firewall allow access to the corresponding port?

### Q: How to access environment variables in the code?

**A:** Use `import.meta.env` to access:

```typescript
// Get the API base URL
const apiBaseUrl = import.meta.env.VITE_APP_API_BASEURL

// Get the application title
const appTitle = import.meta.env.VITE_APP_TITLE

// Check if it's the development environment
const isDev = import.meta.env.DEV
```

### Q: Page refresh results in 404 with history route mode?

**A:** Need to configure server rewrite rules. For example, with Nginx:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

::: tip Tip
For more deployment-related questions, please refer to the [Deployment Guide](../../guide/start/deployment.md) section.
:::