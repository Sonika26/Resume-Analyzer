import { Router, Request, Response } from "express";
import Resume from "../models/resume";

const router = Router();

router.get(
  "/dashboard",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const latestResume = await Resume.findOne({
        "analysis.overallScore": { $exists: true },
      })
        .sort({ updatedAt: -1 })
        .lean();

      if (!latestResume) {
        res.status(200).json({
          hasResume: false,
          analysis: null,
        });

        return;
      }

      res.status(200).json({
        hasResume: true,

        analysis: {
          overallScore: latestResume.analysis?.overallScore ?? 0,
          atsScore: latestResume.analysis?.atsScore ?? 0,
          grammarScore: latestResume.analysis?.grammarScore ?? 0,
          formattingScore:
            latestResume.analysis?.formattingScore ?? 0,
        },
      });
    } catch (error) {
      console.error("Dashboard error:", error);

      res.status(500).json({
        message: "Failed to fetch dashboard data",
      });
    }
  }
);

export default router;