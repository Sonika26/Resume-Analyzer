import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });

import { GoogleGenAI } from "@google/genai";

import { calculateATS } from "./ats";
import { checkGrammar } from "./grammar";
import { checkFormatting } from "./formatting";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeResumeAI(
  resumeText: string
): Promise<any> {
  try {
    const prompt = `
Analyze the following resume.

Return ONLY a valid JSON object with exactly these fields:

{
  "atsScore": number,
  "grammarScore": number,
  "formattingScore": number,
  "overallScore": number,
  "suggestions": [
    "string",
    "string",
    "string",
    "string",
    "string"
  ]
}

Rules:

- atsScore must be between 0 and 100.
- grammarScore must be between 0 and 100.
- formattingScore must be between 0 and 100.
- overallScore must be the average of atsScore, grammarScore and formattingScore, rounded to the nearest integer.
- suggestions must contain exactly 5 useful resume improvement suggestions.
- Do not include markdown.
- Do not include code fences.
- Return valid JSON only.

Resume:

${resumeText}
`;

   const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
  contents: prompt,
});

    const output = response.text ?? "{}";

    // Remove accidental markdown code fences if Gemini adds them
    const cleanedOutput = output
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedOutput);

  } catch (error) {
    console.error("Gemini failed, switching to fallbacks:", error);

    // Existing fallback logic
    const atsScore = calculateATS(resumeText);

    const grammarScore = await checkGrammar(resumeText);

    const formattingScore = checkFormatting(resumeText);

    const overallScore = Math.round(
      (atsScore + grammarScore + formattingScore) / 3
    );

    const suggestions = [
      "Add a summary section",
      "Use consistent bullet points",
      "Highlight measurable achievements",
      "Reduce passive voice",
      "Add relevant technical skills",
    ];

    return {
      atsScore,
      grammarScore,
      formattingScore,
      overallScore,
      suggestions,
      source: "Fallback",
    };
  }
}