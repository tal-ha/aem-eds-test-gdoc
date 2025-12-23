# AEM Edge Delivery Services Project Guidelines

## Architecture Overview
This is an Adobe Experience Manager (AEM) Edge Delivery Services project using the Franklin framework. The codebase follows a block-based component architecture where each feature is implemented as a "block" in the `blocks/` directory.

### Key Components
- **Blocks**: Reusable components in `blocks/{block-name}/` with `{block-name}.js` and `{block-name}.css`
- **Scripts**: Core utilities in `scripts/aem.js`, initialization in `scripts/scripts.js`
- **Styles**: Global styles in `styles/`, fonts in `styles/fonts.css`
- **Content**: HTML files like `head.html`, `404.html` for page structure

## Block Development Pattern
Each block follows this exact pattern:

```javascript
export default async function decorate(block) {
  // Transform block's DOM structure
  // Use utilities from '../../scripts/aem.js'
}
```

- Blocks are automatically loaded via dynamic imports from `blocks/{name}/{name}.js`
- CSS is loaded from `blocks/{name}/{name}.css`
- Block elements have class `block` and data attributes `data-block-name` and `data-block-status`

### Block Examples
- **Video Block** (`blocks/video/video.js`): Handles YouTube/Vimeo/MP4 embeds with lazy loading, autoplay, and accessibility features
- **Cards Block** (`blocks/cards/cards.js`): Transforms content into `<ul><li>` structure with optimized images

## Common Patterns
- **Image Optimization**: Use `createOptimizedPicture(src, alt, eager, breakpoints)` from `scripts/aem.js` for responsive images with WebP fallbacks
- **Lazy Loading**: Use `IntersectionObserver` for performance-critical resources (see video block)
- **Accessibility**: Include proper ARIA labels, especially for interactive elements
- **Reduced Motion**: Check `window.matchMedia('(prefers-reduced-motion: reduce)')` before autoplay
- **Error Handling**: Wrap async operations in try-catch, log to console

## Development Workflow
- **Local Development**: Run `aem up` (requires AEM CLI) to start proxy server at `http://localhost:3000`
- **Linting**: `npm run lint` (JS with ESLint Airbnb base, CSS with Stylelint)
- **Auto-fix**: `npm run lint:fix` for automatic fixes
- **No Build Step**: Code runs directly on the edge; no compilation required

## CSS Conventions
- Use CSS custom properties from `:root` in `styles/styles.css` for colors, fonts, and sizes
- Block-specific styles scoped to `.{block-name}` class
- Follow BEM-like naming where appropriate

## File Structure Expectations
- New blocks go in `blocks/{name}/` with matching JS and CSS files
- Utilities extend `scripts/aem.js` if shared across blocks
- Global styles in `styles/`, block styles in `blocks/{name}/`

## Integration Points
- **AEM Authoring**: Content is authored in AEM and transformed into blocks
- **Image Delivery**: Images served via AEM with query params for optimization (`?width=750&format=webp&optimize=medium`)
- **RUM Monitoring**: Built-in Real User Monitoring via `sampleRUM()` calls

## Key Files to Reference
- `scripts/aem.js`: Core utilities like `createOptimizedPicture`, `loadBlock`
- `blocks/video/video.js`: Complex block with multiple embed types and lazy loading
- `styles/styles.css`: Global CSS variables and base styles
- `README.md`: Setup and documentation links</content>
<parameter name="filePath">c:\Users\Talha\Documents\Tools\aem-eds-test-gdoc\.github\copilot-instructions.md