# Enhanced Table of Contents Navigation Demo

This page showcases our newly implemented enhanced in-page navigation (TOC) feature. Please observe the table of contents navigation on the right, which includes the following characteristics:

## Key Features

### Visual Hierarchy Optimization

Our new TOC navigation features a clear visual hierarchy, with different heading levels distinguished through indentation, font size, and color.

#### Heading Level Differentiation
- H1 headings serve as main sections with prominent visual effects
- H2-H6 headings display with decreasing prominence according to hierarchy
- Each level features appropriate indentation and spacing

#### Color and Styling
- Active items use gradient highlighting
- Hover effects provide immediate visual feedback
- Automatic color scheme adjustment in dark mode

### Enhanced Interaction Experience

Improved interactive features make navigation smoother and more intuitive.

#### Smooth Scrolling
Clicking TOC items triggers smooth scrolling to corresponding sections rather than abrupt jumps.

#### Scroll Synchronization
As you scroll the page, the TOC automatically highlights currently visible sections.

#### Keyboard Navigation
Supports keyboard shortcuts for navigation:
- `↑/↓` or `j/k` - Navigate up/down
- `Enter` or `Space` - Activate current item
- `Home/End` - Jump to first/last item
- `Esc` - Close mobile overlay

### Modern Design Elements

We've adopted contemporary design language including:

#### Gradients and Shadows
- Active indicators use elegant gradient effects
- Subtle shadows add depth
- Rounded corners align with modern aesthetics

#### Animation Transitions
- All state changes feature smooth transition animations
- Pulsing animations for active items provide visual guidance
- Mobile popup animations are fluid and natural

## Feature Enhancements

### Reading Time Estimation

The TOC displays estimated reading time at the top, helping readers plan accordingly. Calculations consider:
- Text length
- Number of code blocks
- Number of images

### Scroll Progress Indicator

A vertical progress bar on the right shows your reading progress.

### Long TOC Folding

For lengthy documents with many sections, supports collapse/expand functionality:
- Ctrl/Cmd + click H1 headings to collapse subsections
- Automatically remembers collapsed state

### Search Highlight Support

When using page search, matching TOC items are highlighted.

## Internationalization Support

### Multilingual Adaptation

TOC navigation fully supports multiple languages:

#### Chinese Support
- Optimized Chinese font rendering
- Appropriate character spacing
- Localized interface text

#### Japanese Support
- Japanese font optimization
- Mixed kana and kanji typesetting
- Japanese interface conventions

#### English Support
- Western font optimization
- Natural word spacing
- English interface text

### CJK Character Optimization

Special optimizations for Chinese, Japanese, and Korean characters:
- Better font weight control
- Optimized line height settings
- Appropriate paragraph spacing

## Mobile Experience

### Responsive Design

TOC navigation performs well across devices:

#### Desktop
- Fixed on the right side
- Always visible
- Maximizes screen space utilization

#### Tablet
- Adaptive width
- Adjusted font sizes
- Touch-friendly interactions

#### Mobile
- Triggered by floating button
- Bottom popup panel
- Gesture support

### Touch Optimization

Special mobile optimizations:
- Larger tap targets
- Touch gesture support
- Anti-misoperation design

## Technical Implementation Details

### Performance Optimization

We prioritize performance for smooth user experience:

#### Debouncing and Throttling
- Scroll events use throttling
- Window resizing uses debouncing
- Reduces unnecessary repaints

#### GPU Acceleration
- Animations use transform property
- Hardware acceleration enabled
- Optimized reflow and repaint

#### Lazy Loading
- On-demand feature module loading
- Delayed non-critical feature initialization
- Optimized first-screen loading time

### Accessibility

We value experience for all users:

#### Screen Reader Support
- Semantic HTML structure
- ARIA attribute labeling
- Keyboard navigation support

#### High Contrast Mode
- Adapts to system settings
- Enhanced borders and outlines
- Clear focus indicators

#### Reduced Motion
- Respects user animation preferences
- Provides motion-free alternatives
- Maintains functional integrity

## Usage Examples

### Basic Configuration

TOC navigation generates automatically without additional configuration, but you can customize behavior:

```typescript
enhanceTOC({
  enableReadingTime: true,    // Show reading time
  enableProgress: true,       // Show progress bar
  enableCollapse: true,       // Enable folding
  enableSmoothScroll: true,   // Smooth scrolling
  enableKeyboardNav: true,    // Keyboard navigation
  enableMobileFloat: true,    // Mobile floating
  enableSearchHighlight: true // Search highlighting
})
```

### Style Customization

Customize appearance through CSS variables:

```css
:root {
  --toc-gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --toc-indent-base: 1rem;
  --toc-font-h1: 0.95rem;
  /* More variables... */
}
```

## Summary

This enhanced in-page navigation system significantly improves document readability and navigation experience. It's not only visually more modern and appealing, but also feature-rich in interactivity. Whether on desktop or mobile, in any language, users enjoy consistent, high-quality experience.

Through these improvements, we aim to help users:
- Quickly understand document structure
- Easily locate content of interest
- Track reading progress
- Enjoy smooth navigation experience

Thank you for experiencing our enhanced table of contents navigation system!