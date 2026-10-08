import { Request, Response, NextFunction } from "express";
import path from "path";
import { generateResumePdf } from "../services/resumePdf";

import Resume, { IResume } from "../models/resume";

import { extractTextFromPdf } from "../services/pdfservice";
import { extractTextFromDocx } from "../services/docxservice";
import { calculateATS } from "../services/ats";
import { checkGrammar } from "../services/grammar";
import { checkFormatting } from "../services/formatting";
import { calculateOverall } from "../services/overall";
import { analyzeResumeAI } from "../services/ai";

// ============================================================
// ANALYZE RESUME
// ============================================================

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

    // ========================================================
    // TRY AI ANALYSIS FIRST
    // ========================================================

    let result;

    try {
      result = await analyzeResumeAI(extractedText);

      result.source = "OpenAI";
    } catch (error) {
      console.error(
        "OpenAI failed, using fallbacks:",
        error
      );

      const atsScore =
        calculateATS(extractedText);

      const grammarScore =
        await checkGrammar(extractedText);

      const formattingScore =
        checkFormatting(extractedText);

      const overallScore =
        calculateOverall(
          atsScore,
          grammarScore,
          formattingScore
        );

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

    // ========================================================
    // SAVE ANALYSIS
    // ========================================================

    resume.analysis = {
      atsScore: result.atsScore,
      grammarScore: result.grammarScore,
      formattingScore: result.formattingScore,
      overallScore: result.overallScore,
      suggestions: result.suggestions,
      source: result.source,
    };

    await resume.save();

    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully.",

      data: {
        resume,
        analysis: resume.analysis,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET ALL USER RESUMES
// ============================================================

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

// ============================================================
// GET RESUME BY ID
// ============================================================

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

// ============================================================
// CREATE RESUME
// ============================================================

export const createResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      template,

      firstName,
      lastName,
      jobTitle,

      email,
      phone,
      location,

      linkedin,
      github,
      portfolio,

      summary,
      skills,

      experience,
      education,
      projects,
      achievements,
    } = req.body;

    const resume = await Resume.create({
      userId: req.user!._id,

      // ======================================================
      // TITLE
      // ======================================================

      title: title?.trim() || "My Resume",
      template: req.body.template || "classic",

      // ======================================================
      // PERSONAL INFORMATION
      // ======================================================

      firstName: firstName || "",
      lastName: lastName || "",
      jobTitle: jobTitle || "",

      email: email || "",
      phone: phone || "",
      location: location || "",

      linkedin: linkedin || "",
      github: github || "",
      portfolio: portfolio || "",

      // ======================================================
      // SUMMARY
      // ======================================================

      summary: summary || "",

      // ======================================================
      // SKILLS
      // ======================================================

      skills: skills || "",

      // ======================================================
      // EXPERIENCE
      // ======================================================

      experience: experience || [],

      // ======================================================
      // EDUCATION
      // ======================================================

      education: education || [],

      // ======================================================
      // PROJECTS
      // ======================================================

      projects: projects || [],

      // ======================================================
      // ACHIEVEMENTS
      // ======================================================

      achievements: achievements || [],
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

// ============================================================
// UPDATE RESUME
// ============================================================

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
      template,

      firstName,
      lastName,
      jobTitle,

      email,
      phone,
      location,

      linkedin,
      github,
      portfolio,

      summary,
      skills,

      experience,
      education,
      projects,
      achievements,
    } = req.body;

    // ========================================================
    // TITLE
    // ========================================================

    resume.title =
      title ?? resume.title;
    resume.template =
      template ?? resume.template;

    // ========================================================
    // PERSONAL INFORMATION
    // ========================================================

    resume.firstName =
      firstName ?? resume.firstName;

    resume.lastName =
      lastName ?? resume.lastName;

    resume.jobTitle =
      jobTitle ?? resume.jobTitle;

    resume.email =
      email ?? resume.email;

    resume.phone =
      phone ?? resume.phone;

    resume.location =
      location ?? resume.location;

    resume.linkedin =
      linkedin ?? resume.linkedin;

    resume.github =
      github ?? resume.github;

    resume.portfolio =
      portfolio ?? resume.portfolio;

    // ========================================================
    // SUMMARY
    // ========================================================

    resume.summary =
      summary ?? resume.summary;

    // ========================================================
    // SKILLS
    // ========================================================

    resume.skills =
      skills ?? resume.skills;

    // ========================================================
    // EXPERIENCE
    // ========================================================

    resume.experience =
      experience ?? resume.experience;

    // ========================================================
    // EDUCATION
    // ========================================================

    resume.education =
      education ?? resume.education;

    // ========================================================
    // PROJECTS
    // ========================================================

    resume.projects =
      projects ?? resume.projects;

    // ========================================================
    // ACHIEVEMENTS
    // ========================================================

    resume.achievements =
      achievements ?? resume.achievements;

    const updatedResume =
      await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: updatedResume,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// DELETE RESUME
// ============================================================

export const deleteResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resume =
      await Resume.findOneAndDelete({
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

// ============================================================
// DOWNLOAD RESUME PDF
// ============================================================

export const downloadResumePdf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    // =====================================================
    // FIND RESUME
    // =====================================================

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

    // =====================================================
    // GENERATE PDF
    // =====================================================

    const pdfBuffer =
      await generateResumePdf(
        resume.toObject()
      );

    // =====================================================
    // FILE NAME
    // =====================================================

    const fileName =
      `${resume.title || "resume"}`
        .replace(
          /[^a-z0-9]/gi,
          "_"
        )
        .toLowerCase() + ".pdf";

    // =====================================================
    // RESPONSE HEADERS
    // =====================================================

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    res.setHeader(
      "Content-Length",
      pdfBuffer.length
    );

    // =====================================================
    // SEND PDF
    // =====================================================

    return res
      .status(200)
      .send(pdfBuffer);

  } catch (error) {

    console.error(
      "Resume PDF generation error:",
      error
    );

    next(error);
  }
};