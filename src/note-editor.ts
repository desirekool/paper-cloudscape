import * as THREE from "three";
import type { AppState, CloudUserData } from "./types";
import { createLabeledCloudTexture } from "./textures/cloud";

let caretBlink = true;
let lastBlinkTime = 0;

export function isNoteEditing(state: AppState): boolean {
  return state.clouds.some(
    (c) => (c.userData as CloudUserData).editing === true,
  );
}

export function getEditingCloud(state: AppState): THREE.Mesh | null {
  return (
    state.clouds.find((c) => (c.userData as CloudUserData).editing === true) ??
    null
  );
}

export function spawnNoteCloud(
  clientX: number,
  clientY: number,
  state: AppState,
): void {
  if (isNoteEditing(state)) return;

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

  pos.x = Math.max(-330, Math.min(330, pos.x));
  pos.y = Math.max(2, Math.min(28, pos.y));
  pos.z = 5;

  const text = "";
  const texture = createLabeledCloudTexture(
    Math.random() * 10000,
    "",
    text,
    false,
    true,
  );

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const scale = 9;
  const geometry = new THREE.PlaneGeometry(scale * 2, scale);
  const cloud = new THREE.Mesh(geometry, material);
  cloud.position.copy(pos);
  cloud.userData = {
    baseX: pos.x,
    baseY: pos.y,
    baseZ: pos.z,
    wobbleSpeed: 0.2 + Math.random() * 0.3,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleAmount: 0.014,
    parallaxFactor: 1.0,
    scale: scale,
    isCloud: true,
    spawnTime: state.clock.getElapsedTime(),
    editing: true,
    noteText: "",
    caretPos: 0,
    caretVisible: true,
  } satisfies CloudUserData;
  scene.add(cloud);
  state.clouds.push(cloud);
}

export function finalizeNote(cloud: THREE.Mesh, state: AppState): void {
  const ud = cloud.userData as CloudUserData;
  if (!ud.editing) return;

  ud.editing = false;
  ud.caretVisible = false;

  if (!ud.noteText || ud.noteText.trim() === "") {
    state.clouds.splice(state.clouds.indexOf(cloud), 1);
    state.scene?.remove(cloud);
    cloud.geometry.dispose();
    (cloud.material as THREE.MeshBasicMaterial).dispose();
    return;
  }

  const texture = createLabeledCloudTexture(
    Math.random() * 10000,
    "",
    ud.noteText ?? "",
    false,
    true,
  );

  const scale = computeNoteScale(ud.noteText ?? "");
  cloud.geometry.dispose();
  cloud.geometry = new THREE.PlaneGeometry(scale * 2, scale);
  (cloud.material as THREE.MeshBasicMaterial).dispose();
  cloud.material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  ud.scale = scale;
}

function computeNoteScale(text: string): number {
  const lines = text.split("\n");
  const totalLines = lines.reduce(
    (count, para) => count + Math.max(1, Math.ceil(para.length / 45)),
    0,
  );
  if (totalLines <= 1) return 9;
  if (totalLines <= 2) return 10;
  if (totalLines <= 4) return 12;
  if (totalLines <= 7) return 13;
  return 14;
}

export function handleNoteKeydown(
  e: KeyboardEvent,
  state: AppState,
): boolean {
  const cloud = getEditingCloud(state);
  if (!cloud) return false;

  const ud = cloud.userData as CloudUserData;

  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    finalizeNote(cloud, state);
    return true;
  }

  if (e.key === "Escape") {
    e.preventDefault();
    ud.editing = false;
    state.clouds.splice(state.clouds.indexOf(cloud), 1);
    state.scene?.remove(cloud);
    cloud.geometry.dispose();
    (cloud.material as THREE.MeshBasicMaterial).dispose();
    return true;
  }

  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    return false;
  }

  if (e.key === "Backspace") {
    e.preventDefault();
    ud.noteText = (ud.noteText ?? "").slice(0, -1);
    return true;
  }

  if (e.key === "Delete") {
    e.preventDefault();
    return true;
  }

  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    if (e.key === "Enter" && e.shiftKey) {
      ud.noteText = (ud.noteText ?? "") + "\n";
    } else {
      ud.noteText = (ud.noteText ?? "") + e.key;
    }
    return true;
  }

  return false;
}

export function redrawNoteTexture(
  cloud: THREE.Mesh,
  time: number,
): void {
  const ud = cloud.userData as CloudUserData;
  if (!ud.editing) return;

  if (time - lastBlinkTime > 0.5) {
    caretBlink = !caretBlink;
    lastBlinkTime = time;
  }

  const displayText = (ud.noteText ?? "") + (caretBlink ? "|" : "");

  const texture = createLabeledCloudTexture(
    0,
    "",
    displayText,
    false,
    true,
  );

  const mat = cloud.material as THREE.MeshBasicMaterial;
  mat.map?.dispose();
  mat.map = texture;
  mat.needsUpdate = true;
}

export function tickNoteEditor(state: AppState, time: number): void {
  const cloud = getEditingCloud(state);
  if (!cloud) return;
  redrawNoteTexture(cloud, time);
}
