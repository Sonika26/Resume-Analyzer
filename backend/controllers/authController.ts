import { Request, Response, NextFunction } from "express";
import path from "path";

import Resume from "../models/resume";
import { extractTextFromPdf } from "../services/pdfservice";
import { extractTextFromDocx } from "../services/docxservice";
import { calculateATS } from "../services/ats";
import { checkGrammar } from "../services/grammar";
import { checkFormatting } from "../services/formatting";
import { calculateOverall } from "../services/overall";
import { analyzeWithAI } from "../services/ai"; // OpenAI JSON analysis

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
    const extension = path.extname(req.file.originalname).toLowerCase();

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

    // 🔍 Try OpenAI first
    let result;
    try {
      result = await analyzeWithAI(extractedText); // returns JSON with atsScore, grammarScore, formattingScore, overallScore, suggestions
      result.source = "OpenAI";
    } catch (error) {
      console.error("OpenAI failed, using fallbacks:", error);

      // Fallback scoring
      const atsScore = calculateATS(extractedText);
      const grammarScore = await checkGrammar(extractedText);
      const formattingScore = checkFormatting(extractedText);
      const overallScore = calculateOverall(atsScore, grammarScore, formattingScore);

      result = {
        atsScore,
        grammarScore,
        formattingScore,
        overallScore,
        suggestions: [
          "Add a summary section",
          "Use consistent bullet points",
          "Highlight measurable achievements",
          "Reduce passive voice",
          "Add relevant technical skills",
        ],
        source: "Fallback",
      };
    }

    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully.",
      data: {
        id: resume._id,
        originalName: resume.originalName,
        fileType: resume.fileType,
        fileSize: resume.fileSize,
        ...result,
      },
    });
  } catch (error) {
    next(error);
  }
};
