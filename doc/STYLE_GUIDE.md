## NextRise – Style Guide (Pastel Palette & Dark Theme)

Single source of truth to keep visual consistency (design + dev). Revised version with pink/violet pastel palette (light theme) + dark variant, new fonts and CSS tokens.

---
### 1. Brand DNA
Keywords: modern, calm, restrained, analytical, warm but not childish.

Intent: a soft universe (lavender / rose pastels) in light mode, and deep / velvety in dark. Accents serve information (actions, interactive elements, key metrics) – never decorative fluff.

---
### 2. Typography
Fonts loaded via Google Fonts.
• Titles / headings: Montserrat (600–700). Tight leading (line-height ~1.1).
• Body / paragraphs: Open Sans 400–600 (line-height 1.5).
• Small labels / META: uppercase, subtle tracking (letter-spacing +4–6%).
• Don’t multiply weight variants: (400 / 600 / 700 are enough).
• Gradient text: only for one key number / internal logo (max 1 per screen).

Accessibility: target AA contrast (ratio ≥ 4.5:1 for body). Re‑check when changing a text color.

---
### 3. Color System (CSS Tokens)
Variables are defined in `frontend/src/index.css` on `:root` (light) then overridden in `.theme-dark`.

#### Base Palette (Swatches)
| Token | Hex | Primary Usage |
|-------|-----|---------------|
| --violet-500 | #C174F2 | Primary accent, primary buttons (light + dark) |
| --violet-400 | #CB90F1 | Glow / hover accent, gradients |
| --violet-300 | #D5A8F2 | Subtle tinted backgrounds (light badges) |
| --violet-200 | #E4BEF8 | Very soft backgrounds / light hover |
| --violet-100 | #EED5FB | Decorative subtle background |
| --rose-500 | #F18585 | Secondary accent (graphs, chips) |
| --rose-400 | #F49C9C | Secondary accent (soft variant) |
| --rose-300 | #F6AEAE | Gradients / soft highlight |
| --rose-200 | #F8CACF | Low-emphasis pastel highlight backgrounds |

#### Light Theme (Derived Values)
| Role | Token | Value | Notes |
|------|-------|-------|-------|
| Page background | --color-bg | #f6f1f8 | Diffuse lavender base |
| Alt section | --color-bg-alt | #f4eef9 | Subtle differentiation |
| Card surface | --color-surface | #fcfaff | Default cards |
| Raised / hover surface | --color-surface-alt | #f3ecfa | Hover / gentle elevation |
| Dashboard panel | --panel-bg | #f9f6fd | Functional group panels |
| Border | --color-border | #e3d6f1 | Discreet separation |
| Soft border | --color-border-soft | #eee3f8 | Internal dividers |
| Primary text | --color-text | #2a2332 | Strong readability |
| Secondary text | --color-text-muted | #6d5f74 | Labels / hints |
| Primary accent | --color-accent | #C174F2 | Primary action |
| Secondary accent | --color-accent-2 | #F49C9C | Light secondary action |
| Accent glow | --color-accent-glow | #CB90F1 | Focus rings / halo |
| Danger base | --color-danger | #e11d48 | Delete / errors |
| Danger hover | --color-danger-hover | #be123c | Hover state |
| Danger active | --color-danger-active | #9f1239 | Pressed |
| Topbar | --color-topbar | gradient | Frosted transparency |

#### Dark Theme (`.theme-dark`)
| Role | Token | Value | Notes |
|------|-------|-------|-------|
| Page background | --color-bg | #141018 | Deep base |
| Alt section | --color-bg-alt | #1b1522 | Gentle variation |
| Card surface | --color-surface | #1f1827 | Cards |
| Raised / hover surface | --color-surface-alt | #261e31 | Hover |
| Panel | --panel-bg | #201a28 | Groups |
| Border | --color-border | #3a2d47 | Moderate contrast |
| Soft border | --color-border-soft | #2c2331 | Dividers |
| Primary text | --color-text | #ece4f2 | High legibility |
| Secondary text | --color-text-muted | #a592b3 | Labels |
| Accents | --color-accent / 2 | #C174F2 / #F49C9C | Palette consistency |
| Accent glow | --color-accent-glow | #D5A8F2 | Focus effects |
| Danger (x3) | same as light | | Consistent feedback |
| Topbar | --color-topbar | dark gradient | Slight translucency |

Usage Rules:
1. Primary accent ≤ ~12% of visual surface (avoid saturation).
2. Use only ONE elevation level per zone (no stacked shadows).
3. Red exclusively for errors / destructive actions.
4. States (hover/focus/active) adjust luminance or border—not a total hue swap.
5. Dark theme must not invert hierarchy (same roles, different values).

---
### 4. Spacing & Radii
Simple rhythm (internal scale: 4 / 8 / 12 / 16 / 24). Choose the smallest sufficient.
• Card padding: 16–20px.
• Gap between major sections: 32px.
• Radii: `--radius-sm:6px`, `--radius-md:10px`, `--radius-lg:14px`. Use md for cards, sm for inputs, lg for hero sections / modals.
• Shadows: prefer `--shadow-sm` (default) and `--shadow-md` only for overlays / modal.

---
### 5. Components (Functional Description)
Buttons:
• Primary: violet gradient or solid (`--color-accent`), contrasting text (#fff or `--color-text`).
• Secondary: neutral surface (`--color-surface` light / `--color-surface-alt` dark) + soft border.
• Danger: red (danger token).
States: hover = slight elevation + 4–6% intensification; active = slight darkening + 1px translation; disabled = ~0.5 opacity + not-allowed cursor.

Cards / Panels:
• Coherent content (optional title at top, grouped actions right).
• No heavy shadow + gradient simultaneously.
• Consistent internal spacing.

Forms:
• Label always above the field.
• Error: danger border + short message (1 sentence).
• Focus: ring / glow via `--color-accent-glow` (soft outer drop shadow).
• Show success validation only when meaningful (e.g., remote save confirmed).

Lists & Tables:
• Header row: slight surface variation (`--color-surface-alt` light / darkened in dark mode).
• Row hover: subtle background (no full inversion).
• Consistent vertical density (row height ~40–48px depending on content).

Badges / Status (future): use very light tints (12–18% transparency) + contrasting text.

---
### 6. Themes & Implementation
Dark activation: add `.theme-dark` on the root element (e.g., `<body>`). Components must not hardcode hex colors—consume tokens. Any new color = add a new variable documented here before usage.

Dev checklist before merge:
1. Using tokens? (no inline hex except small decorative exceptions)
2. Accessible contrast verified?
3. Visible keyboard focus state?
4. Responsive (≥320px) without breakage?

---
### 7. Accessibility
• Focus: visible outline or halo (accent) in both themes.
• Don’t convey info by color alone (add icon/text).
• Interactive target height ≥ 40px (mobile).
• Respect `prefers-reduced-motion` (future TODO) to reduce animations.

---
### 8. Motion
Micro transitions (150–220ms, standard easing: `ease-out`). Fades, translations ≤ 8px. No endlessly looping decorative animations.

---
### 9. Improvement Roadmap
1. Unified component pack (Button, Badge, Input, Modal).
2. Status system (success / warning / info) with dedicated tokens.
3. Showcase / internal Storybook page.
4. Enhanced contrast mode.
5. Illustration & pictogram guidelines.
6. Codified spacing tokens (`--space-…`).
7. Standardized entrance animation (utility class).

---
### 10. Governance
Every new color / style variation goes through design review. Token changes are versioned and announced (UI CHANGELOG).

---
### 11. Quick Summary
Controlled pastel palette, measured accents, readable hierarchy, same structure across light & dark, restraint before effect. Consistency > occasional originality.

---
NOTE: Update this document whenever a CSS variable or **reusable** pattern is added.

