import { Router } from "express";

import {
  analyzeResume,
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from "../controllers/resume";

import { uploadResume } from "../middlewares/uploadmiddleware";

import protect from "../middlewares/authmiddleware";

const router = Router();

/*
 * ==========================================
 * RESUME ANALYSIS
 * ==========================================
 */

router.post(
  "/analyze",
  protect,
  uploadResume.single("resume"),
  analyzeResume
);

/*
 * ==========================================
 * RESUME BUILDER
 * ==========================================
 */

/*
 * Create a new resume
 *
 * POST /api/resumes
 */
router.post(
  "/",
  protect,
  createResume
);

/*
 * Get all resumes belonging to logged-in user
 *
 * GET /api/resumes
 */
router.get(
  "/",
  protect,
  getUserResumes
);

/*
 * Get one resume
 *
 * GET /api/resumes/:id
 */
router.get(
  "/:id",
  protect,
  getResumeById
);

/*
 * Update one resume
 *
 * PUT /api/resumes/:id
 */
router.put(
  "/:id",
  protect,
  updateResume
);

/*
 * Delete one resume
 *
 * DELETE /api/resumes/:id
 */
router.delete(
  "/:id",
  protect,
  deleteResume
);

export default router;