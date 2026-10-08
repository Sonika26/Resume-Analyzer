export interface GenerateCoverLetterRequest {
  jobDescription: string;
}

export interface GenerateCoverLetterResponse {
  success: boolean;
  coverLetter: string;
}

export interface CoverLetterErrorResponse {
  success: false;
  message: string;
}