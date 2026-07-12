import type { AppState } from "../types";
import { handleNoteKeydown, isNoteEditing } from "../note-editor";

export function setupKeyboard(state: AppState): void {
  window.addEventListener("keydown", (e) => {
    if (isNoteEditing(state) && handleNoteKeydown(e, state)) {
      return;
    }

    if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
      state.targetScrollProgress -= 0.04;
    } else if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
      state.targetScrollProgress += 0.04;
    }
    state.targetScrollProgress = Math.max(0, Math.min(1, state.targetScrollProgress));
  });
}
