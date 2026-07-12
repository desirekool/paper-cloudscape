# Fix: Section name updates at midpoint between sections

## Problem
The "Time" stat in the stats card lags behind what's visible. Phase name only changes when `scrollProgress` crosses a section's `scrollTarget` (e.g., PROFIL only shows at 0.12), but the user already *sees* PROFIL clouds entering at ~0.07.

## Fix
Change section name lookup from threshold-based to nearest-distance-based in `src/systems/sky.ts` line 27:

**Replace:**
```ts
const cvPhase = [...cvPhases].reverse().find(p => progress >= p.scrollTarget);
```

**With:**
```ts
const cvPhase = cvPhases.reduce((best, p) =>
  Math.abs(progress - p.scrollTarget) < Math.abs(progress - best.scrollTarget) ? p : best
);
```

## Effect
Name switches at midpoint between consecutive scrollTargets — when next section's clouds are visually dominant.
