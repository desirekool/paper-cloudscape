import * as THREE from "three";
import type { AppState, HillUserData } from "../types";
import { createHillTexture } from "../textures/hill";
import { WORLD_LENGTH, hillLayers } from "../state";

export function createHillLayers(scene: THREE.Scene, state: AppState): void {
  hillLayers.forEach((layer, idx) => {
    const texture = createHillTexture(idx * 10 + 5, layer.color, layer.fiber);
    const segments = 8;
    const segmentWidth = (WORLD_LENGTH + 200) / segments;
    for (let i = 0; i < segments; i++) {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      });
      const geometry = new THREE.PlaneGeometry(segmentWidth + 50, 60);
      const hill = new THREE.Mesh(geometry, material);
      const x =
        (i - segments / 2) * segmentWidth +
        (idx === 1 ? 30 : idx === 2 ? -20 : 0);
      hill.position.set(x, layer.y, layer.z);
      hill.userData = { baseX: x, parallaxFactor: layer.parallax } satisfies HillUserData;
      scene.add(hill);
      state.hills.push(hill);
    }
  });
}

export function getHillSurfaceY(worldX: number, layerIdx: number): number {
  const layer = hillLayers[layerIdx];
  const seed = layerIdx * 10 + 5;
  const segWidth = (WORLD_LENGTH + 200) / 8 + 50;
  const texX =
    (((((worldX + segWidth * 4) % segWidth) + segWidth) % segWidth) /
      segWidth) *
    2048;
  const baseY =
    145 +
    Math.sin(texX * 0.0028 + seed) * 7 +
    Math.sin(texX * 0.007 + seed * 1.5) * 3;
  return layer.y + 30 - (baseY / 256) * 60;
}
