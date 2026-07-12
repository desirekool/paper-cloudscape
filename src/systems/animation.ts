import * as THREE from "three";
import type { AppState, CloudUserData, BirdUserData, TreeUserData, HillUserData } from "../types";
import { SCROLL_START, WORLD_LENGTH } from "../state";
import { updateSky } from "./sky";
import { tickNoteEditor } from "../note-editor";
import { updateHUD } from "../hud";

export function createAnimationLoop(state: AppState): void {
  const animate = () => {
    requestAnimationFrame(animate);

    const delta = Math.min(0.05, state.clock.getDelta());
    const time = state.clock.elapsedTime;

    state.scrollProgress += (state.targetScrollProgress - state.scrollProgress) * 0.08;
    state.mouseX += (state.targetMouseX - state.mouseX) * 0.05;
    state.mouseY += (state.targetMouseY - state.mouseY) * 0.05;

    if (state.camera) {
      state.camera.position.x = SCROLL_START + state.scrollProgress * WORLD_LENGTH;
      state.camera.position.y = state.mouseY * 2.5;
    }

    for (const cloud of state.clouds) {
      const ud = cloud.userData as CloudUserData;
      cloud.position.x =
        ud.baseX +
        state.mouseX * ud.parallaxFactor * 4 +
        Math.sin(time * 0.15 + ud.wobblePhase) * 0.3;
      cloud.position.y =
        ud.baseY +
        Math.sin(time * 0.3 + ud.wobblePhase) * 0.4 +
        state.mouseY * ud.parallaxFactor * 2;
      cloud.rotation.z =
        Math.sin(time * ud.wobbleSpeed + ud.wobblePhase) * ud.wobbleAmount;
      cloud.rotation.y =
        Math.sin(time * ud.wobbleSpeed * 0.7 + ud.wobblePhase) *
        ud.wobbleAmount *
        0.4;

      if (ud.spawnTime !== undefined) {
        const age = time - ud.spawnTime;
        if (age < 0.5) {
          const s = age / 0.5;
          const ease = 1 - Math.pow(1 - s, 3);
          cloud.scale.setScalar(ease);
        } else if (cloud.scale.x !== 1) {
          cloud.scale.setScalar(1);
        }
      }
    }

    if (state.sun) state.sun.rotation.z = Math.sin(time * 0.2) * 0.012;
    if (state.moon) state.moon.rotation.z = Math.sin(time * 0.15 + 1) * 0.01;

    for (const hill of state.hills) {
      const ud = hill.userData as HillUserData;
      hill.position.x = ud.baseX + state.mouseX * ud.parallaxFactor * 2;
    }

    for (const tree of state.trees) {
      const ud = tree.userData as TreeUserData;
      tree.position.x = ud.baseX + state.mouseX * ud.parallaxFactor * 2;
      tree.rotation.z = Math.sin(time * 0.4 + ud.wobblePhase) * 0.008;
    }

    for (const bird of state.birds) {
      const ud = bird.userData as BirdUserData;
      bird.position.x += ud.speed * ud.direction * delta * 3;
      if (bird.position.x > WORLD_LENGTH / 2 + 15)
        bird.position.x = -WORLD_LENGTH / 2 - 15;
      if (bird.position.x < -WORLD_LENGTH / 2 - 15)
        bird.position.x = WORLD_LENGTH / 2 + 15;
      bird.position.y = ud.baseY + Math.sin(time * 1.2 + ud.bobPhase) * 0.6;
      bird.scale.y = 1 + Math.sin(time * 6 + ud.wingPhase) * 0.35;
      bird.scale.x = ud.direction;
    }

    if (state.particleSystem && state.particlePhases) {
      const positions = (state.particleSystem.geometry as THREE.BufferGeometry).attributes.position.array as Float32Array;
      for (let i = 0; i < state.particleCount; i++) {
        positions[i * 3 + 1] += 0.012;
        if (positions[i * 3 + 1] > 35) positions[i * 3 + 1] = -10;
        positions[i * 3] += Math.sin(time * 0.4 + state.particlePhases[i]) * 0.006;
      }
      (state.particleSystem.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
    }

    if (state.starMaterial && state.starMaterial.opacity > 0) {
      state.starMaterial.size = 0.7 + Math.sin(time * 1.5) * 0.12;
    }

    updateSky(state.scrollProgress, state);
    updateHUD(state);
    tickNoteEditor(state, time);

    if (state.scene && state.camera && state.renderer) {
      state.renderer.render(state.scene, state.camera);
    }
  };

  animate();
}
