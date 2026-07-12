import type { AppState } from "../types";
import { SLIDER_MAX } from "../state";

export function setupTouch(
  state: AppState,
  spawnCloud: (clientX: number, clientY: number) => void,
): void {
  const canvas = document.getElementById("bg-canvas") as HTMLCanvasElement;
  const track = document.getElementById("progress-track") as HTMLElement;
  let touchStartX = 0, touchStartScroll = 0, touchMoved = false;
  let sliderTouch = false;

  track.addEventListener("touchstart", (e) => {
    e.stopPropagation();
    sliderTouch = true;
    touchMoved = true;
    const rect = track.getBoundingClientRect();
    const frac = (e.touches[0].clientX - rect.left) / rect.width;
    state.targetScrollProgress = Math.max(0, Math.min(1, frac * SLIDER_MAX));
  });

  track.addEventListener(
    "touchmove",
    (e) => {
      if (!sliderTouch) return;
      e.preventDefault();
      const rect = track.getBoundingClientRect();
      const frac = (e.touches[0].clientX - rect.left) / rect.width;
      state.targetScrollProgress = Math.max(0, Math.min(1, frac * SLIDER_MAX));
    },
    { passive: false },
  );

  track.addEventListener("touchend", (e) => {
    sliderTouch = false;
  });

  canvas.addEventListener("touchstart", (e) => {
    if (sliderTouch) return;
    touchStartX = e.touches[0].clientX;
    touchStartScroll = state.targetScrollProgress;
    touchMoved = false;
  });

  canvas.addEventListener(
    "touchmove",
    (e) => {
      if (sliderTouch) return;
      e.preventDefault();
      const dx = (e.touches[0].clientX - touchStartX) / window.innerWidth;
      if (Math.abs(dx) > 0.01) touchMoved = true;
      state.targetScrollProgress = touchStartScroll - dx * 0.8;
      state.targetScrollProgress = Math.max(0, Math.min(1, state.targetScrollProgress));
    },
    { passive: false },
  );

  canvas.addEventListener("touchend", (e) => {
    if (sliderTouch) return;
    if (!touchMoved && e.changedTouches.length > 0) {
      spawnCloud(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  });
}
