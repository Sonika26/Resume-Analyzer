import { Request, Response, NextFunction } from "express";
import path from "path";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";

import Resume, { IResume } from "../models/resume";
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
  

    const resume: IResume = await Resume.create({
  userId: req.user!._id,
  title: req.file.originalname,
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
        message: "Resume not found",
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
   const resume = await Resume.findOne({
  _id: req.params.id,
  userId: req.user!._id,
});

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

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

    resume.title = title ?? resume.title;

    resume.firstName = firstName ?? resume.firstName;
    resume.lastName = lastName ?? resume.lastName;
    resume.jobTitle = jobTitle ?? resume.jobTitle;

    resume.email = email ?? resume.email;
    resume.phone = phone ?? resume.phone;
    resume.location = location ?? resume.location;

    resume.summary = summary ?? resume.summary;
    resume.skills = skills ?? resume.skills;

    const updatedResume = await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: updatedResume,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadResumePdf = async (
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

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const fileName =
      `${resume.title || "resume"}`
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase() + ".pdf";

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    doc.pipe(res);

    /*
     * NAME
     */
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(
        `${resume.firstName || ""} ${resume.lastName || ""}`.trim() ||
          "Resume"
      );

    /*
     * JOB TITLE
     */
    if (resume.jobTitle) {
      doc
        .moveDown(0.4)
        .fontSize(13)
        .font("Helvetica")
        .text(resume.jobTitle);
    }

    /*
     * CONTACT
     */
    const contact = [
      resume.email,
      resume.phone,
      resume.location,
    ]
      .filter(Boolean)
      .join(" | ");

    if (contact) {
      doc
        .moveDown(0.4)
        .fontSize(9)
        .text(contact);
    }

    doc.moveDown();

    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();

    /*
     * SUMMARY
     */
    if (resume.summary) {
      doc
        .moveDown()
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("PROFESSIONAL SUMMARY");

      doc
        .moveDown(0.4)
        .fontSize(10)
        .font("Helvetica")
        .text(resume.summary);
    }

    /*
     * SKILLS
     */
    if (resume.skills) {
      doc
        .moveDown()
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("SKILLS");

      doc
        .moveDown(0.4)
        .fontSize(10)
        .font("Helvetica")
        .text(resume.skills);
    }

    doc.end();
  } catch (error) {
    next(error);
  }
};

