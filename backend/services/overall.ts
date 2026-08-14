export function calculateOverall(ats: number, grammar: number, formatting: number): number {
  return Math.round((ats + grammar + formatting) / 3);
}
