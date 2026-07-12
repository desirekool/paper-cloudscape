import type { AppState } from "../types";
import { SLIDER_MAX } from "../state";
import { spawnNoteCloud, finalizeNote, getEditingCloud } from "../note-editor";

export function setupMouse(state: AppState): void {
  const canvas = document.getElementById("bg-canvas") as HTMLCanvasElement;
  const track = document.getElementById("progress-track") as HTMLElement;
  let sliderDragging = false;

  window.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      state.targetScrollProgress += e.deltaY * 0.0006;
      state.targetScrollProgress = Math.max(0, Math.min(1, state.targetScrollProgress));
    },
    { passive: false },
  );

  window.addEventListener("mousemove", (e) => {
    state.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    state.targetMouseY = -((e.clientY / window.innerHeight) * 2 - 1);

    if (sliderDragging) {
      const rect = track.getBoundingClientRect();
      const frac = (e.clientX - rect.left) / rect.width;
      state.targetScrollProgress = Math.max(0, Math.min(1, frac * SLIDER_MAX));
      state.dragMoved = true;
    } else if (state.isDragging) {
      const dx = (e.clientX - state.dragStartX) / window.innerWidth;
      if (Math.abs(e.clientX - state.dragStartX) > 5) state.dragMoved = true;
      state.targetScrollProgress = state.dragStartScroll - dx * 0.6;
      state.targetScrollProgress = Math.max(0, Math.min(1, state.targetScrollProgress));
    }
  });

  track.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    sliderDragging = true;
    state.dragMoved = true;
    const rect = track.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    state.targetScrollProgress = Math.max(0, Math.min(1, frac * SLIDER_MAX));
  });

  canvas.addEventListener("mousedown", (e) => {
    if (sliderDragging) return;

    const editingCloud = getEditingCloud(state);
    if (editingCloud && e.target !== canvas) {
      finalizeNote(editingCloud, state);
      return;
    }
    if (editingCloud) {
      finalizeNote(editingCloud, state);
    }

    state.isDragging = true;
    state.dragMoved = false;
    state.dragStartX = e.clientX;
    state.dragStartScroll = state.targetScrollProgress;
    document.body.classList.add("dragging");
  });

  window.addEventListener("mouseup", (e) => {
    if (sliderDragging) {
      sliderDragging = false;
      state.dragMoved = false;
      return;
    }
    if (state.isDragging) {
      if (!state.dragMoved) spawnNoteCloud(e.clientX, e.clientY, state);
      state.isDragging = false;
      document.body.classList.remove("dragging");
    }
  });
}
