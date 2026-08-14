export function calculateATS(text: string): number {
  const keywords = ["JavaScript", "React", "Node", "Python", "SQL", "AWS"]; // example set
  const words = text.split(/\W+/);
  const matched = keywords.filter(k => words.includes(k));
  return Math.round((matched.length / keywords.length) * 100);
}
