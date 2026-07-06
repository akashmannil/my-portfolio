// Shared viewport heuristics for the 3D stage. Kept framework-free so the
// frame loop, Canvas config and particle field can all agree on one breakpoint.

// Tablet + phone: below this the stage switches to centered "ambient" framing.
export const COMPACT_MAX_WIDTH = 1024;

export const isCompact = () =>
  typeof window !== 'undefined' && window.innerWidth < COMPACT_MAX_WIDTH;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
