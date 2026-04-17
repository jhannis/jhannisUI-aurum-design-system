# Aurum Design System — Claude Design Context

> This file tells Claude Design how to apply the Aurum design system correctly.
> Reference it whenever generating prototypes, slides, one-pagers, or any visual output.

---

## What this system is

Aurum is a dark, editorial product design system built for a senior Product Designer's portfolio.
The aesthetic is **warm-dark, luxury, and typographically refined** — not generic SaaS.
When in doubt, lean toward restraint and craft over decoration.

---

## Token architecture

Three-tier token structure. Always resolve in this order:

```
Primitive → Semantic → Component
```

- **Primitives** define the raw palette (`gold/300`, `neutral/900`, `green/300`)
- **Semantic** tokens apply meaning (`brand/default`, `background/base`, `text/primary`)
- **Component** tokens bind to specific UI elements (`button/height-md`, `input/padding-h`)

**Never use primitive values directly in UI.** Always use the semantic layer.

The full token definitions are in `aurum-tokens.json` in this repo.

---

## Color

### Brand
The brand color is **Aurum gold** — warm, not yellow.

| Token | Value | Use |
|-------|-------|-----|
| `brand/default` | `#C9A84C` | Primary CTAs, active states, brand marks |
| `brand/hover` | `#E2BE55` | Hover state on brand elements |
| `brand/subtle` | `rgba(201,168,76,0.12)` | Tinted backgrounds, selected states |
| `brand/muted` | `rgba(201,168,76,0.06)` | Very subtle brand-tinted surfaces |

### Dark mode (default)
| Token | Value | Use |
|-------|-------|-----|
| `background/base` | `#0A0806` | Page background |
| `background/surface` | `#141008` | Cards, panels |
| `background/elevated` | `#1E1610` | Elevated cards, dialogs |
| `background/overlay` | `#28201A` | Tooltips, overlays |
| `border/subtle` | `#2A2018` | Dividers, low-contrast borders |
| `border/default` | `#3A2E25` | Standard component borders |
| `border/strong` | `#5A4A3D` | Emphasis borders |
| `text/primary` | `#F5EDD8` | Headings, important content |
| `text/secondary` | `#A0897A` | Body copy, descriptions |
| `text/muted` | `#5A4A3D` | Hints, timestamps, metadata |

### Light mode
| Token | Value |
|-------|-------|
| `background/base` | `#FFFFFF` |
| `background/surface` | `#F8F5EE` |
| `background/elevated` | `#FFFFFF` |
| `text/primary` | `#0A0806` |
| `text/secondary` | `#7A6558` |
| `text/muted` | `#A0897A` |
| `border/subtle` | `#E2D8C8` |
| `border/default` | `#C8B89A` |

### Status colors (same in both modes)
| Token | Value | Use |
|-------|-------|-----|
| `status/success` | `#3D9E6B` | Confirmations, published states |
| `status/warning` | `#E8A838` | Caution, flagged states |
| `status/error` | `#D95F5F` | Errors, destructive states |
| `status/info` | `#4A90D9` | Informational, in-progress states |

---

## Typography

Three-font system. Use each in its correct context — never swap them.

### Cormorant Garamond (Display)
- **Use for:** page titles, section headings, card titles, hero text, editorial moments
- **Weight:** Light (300) always — never bold
- **Style:** Italic variant for subheadings and accent type
- **Letter spacing:** −0.03em on large sizes, −0.02em on medium
- **Never use for:** body copy, labels, UI elements, code

### Instrument Sans (Body / UI)
- **Use for:** all body copy, button labels, nav items, form labels, captions
- **Weights:** Regular (400) for body, Medium (500) for labels and buttons
- **Never use for:** display headings, code

### DM Mono (Code / Metadata)
- **Use for:** token names, code snippets, version strings, timestamps, badge labels, eyebrow text
- **Weight:** Regular (400), Medium (500) for emphasis
- **Letter spacing:** 0.1–0.2em on uppercase labels
- **Never use for:** body copy or headings

### Type scale
| Style | Font | Size | Weight |
|-------|------|------|--------|
| `display/5xl` | Cormorant Garamond | 96px | 300 |
| `display/3xl` | Cormorant Garamond | 48px | 300 |
| `display/2xl` | Cormorant Garamond | 32px | 300 |
| `body/xl` | Instrument Sans | 24px | 400 |
| `body/base` | Instrument Sans | 15px | 400 |
| `body/sm` | Instrument Sans | 13px | 400/500 |
| `body/xs` | Instrument Sans | 11px | 400 |
| `label/xs` | Instrument Sans | 11px | 500 |
| `mono/base` | DM Mono | 13px | 400 |
| `mono/sm` | DM Mono | 11px | 400 |
| `mono/xs` | DM Mono | 10px | 500 |

---

## Spacing

Base-4 scale. All padding and gap values must come from this scale.

| Token | Value |
|-------|-------|
| `spacing/1` | 4px |
| `spacing/2` | 8px |
| `spacing/3` | 12px |
| `spacing/4` | 16px |
| `spacing/5` | 20px |
| `spacing/6` | 24px |
| `spacing/8` | 32px |
| `spacing/10` | 40px |
| `spacing/12` | 48px |
| `spacing/16` | 64px |
| `spacing/20` | 80px |

---

## Border radius

| Token | Value | Use |
|-------|-------|-----|
| `radius/none` | 0px | Tables, code blocks |
| `radius/sm` | 3px | Badges, tags, small chips |
| `radius/md` | 6px | Buttons, inputs, chips |
| `radius/lg` | 10px | Cards, panels |
| `radius/xl` | 16px | Modals, sheets |
| `radius/full` | 9999px | Avatars, toggles, pills |

---

## Elevation

| Level | Shadow | Use |
|-------|--------|-----|
| `elevation/none` | none | Flat surfaces |
| `elevation/sm` | `0 1px 2px rgba(0,0,0,0.4)` | Tooltips, tags |
| `elevation/md` | `0 4px 12px rgba(0,0,0,0.5)` | Cards, popovers |
| `elevation/lg` | `0 12px 32px rgba(0,0,0,0.6)` | Modals, drawers |

---

## Components

### Button
- **Primary:** `brand/default` fill, `text/inverse` label, `radius/md`, height 36px (MD)
- **Secondary:** transparent fill, `border/default` stroke, `text/primary` label
- **Ghost:** no border, no fill, `text/secondary` label
- **Destructive:** `status/error` tinted fill, `status/error` label and border
- Sizes: SM (28px), MD (36px), LG (44px)
- Font: `body/sm-medium` (Instrument Sans 13px Medium)

### Badge
- Always use DM Mono font
- Always include a 5×5px dot indicator before the label
- Use `status/*-subtle` for background tint at 12% opacity
- Border radius: `radius/full`

### Input
- Height: 40px
- Background: `background/surface`
- Border: `border/default` default, `brand/default` on focus, `status/error` on error
- Focus ring: 2px `brand/subtle` (rgba at 12% opacity)
- Font: Instrument Sans 13px
- Padding: 16px horizontal

### Card
- **Surface:** `background/surface` fill, `border/subtle` stroke, `radius/lg`
- **Elevated:** `background/elevated` fill, `border/default` stroke, `elevation/md` shadow
- Internal padding: 24px
- Header divider: 1px `border/subtle`

### Avatar
- Always circular (`radius/full`)
- Show initials in Instrument Sans Medium
- Border: 1px `border/default`
- Sizes: XS 24px, SM 32px, MD 40px, LG 48px, XL 64px
- Group overlap: −8px margin, 2px `background/base` ring

### Toggle
- Track: 40×22px, `radius/full`
- Thumb: 14×14px, positioned 3px from edge (off) or 21px from edge (on)
- On state: `brand/subtle` track, `brand/default` thumb, `brand/default` border
- Off state: `background/overlay` track, `text/muted` thumb, `border/default` border

---

## Motion

| Token | Curve | Duration | Use |
|-------|-------|----------|-----|
| `motion/easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | 220ms | Default transitions |
| `motion/easing-decelerate` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | 360ms | Elements entering |
| `motion/easing-accelerate` | `cubic-bezier(0.4, 0.0, 1.0, 1)` | 140ms | Elements exiting |
| `motion/easing-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 360ms | Toggle, avatar, spring moments |

---

## Aesthetic rules

These are non-negotiable for any output to look like Aurum:

1. **Dark by default.** Use the dark mode palette unless explicitly asked for light.
2. **Gold is precious — use it sparingly.** Primary CTAs, active indicators, brand marks only. Never as a background fill on large areas.
3. **Cormorant Garamond headings, always light weight.** Never bold, never heavy.
4. **DM Mono for all metadata, tokens, and eyebrow labels.** This is what makes it feel like a real design system.
5. **No generic gradients or purple.** The palette is warm-dark with gold accents.
6. **Generous whitespace.** Prefer spacious layouts over dense ones.
7. **Borders are subtle.** Use `border/subtle` by default, only escalate to `border/default` when needed for clarity.
8. **Status colors only for status.** Never use `status/success` green as a brand color or decorative element.

---

## What not to do

- ❌ Don't use Inter, Roboto, or system fonts
- ❌ Don't use purple or blue-purple as a brand color
- ❌ Don't use white backgrounds unless explicitly in light mode
- ❌ Don't use hardcoded hex values — always reference semantic tokens
- ❌ Don't use bold weights on display type
- ❌ Don't add drop shadows to flat surface cards
- ❌ Don't use gold as a large area fill or background

---

## Files in this repo

| File | Purpose |
|------|---------|
| `aurum-tokens.json` | W3C DTCG token definitions — source of truth for all values |
| `aurum-design-system.html` | Live coded system — reference for component structure and CSS |
| `aurum-figma-sync/sync.js` | Node.js script that syncs tokens to Figma via REST API |
| `aurum-figma-sync/README.md` | Setup instructions for the sync script |
| `claude-design.md` | This file |

---

## Figma file

The canonical Figma source is available at:
`https://www.figma.com/design/Onb3MwpbWm3IjCYMLYWL8s/AURUM-Design-System`

Pages:
- 🖤 Cover — brand overview
- 🎨 Foundation — color, type, spacing, radius token reference
- ⚙️ Components — 8 component sets with variants
- ✦ Patterns — 5 assembled UI patterns
- 🔐 Login — Mode Test — dark/light mode variable binding demo

Variable collections: **Primitives** · **Semantic** (Dark + Light modes) · **Component**
