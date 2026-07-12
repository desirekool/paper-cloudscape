import type { AppState } from "./types";
import { SLIDER_MAX } from "./state";

export function updateHUD(state: AppState): void {
  const distance = Math.round(state.scrollProgress * 100);
  document.getElementById("distance")!.textContent = String(distance);
  const sliderProgress = Math.min(state.scrollProgress / SLIDER_MAX, 1);
  document.getElementById("progress-fill")!.style.width =
    sliderProgress * 100 + "%";
  document.getElementById("progress-marker")!.style.left =
    sliderProgress * 100 + "%";
}

export function updateCloudCount(state: AppState): void {
  document.getElementById("cloud-count")!.textContent = String(state.clouds.length);
}

export function showToast(msg: string): void {
  const toast = document.getElementById("toast")!;
  document.getElementById("toast-text")!.textContent = msg;
  toast.classList.add("show");
  clearTimeout((toast as any).timeout);
  (toast as any).timeout = setTimeout(() => toast.classList.remove("show"), 1800);
}

export function showClickHint(): void {
  setTimeout(() => {
    document.getElementById("click-hint")!.classList.add("show");
    setTimeout(
      () => document.getElementById("click-hint")!.classList.remove("show"),
      3500,
    );
  }, 2000);
}
