import * as THREE from "three";
import { rand } from "../utils/random";
import { addPaperGrain, createUnifiedBlob } from "./paper";

export function createTreeTexture(seed: number): THREE.CanvasTexture {
  const W = 256, H = 256;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const r = (n: number) => rand(seed * 100 + n);

  const trunkW = Math.max(14, 22 + r(1) * 8);
  const trunkH = Math.max(55, 85 + r(2) * 20);
  const trunkX = 128 - trunkW / 2;
  const trunkY = 256 - trunkH - 10;

  ctx.save();
  ctx.shadowColor = "rgba(30, 25, 15, 0.2)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.fillStyle = "#7a5535";
  ctx.fillRect(trunkX, trunkY + 3, trunkW, trunkH - 3);
  ctx.restore();

  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.fillRect(trunkX + trunkW * 0.6, trunkY + 3, trunkW * 0.4, trunkH - 3);

  ctx.strokeStyle = "rgba(60, 40, 20, 0.25)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const lx = trunkX + 3 + r(i + 10) * (trunkW - 6);
    ctx.beginPath();
    ctx.moveTo(lx, trunkY + 5);
    ctx.lineTo(lx + (r(i + 20) - 0.5) * 4, trunkY + trunkH - 5);
    ctx.stroke();
  }

  const greens = ["#5a7a3a", "#6b8a42", "#4a6a2c", "#7a9a52"];
  const green = greens[Math.floor(r(3) * greens.length)];
  const fSize = 1 + r(4) * 0.3;

  const foliage = [
    { x: 128, y: 92, r: Math.max(20, 58 * fSize) },
    { x: 85, y: 112, r: Math.max(15, 44 * fSize) },
    { x: 171, y: 112, r: Math.max(15, 44 * fSize) },
    { x: 102, y: 70, r: Math.max(15, 40 * fSize) },
    { x: 154, y: 70, r: Math.max(15, 40 * fSize) },
    { x: 128, y: 50, r: Math.max(12, 36 * fSize) },
  ];

  const blurred = createUnifiedBlob(canvas, ctx, foliage, 12, 30);

  ctx.save();
  ctx.shadowColor = "rgba(25, 35, 15, 0.3)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.drawImage(blurred, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = green;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  addPaperGrain(ctx, W, H, 0.7, [90, 85, 70]);

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  const shadowGrad = ctx.createLinearGradient(0, 40, 0, 160);
  shadowGrad.addColorStop(0, "rgba(0,0,0,0)");
  shadowGrad.addColorStop(0.6, "rgba(20, 35, 10, 0.05)");
  shadowGrad.addColorStop(1, "rgba(20, 35, 10, 0.3)");
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  const highlightGrad = ctx.createRadialGradient(110, 60, 10, 110, 60, 100);
  highlightGrad.addColorStop(0, "rgba(220, 245, 180, 0.25)");
  highlightGrad.addColorStop(1, "rgba(220, 245, 180, 0)");
  ctx.fillStyle = highlightGrad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}
