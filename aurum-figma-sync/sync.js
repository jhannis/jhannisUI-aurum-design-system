/**
 * Aurum Design System — Figma API Sync
 * ─────────────────────────────────────────────────────────────
 * Creates / updates in your Figma file:
 *   • Variable collections  (primitives · semantic · component)
 *   • Variables with dark + light mode values
 *   • Text styles  (display, body, mono scales)
 *   • Color styles (semantic palette)
 *   • Effect styles (shadow/elevation tokens)
 *
 * Usage:
 *   node sync.js              — full sync
 *   node sync.js --only=tokens
 *   node sync.js --only=styles
 *   node sync.js --dry-run    — print payloads, no API calls
 * ─────────────────────────────────────────────────────────────
 */

import 'dotenv/config';
import { readFileSync } from 'fs';

// ── Config ────────────────────────────────────────────────────
const TOKEN   = process.env.FIGMA_TOKEN;
const FILE_ID = process.env.FIGMA_FILE_ID;
const BASE    = 'https://api.figma.com/v1';

const args     = process.argv.slice(2);
const DRY_RUN  = args.includes('--dry-run');
const ONLY     = (args.find(a => a.startsWith('--only=')) || '').replace('--only=', '') || 'all';

if (!TOKEN || !FILE_ID) {
  console.error('\n  ✗  Missing env vars. Create a .env file:\n');
  console.error('     FIGMA_TOKEN=your_personal_access_token');
  console.error('     FIGMA_FILE_ID=the_file_id_from_your_figma_url\n');
  process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────
const log   = (icon, msg) => console.log(`  ${icon}  ${msg}`);
const ok    = msg => log('✓', msg);
const info  = msg => log('·', msg);
const warn  = msg => log('⚠', msg);
const err   = msg => log('✗', msg);

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function figma(method, path, body) {
  const url = `${BASE}${path}`;
  if (DRY_RUN) {
    info(`DRY ${method} ${path}`);
    if (body) console.log(JSON.stringify(body, null, 2).split('\n').slice(0,12).join('\n') + '\n  ...');
    return { status: 'dry-run' };
  }
  await sleep(300); // gentle rate-limit buffer
  const res = await fetch(url, {
    method,
    headers: { 'X-Figma-Token': TOKEN, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

// ── Colour helpers ────────────────────────────────────────────
function hexToRgba(hex, a = 1) {
  const h = hex.replace('#', '');
  const len = h.length;
  if (len === 3) {
    return {
      r: parseInt(h[0]+h[0], 16) / 255,
      g: parseInt(h[1]+h[1], 16) / 255,
      b: parseInt(h[2]+h[2], 16) / 255,
      a,
    };
  }
  return {
    r: parseInt(h.slice(0,2), 16) / 255,
    g: parseInt(h.slice(2,4), 16) / 255,
    b: parseInt(h.slice(4,6), 16) / 255,
    a,
  };
}

function parseColor(value) {
  if (typeof value === 'string') {
    if (value.startsWith('#'))    return hexToRgba(value);
    if (value.startsWith('rgba')) {
      const [r,g,b,a] = value.match(/[\d.]+/g).map(Number);
      return { r: r/255, g: g/255, b: b/255, a };
    }
  }
  return null;
}

// ── Token definitions (mirrors tokens.json, inlined for portability) ──
const PRIMITIVE_COLORS = {
  'gold/100': '#F0D580', 'gold/200': '#E2BE55', 'gold/300': '#C9A84C',
  'gold/400': '#B08A35', 'gold/500': '#8C6C1F', 'gold/600': '#6A4E10', 'gold/700': '#46320A',
  'neutral/0': '#FFFFFF', 'neutral/50': '#F5EDD8', 'neutral/100': '#E8DEC4',
  'neutral/200': '#C8B89A', 'neutral/300': '#A0897A', 'neutral/400': '#7A6558',
  'neutral/500': '#5A4A3D', 'neutral/600': '#3A2E25', 'neutral/700': '#2A2018',
  'neutral/800': '#1E1610', 'neutral/850': '#141008', 'neutral/900': '#0A0806',
  'neutral/1000': '#000000',
  'green/100': '#A8E6C4', 'green/200': '#72D0A2', 'green/300': '#3D9E6B',
  'green/400': '#2A7A50', 'green/500': '#1A5536',
  'amber/100': '#FAD88A', 'amber/200': '#F0BA4A', 'amber/300': '#E8A838',
  'amber/400': '#C07D1A', 'amber/500': '#8A540A',
  'red/100': '#F4A8A8', 'red/200': '#EA7878', 'red/300': '#D95F5F',
  'red/400': '#B03C3C', 'red/500': '#7A2222',
  'blue/100': '#A8CEEE', 'blue/200': '#74AEE4', 'blue/300': '#4A90D9',
  'blue/400': '#2A6AAF', 'blue/500': '#14477A',
};

const SEMANTIC_COLORS = {
  // Background
  'background/base':     { dark: '#0A0806', light: '#FFFFFF' },
  'background/surface':  { dark: '#141008', light: '#F8F5EE' },
  'background/elevated': { dark: '#1E1610', light: '#FFFFFF' },
  'background/overlay':  { dark: '#28201A', light: '#F0EAE0' },
  // Border
  'border/subtle':       { dark: '#2A2018', light: '#E2D8C8' },
  'border/default':      { dark: '#3A2E25', light: '#C8B89A' },
  'border/strong':       { dark: '#5A4A3D', light: '#A0897A' },
  // Text
  'text/primary':        { dark: '#F5EDD8', light: '#0A0806' },
  'text/secondary':      { dark: '#A0897A', light: '#7A6558' },
  'text/muted':          { dark: '#5A4A3D', light: '#A0897A' },
  'text/inverse':        { dark: '#0A0806', light: '#FFFFFF' },
  // Brand
  'brand/default':       { dark: '#C9A84C', light: '#C9A84C' },
  'brand/hover':         { dark: '#E2BE55', light: '#E2BE55' },
  'brand/subtle':        { dark: 'rgba(201,168,76,0.12)', light: 'rgba(201,168,76,0.12)' },
  // Semantic
  'status/success':      { dark: '#3D9E6B', light: '#3D9E6B' },
  'status/warning':      { dark: '#E8A838', light: '#E8A838' },
  'status/error':        { dark: '#D95F5F', light: '#D95F5F' },
  'status/info':         { dark: '#4A90D9', light: '#4A90D9' },
  'status/success-subtle':{ dark: 'rgba(61,158,107,0.12)', light: 'rgba(61,158,107,0.12)' },
  'status/warning-subtle':{ dark: 'rgba(232,168,56,0.12)', light: 'rgba(232,168,56,0.12)' },
  'status/error-subtle':  { dark: 'rgba(217,95,95,0.12)',  light: 'rgba(217,95,95,0.12)' },
  'status/info-subtle':   { dark: 'rgba(74,144,217,0.12)', light: 'rgba(74,144,217,0.12)' },
};

const SPACING_TOKENS = {
  'spacing/1': 4,  'spacing/2': 8,   'spacing/3': 12,  'spacing/4': 16,
  'spacing/5': 20, 'spacing/6': 24,  'spacing/8': 32,  'spacing/10': 40,
  'spacing/12': 48,'spacing/16': 64, 'spacing/20': 80,
};

const RADIUS_TOKENS = {
  'radius/none': 0, 'radius/sm': 3, 'radius/md': 6,
  'radius/lg': 10, 'radius/xl': 16, 'radius/full': 9999,
};

// ── Text style definitions ────────────────────────────────────
const TEXT_STYLES = [
  // Display (Cormorant Garamond)
  { name: 'display/5xl', family: 'Cormorant Garamond', size: 96, weight: 300, lh: 1.0,  ls: -0.03, italic: false },
  { name: 'display/5xl italic', family: 'Cormorant Garamond', size: 96, weight: 300, lh: 1.0,  ls: -0.03, italic: true },
  { name: 'display/3xl', family: 'Cormorant Garamond', size: 48, weight: 300, lh: 1.1,  ls: -0.03, italic: false },
  { name: 'display/2xl', family: 'Cormorant Garamond', size: 32, weight: 300, lh: 1.2,  ls: -0.02, italic: false },
  // Body (Instrument Sans)
  { name: 'body/xl',    family: 'Instrument Sans', size: 24, weight: 400, lh: 1.6, ls: 0 },
  { name: 'body/xl 500',family: 'Instrument Sans', size: 24, weight: 500, lh: 1.6, ls: 0 },
  { name: 'body/lg',    family: 'Instrument Sans', size: 20, weight: 400, lh: 1.6, ls: 0 },
  { name: 'body/base',  family: 'Instrument Sans', size: 15, weight: 400, lh: 1.6, ls: 0 },
  { name: 'body/base 500', family: 'Instrument Sans', size: 15, weight: 500, lh: 1.6, ls: 0 },
  { name: 'body/sm',    family: 'Instrument Sans', size: 13, weight: 400, lh: 1.6, ls: 0 },
  { name: 'body/sm 500',family: 'Instrument Sans', size: 13, weight: 500, lh: 1.6, ls: 0 },
  { name: 'body/xs',    family: 'Instrument Sans', size: 11, weight: 400, lh: 1.6, ls: 0 },
  { name: 'label/xs',   family: 'Instrument Sans', size: 11, weight: 500, lh: 1.6, ls: 0.2 },
  // Mono (DM Mono)
  { name: 'mono/base',  family: 'DM Mono', size: 13, weight: 400, lh: 1.6, ls: 0 },
  { name: 'mono/sm',    family: 'DM Mono', size: 11, weight: 400, lh: 1.6, ls: 0 },
  { name: 'mono/xs',    family: 'DM Mono', size: 10, weight: 500, lh: 1.6, ls: 0.2 },
];

// ── Effect / shadow styles ────────────────────────────────────
const SHADOW_STYLES = [
  {
    name: 'elevation/sm',
    description: 'Tooltip, tag',
    effects: [{
      type: 'DROP_SHADOW', visible: true, blendMode: 'NORMAL',
      color: { r:0, g:0, b:0, a:0.40 },
      offset: { x:0, y:1 }, radius: 2, spread: 0,
    }],
  },
  {
    name: 'elevation/md',
    description: 'Card, popover',
    effects: [
      { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.50}, offset:{x:0,y:4},  radius:12, spread:0 },
      { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.30}, offset:{x:0,y:1},  radius:3,  spread:0 },
    ],
  },
  {
    name: 'elevation/lg',
    description: 'Modal, drawer',
    effects: [
      { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.60}, offset:{x:0,y:12}, radius:32, spread:0 },
      { type:'DROP_SHADOW', visible:true, blendMode:'NORMAL', color:{r:0,g:0,b:0,a:0.40}, offset:{x:0,y:4},  radius:8,  spread:0 },
    ],
  },
];

// ══════════════════════════════════════════════════════════════
//  PHASE 1 — Figma Variables
// ══════════════════════════════════════════════════════════════
async function syncVariables() {
  console.log('\n  ── Variables ─────────────────────────────────');

  // 1a. Fetch existing collections
  let existingCollections = {};
  try {
    const existing = await figma('GET', `/files/${FILE_ID}/variables/local`);
    if (existing.meta?.variableCollections) {
      for (const [id, col] of Object.entries(existing.meta.variableCollections)) {
        existingCollections[col.name] = { id, modes: col.modes };
      }
    }
    info(`Found ${Object.keys(existingCollections).length} existing collection(s)`);
  } catch(e) {
    info('No existing collections (or insufficient scope)');
  }

  const payload = { variableCollections: [], variableModes: [], variables: [], variableValues: [] };

  // ── Collection: Primitives (single mode) ─────────────────
  payload.variableCollections.push({
    action: 'CREATE', id: 'col_primitives', name: 'Primitives',
    initialModeId: 'mode_prim_default',
  });
  payload.variableModes.push({
    action: 'UPDATE', id: 'mode_prim_default',
    variableCollectionId: 'col_primitives', name: 'Default',
  });

  // Primitive color variables
  for (const [name, hex] of Object.entries(PRIMITIVE_COLORS)) {
    const varId = `var_prim_${name.replace(/\//g,'_').replace(/\./g,'_')}`;
    payload.variables.push({
      action: 'CREATE', id: varId, name,
      variableCollectionId: 'col_primitives',
      resolvedType: 'COLOR',
      description: '',
    });
    payload.variableValues.push({
      variableId: varId, modeId: 'mode_prim_default',
      value: hexToRgba(hex),
    });
  }

  // Primitive spacing variables
  for (const [name, px] of Object.entries(SPACING_TOKENS)) {
    const varId = `var_prim_${name.replace(/\//g,'_')}`;
    payload.variables.push({
      action: 'CREATE', id: varId, name,
      variableCollectionId: 'col_primitives',
      resolvedType: 'FLOAT',
      description: `${px}px`,
    });
    payload.variableValues.push({
      variableId: varId, modeId: 'mode_prim_default', value: px,
    });
  }

  // Primitive radius variables
  for (const [name, px] of Object.entries(RADIUS_TOKENS)) {
    const varId = `var_prim_${name.replace(/\//g,'_')}`;
    payload.variables.push({
      action: 'CREATE', id: varId, name,
      variableCollectionId: 'col_primitives',
      resolvedType: 'FLOAT',
      description: `${px}px`,
    });
    payload.variableValues.push({
      variableId: varId, modeId: 'mode_prim_default', value: px,
    });
  }

  ok(`Primitives: ${Object.keys(PRIMITIVE_COLORS).length} colors, ${Object.keys(SPACING_TOKENS).length} spacing, ${Object.keys(RADIUS_TOKENS).length} radius`);

  // ── Collection: Semantic (Dark + Light modes) ─────────────
  payload.variableCollections.push({
    action: 'CREATE', id: 'col_semantic', name: 'Semantic',
    initialModeId: 'mode_dark',
  });
  payload.variableModes.push(
    { action: 'UPDATE', id: 'mode_dark',  variableCollectionId: 'col_semantic', name: 'Dark' },
    { action: 'CREATE', id: 'mode_light', variableCollectionId: 'col_semantic', name: 'Light' },
  );

  for (const [name, modes] of Object.entries(SEMANTIC_COLORS)) {
    const varId = `var_sem_${name.replace(/\//g,'_').replace(/-/g,'_')}`;
    payload.variables.push({
      action: 'CREATE', id: varId, name,
      variableCollectionId: 'col_semantic',
      resolvedType: 'COLOR',
      scopes: ['ALL_FILLS', 'STROKE_COLOR', 'TEXT_FILL', 'EFFECT_COLOR'],
    });
    const darkRgba  = parseColor(modes.dark);
    const lightRgba = parseColor(modes.light);
    if (darkRgba)  payload.variableValues.push({ variableId: varId, modeId: 'mode_dark',  value: darkRgba  });
    if (lightRgba) payload.variableValues.push({ variableId: varId, modeId: 'mode_light', value: lightRgba });
  }

  ok(`Semantic: ${Object.keys(SEMANTIC_COLORS).length} color vars × 2 modes (Dark + Light)`);

  // ── POST variables payload ────────────────────────────────
  info(`Posting variables payload (${payload.variables.length} vars)...`);
  try {
    const result = await figma('POST', `/files/${FILE_ID}/variables`, payload);
    if (result.status === 'dry-run') {
      ok('Dry-run: variables payload logged');
    } else {
      ok(`Variables created — ${Object.keys(result.meta?.variables || {}).length} confirmed`);
    }
  } catch(e) {
    err(`Variables POST failed: ${e.message}`);
    console.error('  Tip: make sure your token has "File content" write access and the file is in a paid team/org for Variables API access.\n');
    throw e;
  }
}

// ══════════════════════════════════════════════════════════════
//  PHASE 2 — Figma Styles (text + color + effect)
// ══════════════════════════════════════════════════════════════
async function syncStyles() {
  console.log('\n  ── Styles ────────────────────────────────────');

  // 2a. Text styles
  info('Creating text styles...');
  let textOk = 0, textFail = 0;
  for (const style of TEXT_STYLES) {
    try {
      const payload = {
        name: style.name,
        style_type: 'TEXT',
        description: `${style.family} · ${style.size}px · ${style.weight}w`,
        style_properties: {
          fontFamily:       style.family,
          fontSize:         style.size,
          fontWeight:       style.weight,
          lineHeightPx:     Math.round(style.size * style.lh),
          lineHeightUnit:   'PIXELS',
          letterSpacing:    style.ls,
          letterSpacingUnit:'PERCENT',
          italic:           style.italic || false,
          textDecoration:   'NONE',
          textCase:         'ORIGINAL',
        },
      };
      await figma('POST', `/files/${FILE_ID}/styles`, payload);
      textOk++;
    } catch(e) {
      warn(`Text style "${style.name}": ${e.message}`);
      textFail++;
    }
  }
  ok(`Text styles: ${textOk} created${textFail ? `, ${textFail} failed` : ''}`);

  // 2b. Color styles
  info('Creating color styles...');
  const COLOR_STYLE_ENTRIES = [
    ['color/brand', '#C9A84C', 'Primary brand — Aurum gold'],
    ['color/brand-hover', '#E2BE55'],
    ['color/bg/base',     '#0A0806', 'Page background'],
    ['color/bg/surface',  '#141008'],
    ['color/bg/elevated', '#1E1610'],
    ['color/text/primary','#F5EDD8'],
    ['color/text/secondary','#A0897A'],
    ['color/text/muted','#5A4A3D'],
    ['color/border/subtle','#2A2018'],
    ['color/border/default','#3A2E25'],
    ['color/border/strong','#5A4A3D'],
    ['color/status/success','#3D9E6B'],
    ['color/status/warning','#E8A838'],
    ['color/status/error','#D95F5F'],
    ['color/status/info','#4A90D9'],
  ];
  let colorOk = 0, colorFail = 0;
  for (const [name, hex, desc] of COLOR_STYLE_ENTRIES) {
    try {
      await figma('POST', `/files/${FILE_ID}/styles`, {
        name, style_type: 'FILL', description: desc || '',
        style_properties: { fills: [{ type:'SOLID', color: hexToRgba(hex), opacity: 1 }] },
      });
      colorOk++;
    } catch(e) {
      warn(`Color style "${name}": ${e.message}`);
      colorFail++;
    }
  }
  ok(`Color styles: ${colorOk} created${colorFail ? `, ${colorFail} failed` : ''}`);

  // 2c. Effect styles
  info('Creating effect (shadow) styles...');
  let effectOk = 0, effectFail = 0;
  for (const s of SHADOW_STYLES) {
    try {
      await figma('POST', `/files/${FILE_ID}/styles`, {
        name: s.name, style_type: 'EFFECT', description: s.description,
        style_properties: { effects: s.effects },
      });
      effectOk++;
    } catch(e) {
      warn(`Effect style "${s.name}": ${e.message}`);
      effectFail++;
    }
  }
  ok(`Effect styles: ${effectOk} created${effectFail ? `, ${effectFail} failed` : ''}`);
}

// ══════════════════════════════════════════════════════════════
//  Main
// ══════════════════════════════════════════════════════════════
async function main() {
  console.log('\n  ┌─────────────────────────────────────────┐');
  console.log('  │   Aurum Design System → Figma Sync      │');
  console.log('  └─────────────────────────────────────────┘');

  if (DRY_RUN) warn('DRY RUN — no API calls will be made\n');
  info(`File: ${FILE_ID}`);
  info(`Mode: ${ONLY}`);

  const runTokens = ONLY === 'all' || ONLY === 'tokens';
  const runStyles = ONLY === 'all' || ONLY === 'styles';

  try {
    if (runTokens) await syncVariables();
    if (runStyles) await syncStyles();

    console.log('\n  ─────────────────────────────────────────');
    console.log('  ✓  Sync complete!\n');

    if (!DRY_RUN) {
      console.log('  Next steps in Figma:');
      console.log('  1. Open your file — Variables panel should show Primitives + Semantic');
      console.log('  2. Open Assets panel → Local styles for text, color, and shadow styles');
      console.log('  3. Install Token Studio plugin and connect to aurum-tokens.json for alias verification');
      console.log('  4. Start building components referencing semantic variables\n');
    }
  } catch(e) {
    err(`Sync failed: ${e.message}`);
    process.exit(1);
  }
}

main();
