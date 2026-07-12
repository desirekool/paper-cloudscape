import * as THREE from "three";
import { rand } from "../utils/random";
import { addPaperGrain, createUnifiedBlob } from "./paper";

export function createCloudTexture(seed: number): THREE.CanvasTexture {
  const W = 512, H = 256;
  const r = (n: number) => rand(seed * 100 + n);

  const bumps: { x: number; y: number; r: number }[] = [];
  const numBumps = 5 + Math.floor(r(1) * 3);
  const startX = 90, endX = 422;

  for (let i = 0; i < numBumps; i++) {
    const t = numBumps === 1 ? 0.5 : i / (numBumps - 1);
    bumps.push({
      x: startX + (endX - startX) * t,
      y: 148 + (r(i + 10) - 0.5) * 18,
      r: Math.max(20, 58 + r(i + 20) * 18),
    });
  }
  bumps.push({
    x: 256 + (r(30) - 0.5) * 40,
    y: 108 + r(40) * 12,
    r: Math.max(30, 68 + r(50) * 12),
  });
  if (r(60) > 0.3)
    bumps.push({
      x: 256 + (r(70) - 0.5) * 80,
      y: 78 + r(80) * 10,
      r: Math.max(15, 38 + r(90) * 12),
    });
  if (r(100) > 0.5)
    bumps.push({
      x: 65 + r(101) * 25,
      y: 158 + r(102) * 12,
      r: Math.max(15, 32 + r(103) * 10),
    });
  if (r(200) > 0.5)
    bumps.push({
      x: 420 + r(201) * 25,
      y: 158 + r(202) * 12,
      r: Math.max(15, 32 + r(203) * 10),
    });

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const blurred = createUnifiedBlob(canvas, ctx, bumps, 16, 38);

  ctx.save();
  ctx.shadowColor = "rgba(35, 45, 60, 0.25)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 7;
  ctx.drawImage(blurred, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = "#f0e8d4";
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  addPaperGrain(ctx, W, H, 1.0, [140, 120, 85]);

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  const shadowGrad = ctx.createLinearGradient(0, 80, 0, 230);
  shadowGrad.addColorStop(0, "rgba(90, 110, 140, 0)");
  shadowGrad.addColorStop(0.5, "rgba(90, 110, 140, 0.06)");
  shadowGrad.addColorStop(1, "rgba(70, 90, 125, 0.22)");
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  const highlightGrad = ctx.createLinearGradient(0, 50, 0, 170);
  highlightGrad.addColorStop(0, "rgba(255, 240, 200, 0.2)");
  highlightGrad.addColorStop(1, "rgba(255, 240, 200, 0)");
  ctx.fillStyle = highlightGrad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  addPaperGrain(ctx, W, H, 0.3, [140, 120, 85]);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? current + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(" ");
    let current = "";
    for (const word of words) {
      const test = current ? current + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    lines.push("");
  }
  if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

function drawIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: "li" | "gh",
  size: number,
): number {
  const s = size;
  ctx.save();
  if (type === "li") {
    ctx.fillStyle = "#0A66C2";
    ctx.beginPath();
    const r = 2;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + s - r, y);
    ctx.arcTo(x + s, y, x + s, y + r, r);
    ctx.lineTo(x + s, y + s - r);
    ctx.arcTo(x + s, y + s, x + s - r, y + s, r);
    ctx.lineTo(x + r, y + s);
    ctx.arcTo(x, y + s, x, y + s - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${s * 0.5}px "Inter", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("in", x + s / 2, y + s / 2);
  } else {
    ctx.fillStyle = "#24292e";
    ctx.beginPath();
    ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${s * 0.45}px "Inter", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GH", x + s / 2, y + s / 2);
  }
  ctx.restore();
  return s + 5;
}

export function createLabeledCloudTexture(
  seed: number,
  heading: string,
  body: string,
  uniformFont?: boolean,
): THREE.CanvasTexture {
  const W = 512, H = 256;
  const r = (n: number) => rand(seed * 100 + n);
  const bulletsMode = body.startsWith("\u2022");

  const bumps: { x: number; y: number; r: number }[] = [];
  const numBumps = 5 + Math.floor(r(1) * 3);
  const startX = 90, endX = 422;

  for (let i = 0; i < numBumps; i++) {
    const t = numBumps === 1 ? 0.5 : i / (numBumps - 1);
    bumps.push({
      x: startX + (endX - startX) * t,
      y: 148 + (r(i + 10) - 0.5) * 18,
      r: Math.max(20, 58 + r(i + 20) * 18),
    });
  }
  bumps.push({
    x: 256 + (r(30) - 0.5) * 40,
    y: 108 + r(40) * 12,
    r: Math.max(30, 68 + r(50) * 12),
  });
  if (r(60) > 0.3)
    bumps.push({
      x: 256 + (r(70) - 0.5) * 80,
      y: 78 + r(80) * 10,
      r: Math.max(15, 38 + r(90) * 12),
    });
  if (r(100) > 0.5)
    bumps.push({
      x: 65 + r(101) * 25,
      y: 158 + r(102) * 12,
      r: Math.max(15, 32 + r(103) * 10),
    });
  if (r(200) > 0.5)
    bumps.push({
      x: 420 + r(201) * 25,
      y: 158 + r(202) * 12,
      r: Math.max(15, 32 + r(203) * 10),
    });

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const blurred = createUnifiedBlob(canvas, ctx, bumps, 16, 38);

  ctx.save();
  ctx.shadowColor = "rgba(35, 45, 60, 0.25)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 7;
  ctx.drawImage(blurred, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = "#f0e8d4";
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  addPaperGrain(ctx, W, H, 0.7, [140, 120, 85]);

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  const shadowGrad = ctx.createLinearGradient(0, 80, 0, 230);
  shadowGrad.addColorStop(0, "rgba(90, 110, 140, 0)");
  shadowGrad.addColorStop(0.5, "rgba(90, 110, 140, 0.06)");
  shadowGrad.addColorStop(1, "rgba(70, 90, 125, 0.22)");
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  const highlightGrad = ctx.createLinearGradient(0, 50, 0, 170);
  highlightGrad.addColorStop(0, "rgba(255, 240, 200, 0.2)");
  highlightGrad.addColorStop(1, "rgba(255, 240, 200, 0)");
  ctx.fillStyle = highlightGrad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  addPaperGrain(ctx, W, H, 0.3, [140, 120, 85]);

  ctx.save();
  ctx.globalCompositeOperation = "source-atop";

  const areaX = 256;
  const maxTextW = 400;

  const headingFont = uniformFont
    ? "500 13px 'Inter', sans-serif"
    : "bold 15px 'Fraunces', serif";
  const bodyFont = uniformFont
    ? "13px 'Inter', sans-serif"
    : "11px 'Inter', sans-serif";
  const headingLH = uniformFont ? 18 : 17;
  const bodyLH = uniformFont ? 18 : 15;
  const headingGap = uniformFont ? 3 : 2;

  ctx.font = headingFont;
  const headingLines = wrapText(ctx, heading, maxTextW, headingLH);

  ctx.font = bodyFont;
  const bodyLines = wrapLines(ctx, body, maxTextW);

  let totalH = 0;
  if (headingLines.length > 0) {
    totalH += headingLines.length * headingLH + headingGap;
  }
  let pendingCount: "li" | "gh" | null = null;
  for (const line of bodyLines) {
    if (line === "") {
      totalH += 6;
      continue;
    }
    if (uniformFont && line === "LinkedIn:") {
      pendingCount = "li";
    } else if (uniformFont && line === "GitHub:") {
      pendingCount = "gh";
    } else if (pendingCount) {
      totalH += bodyLH;
      pendingCount = null;
    } else if (uniformFont && line.startsWith("LinkedIn: ")) {
      totalH += bodyLH;
    } else if (uniformFont && line.startsWith("GitHub: ")) {
      totalH += bodyLH;
    } else {
      totalH += bodyLH;
    }
  }

  let areaY = Math.max(28, (H - totalH) / 2) + (bulletsMode ? 14 : 0);

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = headingFont;
  ctx.fillStyle = "#1a1410";
  ctx.shadowColor = "rgba(255, 250, 240, 0.25)";
  ctx.shadowBlur = 1;
  ctx.shadowOffsetY = 1;
  for (const line of headingLines) {
    ctx.fillText(line, areaX - maxTextW / 2, areaY);
    areaY += headingLH;
  }
  if (headingLines.length > 0) {
    areaY += headingGap;
  }

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.font = bodyFont;
  ctx.fillStyle = "#231c14";
  ctx.textAlign = "left";

  if (bulletsMode) {
    const pad = 10;
    const textW = Math.ceil(maxTextW);
    const textH = Math.ceil(totalH);
    const tc = document.createElement("canvas");
    tc.width = textW + pad * 2;
    tc.height = textH + pad * 2;
    const tx = tc.getContext("2d")!;
    tx.font = bodyFont;
    tx.fillStyle = "#231c14";
    tx.textAlign = "left";
    tx.textBaseline = "top";
    let ty = pad;
    for (const line of bodyLines) {
      if (line === "") { ty += 6; continue; }
      tx.fillText(line, pad, ty);
      ty += bodyLH;
    }

    const safeY = 52;
    const safeH = H - safeY - 20 - 5;
    const scale = Math.min(1, safeH / tc.height);
    const drawW = tc.width * scale;
    const drawH = tc.height * scale;
    const drawX = areaX - drawW / 2;
    const drawY = safeY + (safeH - drawH) / 2 + 7;
    ctx.drawImage(tc, drawX, drawY, drawW, drawH);
  } else {
  let pendingIcon: "li" | "gh" | null = null;
  for (let li = 0; li < bodyLines.length; li++) {
    const line = bodyLines[li];
    if (line === "") {
      areaY += 6;
      continue;
    }
    if (areaY > 220) break;
    const baseX = areaX - maxTextW / 2;

    if (uniformFont && line === "LinkedIn:") {
      pendingIcon = "li";
    } else if (uniformFont && line.startsWith("LinkedIn: ")) {
      const iconW = drawIcon(ctx, baseX, areaY + (bodyLH - 14) / 2, "li", 14);
      ctx.fillText(line.slice(10), baseX + iconW, areaY);
      areaY += bodyLH;
    } else if (uniformFont && line === "GitHub:") {
      pendingIcon = "gh";
    } else if (uniformFont && line.startsWith("GitHub: ")) {
      const iconW = drawIcon(ctx, baseX, areaY + (bodyLH - 14) / 2, "gh", 14);
      ctx.fillText(line.slice(8), baseX + iconW, areaY);
      areaY += bodyLH;
    } else if (pendingIcon) {
      const iconW = drawIcon(ctx, baseX, areaY + (bodyLH - 14) / 2, pendingIcon, 14);
      ctx.fillText(line, baseX + iconW, areaY);
      pendingIcon = null;
      areaY += bodyLH;
    } else {
      ctx.fillText(line, baseX, areaY);
      areaY += bodyLH;
    }
  }
  }

  ctx.restore();

  addPaperGrain(ctx, W, H, 0.3, [140, 120, 85]);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}
