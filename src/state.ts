import * as THREE from "three";
import type { AppState, HillLayerConfig } from "./types";

export const WORLD_LENGTH = 600;
export const SCROLL_START = -WORLD_LENGTH / 2;
export const SCROLL_END = WORLD_LENGTH / 2;
export const SLIDER_MAX = 0.84;

export const hillLayers: HillLayerConfig[] = [
  { z: -55, color: "#4a5d3a", fiber: [70, 80, 55], y: -10, parallax: 0.4 },
  { z: -30, color: "#6b8355", fiber: [95, 115, 75], y: -12, parallax: 0.65 },
  { z: 8, color: "#8a9d6a", fiber: [110, 125, 85], y: -8, parallax: 0.95 },
];

export function createAppState(): AppState {
  return {
    scrollProgress: 0,
    targetScrollProgress: 0,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartScroll: 0,
    dragMoved: false,
    clouds: [],
    hills: [],
    trees: [],
    birds: [],
    scene: null,
    camera: null,
    renderer: null,
    sun: null,
    moon: null,
    stars: null,
    starMaterial: null,
    particleSystem: null,
    particlePhases: null,
    particleCount: 150,
    cloudTextures: [],
    treeTextures: [],
    raycaster: new THREE.Raycaster(),
    mouseVec: new THREE.Vector2(),
    clock: new THREE.Clock(),
    worldLength: WORLD_LENGTH,
    hillLayers,
  };
}
