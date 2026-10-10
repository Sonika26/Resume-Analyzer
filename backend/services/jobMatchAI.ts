
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

export interface JobMatchAnalysis {
  matchScore: number;
  categoryScores: {
    skills: number;
    keywords: number;
    experience: number;
    education: number;
    resumeQuality: number;
  };
  strengths: string[];
  matchedSkills: string[];
  missingSkills: string[];
  missingKeywords: string[];
  improvements: string[];
  formattingIssues: string[];
  summary: string;
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeJobMatchAI(
  resumeText: string,
  jobDescription: string
): Promise<JobMatchAnalysis> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const prompt = `
You are a resume and job-description compatibility analyzer.

Compare the resume with the job description. Base your findings
only on the supplied text. Never invent qualifications or experience.

Return ONLY valid JSON with exactly these fields:
{
  "matchScore": 0,
  "categoryScores": {
    "skills": 0,
    "keywords": 0,
    "experience": 0,
    "education": 0,
    "resumeQuality": 0
  },
  "strengths": [],
  "matchedSkills": [],
  "missingSkills": [],
  "missingKeywords": [],
  "improvements": [],
  "formattingIssues": [],
  "summary": ""
}

Rules:
- All scores must be integers from 0 to 100.
- matchScore is an estimated compatibility score, not an actual
  employer ATS score.
- Evaluate relevant skills, keywords, experience, education,
  and resume quality.
- Only report matched skills supported by the resume.
- Account for equivalent terms when comparing skills.
- List important job requirements that are absent from the resume.
- Make improvements specific and actionable.
- Use empty arrays when there are no applicable findings.
- Do not invent details or recommend adding skills the candidate
  does not actually possess.
- Return JSON only, without markdown or code fences.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
  });

  const output = (response.text ?? "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = output.indexOf("{");
  const end = output.lastIndexOf("}");

  if (start === -1 || end <= start) {
    throw new Error("Invalid AI response for job-match analysis.");
  }

  const parsed = JSON.parse(output.slice(start, end + 1));

  const toScore = (value: unknown): number => {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.min(100, Math.round(number)));
  };

  const toStringArray = (value: unknown): string[] =>
    Array.isArray(value)
      ? value.filter(
          (item): item is string => typeof item === "string"
        )
      : [];

  const categories = parsed.categoryScores ?? {};

  return {
    matchScore: toScore(parsed.matchScore),
    categoryScores: {
      skills: toScore(categories.skills),
      keywords: toScore(categories.keywords),
      experience: toScore(categories.experience),
      education: toScore(categories.education),
      resumeQuality: toScore(categories.resumeQuality),
    },
    strengths: toStringArray(parsed.strengths),
    matchedSkills: toStringArray(parsed.matchedSkills),
    missingSkills: toStringArray(parsed.missingSkills),
    missingKeywords: toStringArray(parsed.missingKeywords),
    improvements: toStringArray(parsed.improvements),
    formattingIssues: toStringArray(parsed.formattingIssues),
    summary:
      typeof parsed.summary === "string"
        ? parsed.summary
        : "Resume and job description comparison completed.",
  };
}