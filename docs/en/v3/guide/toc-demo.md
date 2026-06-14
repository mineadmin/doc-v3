# Enhanced Table of Contents Navigation Demo

This page demonstrates our newly implemented enhanced in-page navigation (TOC) feature. Please note the table of contents on the right, which offers the following features:

## Main Feature Highlights

### Visual Hierarchy Optimization

Our new table of contents navigation features a clear visual hierarchy, with different heading levels distinguished through indentation, font sizes, and colors.

#### Heading Level Differentiation
- H1 headings serve as major sections with prominent visual effects
- H2-H6 headings display progressively decreasing levels
- Each level has appropriate indentation and spacing

#### Colors and Styles
- Active items are highlighted with gradient effects
- Hover effects provide instant visual feedback
- Color scheme automatically adjusts in dark mode

### Enhanced Interaction Experience

Enhanced interactive features make navigation smoother and more intuitive.

#### Smooth Scrolling
Clicking a table of contents item scrolls the page smoothly to the corresponding position instead of jumping abruptly.

#### Scroll Synchronization
As you scroll the page, the table of contents automatically highlights the currently visible section.

#### Keyboard Navigation
Supports navigation using keyboard shortcuts:
- `↑/↓` or `j/k` - Navigate up/down
- `Enter` or `Space` - Activate current item
- `Home/End` - Jump to first/last item
- `Esc` - Close mobile floating panel

### Modern Design Elements

We have adopted a modern design language, including:

#### Gradients and Shadows
- Active indicators use elegant gradient effects
- Subtle shadows add depth
- Rounded corners align with modern aesthetics

#### Animation Transitions
- All state changes feature smooth transition animations
- Pulse animation on active items provides visual guidance
- Mobile pop-up animations are smooth and natural

## Feature Enhancements

### Reading Time Estimation

The top of the table of contents displays an estimated reading time to help readers plan accordingly. Calculations consider:
- Text length
- Number of code blocks
- Number of images

### Scroll Progress Indicator

A vertical progress bar on the right side of the page shows your reading progress.

### Long Table of Contents Collapsing

For long documents with many sections, collapsing/expanding is supported:
- Ctrl/Cmd + Click on H1 headings to collapse sub-sections below
- Collapse state is automatically remembered

### Search Highlight Support

When using the page search function, matching table of contents items are highlighted.

## Internationalization Support

### Multi-language Adaptation

The table of contents navigation perfectly supports multiple languages:

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

The table of contents navigation performs well on different devices:

#### Desktop
- Fixed on the right side
- Always visible
- Makes full use of screen space

#### Tablet
- Adaptive width
- Font size adjustments
- Touch-friendly interaction

#### Mobile
- Triggered by floating button
- Bottom pop-up panel
- Gesture support

### Touch Optimization

Special optimizations for mobile devices:
- Larger clickable areas
- Touch gesture support
- Anti-accidental touch design

## Technical Implementation Details

### Performance Optimization

We focus on performance to ensure a smooth user experience:

#### Debouncing and Throttling
- Scroll events are throttled
- Window resizing is debounced
- Unnecessary repaints are reduced

#### GPU Acceleration
- Animations use the transform property
- Hardware acceleration is enabled
- Optimized reflow and repaint

#### Lazy Loading
- Feature modules are loaded on demand
- Non-critical functions are initialized lazily
- Initial page load time is optimized

### Accessibility

We value the experience of all users:

#### Screen Reader Support
- Semantic HTML structure
- ARIA attribute annotations
- Keyboard navigation support

#### High Contrast Mode
- Automatically adapts to system settings
- Enhanced borders and outlines
- Clear focus indicators

#### Reduced Motion
- Respects user motion preferences
- Provides non-animated alternatives
- Maintains functional integrity

## Usage Examples

### Basic Configuration

The table of contents generation is automatic and requires no additional configuration. However, you can customize behavior through options:

```typescript
enhanceTOC({
  enableReadingTime: true,    // Display reading time
  enableProgress: true,       // Display progress bar
  enableCollapse: true,       // Enable collapsing
  enableSmoothScroll: true,   // Smooth scrolling
  enableKeyboardNav: true,    // Keyboard navigation
  enableMobileFloat: true,    // Mobile floating
  enableSearchHighlight: true // Search highlighting
})
```

### Style Customization

You can customize the appearance using CSS variables:

```css
:root {
  --toc-gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --toc-indent-base: 1rem;
  --toc-font-h1: 0.95rem;
  /* More variables... */
}
```

## Conclusion

This enhanced in-page navigation system greatly improves document readability and navigation experience. It not only looks more modern and appealing but also offers rich interactive features. Whether on desktop or mobile, regardless of language, users can enjoy a consistent and excellent experience.

Through these improvements, we hope to enable users browsing long documents to:
- Quickly understand the document structure
- Easily locate content of interest
- Track reading progress
- Enjoy a smooth navigation experience

Thank you for experiencing our enhanced table of contents navigation system!