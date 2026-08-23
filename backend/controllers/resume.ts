import { Request, Response, NextFunction } from "express";
import path from "path";
import mongoose from "mongoose";

import Resume from "../models/resume";
import { extractTextFromPdf } from "../services/pdfservice";
import { extractTextFromDocx } from "../services/docxservice";
import { calculateATS } from "../services/ats";
import { checkGrammar } from "../services/grammar";
import { checkFormatting } from "../services/formatting";
import { calculateOverall } from "../services/overall";
import { analyzeResumeAI } from "../services/ai"; // OpenAI JSON analysis

// -------------------- Analyze Resume --------------------
export const analyzeResume = async (req: Request, res: Response, next: NextFunction) => {
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
      userId: req.user!._id,
      title: req.file.originalname,  // 👈 add this line
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
        analysis: resume.analysis,
      },
    });
  } catch (error) {
    next(error);
  }
};

// -------------------- Get All Resumes --------------------
export const getUserResumes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resumes = await Resume.find({
      userId: req.user!._id,
    })
      .sort({
        updatedAt: -1,
      })
      .select("-extractedText");

    return res.status(200).json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------- Get Resume By ID --------------------
export const getResumeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};
// -------------------- Delete Resume --------------------
export const deleteResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// -------------------- Export All Controllers --------------------

export const createResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      firstName,
      lastName,
      jobTitle,
      email,
      phone,
      location,
      summary,
      skills,
    } = req.body;

    const resume = await Resume.create({
      userId: req.user!._id,

      title: title?.trim() || "My Resume",

      firstName: firstName || "",
      lastName: lastName || "",
      jobTitle: jobTitle || "",
      email: email || "",
      phone: phone || "",
      location: location || "",
      summary: summary || "",
      skills: skills || "",
    });

    return res.status(201).json({
      success: true,
      message: "Resume created successfully.",
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

export const updateResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      firstName,
      lastName,
      jobTitle,
      email,
      phone,
      location,
      summary,
      skills,
    } = req.body;

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    /*
     * Update only fields that were sent.
     */
    if (title !== undefined) {
      resume.title = title.trim();
    }

    if (firstName !== undefined) {
      resume.firstName = firstName;
    }

    if (lastName !== undefined) {
      resume.lastName = lastName;
    }

    if (jobTitle !== undefined) {
      resume.jobTitle = jobTitle;
    }

    if (email !== undefined) {
      resume.email = email;
    }

    if (phone !== undefined) {
      resume.phone = phone;
    }

    if (location !== undefined) {
      resume.location = location;
    }

    if (summary !== undefined) {
      resume.summary = summary;
    }

    if (skills !== undefined) {
      resume.skills = skills;
    }

    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully.",
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

