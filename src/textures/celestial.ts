import * as THREE from "three";
import { addPaperGrain } from "./paper";

export function createSunTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const cx = 256, cy = 256;

  const glow = ctx.createRadialGradient(cx, cy, 80, cx, cy, 256);
  glow.addColorStop(0, "rgba(255, 215, 130, 0.4)");
  glow.addColorStop(0.5, "rgba(255, 200, 100, 0.15)");
  glow.addColorStop(1, "rgba(255, 200, 100, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 512, 512);

  ctx.save();
  ctx.shadowColor = "rgba(180, 120, 40, 0.3)";
  ctx.shadowBlur = 10;
  const sunGrad = ctx.createRadialGradient(cx - 35, cy - 35, 20, cx, cy, 130);
  sunGrad.addColorStop(0, "#fff5c8");
  sunGrad.addColorStop(0.6, "#f5cf6a");
  sunGrad.addColorStop(1, "#e0a838");
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 128, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 128, 0, Math.PI * 2);
  ctx.clip();
  addPaperGrain(ctx, 512, 512, 0.7, [180, 140, 70]);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  const edgeGrad = ctx.createRadialGradient(cx, cy, 100, cx, cy, 128);
  edgeGrad.addColorStop(0, "rgba(0,0,0,0)");
  edgeGrad.addColorStop(1, "rgba(160, 100, 30, 0.15)");
  ctx.fillStyle = edgeGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 128, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  return new THREE.CanvasTexture(canvas);
}

export function createMoonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const cx = 256, cy = 256;

  const glow = ctx.createRadialGradient(cx, cy, 60, cx, cy, 256);
  glow.addColorStop(0, "rgba(220, 225, 240, 0.35)");
  glow.addColorStop(0.5, "rgba(200, 210, 230, 0.12)");
  glow.addColorStop(1, "rgba(200, 210, 230, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 512, 512);

  ctx.save();
  ctx.shadowColor = "rgba(100, 110, 140, 0.25)";
  ctx.shadowBlur = 8;
  const moonGrad = ctx.createRadialGradient(cx - 30, cy - 30, 20, cx, cy, 118);
  moonGrad.addColorStop(0, "#fdfaf2");
  moonGrad.addColorStop(0.7, "#e8e4d8");
  moonGrad.addColorStop(1, "#c8c4b8");
  ctx.fillStyle = moonGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 116, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 116, 0, Math.PI * 2);
  ctx.clip();
  addPaperGrain(ctx, 512, 512, 0.6, [160, 155, 140]);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  const craters = [
    { x: cx - 35, y: cy - 25, r: 14 },
    { x: cx + 38, y: cy + 28, r: 18 },
    { x: cx - 48, y: cy + 35, r: 10 },
    { x: cx + 18, y: cy - 48, r: 9 },
    { x: cx + 55, y: cy - 15, r: 7 },
    { x: cx - 20, y: cy + 55, r: 8 },
  ];
  craters.forEach((c) => {
    const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
    grad.addColorStop(0, "rgba(140, 135, 125, 0.25)");
    grad.addColorStop(0.7, "rgba(140, 135, 125, 0.1)");
    grad.addColorStop(1, "rgba(140, 135, 125, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  const edgeGrad = ctx.createRadialGradient(cx, cy, 90, cx, cy, 116);
  edgeGrad.addColorStop(0, "rgba(0,0,0,0)");
  edgeGrad.addColorStop(1, "rgba(100, 95, 85, 0.18)");
  ctx.fillStyle = edgeGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 116, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  return new THREE.CanvasTexture(canvas);
}

export function createBirdTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  ctx.strokeStyle = "#4a4035";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(18, 38);
  ctx.quadraticCurveTo(38, 14, 64, 32);
  ctx.quadraticCurveTo(90, 14, 110, 38);
  ctx.stroke();
  addPaperGrain(ctx, 128, 64, 0.5, [80, 70, 55]);
  return new THREE.CanvasTexture(canvas);
}
