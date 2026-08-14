export function checkFormatting(text: string): number {
  let score = 100;
  if (!text.includes("Experience")) score -= 20;
  if (!text.includes("Education")) score -= 20;
  if (!text.includes("Skills")) score -= 20;
  if (!text.includes("Projects")) score -= 20;
  return score;
}
