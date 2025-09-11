# NextRise Documentation Guide

Welcome to the developer documentation system. We use **Doxygen** to generate browsable docs from JSDoc-style comments in both the **Next.js backend** (`backend/src`) and the **React/Vite frontend** (`frontend/src`).

## 1. Quick Start

From the project root run:
```
doxygen doc/Doxyfile
```
Then open:
```
open doc/doxygen/html/index.html
```
(Use `xdg-open` on Linux or just double‑click the file in Finder.)

## 2. Installing Doxygen

macOS (Homebrew):
```
brew install doxygen
```
Graphviz (optional for diagrams):
```
brew install graphviz
```
After installing Graphviz you can enable diagrams by setting `HAVE_DOT = YES` in `doc/Doxyfile`.

## 3. Directory Coverage
- Backend sources: `backend/src`
- Frontend sources: `frontend/src`
- This guide file becomes the main page.

Excluded: build artifacts (`backend/.next`, `frontend/dist`), `node_modules`, log folders.

## 4. Writing JSDoc / Doxygen Comments
Use standard JSDoc blocks. A few examples:

### Function / Module
```js
/**
 * Fetch a list of incubator events.
 * @async
 * @function fetchEvents
 * @returns {Promise<Array<Object>>} Resolves with event objects.
 * @throws {Error} Network or parsing failures.
 */
export async function fetchEvents() { /* ... */ }
```

### React Component
```jsx
/**
 * ProjectCard component.
 * Renders summary information for a project with quick actions.
 * @component
 * @param {Object} props
 * @param {Object} props.project The project data model.
 * @param {string} props.project.id Unique id.
 * @param {string} props.project.name Display name.
 * @param {Function} [props.onSelect] Optional select handler.
 * @returns {JSX.Element}
 */
function ProjectCard({ project, onSelect }) { /* ... */ }
export default ProjectCard;
```

### Custom Hook
```jsx
/**
 * useAuth
 * React hook returning current user and auth helpers.
 * @hook
 * @returns {{ user: Object|null, login: Function, logout: Function }}
 */
export function useAuth() { /* ... */ }
```

### Class (if used)
```js
/**
 * Represents a cached API client.
 * @class ApiCache
 * @param {number} ttlSeconds Time to live in seconds.
 */
class ApiCache { /* ... */ }
```

### Documenting Data Structures
```js
/**
 * @typedef {Object} Investor
 * @property {string} id Unique identifier.
 * @property {string} name Investor name.
 * @property {string[]} sectors Preferred sectors.
 */
```

## 5. Aliases
Two custom aliases are defined in `Doxyfile`:
- `@component` / `@component` tag labelled as Component section
- `@hook` for React hooks

(They render as separate titled paragraphs.)

## 6. Tips for Good Docs
- Use `@returns` only once per function.
- Use `@throws` for expected error scenarios.
- Prefer `@typedef` for shared object shapes.
- Keep descriptions in present tense: "Fetches", "Returns".
- Write brief first sentence; Doxygen treats it as summary.

## 7. Regenerating
Re-run `doxygen doc/Doxyfile` anytime. Old output is overwritten. Commit the `Doxyfile` and guide, but normally **do not** commit the generated `doc/doxygen/html` unless you plan to publish via GitHub Pages or similar.

## 8. Publishing (Optional)
You can publish HTML docs to GitHub Pages:
1. Add a workflow that runs Doxygen and pushes `doc/doxygen/html` to `gh-pages` branch.
2. Enable Pages from repository settings.

## 9. Enabling Diagrams (Optional)
1. Install Graphviz (see above).
2. Edit `doc/Doxyfile`: set `HAVE_DOT = YES` and optionally enable `CALL_GRAPH` / `CALLER_GRAPH`.

## 10. Maintenance Checklist
- [ ] Add JSDoc blocks to new modules and components.
- [ ] Review warnings in `doc/doxygen/doxygen-warnings.log` after generation.
- [ ] Update `PROJECT_NUMBER` for releases.

## 11. Troubleshooting
| Issue | Fix |
|-------|-----|
| No output directory | Ensure you run from repo root so relative paths resolve. |
| Missing symbols | Confirm file pattern includes extension (.jsx/.mjs) and comment block is /** ... */ style. |
| Garbled JSX | Inline complex JSX examples inside `<pre>` in markdown or exclude them. |

## 12. Next Steps
Consider adding ESLint rules to enforce JSDoc completeness or a pre-commit hook to run `doxygen -u` validation.

---
Happy documenting!
