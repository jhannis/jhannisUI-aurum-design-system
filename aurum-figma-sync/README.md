# Aurum DS → Figma Sync

Pushes all Aurum design tokens into your Figma file as Variables and Styles.

## What it creates

| Type | Count | Details |
|------|-------|---------|
| Variable collection: Primitives | 1 | Single mode — raw palette + spacing + radius |
| Variable collection: Semantic | 1 | Two modes: Dark + Light |
| Color variables | 42 | Primitive colors |
| Semantic color variables | 23 | With dark/light mode values |
| Spacing variables | 11 | 4–80px base-4 scale |
| Radius variables | 6 | none → full |
| Text styles | 16 | Display · Body · Mono scales |
| Color styles | 15 | Named semantic palette |
| Effect styles | 3 | elevation/sm · md · lg |

## Setup

```bash
# 1. Copy env template
cp .env.example .env

# 2. Fill in your token and file ID in .env
#    (see comments in .env.example for how to get these)

# 3. Dry run first — prints payloads, no API calls
npm run dry-run

# 4. Full sync
npm run sync
```

## Partial syncs

```bash
# Variables only (collections + tokens)
npm run sync:tokens

# Styles only (text + color + effect)
npm run sync:styles
```

## Figma API requirements

- **File content** scope: Read + Write
- **Variables** scope: Read + Write  
- File must be in a **paid Figma team or org** for the Variables REST API  
  (Variables API is not available on the Free plan)

## After running

1. Open your Figma file
2. Check the **Variables panel** → you'll see `Primitives` and `Semantic` collections
3. Check **Assets → Local styles** → text, color, and effect styles appear
4. Open **Token Studio plugin** and point it at `aurum-tokens.json` to verify alias resolution
5. Start building components — reference `Semantic/*` variables, never Primitive values directly

## Troubleshooting

| Error | Fix |
|-------|-----|
| 403 Forbidden | Token missing Variables write scope — regenerate with correct scopes |
| 404 Not Found | Wrong FILE_ID — check your Figma URL |
| 429 Too Many Requests | Script auto-retries; if it persists, wait a minute and re-run `--only=styles` |
| Variables not visible | Variables API requires a paid Figma plan |
