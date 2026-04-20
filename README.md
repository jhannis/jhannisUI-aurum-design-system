# AURUM Design System

A full-stack product design system — from Figma Variables to W3C DTCG tokens to live coded components, with automated API sync between design and code.

**[Live Preview →](https://jhannis.github.io/jhannisUI-aurum-design-system/aurum-design-system.html)**&ensp;·&ensp;**[Figma File →](https://www.figma.com/design/Onb3MwpbWm3IjCYMLYWL8s/AURUM-Design-System)**

---

## Overview

Aurum is a dark, editorial design system built to demonstrate end-to-end systems thinking — the kind of work that bridges design and engineering without losing craft along the way.

It covers the full lifecycle: token architecture, Figma variable binding, coded component library, and a Node.js sync script that pushes tokens into Figma via the REST API.

### What's included

| Layer | Description |
|-------|-------------|
| **Token architecture** | Three-tier system (primitive → semantic → component) in W3C DTCG format |
| **Figma file** | Variable collections with dark + light modes, 8 component sets, 5 assembled patterns |
| **Coded components** | 10 production-ready components in semantic HTML + CSS |
| **Figma API sync** | Node.js script that creates variables, text styles, color styles, and effect styles via the Figma REST API |

---

## Token Architecture

Aurum uses a three-tier token structure. UI never references primitives directly — everything resolves through the semantic layer.

```
Primitive          Semantic              Component
─────────          ────────              ─────────
gold/300      →    brand/default    →    button/primary/background
neutral/900   →    background/base  →    card/surface/background
neutral/50    →    text/primary     →    input/text
```

The full token definitions live in [`aurum-tokens.json`](aurum-tokens.json) and follow the [W3C Design Token Community Group](https://tr.designtokens.org/format/) specification.

### Token counts

| Category | Count |
|----------|-------|
| Primitive colors | 42 |
| Semantic color variables | 23 (× 2 modes) |
| Spacing tokens | 11 |
| Border radius tokens | 6 |
| Typography styles | 16 |
| Shadow/elevation styles | 3 |

---

## Design Decisions

A few of the intentional choices that shape the system:

**Three-font system.** Cormorant Garamond handles display hierarchy with editorial weight. Instrument Sans covers all UI text. DM Mono carries token references, code, and metadata. Each font has a specific role and they never swap contexts.

**Warm-dark palette.** The dark mode default uses warm neutrals (`#0A0806` base) rather than cool grays, with Aurum gold (`#C9A84C`) as the sole brand accent. Gold is used sparingly — primary CTAs and active indicators only, never as a large-area fill.

**Base-4 spacing scale.** All spacing values are multiples of 4px (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80), enforced through tokens. No hardcoded values in component CSS.

**Semantic-only references.** Components bind to semantic tokens, not primitives. This makes dark/light mode switching a matter of swapping one variable layer rather than updating individual components.

---

## Components

Ten components with full variant coverage:

| Component | Variants | States |
|-----------|----------|--------|
| **Button** | primary · secondary · ghost · destructive | default · hover · focus · disabled |
| **Badge** | default · brand · success · warning · error · info | — |
| **Input** | text field with label + hint | default · focus · error · disabled |
| **Card** | surface · elevated | default · hover |
| **Avatar** | XS · SM · MD · LG · XL + group stacking | — |
| **Toggle** | off · on · disabled | spring-animated thumb |
| **Progress** | brand · success · warning · error | standard + large track |
| **Tabs** | underline pattern | default · hover · active |
| **Chip** | selectable · removable | off · on |
| **Skeleton** | text · title · avatar · card | shimmer animation |

---

## Figma API Sync

The [`sync.js`](sync.js) script pushes the full token set into a Figma file via the REST API:

```bash
# Dry run — prints payloads without making API calls
npm run dry-run

# Full sync — variables + styles
npm run sync

# Partial syncs
npm run sync:tokens    # Variable collections only
npm run sync:styles    # Text, color, and effect styles only
```

### What it creates in Figma

- **Primitives** collection — single mode, raw palette + spacing + radius
- **Semantic** collection — two modes (Dark + Light) with all color variables
- **16 text styles** — display, body, and mono scales
- **15 color styles** — semantic palette
- **3 effect styles** — elevation/sm, md, lg

### Setup

```bash
cp .env.example .env
# Add your FIGMA_TOKEN and FIGMA_FILE_ID
npm install
npm run dry-run
```

Requires a Figma token with File Content (read + write) and Variables (read + write) scopes. The Variables API requires a paid Figma plan.

---

## Figma File Structure

| Page | Contents |
|------|----------|
| 🖤 Cover | Brand overview |
| 🎨 Foundation | Color, typography, spacing, radius token reference |
| ⚙️ Components | 8 component sets with full variant properties |
| ✦ Patterns | 5 assembled UI patterns |
| 🔐 Login — Mode Test | Dark/light mode variable binding demo |

Variable collections: **Primitives** · **Semantic** (Dark + Light modes) · **Component**

---

## Repository Structure

```
├── aurum-design-system.html   # Live coded component library
├── aurum-tokens.json          # W3C DTCG token definitions (source of truth)
├── claude-design.md           # Design context document for AI-assisted workflows
├── sync.js                    # Figma REST API sync script
├── package.json
└── README.md
```

---

## Local Development

Open the design system locally:

```bash
# No build step needed — it's a single HTML file
open aurum-design-system.html
```

For the Figma sync:

```bash
npm install
npm run dry-run    # Preview what will be created
npm run sync       # Push to Figma
```

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Author

**Jason Hannis** — Product Designer  
[Portfolio](https://jhannis.github.io) · [LinkedIn](https://linkedin.com/in/jhannis) · [GitHub](https://github.com/jhannis)
