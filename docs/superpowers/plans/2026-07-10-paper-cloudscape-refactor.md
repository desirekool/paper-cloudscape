# Paper Cloudscape Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor monolithic Three.js diorama into modular Vite + TypeScript project with production build

**Architecture:** Single-responsibility modules under `src/` — textures, scene objects, input, systems, state — composed in `main.ts`. Vite handles dev server (HMR) and production bundling.

**Tech Stack:** Vite 5, TypeScript 5, Three.js 0.160

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Modify: `index.html`

- [ ] Create `package.json`
- [ ] Create `tsconfig.json`
- [ ] Create `vite.config.ts`
- [ ] Update `index.html` (remove inline style+script, add CSS link + TS entry)
- [ ] Run `npm install`
- [ ] Verify `npx vite` starts

### Task 2: Core Utilities

**Files:**
- Create: `src/types.ts`
- Create: `src/state.ts`
- Create: `src/utils/random.ts`
- Create: `src/utils/math.ts`

- [ ] Create all files with extracted types, state, helper functions

### Task 3: Texture Modules

**Files:**
- Create: `src/style.css`
- Create: `src/textures/paper.ts`
- Create: `src/textures/cloud.ts`
- Create: `src/textures/hill.ts`
- Create: `src/textures/tree.ts`
- Create: `src/textures/celestial.ts`

- [ ] Extract all texture generation functions into separate modules

### Task 4: Scene Creation

**Files:**
- Create: `src/scene/setup.ts`
- Create: `src/scene/clouds.ts`
- Create: `src/scene/hills.ts`
- Create: `src/scene/trees.ts`
- Create: `src/scene/celestial.ts`
- Create: `src/scene/birds.ts`
- Create: `src/scene/particles.ts`

- [ ] Extract all scene object creation into separate modules

### Task 5: Input Handlers

**Files:**
- Create: `src/input/keyboard.ts`
- Create: `src/input/mouse.ts`
- Create: `src/input/touch.ts`

- [ ] Extract input handling into separate modules

### Task 6: Systems & HUD

**Files:**
- Create: `src/systems/sky.ts`
- Create: `src/systems/animation.ts`
- Create: `src/hud.ts`

- [ ] Extract sky system, animation loop, HUD into modules

### Task 7: main.ts Entry Point

**Files:**
- Create: `src/main.ts`

- [ ] Wire all modules together in entry point

### Task 8: Production Build

- [ ] Run `npx vite build`
- [ ] Verify `dist/` output
