/**
 * Reading Experience Enhancements for Chinese Documentation
 * Provides reading progress tracking and smooth scrolling optimizations
 */

export function enhanceReadingExperience() {
  // Reading Progress Indicator
  function updateReadingProgress() {
    const article = document.querySelector('.vp-doc');
    if (!article) return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    
    // Calculate the maximum scrollable height
    const maxScroll = documentHeight - windowHeight;
    
    // Calculate progress percentage
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    
    // Update CSS variable for progress bar
    document.documentElement.style.setProperty('--reading-progress', `${progress}%`);
  }

  // Smooth anchor scrolling with offset for fixed header
  function enhanceAnchorScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        e.preventDefault();
        
        const navHeight = getComputedStyle(document.documentElement)
          .getPropertyValue('--vp-nav-height')
          .replace('px', '');
        
        const offset = parseInt(navHeight) + 20;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash
        history.pushState(null, null, href);
      });
    });
  }

  // Highlight current section in table of contents
  function highlightCurrentSection() {
    const sections = document.querySelectorAll('.vp-doc h2[id], .vp-doc h3[id]');
    const tocLinks = document.querySelectorAll('.VPDocAside .outline-link');
    
    if (!sections.length || !tocLinks.length) return;
    
    const observerOptions = {
      rootMargin: '-100px 0px -70% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const tocLink = document.querySelector(`.VPDocAside a[href="#${id}"]`);
        
        if (!tocLink) return;
        
        if (entry.isIntersecting) {
          // Remove active class from all links
          tocLinks.forEach(link => link.classList.remove('active'));
          // Add active class to current link
          tocLink.classList.add('active');
        }
      });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
  }

  // Add reading time estimation
  function addReadingTime() {
    const article = document.querySelector('.vp-doc');
    if (!article) return;
    
    const text = article.innerText;
    const wordsPerMinute = 250; // Average reading speed for Chinese
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    
    // Estimate reading time (Chinese characters are read faster)
    const totalWords = chineseChars + englishWords;
    const readingTime = Math.ceil(totalWords / wordsPerMinute);
    
    // Create reading time element
    const readingTimeEl = document.createElement('div');
    readingTimeEl.className = 'reading-time';
    readingTimeEl.innerHTML = `
      <style>
        .reading-time {
          padding: 0.5rem 1rem;
          background: var(--vp-c-bg-soft);
          border-left: 3px solid var(--vp-c-brand-1);
          border-radius: 4px;
          margin-bottom: 2rem;
          font-size: 0.875rem;
          color: var(--vp-c-text-2);
          display: inline-block;
        }
        .reading-time strong {
          color: var(--vp-c-brand-1);
          font-weight: 600;
        }
      </style>
      预计阅读时间：<strong>${readingTime} 分钟</strong> | 
      字数：<strong>${totalWords.toLocaleString()}</strong>
    `;
    
    // Insert after the first heading
    const firstHeading = article.querySelector('h1');
    if (firstHeading && firstHeading.nextSibling) {
      firstHeading.parentNode.insertBefore(readingTimeEl, firstHeading.nextSibling);
    }
  }

  // Enhance tables with responsive wrapper
  function enhanceTablesResponsive() {
    const tables = document.querySelectorAll('.vp-doc table');
    
    tables.forEach(table => {
      if (table.parentElement.classList.contains('table-responsive')) return;
      
      const wrapper = document.createElement('div');
      wrapper.className = 'table-responsive';
      wrapper.style.cssText = `
        overflow-x: auto;
        margin: 2rem 0;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      `;
      
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  // Add copy button to code blocks
  function addCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('.vp-doc div[class*="language-"] pre');
    
    codeBlocks.forEach(block => {
      if (block.querySelector('.copy-button')) return;
      
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.innerHTML = '复制';
      button.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 0.25rem 0.75rem;
        background: var(--vp-c-brand-soft);
        color: var(--vp-c-brand-1);
        border: 1px solid var(--vp-c-brand-1);
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
      `;
      
      button.addEventListener('click', async () => {
        const code = block.querySelector('code').innerText;
        
        try {
          await navigator.clipboard.writeText(code);
          button.innerHTML = '已复制!';
          button.style.background = 'var(--vp-c-success-soft)';
          button.style.borderColor = 'var(--vp-c-success-1)';
          button.style.color = 'var(--vp-c-success-1)';
          
          setTimeout(() => {
            button.innerHTML = '复制';
            button.style.background = 'var(--vp-c-brand-soft)';
            button.style.borderColor = 'var(--vp-c-brand-1)';
            button.style.color = 'var(--vp-c-brand-1)';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code:', err);
        }
      });
      
      block.style.position = 'relative';
      block.appendChild(button);
    });
  }

  // Initialize all enhancements
  function init() {
    // Set up scroll event listeners
    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    window.addEventListener('resize', updateReadingProgress, { passive: true });
    
    // Initial progress update
    updateReadingProgress();
    
    // Apply other enhancements
    enhanceAnchorScrolling();
    highlightCurrentSection();
    addReadingTime();
    enhanceTablesResponsive();
    addCodeCopyButtons();
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Re-initialize on route changes (for SPA navigation)
  if (window.__VP_HASH_MAP__) {
    const observer = new MutationObserver(() => {
      setTimeout(() => {
        updateReadingProgress();
        highlightCurrentSection();
        addReadingTime();
        enhanceTablesResponsive();
        addCodeCopyButtons();
      }, 100);
    });
    
    observer.observe(document.querySelector('#app'), {
      childList: true,
      subtree: true
    });
  }
}

// Export for use in VitePress theme
export default enhanceReadingExperience;