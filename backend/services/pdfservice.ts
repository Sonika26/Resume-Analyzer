import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

export const extractTextFromPdf = async (
  filePath: string
): Promise<string> => {
  const fileBuffer = await fs.readFile(filePath);

  const parser = new PDFParse({
    data: fileBuffer,
  });

  try {
    const data = await parser.getText();
    return data.text.trim();
  } finally {
    await parser.destroy();
  }
};