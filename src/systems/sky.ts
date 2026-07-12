import * as THREE from "three";
import type { AppState, SkyPalette } from "../types";
import { lerpColor, rgbStr } from "../utils/math";
import { cvPhases } from "../cv-data";

const skyPalettes: SkyPalette[] = [
  { top: [225, 170, 140], bottom: [245, 220, 195], name: "Dawn", iconColor: "#d4a574", warmLight: 0.6 },
  { top: [175, 195, 215], bottom: [230, 230, 220], name: "Morning", iconColor: "#e8c878", warmLight: 0.3 },
  { top: [140, 178, 210], bottom: [210, 222, 225], name: "Midday", iconColor: "#e8c878", warmLight: 0.15 },
  { top: [218, 135, 105], bottom: [200, 155, 130], name: "Sunset", iconColor: "#c97a5a", warmLight: 0.7 },
  { top: [128, 98, 140], bottom: [165, 118, 130], name: "Dusk", iconColor: "#9a7aaa", warmLight: 0.4 },
  { top: [28, 32, 58], bottom: [58, 52, 82], name: "Night", iconColor: "#c8c4b8", warmLight: 0.05 },
];

export function updateSky(progress: number, state: AppState): void {
  const t = progress * (skyPalettes.length - 1);
  const idx = Math.floor(t);
  const frac = t - idx;
  const p1 = skyPalettes[idx];
  const p2 = skyPalettes[Math.min(idx + 1, skyPalettes.length - 1)];

  const top = lerpColor(p1.top, p2.top, frac);
  const bottom = lerpColor(p1.bottom, p2.bottom, frac);
  document.body.style.background = `linear-gradient(to bottom, ${rgbStr(top)} 0%, ${rgbStr(bottom)} 100%)`;

  const palette = skyPalettes[Math.min(Math.round(t), skyPalettes.length - 1)];
  const cvPhase = cvPhases.reduce((closest, phase) =>
    Math.abs(progress - phase.scrollTarget) < Math.abs(progress - closest.scrollTarget) ? phase : closest
  );
  document.getElementById("time-name")!.textContent = cvPhase.phase;
  document.getElementById("time-icon")!.style.background = palette.iconColor;
  document.getElementById("warm-light")!.style.opacity = String(palette.warmLight);

  document.querySelectorAll(".progress-labels span").forEach((el, i) => {
    el.classList.toggle("active", cvPhases[i] === cvPhase);
  });

  if (state.sun && state.camera) {
    state.sun.position.x = state.camera.position.x + (progress - 0.4) * 200;
    state.sun.position.y = Math.sin(progress * Math.PI) * 30 + 5;
    (state.sun.material as THREE.MeshBasicMaterial).opacity =
      progress > 0.72 ? Math.max(0, 1 - (progress - 0.72) / 0.13) : 1;
  }

  if (state.moon && state.camera) {
    const moonT = Math.max(0, (progress - 0.72) / 0.28);
    state.moon.position.x = state.camera.position.x + (moonT - 0.5) * 120;
    state.moon.position.y = Math.max(5, Math.sin(moonT * Math.PI) * 25 + 8);
    (state.moon.material as THREE.MeshBasicMaterial).opacity =
      progress > 0.72 ? Math.min(1, (progress - 0.72) / 0.15) : 0;
  }

  if (state.starMaterial) {
    state.starMaterial.opacity =
      progress > 0.7 ? Math.min(0.8, (progress - 0.7) * 3) : 0;
  }

  if (state.particleSystem) {
    const pc = lerpColor([245, 236, 214], [200, 210, 230], progress);
    (state.particleSystem.material as THREE.PointsMaterial).color.setRGB(
      pc[0] / 255, pc[1] / 255, pc[2] / 255,
    );
  }
}
