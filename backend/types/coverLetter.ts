export interface GenerateCoverLetterRequest {
  jobDescription: string;
}

export interface GenerateCoverLetterResponse {
  success: boolean;
  coverLetter: string;
}