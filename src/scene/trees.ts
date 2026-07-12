import * as THREE from "three";
import type { AppState, TreeUserData } from "../types";
import { rand } from "../utils/random";
import { WORLD_LENGTH, hillLayers } from "../state";
import { getHillSurfaceY } from "./hills";

const TRUNK_BASE_OFFSET = 0.461;
const layerScaleRanges: [number, number][] = [
  [3.5, 5.0],
  [4.5, 6.5],
  [5.5, 8.0],
];

export function placeTreeClusters(scene: THREE.Scene, state: AppState): void {
  const treeData: { x: number; layerIdx: number; scale: number; texIdx: number; seed: number }[] = [];
  const numClusters = 22;

  for (let c = 0; c < numClusters; c++) {
    const clusterX =
      rand(c * 50 + 1) * (WORLD_LENGTH - 40) - (WORLD_LENGTH - 40) / 2;
    const clusterSize = 1 + Math.floor(rand(c * 70 + 2) * 4);
    const layerIdx = Math.floor(rand(c * 90 + 3) * 3);
    const sr = layerScaleRanges[layerIdx];

    for (let j = 0; j < clusterSize; j++) {
      const offset = (rand(c * 1000 + j * 13 + 5) - 0.5) * 35;
      const x = clusterX + offset;
      if (x < -WORLD_LENGTH / 2 - 10 || x > WORLD_LENGTH / 2 + 10) continue;
      const scale = sr[0] + rand(c * 1000 + j * 17 + 7) * (sr[1] - sr[0]);
      const texIdx = Math.floor(
        rand(c * 2000 + j * 19 + 9) * state.treeTextures.length,
      );
      treeData.push({ x, layerIdx, scale, texIdx, seed: c * 10000 + j * 17 + 3 });
    }
  }

  treeData.forEach((td) => {
    const texture = state.treeTextures[td.texIdx];
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(td.scale, td.scale);
    const tree = new THREE.Mesh(geometry, material);

    const surfaceY = getHillSurfaceY(td.x, td.layerIdx);
    const treeY = surfaceY + TRUNK_BASE_OFFSET * td.scale;

    const layer = hillLayers[td.layerIdx];
    tree.position.set(td.x, treeY, layer.z + 1);
    tree.userData = {
      baseX: td.x,
      parallaxFactor: layer.parallax,
      baseY: treeY,
      wobblePhase: rand(td.seed + 3) * Math.PI * 2,
    } satisfies TreeUserData;
    scene.add(tree);
    state.trees.push(tree);
  });
}
