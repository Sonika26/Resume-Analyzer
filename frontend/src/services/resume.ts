import axios from "axios";
import type { ResumeForm } from "../types/resume";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Resume returned by the backend.
 */
export interface Resume {
  _id: string;
  userId: string;

  title: string;

  originalName?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;

  extractedText?: string;

  // Existing builder fields
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills?: string;

  // New personal links
  linkedin?: string;
  github?: string;
  portfolio?: string;

  experience?: ResumeForm["experience"];
  education?: ResumeForm["education"];
  projects?: ResumeForm["projects"];
  certifications?: ResumeForm["certifications"];
  languages?: ResumeForm["languages"];

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

/**
 * Create a new resume.
 *
 * This will be connected to the backend
 * when we implement the resume builder save API.
 */
export const createResume = async (data: {
  title: string;
  extractedText?: string;
}
): Promise<Resume> => {
  const response = await axios.post<ResumeResponse>(
    `${API_URL}/resume`,
    data,
    getAuthHeaders()
  );

  return response.data.data;
};

/**
 * Update an existing resume.
 */
export const updateResume = async (
  resumeId: string,
  data: Partial<ResumeForm>
): Promise<Resume> => {
  const response = await axios.put<ResumeResponse>(
    `${API_URL}/resume/${resumeId}`,
    data,
    getAuthHeaders()
  );

  return response.data.data;
};

export const downloadResumePdf = async (
  resumeId: string
): Promise<Blob> => {
  const response = await axios.get(
    `${API_URL}/resume/${resumeId}/download`,
    {
      ...getAuthHeaders(),
      responseType: "blob",
    }
  );

  return response.data;
};