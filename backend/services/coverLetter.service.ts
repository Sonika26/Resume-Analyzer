import {
  COVER_LETTER_SYSTEM_PROMPT,
  buildCoverLetterPrompt,
} from "../prompts/coverLetter.prompt";

export const generateCoverLetter = async (
  jobDescription: string
): Promise<string> => {
  const userPrompt = buildCoverLetterPrompt(jobDescription);

  // Call your existing AI service here.

  const result = await yourExistingAIService({
    systemPrompt: COVER_LETTER_SYSTEM_PROMPT,
    userPrompt,
  });

  return result;
};