export function addPaperGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity = 1,
  fiberColor: [number, number, number] = [130, 110, 80],
): void {
  ctx.save();
  ctx.globalCompositeOperation = "source-atop";

  ctx.strokeStyle = `rgba(${fiberColor[0]}, ${fiberColor[1]}, ${fiberColor[2]}, ${0.05 * intensity})`;
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 350 * intensity; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const length = 4 + Math.random() * 18;
    const angle = Math.random() * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }

  ctx.strokeStyle = `rgba(${fiberColor[0] - 20}, ${fiberColor[1] - 20}, ${fiberColor[2] - 20}, ${0.04 * intensity})`;
  ctx.lineWidth = 0.3;
  for (let i = 0; i < 600 * intensity; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const length = 1 + Math.random() * 5;
    const angle = Math.random() * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 10) {
      const noise = (Math.random() - 0.5) * 22 * intensity;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
  }
  ctx.putImageData(imageData, 0, 0);

  ctx.globalAlpha = 0.04 * intensity;
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.max(10, 20 + Math.random() * 60);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(
      0,
      `rgba(${fiberColor[0] - 30}, ${fiberColor[1] - 30}, ${fiberColor[2] - 30}, 0.3)`,
    );
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

export function createUnifiedBlob(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  bumps: { x: number; y: number; r: number }[],
  blurAmount: number,
  threshold: number,
): HTMLCanvasElement {
  const off = document.createElement("canvas");
  off.width = canvas.width;
  off.height = canvas.height;
  const offCtx = off.getContext("2d")!;

  offCtx.fillStyle = "white";
  bumps.forEach((b) => {
    offCtx.beginPath();
    offCtx.arc(b.x, b.y, Math.max(1, b.r), 0, Math.PI * 2);
    offCtx.fill();
  });

  const blurred = document.createElement("canvas");
  blurred.width = canvas.width;
  blurred.height = canvas.height;
  const blCtx = blurred.getContext("2d")!;
  blCtx.filter = `blur(${blurAmount}px)`;
  blCtx.drawImage(off, 0, 0);
  blCtx.filter = "none";

  const imgData = blCtx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] > threshold) {
      d[i] = 255;
      d[i + 1] = 255;
      d[i + 2] = 255;
      d[i + 3] = 255;
    } else {
      d[i] = 0;
      d[i + 1] = 0;
      d[i + 2] = 0;
      d[i + 3] = 0;
    }
  }
  blCtx.putImageData(imgData, 0, 0);
  return blurred;
}
