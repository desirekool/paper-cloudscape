import * as THREE from "three";
import { rand } from "../utils/random";
import { addPaperGrain } from "./paper";

export function createHillTexture(
  seed: number,
  fillColor: string,
  fiberColor: [number, number, number],
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  const r = (n: number) => rand(seed * 100 + n);

  const points: { x: number; y: number }[] = [];
  let x = 0;
  while (x < 2048) {
    const step = 30 + r(x * 0.1) * 15;
    x += step;
    const baseY =
      145 +
      Math.sin(x * 0.0028 + seed) * 7 +
      Math.sin(x * 0.007 + seed * 1.5) * 3;
    points.push({ x, y: baseY });
  }

  ctx.save();
  ctx.shadowColor = "rgba(30, 35, 30, 0.15)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = -2;
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(0, 256);
  ctx.lineTo(0, points[0].y);
  for (let i = 0; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
  ctx.lineTo(2048, 256);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  addPaperGrain(ctx, 2048, 256, 0.8, fiberColor);

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  ctx.strokeStyle = "rgba(255, 250, 230, 0.12)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, points[0].y + 1);
  for (let i = 0; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
  }
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  const grad = ctx.createLinearGradient(0, 100, 0, 256);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.12)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 256);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = `rgba(${fiberColor[0] - 40}, ${fiberColor[1] - 40}, ${fiberColor[2] - 30}, 0.2)`;
  for (let i = 0; i < 80; i++) {
    const px = r(i + 100) * 2000 + 24;
    const texX = px;
    const surfaceY =
      145 +
      Math.sin(texX * 0.0028 + seed) * 7 +
      Math.sin(texX * 0.007 + seed * 1.5) * 3;
    const py = surfaceY + 2 + r(i + 200) * 40;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px - 2, py - 5 - r(i + 300) * 3);
    ctx.lineTo(px, py - 7 - r(i + 400) * 4);
    ctx.lineTo(px + 2, py - 5 - r(i + 500) * 3);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}
