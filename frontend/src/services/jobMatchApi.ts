
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

export async function analyzeJobMatch(
  resume: File,
  jobDescription: string
): Promise<JobMatchAnalysis> {
  const formData = new FormData();

  // These names must match the backend's upload middleware
  // and controller.
  formData.append("resume", resume);
  formData.append("jobDescription", jobDescription);

  const response = await fetch("/api/job-match/analyze", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || "Unable to analyze the resume."
    );
  }

  // Supports either { data: {...} } or a direct result object.
  const analysis = result?.data?.analysis ?? result?.data;

  if (
    !analysis ||
    typeof analysis.matchScore !== "number"
  ) {
    throw new Error("The server returned an invalid analysis.");
  }

  return analysis as JobMatchAnalysis;
}