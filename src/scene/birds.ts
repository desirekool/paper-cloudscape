import * as THREE from "three";
import type { AppState, BirdUserData } from "../types";
import { rand } from "../utils/random";
import { createBirdTexture } from "../textures/celestial";
import { WORLD_LENGTH } from "../state";

export function createBirdFlock(scene: THREE.Scene, state: AppState): void {
  const birdTexture = createBirdTexture();
  for (let i = 0; i < 8; i++) {
    const material = new THREE.MeshBasicMaterial({
      map: birdTexture,
      transparent: true,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(3, 1.5);
    const bird = new THREE.Mesh(geometry, material);
    bird.position.set(
      rand(i + 1) * WORLD_LENGTH - WORLD_LENGTH / 2,
      12 + rand(i + 2) * 12,
      -15 + rand(i + 3) * 25,
    );
    bird.userData = {
      speed: 0.8 + rand(i + 4) * 1.2,
      direction: rand(i + 5) > 0.5 ? 1 : -1,
      wingPhase: rand(i + 6) * Math.PI * 2,
      baseY: bird.position.y,
      bobPhase: rand(i + 7) * Math.PI * 2,
    } satisfies BirdUserData;
    scene.add(bird);
    state.birds.push(bird);
  }
}
