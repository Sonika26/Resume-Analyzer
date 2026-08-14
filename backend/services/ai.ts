import OpenAI from "openai";
import { calculateATS } from "./ats";
import { checkGrammar } from "./grammar";
import { checkFormatting } from "./formatting";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeResumeAI(resumeText: string): Promise<any> {
  try {
    // Try OpenAI first
    const prompt = `
      Analyze this resume text and return a JSON object with:
      - atsScore (0–100)
      - grammarScore (0–100)
      - formattingScore (0–100)
      - overallScore (0–100, average of the above)
      - suggestions (array of 5 strings)

      Resume:
      ${resumeText}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const output = response.choices[0].message.content;
    return JSON.parse(output);

  } catch (error) {
    console.error("OpenAI failed, switching to fallbacks:", error);

    // Fallback logic
    const atsScore = calculateATS(resumeText);
    const grammarScore = await checkGrammar(resumeText);
    const formattingScore = checkFormatting(resumeText);
    const overallScore = Math.round((atsScore + grammarScore + formattingScore) / 3);

    // Basic suggestions (could use Hugging Face/Cohere here)
    const suggestions = [
      "Add a summary section",
      "Use consistent bullet points",
      "Highlight measurable achievements",
      "Reduce passive voice",
      "Add relevant technical skills"
    ];

    return { atsScore, grammarScore, formattingScore, overallScore, suggestions, source: "Fallback" };
  }
}
