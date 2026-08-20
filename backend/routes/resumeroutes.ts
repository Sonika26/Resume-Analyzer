import { Router } from "express";


import {
  analyzeResume,
  getUserResumes,
  getResumeById,
  deleteResume,
} from "../controllers/resume";

import { uploadResume } from "../middlewares/uploadmiddleware";
import protect from "../middlewares/authmiddleware";

const router = Router();

// ============================================================
// GET ALL RESUMES FOR LOGGED-IN USER
// ============================================================

router.get(
  "/",
  protect,
  getUserResumes
);

// ============================================================
// GET ONE RESUME
// ============================================================

router.get(
  "/:id",
  protect,
  getResumeById
);

// ANALYZE + SAVE UPLOADED RESUME


router.post(
  "/analyze",
  protect,
  uploadResume.single("resume"),
  analyzeResume
);


// DELETE RESUME


router.delete(
  "/:id",
  protect,
  deleteResume
);

export default router;