import axios from "axios";

interface GenerateCoverLetterResponse {
  success: boolean;
  coverLetter: string;
}

export const generateCoverLetter = async (
  jobDescription: string
): Promise<string> => {
  const response = await axios.post<GenerateCoverLetterResponse>(
    "/api/cover-letter/generate",
    {
      jobDescription,
    }
  );

  return response.data.coverLetter;
};