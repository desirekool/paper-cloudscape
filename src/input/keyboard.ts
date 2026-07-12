import type { AppState } from "../types";

export function setupKeyboard(state: AppState): void {
  window.addEventListener("keydown", (e) => {
    const step = 0.04;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
      state.targetScrollProgress -= step;
    else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
      state.targetScrollProgress += step;
    state.targetScrollProgress = Math.max(0, Math.min(1, state.targetScrollProgress));
  });
}
