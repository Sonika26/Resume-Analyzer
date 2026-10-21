import { Router } from "express";
 
import {
  analyzeResume,
  getResumeById,
  getUserResumes,
  updateResume,
  deleteResume,
  downloadResumePdf,
} from "../controllers/resume";
 
import { uploadResume } from "../middlewares/uploadmiddleware";
import protect from "../middlewares/authmiddleware";
import { trackActivity } from "../middlewares/trackActivity";
 
const router = Router();
 
router.post(
  "/analyze",
  protect,
  uploadResume.single("resume"),
  trackActivity("resume_analyzed", "Resume analyzed", "Your resume was analyzed successfully."),
  analyzeResume
);
// New route for fetching all resumes
router.get(
  "/",
  protect,
  getUserResumes
);
 
/*
 * Download MUST come before /:id
 */
router.get(
  "/:id/download",
  protect,
  downloadResumePdf
);
 
router.get(
  "/:id",
  protect,
  getResumeById
);
 
router.put(
  "/:id",
  protect,
  updateResume
);
 
router.delete(
  "/:id",
  protect,
  deleteResume
);
 
export default router;