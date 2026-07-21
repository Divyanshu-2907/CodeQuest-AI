# CodeQuest AI — Design System (Ethereal Glassmorphism)

## Philosophy

This is a premium, cinematic learning platform. Every UI decision should feel like you're interacting with a high-end, futuristic holographic interface. The aesthetic is "Ethereal Glassmorphism"—moving away from gritty realism into a sleek, glowing, floating digital environment. 

Core principles:
- **Depth through Blur** — Rely heavily on `backdrop-blur` and translucent backgrounds to create a sense of depth and hierarchy.
- **Floating Elements** — Cards and panels should feel like they are floating above the deep dark background, utilizing subtle drop shadows and inner glows.
- **Neon Edges** — Borders are not just lines; they are glowing light sources. Use translucent purple borders and inner shadows to simulate illuminated glass edges.
- **Mono for Data, Sans for Narrative** — JetBrains Mono for all numbers, stats, labels, tags, and code. Inter for headings and body copy.
- **Cinematic Lighting** — The background should feel like a vast, deep void (#080809) with ambient light spills behind important elements.

---

## Color Tokens

```
Base Canvas:
  --bg-base:      #080809   ← The deep void (page background)

Glass Surfaces (use with backdrop-blur-md or lg):
  --glass-1:      rgba(15, 15, 18, 0.6)  ← Sidebar, main panels
  --glass-2:      rgba(20, 20, 24, 0.4)  ← Standard cards
  --glass-3:      rgba(28, 28, 34, 0.3)  ← Hover states, inputs
  --glass-purple: rgba(127, 119, 221, 0.08) ← Active/highlight panels

Illuminated Borders:
  --border-glass: rgba(255, 255, 255, 0.05) ← Default subtle glass edge
  --border-glow:  rgba(127, 119, 221, 0.4)  ← Active purple edge
  --border-inner: rgba(255, 255, 255, 0.1)  ← Inner highlight for top edge

Text:
  --text-primary:  #E8E8F0  ← Headings, important labels
  --text-secondary:#9998A3  ← Body copy, descriptions
  --text-muted:    #6B6A72  ← Placeholders, disabled
  --text-ghost:    rgba(232, 232, 240, 0.2) ← Watermarks, subtle typography

Accent (Purple — Primary Brand):
  --purple-bright: #7F77DD  ← Buttons, active borders, progress bars
  --purple-mid:    #534AB7  ← Hover states
  --purple-dim:    #AFA9EC  ← Secondary purple text
  --purple-neon:   rgba(127,119,221, 0.6) ← Drop shadows for glowing elements
```

---

## Component Patterns

### Glass Panels (Cards)

All cards and main containers use the `.glass-panel` utility:
```css
.glass-panel {
  background: rgba(20, 20, 24, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  border-radius: 12px;
}
```

**Active / Highlight State (`.glass-active`):**
```css
.glass-active {
  background: rgba(127, 119, 221, 0.08);
  border: 1px solid rgba(127, 119, 221, 0.4);
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.3),          /* Base shadow */
    0 0 20px 0 rgba(127, 119, 221, 0.15),     /* Outer purple glow */
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1); /* Top edge light catch */
}
```

### Buttons

Primary (Glowing):
```tsx
<button className="bg-[#7F77DD] text-white px-5 py-2.5 rounded-lg font-bold tracking-wide text-sm
  shadow-[0_0_15px_rgba(127,119,221,0.4)] hover:shadow-[0_0_25px_rgba(127,119,221,0.6)] 
  transition-shadow duration-300">
  START MISSION
</button>
```

Ghost / Secondary (Glass):
```tsx
<button className="glass-panel text-[#AFA9EC] px-5 py-2.5 rounded-lg font-medium text-sm
  hover:bg-[rgba(127,119,221,0.1)] hover:border-[rgba(127,119,221,0.3)] transition-all duration-300">
  VIEW LOGS
</button>
```

### Ambient Backgrounds

Use radial gradients to create ambient lighting behind the glass panels. Place these absolutely in the background of a page:
```tsx
<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full 
  bg-[rgba(127,119,221,0.15)] blur-[120px] pointer-events-none" />
```

---

## Typography & Scale

```
Heading font:   Inter (--font-sans)
Data/Tech font: JetBrains Mono (--font-mono)
```
*   Use `font-mono` for anything data-driven (XP, levels, code, timestamps).
*   Avoid ALL CAPS for large headings (unlike the Brutalist/Cyberpunk look). Use sentence case or title case with tight tracking (`tracking-tight`) for a more refined, premium Apple-like feel.

---

## Cursor AI Instructions

When generating or editing any component in this project:

1. Read this file first.
2. Use the Ethereal Glassmorphism aesthetic. No flat, solid grays. Use `.glass-panel` and translucent backgrounds.
3. Incorporate `backdrop-blur` heavily.
4. Add inner highlights (`inset 0 1px 0 rgba(255,255,255,0.1)`) to cards to make them feel like polished glass edges.
5. Use glowing drop shadows for active states (`.glass-active`), never harsh borders.
6. The background should be `#080809` with massive, blurred radial gradients (`blur-[100px]`) behind the content to simulate ambient light.
