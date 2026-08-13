import { Request, Response, NextFunction } from "express";
import path from "path";

import Resume from "../models/resume";
import { extractTextFromPdf } from "../services/pdfservice";
import { extractTextFromDocx } from "../services/docxservice";

export const analyzeResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required.",
      });
    }

    const filePath = req.file.path;

    const extension = path
      .extname(req.file.originalname)
      .toLowerCase();

    let extractedText = "";

    if (extension === ".pdf") {
      extractedText = await extractTextFromPdf(filePath);
    }

    if (extension === ".docx") {
      extractedText = await extractTextFromDocx(filePath);
    }

    if (!extractedText) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from the resume.",
      });
    }

    const resume = await Resume.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      extractedText,
    });

    return res.status(201).json({
      success: true,
      message: "Resume uploaded and text extracted successfully.",
      data: {
        id: resume._id,
        originalName: resume.originalName,
        fileType: resume.fileType,
        fileSize: resume.fileSize,
        extractedText: resume.extractedText,
      },
    });
  } catch (error) {
    next(error);
  }
};