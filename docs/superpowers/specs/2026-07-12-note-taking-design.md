# Note-Taking via Click-to-Edit Clouds

## Goal
Replace blank cloud spawning with on-canvas note editor: click creates editable cloud, type to write, Enter to save.

## Flow
1. Click canvas → editable note cloud appears at click position with blinking caret
2. User types text — real-time rendered on cloud texture
3. Enter or click-away → note finalizes; Escape → discard
4. Note persists as read-only labeled cloud; visually distinct from CV clouds

## Files

### Create: `src/note-editor.ts`
- `spawnNoteCloud(clientX, clientY, state)` — creates cloud with empty labeled texture, sets `userData.editing=true`
- `handleNoteKeydown(e, state)` — processes printable chars, Backspace, Delete, Enter, Escape, Shift+Enter; returns `true` if key consumed
- `finalizeNote(cloud, state)` — redraws texture as final labeled cloud or removes if empty
- `redrawNoteTexture(cloud)` — renders text + caret blink to canvas, calls `texture.needsUpdate=true`
- `isNoteEditing(state)` — checks if any cloud has `userData.editing===true`

### Modify: `src/input/mouse.ts`
- Click without drag → call `spawnNoteCloud` instead of `spawnCloudAtMouse`
- Click-away while editing → finalize current note first

### Modify: `src/input/keyboard.ts`
- When `isNoteEditing`, route keystrokes to `handleNoteKeydown` before scroll handling

### Modify: `src/systems/animation.ts`
- In render loop, redraw editing cloud texture each frame (caret blink toggle ~500ms)

### Modify: `src/types.ts`
- `CloudUserData` gains: `editing?: boolean`, `noteText?: string`, `caretPos?: number`, `caretVisible?: boolean`

### Modify: `src/main.ts`
- Import and wire new functions

## Key Handling Priority
1. Slider drag → handled by mouse.ts (unchanged)
2. Note editing → printable chars, Backspace, Delete → note-editor
3. Scroll keys (A/D/arrows) → always pass through
4. Escape → discard note
5. Enter → finalize note
6. Shift+Enter → newline

## Visual Differentiation
- Note clouds: warmer paper tint `#faf3e6` (CV clouds: `#f0e8d4`)
- Small pushpin icon in top-right corner

## Constraints
- One note editing at a time
- Notes read-only after finalize
- 120 cloud limit (shared pool with decorative clouds)
- Cloud scale: starts 9, grows to max 14 as text wraps
