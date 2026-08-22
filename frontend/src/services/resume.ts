import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Resume returned by the backend.
 */
export interface Resume {
  _id: string;
  user: string;

  title?: string;

  originalName: string;
  fileName: string;
  fileType: string;
  fileSize: number;

  extractedText?: string;

  source: "upload" | "builder";

  analysis?: {
    atsScore?: number;
    grammarScore?: number;
    formattingScore?: number;
    overallScore?: number;
    suggestions?: string[];
    source?: string;
  };

  createdAt: string;
  updatedAt: string;
}

/**
 * API response structure.
 */
interface ResumeListResponse {
  success: boolean;
  data: Resume[];
  message?: string;
}

interface ResumeResponse {
  success: boolean;
  data: Resume;
  message?: string;
}

interface DeleteResumeResponse {
  success: boolean;
  message: string;
}

/**
 * Get authentication token.
 *
 * IMPORTANT:
 * Change "token" below if your AuthContext stores
 * the JWT under a different localStorage key.
 */
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Create authorization headers.
 */
const getAuthHeaders = () => {
  const token = getToken();

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

/**
 * Get all resumes belonging to the logged-in user.
 */
export const getResumes = async (): Promise<Resume[]> => {
  const response = await axios.get<ResumeListResponse>(
    `${API_URL}/resume`,
    getAuthHeaders()
  );

  return response.data.data;
};

/**
 * Get one resume by ID.
 */
export const getResumeById = async (
  resumeId: string
): Promise<Resume> => {
  const response = await axios.get<ResumeResponse>(
    `${API_URL}/resume/${resumeId}`,
    getAuthHeaders()
  );

  return response.data.data;
};

/**
 * Upload and analyze a resume.
 */
export const uploadResume = async (
  file: File
): Promise<ResumeResponse["data"]> => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await axios.post<{
    success: boolean;
    message: string;
    data: {
      resume: Resume;
      analysis: Resume["analysis"];
    };
  }>(
    `${API_URL}/resume/analyze`,
    formData,
    {
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data.resume;
};

/**
 * Delete a resume.
 */
export const deleteResume = async (
  resumeId: string
): Promise<string> => {
  const response = await axios.delete<DeleteResumeResponse>(
    `${API_URL}/resume/${resumeId}`,
    getAuthHeaders()
  );

  return response.data.message;
};