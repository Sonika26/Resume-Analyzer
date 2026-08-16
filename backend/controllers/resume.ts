import { Request, Response, NextFunction } from "express";
import path from "path";

import Resume from "../models/resume";
import { extractTextFromPdf } from "../services/pdfservice";
import { extractTextFromDocx } from "../services/docxservice";
import { calculateATS } from "../services/ats";
import { checkGrammar } from "../services/grammar";
import { checkFormatting } from "../services/formatting";
import { calculateOverall } from "../services/overall";
import { analyzeResumeAI } from "../services/ai"; // OpenAI JSON analysis

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
    } else if (extension === ".docx") {
      extractedText = await extractTextFromDocx(filePath);
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type",
      });
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
      result = await analyzeResumeAI(extractedText);
      result.source = "OpenAI";
    } catch (error) {
      console.error("OpenAI failed, using fallbacks:", error);

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

    // ⭐ SAVE ANALYSIS INTO DATABASE
    resume.analysis = {
      atsScore: result.atsScore,
      grammarScore: result.grammarScore,
      formattingScore: result.formattingScore,
      overallScore: result.overallScore,
      suggestions: result.suggestions,
      source: result.source,
    };

    await resume.save();

    

    // ⭐ SEND RESPONSE IN CORRECT STRUCTURE FOR FRONTEND
    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully.",
      data: {
        analysis: resume.analysis,   // ⭐ frontend expects this
      },
    });

  } catch (error) {
    next(error);
  }
};
