import { Request, Response } from "express";
import { generateCoverLetter } from "../services/coverLetter.service";

export const generateCoverLetterController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || typeof jobDescription !== "string") {
      res.status(400).json({
        success: false,
        message: "Job description is required.",
      });
      return;
    }

    const trimmedJobDescription = jobDescription.trim();

    if (trimmedJobDescription.length < 50) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid job description.",
      });
      return;
    }

    if (trimmedJobDescription.length > 5000) {
      res.status(400).json({
        success: false,
        message: "Job description cannot exceed 5000 characters.",
      });
      return;
    }

    const coverLetter = await generateCoverLetter(
      trimmedJobDescription
    );

    res.status(200).json({
      success: true,
      coverLetter,
    });
  } catch (error) {
    console.error("Cover letter generation failed:", error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate cover letter.",
    });
  }
};