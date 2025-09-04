## NextRise Platform – Visual Style Overview (Non‑Technical)

Last updated: 2025-09-04

This document explains, in plain language, how the product should look and feel so that everything stays consistent as we grow. No code knowledge required.

---
### 1. Brand Essence
Keywords: modern, focused, professional, trustworthy, data‑driven.

Overall feel: a calm dark background with touches of bright cyan used sparingly to draw attention to the most important actions and numbers. The interface should feel clear and uncluttered.

---
### 2. Colours
Primary background: very dark blue (nearly navy).
Surface blocks (cards, panels): slightly lighter dark blue.
Hover / highlighted areas: one step lighter again.
Text (normal): soft light grey—easy to read on dark.
Text (secondary): muted grey for labels or less important information.
Accent: vibrant cyan / aqua gradient, used for key actions, important numbers and small visual highlights.
Danger / errors: clear red (used only for destructive actions or error messages).
Status labels (future): green for success, yellow for warnings, purple for planning/in‑progress – to be standardised later.

| Purpose / Name | What It’s For | Hex Code |
|----------------|---------------|----------|
| Primary background | Main page background | #0F172A |
| Surface (cards/panels) | Standard blocks & containers | #162132 |
| Hover / elevated surface | Hover states / subtle lift | #1F2D40 |
| Top bar | Global navigation bar | #0C1320 |
| Border | Lines & outlines | #2C3B50 |
| Text (primary) | Main reading text | #E2E8F0 |
| Text (secondary) | Labels / less important info | #94A3B8 |
| Accent (bright cyan) | Primary actions & key numbers | #38BDF8 |
| Accent (deep cyan) | Start of gradients / active glow | #0EA5E9 |
| Danger | Destructive actions / errors | #EF5555 |
| Success (future) | Positive / active states | #34D399 |
| Warning (future) | Caution / pending attention | #FACC15 |
| Planning / Info (future) | In progress / planning | #C084FC |

Usage rules:
1. Keep accent colour special (aim below ~10% of a screen).
2. Don’t mix too many bright colours together; the dark background is the canvas.
3. Red only signals risk or deletion.
4. Status colours must always be readable—avoid very low contrast.

---
### 3. Typography (Text)
Base type: clean system font (what your device normally uses).
Headings: slightly tighter spacing than body text; bold enough to be clear but not heavy.
Body text: regular weight, comfortable line height for easy reading.
Small labels & tags: uppercase, spaced-out letters for quick scanning.
Gradient text (colour‑blended): only for standout numbers or the brand name—do not overuse.

---
### 4. Layout & Spacing
We use a small set of spacing steps so everything aligns neatly. Think in “small, medium, large” rather than inventing new gaps. Consistency beats creativity here.

General guidelines:
1. Keep consistent padding inside cards and panels (roughly a medium spacing).
2. Group related items tightly; separate different sections with larger space.
3. Side navigation stays fixed on larger screens and hides on smaller screens to keep focus.
4. Content width is limited so lines don’t become too wide to read comfortably.

Rounded corners: gentle, not sharp, across buttons, cards and panels. Larger hero or special blocks can have slightly bigger rounding for emphasis.

Shadows (depth): used lightly—only for elements that need to “sit above” others (like sign‑in panel). Avoid stacking many deep shadows.

---
### 5. Key UI Elements (Human Description)
Buttons:
• Primary action: bright cyan gradient; should be the most visually prominent interactive element on a screen.
• Secondary action: quiet dark surface with subtle hover highlight.
• Destructive: red; only when something risky happens (delete, remove, stop).
States: normal, hover (slightly brighter or lighter), pressed (slightly darker / nudged), disabled (faded and not clickable).

Cards & Panels:
• Use them to group related data or controls.
• Each has consistent internal spacing and a clear heading (if needed).
• Avoid putting too many decorative gradients together—let the accent areas breathe.

Tables & Lists:
• Header row slightly darker or contrasted.
• Rows should be easy to scan—keep consistent vertical rhythm.
• Status labels use subtle coloured backgrounds (light tint with readable text).

Forms:
• Keep one clear label above each field.
• Enough space between fields so the form doesn’t feel cramped.
• Error states: field outline and message in red with short, clear copy.
• Only ask for what we truly need—less friction increases completion.

Status Tags (chips):
• Compact, rounded, all-uppercase.
• Colour meaning must be consistent everywhere (green always = active/success, etc.).

---
### 6. Motion & Interaction
Subtle only. Small fades or slides when something appears. No large or distracting animations. Everything should feel quick and responsive.

---
### 7. Accessibility & Clarity
• Text should always be clearly readable on its background.
• Every interactive element must show a visible focus outline when using keyboard navigation.
• Don’t rely only on colour to communicate meaning (add labels when needed).
• Buttons and touch targets should be large enough to tap comfortably.
• Minimise unnecessary motion for users who are sensitive to animations (future improvement path).

---
### 8. Future Improvements (Non‑Technical List)
1. Standardise success / warning / info colours.
2. Provide a simple library of reusable button styles.
3. Add clear error and success styles for forms everywhere.
4. Consider a light theme if required by customers.
5. Create a small gallery page to preview all components at once.
6. Document tone of voice for microcopy (empty states, errors).
7. Add basic icon style rules (sizes, colour usage).

---
### 9. How to Use This Document
Use it as a reference when adding screens or features. If something new doesn’t match these rules, adapt it so it does—or propose a small, justified update here before shipping.

---
### 10. Ownership
Assign a person responsible for visual consistency. Any change to colours, typography, or spacing should be reviewed with that lens.

---

In short: dark, calm foundation; restrained use of bright cyan; clear hierarchy; consistency over novelty.

