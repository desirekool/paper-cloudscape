import * as THREE from "three";

export interface CloudLayerConfig {
  z: number;
  count: number;
  scaleRange: [number, number];
  yRange: [number, number];
  parallax: number;
  wobble: number;
}

export interface HillLayerConfig {
  z: number;
  color: string;
  fiber: [number, number, number];
  y: number;
  parallax: number;
}

export interface SkyPalette {
  top: [number, number, number];
  bottom: [number, number, number];
  name: string;
  iconColor: string;
  warmLight: number;
}

export interface CloudUserData {
  baseX: number;
  baseY: number;
  baseZ: number;
  wobbleSpeed: number;
  wobblePhase: number;
  wobbleAmount: number;
  parallaxFactor: number;
  scale: number;
  isCloud: true;
  spawnTime?: number;
  editing?: boolean;
  noteText?: string;
  caretPos?: number;
  caretVisible?: boolean;
}

export interface HillUserData {
  baseX: number;
  parallaxFactor: number;
}

export interface TreeUserData {
  baseX: number;
  parallaxFactor: number;
  baseY: number;
  wobblePhase: number;
}

export interface BirdUserData {
  speed: number;
  direction: number;
  wingPhase: number;
  baseY: number;
  bobPhase: number;
}

export interface AppState {
  scrollProgress: number;
  targetScrollProgress: number;
  mouseX: number;
  mouseY: number;
  targetMouseX: number;
  targetMouseY: number;
  isDragging: boolean;
  dragStartX: number;
  dragStartScroll: number;
  dragMoved: boolean;
  clouds: THREE.Mesh[];
  hills: THREE.Mesh[];
  trees: THREE.Mesh[];
  birds: THREE.Mesh[];
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  sun: THREE.Mesh | null;
  moon: THREE.Mesh | null;
  stars: THREE.Points | null;
  starMaterial: THREE.PointsMaterial | null;
  particleSystem: THREE.Points | null;
  particlePhases: Float32Array | null;
  particleCount: number;
  cloudTextures: THREE.CanvasTexture[];
  treeTextures: THREE.CanvasTexture[];
  raycaster: THREE.Raycaster;
  mouseVec: THREE.Vector2;
  clock: THREE.Clock;
  worldLength: number;
  hillLayers: HillLayerConfig[];
}
