import { errorMessages } from "./errorMessages";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const validExtensions = [".pdf", ".docx"];

export function validateFile(file: File | undefined): string | null {
  if (!file) return errorMessages.noFile;

  const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

  if (!validExtensions.includes(extension)) {
    return errorMessages.invalidType;
  }

  if (file.size > MAX_FILE_SIZE) {
    return errorMessages.fileTooLarge;
  }

  return null; // ✅ No error
}
