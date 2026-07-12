import * as THREE from "three";
import type { AppState } from "../types";
import { rand } from "../utils/random";
import { createSunTexture, createMoonTexture } from "../textures/celestial";
import { WORLD_LENGTH } from "../state";

export function createCelestialObjects(scene: THREE.Scene, state: AppState): void {
  const sunTexture = createSunTexture();
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
    transparent: true,
    depthWrite: false,
    opacity: 1,
  });
  const sun = new THREE.Mesh(new THREE.PlaneGeometry(45, 45), sunMaterial);
  sun.position.set(0, 25, -70);
  scene.add(sun);
  state.sun = sun;

  const moonTexture = createMoonTexture();
  const moonMaterial = new THREE.MeshBasicMaterial({
    map: moonTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0,
  });
  const moon = new THREE.Mesh(new THREE.PlaneGeometry(38, 38), moonMaterial);
  moon.position.set(0, 20, -68);
  scene.add(moon);
  state.moon = moon;

  const starCount = 250;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] =
      rand(i + 1) * (WORLD_LENGTH + 200) - (WORLD_LENGTH + 200) / 2;
    starPositions[i * 3 + 1] = 5 + rand(i + 100) * 40;
    starPositions[i * 3 + 2] = -60 + rand(i + 200) * 10;
  }
  starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({
    color: 0xf0ece0,
    size: 0.7,
    transparent: true,
    opacity: 0,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  state.stars = stars;
  state.starMaterial = starMaterial;
}
