import fetch from "node-fetch";

export async function checkGrammar(text: string): Promise<number> {
  const res = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `text=${encodeURIComponent(text)}&language=en-US`
  });
  const data = await res.json();
  const errors = data.matches.length;
  const words = text.split(/\s+/).length;
  return Math.max(0, 100 - (errors / words) * 100);
}

