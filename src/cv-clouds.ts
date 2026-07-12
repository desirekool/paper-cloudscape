import * as THREE from "three";
import type { AppState } from "./types";
import { cvPhases } from "./cv-data";
import type { CvCard } from "./cv-data";
import { createLabeledCloudTexture } from "./textures/cloud";
import { rand } from "./utils/random";
import { WORLD_LENGTH, SCROLL_START } from "./state";

interface CloudPos {
  x: number;
  y: number;
}

function computeGridPositions(
  cards: CvCard[],
  centerX: number,
  baseY: number,
): CloudPos[] {
  const positions: CloudPos[] = new Array(cards.length);

  const groups: { sub: string; indices: number[] }[] = [];
  for (let i = 0; i < cards.length; i++) {
    const sub = cards[i].subsection || "";
    if (groups.length === 0 || groups[groups.length - 1].sub !== sub) {
      groups.push({ sub, indices: [] });
    }
    groups[groups.length - 1].indices.push(i);
  }

  const blockSpacingX = 32;
  const cardRowStep = 6;
  const cardColOff = 4;
  const rowSpacingY = 16;
  const maxCols = 3;

  for (let gi = 0; gi < groups.length; gi++) {
    const blockRow = Math.floor(gi / maxCols);
    const blockCol = gi % maxCols;
    const firstRowCols = Math.min(maxCols, groups.length);
    const rowCenter =
      centerX + (blockCol - (firstRowCols - 1) / 2) * blockSpacingX;
    const blockBY = baseY - blockRow * rowSpacingY;
    const indices = groups[gi].indices;

    for (let ci = 0; ci < indices.length; ci++) {
      positions[indices[ci]] = {
        x: rowCenter + (ci % 2 === 0 ? -cardColOff : cardColOff),
        y: blockBY - ci * cardRowStep,
      };
    }
  }

  return positions;
}

function computeCloudScale(heading: string, text: string): number {
  const headingLines = heading ? 1 : 0;
  const textLines = text.split("\n").reduce((count, para) => {
    return count + Math.max(1, Math.ceil(para.length / 50));
  }, 0);
  const totalLines = headingLines + textLines;

  if (totalLines <= 1) return 8;
  if (totalLines <= 2) return 9;
  if (totalLines <= 4) return 10;
  if (totalLines <= 7) return 11;
  return 12;
}

function computeStackPositions(
  cards: CvCard[],
  centerX: number,
  baseY: number,
): CloudPos[] {
  const n = cards.length;
  const positions: CloudPos[] = [];
  const hStep = 24;
  const vStep = 8;

  if (n === 1) {
    positions.push({ x: centerX, y: baseY });
    return positions;
  }

  const rows = n <= 2 ? 1 : n <= 4 ? 2 : 3;
  const cols = 2;

  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const cardsInRow = row === rows - 1 ? n - (rows - 1) * cols : cols;
    const rowWidth = (cardsInRow - 1) * hStep;
    const x = centerX - rowWidth / 2 + col * hStep;
    const y = baseY + (rows - 1) * vStep / 2 - row * vStep + (col === 0 ? 2 : -2);

    positions.push({ x, y });
  }
  return positions;
}

export function createCvClouds(scene: THREE.Scene, state: AppState): void {
  const baseY = 2;

  cvPhases.forEach((phase, phaseIdx) => {
    const centerX = SCROLL_START + phase.scrollTarget * WORLD_LENGTH;
    const isGrid = phase.phase.startsWith("BERUFS");
    const isKontakt = phase.phase === "Kontakt";
    const gridBaseY = 10;
    const positions = isGrid
      ? computeGridPositions(phase.cards, centerX, gridBaseY)
      : computeStackPositions(phase.cards, centerX, baseY);

    const xShift = phase.phase === "PROFIL" ? 14 : 0;

    phase.cards.forEach((card, cardIdx) => {
      const seed = 9000 + phaseIdx * 1000 + cardIdx * 137;
      let h = card.heading ?? "";
      let t = card.text ?? "";
      if (card.bullets && card.bullets.length > 0) {
        t = card.bullets.map((b) => "\u2022 " + b).join("\n");
      }
      if (!t && h.includes("\n")) {
        t = h;
        h = "";
      }
      const texture = createLabeledCloudTexture(
        seed,
        h,
        t,
        isKontakt,
      );
      const scale = computeCloudScale(h, t);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const geometry = new THREE.PlaneGeometry(scale * 2, scale);
      const cloud = new THREE.Mesh(geometry, material);

      const pos = positions[cardIdx];
      cloud.position.set(pos.x + xShift, pos.y, 10);
      cloud.userData = {
        baseX: pos.x + xShift,
        baseY: pos.y,
        baseZ: 10,
      wobbleSpeed: 0.2 + rand(seed + 42) * 0.3,
      wobblePhase: rand(seed + 99) * Math.PI * 2,
      wobbleAmount: 0.012,
        parallaxFactor: 0.9,
        scale: scale,
        isCloud: true,
        isCvCloud: true,
        phaseIndex: phaseIdx,
        cardIndex: cardIdx,
      };
      scene.add(cloud);
      state.clouds.push(cloud);
    });
  });
}
