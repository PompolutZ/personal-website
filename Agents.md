# Agent Reference Guide

## ⚠️ CRITICAL WRITING STYLE RULE

**NEVER USE THE WORD "COMPREHENSIVE" IN ANY CONTEXT**

When describing documentation, guides, or analysis:
- ❌ "comprehensive guide"
- ❌ "comprehensive overview"
- ❌ "comprehensive documentation"
- ✅ Use: "complete", "detailed", "thorough", "full", "in-depth" instead

---

## Project Overview

Personal website built with a custom JSX library running on Vite. Features: landing page, about, CV, and blog pages with a signal-based reactivity system inspired by Solid.js.

**Key Tech**: Custom JSX Runtime + Reactivity System + Vite + TypeScript + Markdown

---

## Quick Navigation

```
apps/website/
├── src/
│   ├── jsx-runtime.ts          # Core JSX implementation
│   ├── reactivity.ts           # Signal + Effect system
│   ├── main.tsx                # App router (pathname-based)
│   ├── pages/                  # Home, About, CV components
│   ├── blog/posts/             # Markdown blog posts
│   └── cv/cv.md                # CV markdown source
├── vite.config.ts              # Custom plugins + build config
├── build-blog.ts               # Blog static generator
├── build-cv.ts                 # CV JSON generator
└── typescript-jsx-transformer.ts # Auto-wraps JSX expressions
```

---

## Core Concepts

### 1. Custom JSX Runtime

**Location**: `src/jsx-runtime.ts`

```tsx
// Creates DOM elements from JSX
export function createElement(tag, props, ...children)

// Groups children without wrapper
export function Fragment({ children })
```

**Special Syntax**:
- Events: `<button on:click={handler}>` (not `onClick`)
- Reactive content: `<div>{() => signal()}</div>` (function children)
- Trusted HTML: `<div innerHTML={html}></div>` (for markdown)

### 2. Reactivity System

**Location**: `src/reactivity.ts`

```tsx
// Create reactive state
const [count, setCount] = createSignal(0);

// Read value (subscribes to changes)
count()  // Returns current value

// Update value
setCount(1)              // Direct value
setCount(v => v + 1)     // Updater function

// Auto-run on dependencies change
createEffect(() => {
  console.log(count());  // Re-runs when count changes
});
```

**How it works**: Execution context tracking - signals track which effect is running via a global `context` stack.

### 3. TypeScript JSX Transformer

**Location**: `typescript-jsx-transformer.ts`

**Purpose**: Auto-wraps JSX expressions in arrow functions for reactivity

```tsx
// You write:
<div class={getValue()}></div>

// Transformed to:
<div class={() => getValue()}></div>
```

**Skips**: Simple identifiers, literals, and event handlers

---

## Common Tasks

### Adding a Blog Post

1. Create `apps/website/src/blog/posts/your-post.md`
2. Add frontmatter:
```yaml
---
title: Your Post Title
date: 2025-12-04
description: Short description for preview
tags: javascript, react
---

# Your content here
```
3. Run `pnpm website:dev` or `pnpm website:build` (auto-generates HTML)

**Output**:
- `/blog/your-post.html` - Individual post page
- `/blog/index.html` - Updated blog index
- `/blog/index.json` - API with all posts

**Builder**: `build-blog.ts` (uses markdown-it + highlight.js)

### Styling Changes

**Main Styles**: `apps/website/src/style.css`
- Terminal theme with orange accents
- CSS custom properties in `:root`
- Body classes: `.home-page`, `.cv-page`

**CV Styles**: `apps/website/src/cv/cv-styles.css`
- Print-specific styles with `@media print`
- A4 page sizing for PDF export

**Blog Styles**: `apps/website/src/blog/templates/styles.css`

**Key Classes**:
- `.prompt` - Large italic text with fade-in
- `.cursor` - Blinking orange cursor

### Adding Features to JSX Library

**Core Files**:
- `src/jsx-runtime.ts` - Element creation, event handling, fragments
- `src/reactivity.ts` - Signals and effects
- `typescript-jsx-transformer.ts` - Expression wrapping logic

**Testing**: `src/reactivity.test.ts` (uses Vitest)

**Run tests**: `pnpm test`

### Updating CV

1. Edit `apps/website/src/cv/cv.md`
2. Update frontmatter (name, title, email, etc.)
3. Edit markdown content
4. Build auto-generates `/cv/cv.json`

**Builder**: `build-cv.ts`

**Component**: `src/pages/CV.tsx` (fetches JSON, renders with signals)

### Performance Optimization

**Current Setup**:
- Fine-grained reactivity (only affected elements update)
- Build-time markdown rendering (no runtime parsing)
- Minified production build
- No framework overhead (~1KB runtime)

**Potential Improvements**:
- Code splitting (currently single bundle)
- Image optimization
- Service worker caching

---

## Routing

**Type**: Simple pathname matching (no router library)

**Implementation**: `src/main.tsx`
```tsx
function App() {
  const pathname = window.location.pathname;
  if (pathname === "/about") return <About />;
  if (pathname === "/cv") return <CV />;
  return <Home />;
}
```

**Routes**:
- `/` - Home (typewriter effect)
- `/about` - About page
- `/cv` - CV with JSON data
- `/blog` - Blog index (static HTML)
- `/blog/:slug.html` - Blog posts (static HTML)

---

## Build System

### Vite Configuration

**Location**: `vite.config.ts`

**Custom Plugins**:
1. `typescript-jsx-interceptor` - Handles .tsx/.jsx with custom transformer
2. `blog-plugin()` - Serves blog HTML in dev, builds blog
3. `cv-plugin()` - Serves CV JSON in dev, builds CV data

**Key Config**:
```ts
esbuild: {
  include: /\.(ts|js)$/,  // Exclude tsx/jsx (handled by custom plugin)
}
```

### Commands

```bash
pnpm website:dev      # Dev server with hot reload
pnpm website:build    # Production build
pnpm website:preview  # Preview production build
pnpm test             # Run tests
```

---

## Architecture Patterns

### Component Structure

```tsx
export function MyComponent() {
  // 1. Create signals for state
  const [data, setData] = createSignal<Data | null>(null);
  const [loading, setLoading] = createSignal(true);

  // 2. Side effects (data fetching, etc.)
  createEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  });

  // 3. Reactive derived values
  const message = () => loading() ? "Loading..." : data()?.title;

  // 4. Render with reactive expressions
  return (
    <div>
      <h1>{message()}</h1>
      {() => !loading() && <Content data={data()} />}
    </div>
  );
}
```

### Conditional Rendering

```tsx
// Use function children for reactive conditions
<div>
  {() => condition() && <Element />}
  {() => condition() ? <A /> : <B />}
</div>
```

### Event Handling

```tsx
// Use on:event syntax (not onClick)
<button on:click={() => handleClick()}>Click</button>
<input on:input={(e) => handleInput(e.target.value)} />
```

### Lists

```tsx
// Map over arrays (no keys needed - not using virtual DOM diffing)
<ul>
  {items.map(item => (
    <li>{item.name}</li>
  ))}
</ul>

// Reactive lists
<ul>
  {() => items().map(item => (
    <li>{item.name}</li>
  ))}
</ul>
```

---

## Future Plans

### Potential Library Extraction

**Target**: Extract custom JSX library as standalone package

**Files to Extract**:
- `src/jsx-runtime.ts`
- `src/reactivity.ts`
- `typescript-jsx-transformer.ts`
- `jsx.d.ts`
- Type definitions

**Consider**:
- Package name (e.g., `@oleh/jsx-runtime`)
- Documentation
- Examples
- NPM publishing
- Versioning strategy

### Possible Enhancements

- RSS feed for blog
- Blog search functionality
- Code block copy button
- Dark/light theme toggle
- Blog post series/categories
- Reading time estimate
- Social share buttons

---

## Important Notes

### When Editing JSX Files

- Event handlers use `on:event` syntax (e.g., `on:click`, not `onClick`)
- Reactive values must be functions: `{() => signal()}`
- The transformer auto-wraps expressions, but explicit functions work too
- `innerHTML` is for trusted content only (used for markdown rendering)

### When Working with Reactivity

- Always call signals as functions: `count()` not `count`
- Effects track dependencies automatically during execution
- Avoid reading signals outside effects if you don't need tracking
- Effects run immediately once, then re-run on changes

### When Building

- Blog and CV are built automatically by Vite plugins
- Markdown changes require rebuild (no hot reload for .md files)
- TypeScript transformer bypasses esbuild for .tsx/.jsx files
- Production builds are minified and bundled into `dist/`

### Print Styling (CV)

- CV has special print styles in `cv-styles.css`
- Use `@media print` for print-specific rules
- Test with browser print preview (Cmd+P)
- Consider page breaks with `page-break-after: avoid`

---

## Troubleshooting

### Reactivity Not Working

- Ensure you're calling signal as function: `count()` ✓ not `count` ✗
- Check if expression is wrapped in function: `{() => signal()}`
- Verify effect is created with `createEffect()`

### Blog Post Not Showing

- Check frontmatter syntax (YAML with `---` delimiters)
- Ensure file is in `src/blog/posts/`
- Rebuild with `pnpm website:build` or restart dev server

### Build Errors

- Check TypeScript errors: `pnpm exec tsc --noEmit`
- Verify all imports use correct paths (no `@/` aliases)
- Ensure markdown frontmatter is valid YAML

### Styling Not Applied

- Check if correct body class is set (`home-page`, `cv-page`)
- Verify CSS selectors match rendered HTML
- Use browser DevTools to inspect computed styles

---

## Dependencies

**Production**:
- `vite` - Build tool and dev server
- `typescript` - Type system and transformer
- `markdown-it` - Markdown to HTML
- `highlight.js` - Code syntax highlighting

**Dev**:
- `vitest` - Testing framework
- `gray-matter` - YAML frontmatter parser

**No Runtime Dependencies** - The JSX library and reactivity system are custom implementations with zero external dependencies.

---

## File Size Reference

| File | LOC | Purpose |
|------|-----|---------|
| `jsx-runtime.ts` | 70 | Core JSX implementation |
| `reactivity.ts` | 42 | Signal + Effect system |
| `main.tsx` | 23 | App routing |
| `vite.config.ts` | 72 | Build configuration |
| `build-blog.ts` | 300 | Blog builder |
| `typescript-jsx-transformer.ts` | 47 | Expression wrapper |

**Total Runtime**: ~1KB (minified + gzipped)

---

## Contact & Links

- Check `src/cv/cv.md` for contact information
- Blog posts are in `src/blog/posts/`
- Project uses pnpm workspaces (monorepo-ready)

---

**Last Updated**: 2025-12-04
