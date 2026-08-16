import fetch from "node-fetch";

interface LTResponse {
  matches: { message: string }[];
}

export const checkGrammar = async (text: string) => {
  const res = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `text=${encodeURIComponent(text)}&language=en-US`
  });

 const data = (await res.json()) as LTResponse;


  const errors = data.matches.length;
  const words = text.split(/\s+/).length;

  return Math.max(0, 100 - (errors / words) * 100);
};
