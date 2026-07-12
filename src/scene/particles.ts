import * as THREE from "three";
import type { AppState } from "../types";
import { rand } from "../utils/random";
import { WORLD_LENGTH } from "../state";

export function createDustMotes(scene: THREE.Scene, state: AppState): void {
  const particleCount = 150;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particlePhases = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] =
      rand(i + 500) * (WORLD_LENGTH + 100) - (WORLD_LENGTH + 100) / 2;
    particlePositions[i * 3 + 1] = -5 + rand(i + 600) * 45;
    particlePositions[i * 3 + 2] = -30 + rand(i + 700) * 40;
    particlePhases[i] = rand(i + 800) * Math.PI * 2;
  }
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3),
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xf5ecd6,
    size: 0.3,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);
  state.particleSystem = particleSystem;
  state.particlePhases = particlePhases;
  state.particleCount = particleCount;
}
