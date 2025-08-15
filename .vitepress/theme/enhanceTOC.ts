/**
 * Enhanced Table of Contents (TOC) Functionality
 * Adds interactive features to VitePress aside navigation
 */

interface TOCEnhancementOptions {
  enableReadingTime?: boolean
  enableProgress?: boolean
  enableCollapse?: boolean
  enableSmoothScroll?: boolean
  enableKeyboardNav?: boolean
  enableMobileFloat?: boolean
  enableSearchHighlight?: boolean
}

class TOCEnhancer {
  private options: TOCEnhancementOptions
  private tocElement: HTMLElement | null = null
  private headings: HTMLElement[] = []
  private links: HTMLAnchorElement[] = []
  private activeIndex: number = -1
  // private scrollTimeout: number | null = null // Reserved for future use
  private observer: IntersectionObserver | null = null
  private progressBar: HTMLElement | null = null
  private isMobile: boolean = false

  constructor(options: TOCEnhancementOptions = {}) {
    this.options = {
      enableReadingTime: true,
      enableProgress: true,
      enableCollapse: true,
      enableSmoothScroll: true,
      enableKeyboardNav: true,
      enableMobileFloat: true,
      enableSearchHighlight: true,
      ...options
    }
    
    this.isMobile = window.matchMedia('(max-width: 768px)').matches
  }

  /**
   * Initialize the TOC enhancement
   */
  public init(): void {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup())
    } else {
      this.setup()
    }
  }

  /**
   * Setup all enhancements
   */
  private setup(): void {
    this.tocElement = document.querySelector('.VPDocAsideOutline')
    if (!this.tocElement) {
      // Retry after a short delay as VitePress might load content dynamically
      setTimeout(() => {
        this.tocElement = document.querySelector('.VPDocAsideOutline')
        if (this.tocElement) {
          this.setupEnhancements()
        }
      }, 500)
      return
    }
    
    this.setupEnhancements()
  }

  /**
   * Setup individual enhancement features
   */
  private setupEnhancements(): void {
    if (!this.tocElement) return

    // Collect headings and links
    this.collectElements()
    
    // Setup features based on options
    if (this.options.enableReadingTime) {
      this.setupReadingTime()
    }
    
    if (this.options.enableProgress) {
      this.setupProgressIndicator()
    }
    
    if (this.options.enableCollapse) {
      this.setupCollapsibleSections()
    }
    
    if (this.options.enableSmoothScroll) {
      this.setupSmoothScroll()
    }
    
    if (this.options.enableKeyboardNav) {
      this.setupKeyboardNavigation()
    }
    
    if (this.options.enableMobileFloat && this.isMobile) {
      this.setupMobileFloat()
    }
    
    // Setup scroll spy
    this.setupScrollSpy()
    
    // Add data attributes for CSS styling
    this.addDataAttributes()
  }

  /**
   * Collect all headings and TOC links
   */
  private collectElements(): void {
    // Get all headings in the main content
    const content = document.querySelector('.VPDoc')
    if (content) {
      this.headings = Array.from(content.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .filter(h => h.id) as HTMLElement[] // Only headings with IDs
    }
    
    // Get all TOC links
    if (this.tocElement) {
      this.links = Array.from(this.tocElement.querySelectorAll('a'))
    }
  }

  /**
   * Calculate and display estimated reading time
   */
  private setupReadingTime(): void {
    const content = document.querySelector('.VPDoc')
    if (!content || !this.tocElement) return
    
    const text = content.textContent || ''
    const wordsPerMinute = 200 // Average reading speed
    const words = text.trim().split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    
    // Account for code blocks and images
    const codeBlocks = content.querySelectorAll('pre').length
    const images = content.querySelectorAll('img').length
    const adjustedMinutes = minutes + (codeBlocks * 0.5) + (images * 0.3)
    
    const readingTime = Math.ceil(adjustedMinutes)
    const timeText = readingTime === 1 ? '1 min read' : `${readingTime} min read`
    
    // Add reading time attribute for CSS
    this.tocElement.setAttribute('data-reading-time', timeText)
  }

  /**
   * Setup scroll progress indicator
   */
  private setupProgressIndicator(): void {
    if (!this.tocElement) return
    
    // Create progress bar element
    this.progressBar = document.createElement('div')
    this.progressBar.className = 'scroll-progress'
    document.body.appendChild(this.progressBar)
    
    // Update progress on scroll
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      const progress = (scrollPosition / scrollHeight) * 100
      
      if (this.progressBar) {
        this.progressBar.style.height = `${progress}%`
      }
      
      // Also update TOC progress
      if (this.tocElement) {
        this.tocElement.style.setProperty('--toc-progress', `${progress}%`)
      }
    }
    
    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress() // Initial update
  }

  /**
   * Setup collapsible sections for long TOCs
   */
  private setupCollapsibleSections(): void {
    if (!this.tocElement || this.links.length < 15) return // Only for long TOCs
    
    this.tocElement.classList.add('collapsible')
    
    // Group links by H1 sections
    const h1Links = this.links.filter(link => {
      const href = link.getAttribute('href')
      if (!href) return false
      const heading = document.querySelector(href)
      return heading && heading.tagName === 'H1'
    })
    
    h1Links.forEach(h1Link => {
      h1Link.setAttribute('data-level', '1')
      h1Link.addEventListener('click', (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          h1Link.classList.toggle('collapsed')
        }
      })
    })
  }

  /**
   * Setup smooth scrolling with offset
   */
  private setupSmoothScroll(): void {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const href = link.getAttribute('href')
        if (!href) return
        
        const target = document.querySelector(href)
        if (!target) return
        
        // Calculate offset for fixed header
        const navHeight = getComputedStyle(document.documentElement)
          .getPropertyValue('--vp-nav-height')
        const offset = parseInt(navHeight) || 60
        
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset - 20
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
        
        // Update URL without scrolling
        history.pushState(null, '', href)
      })
    })
  }

  /**
   * Setup keyboard navigation
   */
  private setupKeyboardNavigation(): void {
    if (!this.tocElement) return
    
    // Make TOC focusable
    this.tocElement.setAttribute('tabindex', '0')
    this.tocElement.setAttribute('role', 'navigation')
    this.tocElement.setAttribute('aria-label', 'Table of contents')
    
    // Keyboard event handler
    this.tocElement.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'j':
          e.preventDefault()
          this.navigateToNext()
          break
        case 'ArrowUp':
        case 'k':
          e.preventDefault()
          this.navigateToPrevious()
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          this.activateCurrentLink()
          break
        case 'Home':
          e.preventDefault()
          this.navigateToFirst()
          break
        case 'End':
          e.preventDefault()
          this.navigateToLast()
          break
        case 'Escape':
          if (this.isMobile && this.tocElement) {
            this.tocElement.classList.remove('visible')
          }
          break
      }
    })
  }

  /**
   * Navigate to next TOC item
   */
  private navigateToNext(): void {
    if (this.activeIndex < this.links.length - 1) {
      this.activeIndex++
      this.updateActiveLink()
    }
  }

  /**
   * Navigate to previous TOC item
   */
  private navigateToPrevious(): void {
    if (this.activeIndex > 0) {
      this.activeIndex--
      this.updateActiveLink()
    }
  }

  /**
   * Navigate to first TOC item
   */
  private navigateToFirst(): void {
    this.activeIndex = 0
    this.updateActiveLink()
  }

  /**
   * Navigate to last TOC item
   */
  private navigateToLast(): void {
    this.activeIndex = this.links.length - 1
    this.updateActiveLink()
  }

  /**
   * Activate the current link
   */
  private activateCurrentLink(): void {
    if (this.activeIndex >= 0 && this.activeIndex < this.links.length) {
      this.links[this.activeIndex].click()
    }
  }

  /**
   * Update active link styling and focus
   */
  private updateActiveLink(): void {
    this.links.forEach((link, index) => {
      if (index === this.activeIndex) {
        link.classList.add('keyboard-focus')
        link.focus()
        link.setAttribute('aria-current', 'true')
      } else {
        link.classList.remove('keyboard-focus')
        link.removeAttribute('aria-current')
      }
    })
  }

  /**
   * Setup mobile floating TOC
   */
  private setupMobileFloat(): void {
    if (!this.tocElement) return
    
    // Create toggle button
    const toggleBtn = document.createElement('button')
    toggleBtn.className = 'toc-mobile-toggle'
    toggleBtn.innerHTML = '☰'
    toggleBtn.setAttribute('aria-label', 'Toggle table of contents')
    toggleBtn.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: var(--vp-c-brand-1);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 998;
      cursor: pointer;
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s;
    `
    
    document.body.appendChild(toggleBtn)
    
    // Toggle TOC visibility
    toggleBtn.addEventListener('click', () => {
      if (this.tocElement) {
        this.tocElement.classList.toggle('visible')
        toggleBtn.style.transform = this.tocElement.classList.contains('visible') 
          ? 'rotate(90deg)' 
          : 'rotate(0deg)'
      }
    })
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.tocElement && 
          !this.tocElement.contains(e.target as Node) && 
          e.target !== toggleBtn) {
        this.tocElement.classList.remove('visible')
        toggleBtn.style.transform = 'rotate(0deg)'
      }
    })
  }

  /**
   * Setup scroll spy to highlight current section
   */
  private setupScrollSpy(): void {
    if (!this.headings.length || !this.links.length) return
    
    // Create intersection observer
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id
        const link = this.links.find(l => l.getAttribute('href') === `#${id}`)
        
        if (link) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            // Remove active class from all links
            this.links.forEach(l => l.classList.remove('active'))
            // Add active class to current link
            link.classList.add('active')
            
            // Update active index for keyboard navigation
            this.activeIndex = this.links.indexOf(link)
            
            // Scroll TOC to keep active item visible
            this.scrollTOCToActive(link)
          }
        }
      })
    }, observerOptions)
    
    // Observe all headings
    this.headings.forEach(heading => {
      if (this.observer) {
        this.observer.observe(heading)
      }
    })
  }

  /**
   * Scroll TOC container to keep active item visible
   */
  private scrollTOCToActive(activeLink: HTMLElement): void {
    if (!this.tocElement) return
    
    const tocRect = this.tocElement.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()
    
    // Check if link is outside visible area
    if (linkRect.top < tocRect.top + 50 || linkRect.bottom > tocRect.bottom - 50) {
      activeLink.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }

  /**
   * Add data attributes for CSS styling
   */
  private addDataAttributes(): void {
    this.links.forEach(link => {
      const href = link.getAttribute('href')
      if (!href) return
      
      const heading = document.querySelector(href)
      if (!heading) return
      
      // Add level data attribute
      const level = heading.tagName.charAt(1)
      link.setAttribute('data-level', level)
      
      // Add text length indicator for truncation
      const textLength = link.textContent?.length || 0
      if (textLength > 50) {
        link.classList.add('long-text')
      }
    })
  }

  /**
   * Cleanup method
   */
  public destroy(): void {
    // Remove event listeners
    window.removeEventListener('scroll', this.updateActiveLink)
    
    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect()
    }
    
    // Remove added elements
    if (this.progressBar) {
      this.progressBar.remove()
    }
    
    // Remove mobile toggle if exists
    const toggle = document.querySelector('.toc-mobile-toggle')
    if (toggle) {
      toggle.remove()
    }
  }
}

/**
 * Initialize TOC enhancements
 */
export default function enhanceTOC(options?: TOCEnhancementOptions): TOCEnhancer {
  const enhancer = new TOCEnhancer(options)
  enhancer.init()
  return enhancer
}

// Auto-initialize on VitePress route change
if (typeof window !== 'undefined') {
  let currentEnhancer: TOCEnhancer | null = null
  
  // Listen for route changes
  if ((window as any).__VP_HASH_MAP__) {
    // VitePress is loaded
    const initEnhancer = () => {
      // Cleanup previous instance
      if (currentEnhancer) {
        currentEnhancer.destroy()
      }
      
      // Create new instance
      currentEnhancer = enhanceTOC()
    }
    
    // Initialize on first load
    initEnhancer()
    
    // Reinitialize on route change
    window.addEventListener('hashchange', initEnhancer)
    
    // Watch for VitePress route updates
    const { router } = (window as any).__VP_HASH_MAP__
    if (router && router.onAfterRouteChanged) {
      router.onAfterRouteChanged(initEnhancer)
    }
  } else {
    // Fallback for direct initialization
    window.addEventListener('DOMContentLoaded', () => {
      enhanceTOC()
    })
  }
}