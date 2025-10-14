# Reactivity System Security & DOM Rendering Analysis

## Date: October 14, 2025

## Executive Summary

Analysis of the custom JSX runtime and reactivity system revealed both security vulnerabilities and architectural issues with DOM updates. This document outlines the findings and proposed solutions.

---

## Security Analysis

### ✅ What's Already Safe

The core JSX runtime is fundamentally secure for normal usage:

```tsx
const userInput = "<script>alert('xss')</script>";
<div>{userInput}</div>  // ✅ SAFE - renders as literal text
```

**Why it's safe:**
- Uses `document.createTextNode()` for string children
- Automatically escapes all HTML/JavaScript
- No execution of injected code

### ⚠️ Current Vulnerabilities

#### 1. Direct `innerHTML` Property (jsx-runtime.ts, lines 17-27)

**Problem:**
```typescript
if (key === "innerHTML") {
  el.innerHTML = value;  // ❌ No sanitization
}
```

**Attack vector:**
```tsx
const malicious = '<img src=x onerror="alert(\'XSS\')">';
<div innerHTML={malicious} />  // ❌ VULNERABLE
```

#### 2. Reactive Children DOM Clearing (jsx-runtime.ts, lines 45-50)

**Problem:**
```typescript
if (typeof child === "function") {
  createEffect(() => {
    el.innerHTML = "";  // ⚠️ Destroys all children + their state
    el.append(child());
  });
}
```

**Issues:**
- Destroys event listeners
- Loses input values and focus
- Full re-render on every update
- Uses `innerHTML` unnecessarily

---

## Legitimate Use Cases

### Why `innerHTML` Exists

**Example from CV.tsx:**
```tsx
<div class="cv-body" innerHTML={cv.content}></div>
```

This is rendering **trusted HTML** generated from markdown by the build process. This is a legitimate need, similar to:
- Blog posts from markdown
- Rich text editors
- Server-rendered content

---

## Proposed Solutions

### Solution 1: Improve Reactive Children Handling ⭐ RECOMMENDED

Replace the problematic reactive children code with a text node tracking approach:

```typescript
// In jsx-runtime.ts, replace lines 45-50
for (const child of children.flat()) {
  if (typeof child === "function") {
    // Create a marker text node for reactive content
    const textNode = document.createTextNode("");
    el.append(textNode);
    
    createEffect(() => {
      const value = child();
      
      // For primitive values, update text node efficiently
      if (typeof value === "string" || typeof value === "number") {
        textNode.textContent = String(value);
      } 
      // For DOM elements, replace the node
      else if (value instanceof Node) {
        const newNode = value;
        textNode.parentNode?.replaceChild(newNode, textNode);
        // Update reference for next update
        textNode = newNode;
      }
      // Handle null/undefined
      else if (value == null) {
        textNode.textContent = "";
      }
    });
  } else if (child != null) {
    el.append(
      typeof child === "string" || typeof child === "number"
        ? document.createTextNode(String(child)) 
        : child
    );
  }
}
```

**Benefits:**
- ✅ No innerHTML usage
- ✅ Preserves DOM state
- ✅ Efficient text updates
- ✅ Handles all child types

### Solution 2: Rename `innerHTML` to `dangerouslySetInnerHTML`

Make the danger explicit, following React's convention:

```typescript
// In jsx-runtime.ts, replace lines 17-27
if (key === "dangerouslySetInnerHTML") {
  // Force explicit object structure
  if (typeof value === "object" && value !== null && "__html" in value) {
    const html = value.__html;
    
    if (typeof html === "function") {
      createEffect(() => {
        el.innerHTML = html();
      });
    } else {
      el.innerHTML = html;
    }
  }
  continue;
}
```

**Usage in CV.tsx:**
```tsx
<div class="cv-body" dangerouslySetInnerHTML={{ __html: cv.content }}></div>
```

**Benefits:**
- ✅ Makes danger obvious
- ✅ Requires explicit opt-in
- ✅ Familiar to React developers
- ✅ Prevents accidental usage

### Solution 3: Alternative - Comment Markers (Advanced)

For complex scenarios with multiple children, use marker comments:

```typescript
if (typeof child === "function") {
  const startMarker = document.createComment("reactive-start");
  const endMarker = document.createComment("reactive-end");
  el.append(startMarker, endMarker);
  
  let currentNodes: Node[] = [];
  
  createEffect(() => {
    // Remove old nodes
    currentNodes.forEach(node => node.remove());
    currentNodes = [];
    
    // Insert new nodes between markers
    const value = child();
    const nodes = Array.isArray(value) ? value : [value];
    
    for (const node of nodes) {
      const domNode = typeof node === "string" 
        ? document.createTextNode(node) 
        : node;
      endMarker.parentNode?.insertBefore(domNode, endMarker);
      currentNodes.push(domNode);
    }
  });
}
```

**Benefits:**
- ✅ Handles arrays of elements
- ✅ Preserves sibling nodes
- ✅ Clean removal strategy

**Drawbacks:**
- ⚠️ More complex
- ⚠️ Slight memory overhead

---

## Implementation Plan

### Phase 1: Fix Reactive Children (High Priority)
1. Implement Solution 1 (text node tracking)
2. Test with existing components
3. Verify no regressions in Home.tsx, CV.tsx, About.tsx

### Phase 2: Secure innerHTML (Medium Priority)
1. Implement Solution 2 (dangerouslySetInnerHTML)
2. Update CV.tsx usage
3. Add documentation warnings

### Phase 3: Testing (High Priority)
1. Add test cases for XSS attempts
2. Test reactive updates preserve state
3. Verify performance improvements

---

## Testing Checklist

### Security Tests
- [ ] String with `<script>` tags renders as text
- [ ] Event handler strings don't execute
- [ ] `dangerouslySetInnerHTML` is required for HTML
- [ ] Nested reactive signals don't break

### Functionality Tests
- [ ] Reactive text updates work
- [ ] Event listeners persist through updates
- [ ] Input values preserved during updates
- [ ] Conditional rendering works (CV.tsx)
- [ ] Arrays of children render correctly

### Performance Tests
- [ ] No full DOM rebuilds on signal changes
- [ ] Text updates are efficient
- [ ] No memory leaks with repeated updates

---

## Code Comparison

### Before (Vulnerable)
```typescript
// Destroys everything on update
if (typeof child === "function") {
  createEffect(() => {
    el.innerHTML = "";  // ❌
    el.append(child());
  });
}
```

### After (Secure & Efficient)
```typescript
// Updates efficiently
if (typeof child === "function") {
  const textNode = document.createTextNode("");
  el.append(textNode);
  createEffect(() => {
    textNode.textContent = String(child());  // ✅
  });
}
```

---

## References

### Similar Approaches in Other Frameworks

**React:**
- Uses virtual DOM diffing
- `dangerouslySetInnerHTML` for trusted HTML
- All text escaped by default

**Solid.js:**
- Uses comment markers for dynamic content
- Fine-grained reactivity like ours
- `innerHTML` also available but discouraged

**Preact:**
- Similar to React
- Virtual DOM reconciliation
- Text node reuse for efficiency

---

## Additional Considerations

### When to Use `dangerouslySetInnerHTML`
✅ **Safe:**
- Markdown rendered at build time
- Sanitized server content
- Trusted CMS content (with DOMPurify)

❌ **Dangerous:**
- User input (comments, forms)
- URL parameters
- External API data (without sanitization)
- Any untrusted source

### Future Enhancements

1. **Optional DOMPurify Integration**
   ```typescript
   if (key === "innerHTML" && options.sanitize) {
     el.innerHTML = DOMPurify.sanitize(value);
   }
   ```

2. **Development Mode Warnings**
   ```typescript
   if (import.meta.env.DEV && key === "innerHTML") {
     console.warn("Using innerHTML - ensure content is trusted!");
   }
   ```

3. **Type Safety**
   ```typescript
   interface DangerousHTML {
     __html: string;
   }
   dangerouslySetInnerHTML?: DangerousHTML;
   ```

---

## Conclusion

The current implementation is **mostly secure** but has room for improvement:

1. **Reactive children updates** can be made more efficient and avoid `innerHTML`
2. **Explicit `innerHTML`** usage should require a scary name to prevent accidents
3. **Normal text rendering** is already safe and should remain unchanged

Implementing the recommended solutions will result in a **more secure, efficient, and maintainable** JSX runtime while preserving the flexibility needed for legitimate use cases like markdown rendering.
