import fs from "fs/promises";
import mammoth from "mammoth";

export const extractTextFromDocx = async (
  filePath: string
): Promise<string> => {
  const fileBuffer = await fs.readFile(filePath);

  const result = await mammoth.extractRawText({
    buffer: fileBuffer,
  });

  return result.value.trim();
};