
import type { Request, Response } from "express";
import fs from "fs/promises";

import { analyzeJobMatchAI } from "../services/jobMatchAI";

// Replace these paths with your actual extractor file paths.
import { extractTextFromPdf } from "../services/pdfservice";
import { extractTextFromDocx } from "../services/docxservice";


export async function analyzeJobMatch(
  req: Request,
  res: Response
): Promise<void> {
  const uploadedFile = req.file;

  try {
    if (!uploadedFile) {
      res.status(400).json({
        message: "Please upload a PDF or DOCX resume.",
      });
      return;
    }

    const jobDescription =
      typeof req.body.jobDescription === "string"
        ? req.body.jobDescription.trim()
        : "";

    if (!jobDescription) {
      res.status(400).json({
        message: "Please provide a job description.",
      });
      return;
    }

    if (jobDescription.length > 30000) {
      res.status(400).json({
        message: "The job description is too long.",
      });
      return;
    }

    const extension = uploadedFile.originalname
      .split(".")
      .pop()
      ?.toLowerCase();

    let resumeText: string;

    if (extension === "pdf") {
      resumeText = await extractTextFromPdf(uploadedFile.path);
    } else if (extension === "docx") {
      resumeText = await extractTextFromDocx(uploadedFile.path);
    } else {
      res.status(400).json({
        message: "Only PDF and DOCX files are supported.",
      });
      return;
    }

    if (!resumeText.trim()) {
      res.status(400).json({
        message:
          "No readable text was found in the resume. Try a text-based PDF or DOCX file.",
      });
      return;
    }

    const analysis = await analyzeJobMatchAI(
      resumeText,
      jobDescription
    );

    res.status(200).json({
      message: "Job match analysis completed.",
      data: {
        analysis,
      },
    });
  } catch (error) {
    console.error("Job match analysis failed:", error);

    res.status(500).json({
      message:
        "Unable to analyze this resume right now. Please try again.",
    });
  } finally {
    if (uploadedFile?.path) {
      await fs.unlink(uploadedFile.path).catch((error) => {
        console.error("Unable to remove uploaded resume:", error);
      });
    }
  }
}

