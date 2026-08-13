import fs from "fs/promises";
import pdfParse from "pdf-parse";

export const extractTextFromPdf = async (filePath: string): Promise<string> => {
  const fileBuffer = await fs.readFile(filePath);
  const data = await pdf(fileBuffer);
  return data.text.trim();
};
