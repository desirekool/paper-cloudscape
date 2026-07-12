export function rand(seed: number): number {
  const x = Math.sin(seed * 999.123) * 10000;
  return x - Math.floor(x);
}
