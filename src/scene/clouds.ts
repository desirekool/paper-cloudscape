import * as THREE from "three";
import type { AppState, CloudLayerConfig, CloudUserData } from "../types";
import { rand } from "../utils/random";
import { createCloudTexture } from "../textures/cloud";
import { createTreeTexture } from "../textures/tree";
import { WORLD_LENGTH, SCROLL_START, SCROLL_END } from "../state";
import { cvPhases } from "../cv-data";

export const cloudLayers: CloudLayerConfig[] = [
  { z: -45, count: 18, scaleRange: [3, 5], yRange: [8, 22], parallax: 0.35, wobble: 0.008 },
  { z: -25, count: 14, scaleRange: [4, 6], yRange: [5, 24], parallax: 0.6, wobble: 0.012 },
  { z: -5, count: 12, scaleRange: [5, 7], yRange: [2, 26], parallax: 0.85, wobble: 0.016 },
  { z: 12, count: 7, scaleRange: [6, 9], yRange: [0, 28], parallax: 1.1, wobble: 0.02 },
];

export function prebuildTexturePools(state: AppState): void {
  for (let i = 0; i < 18; i++)
    state.cloudTextures.push(createCloudTexture(i * 13.7 + 2.1));
  for (let i = 0; i < 8; i++)
    state.treeTextures.push(createTreeTexture(i * 17.3 + 5.7));
}

export function prebuildCloudLayers(scene: THREE.Scene, state: AppState): void {
  const xRange = WORLD_LENGTH + 100;
  const worldMin = -xRange / 2;
  const worldMax = xRange / 2;
  const phaseCenters = cvPhases.map(
    (p) => SCROLL_START + p.scrollTarget * WORLD_LENGTH,
  );
  const buffer = 32;

  const gaps: { start: number; end: number }[] = [];
  if (phaseCenters[0] - buffer > worldMin)
    gaps.push({ start: worldMin, end: phaseCenters[0] - buffer });
  for (let pi = 0; pi < phaseCenters.length - 1; pi++) {
    const gs = phaseCenters[pi] + buffer;
    const ge = phaseCenters[pi + 1] - buffer;
    if (ge > gs) gaps.push({ start: gs, end: ge });
  }
  if (phaseCenters[phaseCenters.length - 1] + buffer < worldMax)
    gaps.push({
      start: phaseCenters[phaseCenters.length - 1] + buffer,
      end: worldMax,
    });

  const gapWeights = gaps.map((g) => g.end - g.start);
  const totalGapWeight = gapWeights.reduce((a, b) => a + b, 0);

  cloudLayers.forEach((layer, layerIdx) => {
    for (let i = 0; i < layer.count; i++) {
      const seed = layerIdx * 1000 + i * 7 + 13;
      const textureIdx = Math.floor(rand(seed) * state.cloudTextures.length);
      const texture = state.cloudTextures[textureIdx];
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const scale = Math.max(
        0.5,
        layer.scaleRange[0] +
          rand(seed + 0.5) * (layer.scaleRange[1] - layer.scaleRange[0]),
      );
      const geometry = new THREE.PlaneGeometry(scale * 2, scale);
      const cloud = new THREE.Mesh(geometry, material);

      let x =
        (i / layer.count) * xRange -
        xRange / 2 +
        (rand(seed + 1) - 0.5) * ((xRange / layer.count) * 0.6);

      let nearPhase = false;
      for (const pc of phaseCenters) {
        if (Math.abs(x - pc) < buffer) {
          nearPhase = true;
          break;
        }
      }
      if (nearPhase && gaps.length > 0) {
        let r = rand(seed + 99) * totalGapWeight;
        let chosen = gaps[0];
        for (let gi = 0; gi < gaps.length; gi++) {
          r -= gapWeights[gi];
          if (r <= 0) {
            chosen = gaps[gi];
            break;
          }
        }
        x = chosen.start + rand(seed + 100) * (chosen.end - chosen.start);
      }
      const y =
        layer.yRange[0] +
        rand(seed + 2) * (layer.yRange[1] - layer.yRange[0]);

      cloud.position.set(x, y, layer.z);
      cloud.userData = {
        baseX: x,
        baseY: y,
        baseZ: layer.z,
        wobbleSpeed: 0.2 + rand(seed + 3) * 0.3,
        wobblePhase: rand(seed + 4) * Math.PI * 2,
        wobbleAmount: layer.wobble,
        parallaxFactor: layer.parallax,
        scale: scale,
        isCloud: true,
      } satisfies CloudUserData;
      scene.add(cloud);
      state.clouds.push(cloud);
    }
  });

  const extraTargets = [
    { phase: "Kontakt", offset: 38 },
    { phase: "PROFIL", offset: 38 },
    { phase: "Studium", offset: -38 },
    { phase: "SPRACHEN & SONSTIGES", offset: 38 },
  ];
  for (const t of extraTargets) {
    const phase = cvPhases.find((p) => p.phase === t.phase);
    if (!phase) continue;
    const cx = SCROLL_START + phase.scrollTarget * WORLD_LENGTH;
    const seed = 7777 + cx;
    const textureIdx = Math.floor(rand(seed) * state.cloudTextures.length);
    const texture = state.cloudTextures[textureIdx];
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const scale = 3 + rand(seed + 0.5) * 3;
    const geometry = new THREE.PlaneGeometry(scale * 2, scale);
    const cloud = new THREE.Mesh(geometry, material);
    const x = cx + t.offset;
    const y = 12 + rand(seed + 2) * 10;
    cloud.position.set(x, y, 12);
    cloud.userData = {
      baseX: x,
      baseY: y,
      baseZ: 12,
      wobbleSpeed: 0.2 + rand(seed + 3) * 0.3,
      wobblePhase: rand(seed + 4) * Math.PI * 2,
      wobbleAmount: 0.016,
      parallaxFactor: 1.1,
      scale,
      isCloud: true,
    };
    scene.add(cloud);
    state.clouds.push(cloud);
  }
}

export function spawnCloudAtMouse(
  clientX: number,
  clientY: number,
  state: AppState,
): void {
  const { camera, scene } = state;
  if (!camera || !scene) return;

  state.mouseVec.x = (clientX / window.innerWidth) * 2 - 1;
  state.mouseVec.y = -((clientY / window.innerHeight) * 2 - 1);
  state.raycaster.setFromCamera(state.mouseVec, camera);

  const dz = state.raycaster.ray.direction.z;
  if (Math.abs(dz) < 0.0001) return;
  const distance = -state.raycaster.ray.origin.z / dz;
  const pos = state.raycaster.ray.origin
    .clone()
    .add(state.raycaster.ray.direction.clone().multiplyScalar(distance));

  pos.x = Math.max(SCROLL_START - 30, Math.min(SCROLL_END + 30, pos.x));
  pos.y = Math.max(2, Math.min(32, pos.y));
  pos.z = 5;

  const texture =
    state.cloudTextures[Math.floor(Math.random() * state.cloudTextures.length)];
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const scale = Math.max(4, 9 + Math.random() * 6);
  const geometry = new THREE.PlaneGeometry(scale * 2, scale);
  const cloud = new THREE.Mesh(geometry, material);
  cloud.position.copy(pos);
  cloud.userData = {
    baseX: pos.x,
    baseY: pos.y,
    baseZ: pos.z,
    wobbleSpeed: 0.2 + Math.random() * 0.3,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleAmount: 0.018,
    parallaxFactor: 1.0,
    scale: scale,
    isCloud: true,
    spawnTime: state.clock.getElapsedTime(),
  } satisfies CloudUserData;
  scene.add(cloud);
  state.clouds.push(cloud);

  if (state.clouds.length > 120) {
    let oldestIdx = -1, oldestTime = Infinity;
    for (let i = 0; i < state.clouds.length; i++) {
      const st = (state.clouds[i].userData as CloudUserData).spawnTime;
      if (st !== undefined && st < oldestTime) {
        oldestTime = st;
        oldestIdx = i;
      }
    }
    if (oldestIdx < 0) oldestIdx = 0;
    const old = state.clouds[oldestIdx];
    scene.remove(old);
    old.geometry.dispose();
    if (Array.isArray(old.material)) {
      old.material.forEach((m) => m.dispose());
    } else {
      old.material.dispose();
    }
    state.clouds.splice(oldestIdx, 1);
  }
}
