import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });

import { GoogleGenAI } from "@google/genai";

import {
  COVER_LETTER_SYSTEM_PROMPT,
  buildCoverLetterPrompt,
} from "../prompts/coverLetter.prompt";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateCoverLetter = async (
  jobDescription: string
): Promise<string> => {
  try {
    const userPrompt = buildCoverLetterPrompt(jobDescription);

    const prompt = `
${COVER_LETTER_SYSTEM_PROMPT}

${userPrompt}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const coverLetter = response.text;

    if (!coverLetter) {
      throw new Error("Gemini did not return a cover letter.");
    }

    return coverLetter
      .replace(/```text/g, "")
      .replace(/```/g, "")
      .trim();

  } catch (error) {
    console.error("Gemini cover letter generation failed:", error);
    throw new Error("Failed to generate cover letter.");
  }
};