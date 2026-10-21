
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

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

  if (!resumeText.trim()) {
    throw new Error("Resume text is empty.");
  }

  if (!jobDescription.trim()) {
    throw new Error("Job description is empty.");
  }

  const prompt = `
You are an expert ATS (Applicant Tracking System) analyst,
senior technical recruiter, and professional resume coach.

Compare the supplied RESUME against the supplied JOB DESCRIPTION.
Evaluate the candidate fairly, critically, and using evidence from
the provided text.

The job description defines the target role and its requirements.
The resume is the only source of evidence about the candidate.

JOB DESCRIPTION:
"""
${jobDescription}
"""

RESUME:
"""
${resumeText}
"""

EVALUATION REQUIREMENTS

1. ATS MATCH SCORE

Assign an estimated resume-to-job compatibility score from 0 to 100.

Evaluate these four dimensions, each scored from 0 to 25:

- keywords: Coverage of important required skills, tools,
  qualifications, and role-specific terminology.
- formatting: Apparent ATS parseability, clear section structure,
  readable extracted text, and identifiable resume sections.
- impact: Relevant achievements, demonstrated contributions,
  and quantified results supported by the resume.
- clarity: Concise, specific, professional, clearly written content.

The final matchScore must equal the sum of the four category scores.

Map the categories to the existing response as follows:

- categoryScores.keywords = keywords score multiplied by 4.
- categoryScores.resumeQuality = formatting score multiplied by 4.
- categoryScores.experience = impact score multiplied by 4.
- categoryScores.skills = clarity score multiplied by 4.
- categoryScores.education = a separate 0–100 assessment of
  education and certification alignment with the job requirements.

IMPORTANT: Calculate matchScore using the original four 0–25
scores, not by averaging the five categoryScores.

Do not claim to know the score assigned by an employer's actual ATS.
Do not award credit for qualifications that are absent or unsupported.

2. JOB REQUIREMENTS AND KEYWORDS

Identify relevant skills, technologies, tools, qualifications,
certifications, and responsibilities requested in the job description.

matchedSkills:
- Include important skills explicitly supported by the resume.
- Equivalent terminology may count when the meaning is clearly equivalent.
- Do not list skills merely because they appear in the job description.

missingSkills:
- Include important required or preferred capabilities that are not
  clearly demonstrated in the resume.
- A missing skill means it is not evidenced in the resume, not that
  the candidate definitely lacks that skill.

missingKeywords:
- Identify notable job-description keywords absent from, or inadequately
  represented in, the resume.
- Prioritize terms relevant to the role and its stated requirements.
- Avoid unnecessary duplication with missingSkills.

Never recommend adding a keyword unless the candidate can substantiate it
with genuine experience, knowledge, or qualifications.

3. STRENGTHS

Return 2 to 5 standout strengths that directly relate to the job.

Each strength must be a concise string grounded in evidence from the resume.
Prefer relevant skills, projects, experience, education, and achievements.

Do not invent qualifications, experience, or results.

4. IMPROVEMENTS AND WEAK BULLET REWRITES

Return 3 to 8 practical, prioritized improvements to help the resume
better align with the job description.

When suitable weak bullets or statements are available, rewrite them
as part of the improvements array.

For each rewrite:
- Quote or identify the original wording when practical.
- Provide the improved wording.
- Briefly explain why the change improves clarity, relevance,
  impact, or keyword alignment.

Because the response schema requires improvements to be strings,
format each rewrite as a concise string, for example:

"Original: [original wording] | Rewrite: [improved wording] |
Why: [one-line rationale]"

The original wording must match the supplied resume.
Preserve the original meaning and factual claims.

Never invent numbers, percentages, revenue, users, team sizes,
tools, technologies, responsibilities, or outcomes.

If a useful metric is unavailable, suggest what the candidate could
measure. Use placeholders such as [X%] or [N users] only when clearly
marked as placeholders requiring verification.

Do not turn participation into leadership or imply ownership
that the original statement does not establish.

If the resume contains fewer than three suitable bullets, rewrite
only those that exist and use the remaining improvements for other
specific, evidence-based recommendations.

5. FORMATTING ISSUES

Return only formatting or readability problems reasonably inferable
from the supplied resume text.

Examples include unclear headings, inconsistent section labels,
or extracted text that appears disorganized.

Do not claim to have inspected the original document's fonts, colors,
margins, columns, graphics, or visual layout.

If a formatting issue cannot be verified from extracted text,
state that limitation rather than inventing a defect.

6. SUMMARY

Write 3–4 concise sentences describing:
- The candidate's overall fit for the target role.
- The strongest relevant qualifications supported by the resume.
- The most important skill, keyword, experience, or presentation gaps.
- The most valuable next steps.

Do not guarantee an interview, ATS passage, or hiring outcome.

OUTPUT FORMAT

Return ONLY valid JSON, with no Markdown fences or commentary.

Use exactly this schema:

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

VALIDATION RULES

- All scores must be integers from 0 to 100.
- The four original scoring dimensions must each be integers from 0 to 25.
- matchScore must equal the sum of those four original dimension scores.
- Map the four original scores to categoryScores using the rules above.
- education must independently reflect alignment with the stated
  education and certification requirements.
- Return 2–5 evidence-based strengths when sufficient evidence exists.
- Return 3–8 improvements when the resume provides enough material.
- Every array must contain strings.
- Do not fabricate resume quotes, metrics, skills, or qualifications.
- Keep all recommendations specific to this job and resume.
- Return valid JSON with every required field present.
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
    
  });

  const output = (response.text ?? "").trim();

  let parsed: any;

  try {
    parsed = JSON.parse(output);
  } catch {
    throw new Error("The AI returned invalid JSON for job-match analysis.");
  }

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

  const categoryScores = {
    skills: toScore(categories.skills),
    keywords: toScore(categories.keywords),
    experience: toScore(categories.experience),
    education: toScore(categories.education),
    resumeQuality: toScore(categories.resumeQuality),
  };

  // Reconstruct the four original 0–25 dimensions from their
  // corresponding 0–100 category scores.
  const keywordsScore = Math.round(categoryScores.keywords / 4);
  const formattingScore = Math.round(categoryScores.resumeQuality / 4);
  const impactScore = Math.round(categoryScores.experience / 4);
  const clarityScore = Math.round(categoryScores.skills / 4);

  const matchScore = Math.max(
    0,
    Math.min(
      100,
      keywordsScore +
        formattingScore +
        impactScore +
        clarityScore
    )
  );

  return {
    matchScore,
    categoryScores,
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
