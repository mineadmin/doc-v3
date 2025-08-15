/**
 * Language Detection and Auto-Configuration Plugin
 * Provides intelligent language detection and UI adaptation
 */

export interface LanguageConfig {
  code: string
  name: string
  nativeName: string
  dir: 'ltr' | 'rtl'
  fontScale: number
}

// Supported languages configuration
export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
  'zh': {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    dir: 'ltr',
    fontScale: 1.0
  },
  'zh-CN': {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    dir: 'ltr',
    fontScale: 1.0
  },
  'zh-HK': {
    code: 'zh-HK',
    name: 'Chinese (Traditional - Hong Kong)',
    nativeName: '繁體中文（香港）',
    dir: 'ltr',
    fontScale: 1.0
  },
  'zh-TW': {
    code: 'zh-TW',
    name: 'Chinese (Traditional - Taiwan)',
    nativeName: '繁體中文（台灣）',
    dir: 'ltr',
    fontScale: 1.0
  },
  'ja': {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    dir: 'ltr',
    fontScale: 0.95
  },
  'en': {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    fontScale: 1.0
  }
}

// Language detection utilities
export class LanguageDetector {
  private currentLanguage: string
  private userPreference: string | null

  constructor() {
    this.currentLanguage = this.detectLanguage()
    this.userPreference = this.getUserPreference()
  }

  /**
   * Detect language from various sources
   */
  private detectLanguage(): string {
    // Priority 1: URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    const urlLang = urlParams.get('lang')
    if (urlLang && this.isSupported(urlLang)) {
      return urlLang
    }

    // Priority 2: Path segment
    const pathLang = this.getLanguageFromPath()
    if (pathLang && this.isSupported(pathLang)) {
      return pathLang
    }

    // Priority 3: User saved preference
    const savedLang = this.getUserPreference()
    if (savedLang && this.isSupported(savedLang)) {
      return savedLang
    }

    // Priority 4: Browser language
    const browserLang = this.getBrowserLanguage()
    if (browserLang && this.isSupported(browserLang)) {
      return browserLang
    }

    // Default fallback
    return 'zh'
  }

  /**
   * Extract language from URL path
   */
  private getLanguageFromPath(): string | null {
    const path = window.location.pathname
    const segments = path.split('/')
    
    // Check if path contains language code
    for (const segment of segments) {
      if (this.isSupported(segment)) {
        return segment
      }
    }
    
    return null
  }

  /**
   * Get browser's preferred language
   */
  private getBrowserLanguage(): string {
    const browserLang = navigator.language || (navigator as any).userLanguage
    
    // Map browser language to supported language
    const langMap: Record<string, string> = {
      'zh-CN': 'zh',
      'zh-SG': 'zh',
      'zh-HK': 'zh-HK',
      'zh-TW': 'zh-TW',
      'zh-MO': 'zh-HK',
      'ja-JP': 'ja',
      'en-US': 'en',
      'en-GB': 'en',
      'en-AU': 'en',
      'en-CA': 'en'
    }
    
    return langMap[browserLang] || browserLang.split('-')[0]
  }

  /**
   * Check if language is supported
   */
  private isSupported(lang: string): boolean {
    return lang in SUPPORTED_LANGUAGES
  }

  /**
   * Get user's saved language preference
   */
  private getUserPreference(): string | null {
    try {
      return localStorage.getItem('vitepress-preferred-language')
    } catch {
      return null
    }
  }

  /**
   * Save user's language preference
   */
  public saveUserPreference(lang: string): void {
    if (!this.isSupported(lang)) return
    
    try {
      localStorage.setItem('vitepress-preferred-language', lang)
      this.userPreference = lang
    } catch {
      console.warn('Failed to save language preference')
    }
  }

  /**
   * Get current language
   */
  public getCurrentLanguage(): string {
    return this.currentLanguage
  }

  /**
   * Set current language and update UI
   */
  public setLanguage(lang: string): void {
    if (!this.isSupported(lang)) return
    
    this.currentLanguage = lang
    this.saveUserPreference(lang)
    this.applyLanguageToUI(lang)
  }

  /**
   * Apply language settings to UI
   */
  public applyLanguageToUI(lang: string): void {
    const config = SUPPORTED_LANGUAGES[lang]
    if (!config) return

    // Set HTML attributes
    document.documentElement.lang = config.code
    document.documentElement.dir = config.dir
    
    // Set CSS custom properties for font scaling
    document.documentElement.style.setProperty('--font-scale', config.fontScale.toString())
    
    // Add language class for specific styling
    document.documentElement.className = document.documentElement.className
      .replace(/lang-[\w-]+/g, '')
      .trim() + ` lang-${config.code}`
    
    // Update meta tags
    this.updateMetaTags(config)
  }

  /**
   * Update meta tags for language
   */
  private updateMetaTags(config: LanguageConfig): void {
    // Update og:locale
    let ogLocale = document.querySelector('meta[property="og:locale"]')
    if (!ogLocale) {
      ogLocale = document.createElement('meta')
      ogLocale.setAttribute('property', 'og:locale')
      document.head.appendChild(ogLocale)
    }
    ogLocale.setAttribute('content', config.code.replace('-', '_'))
    
    // Update content language
    let contentLang = document.querySelector('meta[http-equiv="content-language"]')
    if (!contentLang) {
      contentLang = document.createElement('meta')
      contentLang.setAttribute('http-equiv', 'content-language')
      document.head.appendChild(contentLang)
    }
    contentLang.setAttribute('content', config.code)
  }

  /**
   * Get language configuration
   */
  public getLanguageConfig(lang?: string): LanguageConfig | null {
    const targetLang = lang || this.currentLanguage
    return SUPPORTED_LANGUAGES[targetLang] || null
  }

  /**
   * Get all supported languages
   */
  public getSupportedLanguages(): LanguageConfig[] {
    return Object.values(SUPPORTED_LANGUAGES)
  }

  /**
   * Switch to next available language (for quick toggle)
   */
  public switchToNextLanguage(): void {
    const languages = Object.keys(SUPPORTED_LANGUAGES)
    const currentIndex = languages.indexOf(this.currentLanguage)
    const nextIndex = (currentIndex + 1) % languages.length
    const nextLang = languages[nextIndex]
    
    this.setLanguage(nextLang)
    
    // Optionally redirect to the new language path
    this.redirectToLanguage(nextLang)
  }

  /**
   * Redirect to language-specific path
   */
  private redirectToLanguage(lang: string): void {
    const currentPath = window.location.pathname
    const pathSegments = currentPath.split('/')
    
    // Find and replace language segment in path
    let newPath = currentPath
    for (let i = 0; i < pathSegments.length; i++) {
      if (this.isSupported(pathSegments[i])) {
        pathSegments[i] = lang
        newPath = pathSegments.join('/')
        break
      }
    }
    
    // If no language segment found, prepend it
    if (newPath === currentPath) {
      newPath = `/${lang}${currentPath}`
    }
    
    // Navigate to new path
    window.location.pathname = newPath
  }
}

// Export singleton instance
let detector: LanguageDetector | null = null

export function getLanguageDetector(): LanguageDetector {
  if (!detector && typeof window !== 'undefined') {
    detector = new LanguageDetector()
  }
  return detector!
}

// Auto-initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const detector = getLanguageDetector()
    const currentLang = detector.getCurrentLanguage()
    detector.applyLanguageToUI(currentLang)
  })
}

/**
 * Vue composable for language detection
 */
export function useLanguageDetector() {
  const detector = getLanguageDetector()
  
  return {
    currentLanguage: detector.getCurrentLanguage(),
    supportedLanguages: detector.getSupportedLanguages(),
    setLanguage: (lang: string) => detector.setLanguage(lang),
    switchLanguage: () => detector.switchToNextLanguage(),
    getConfig: (lang?: string) => detector.getLanguageConfig(lang)
  }
}