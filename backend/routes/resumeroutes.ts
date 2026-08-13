import { Router } from "express";
import { analyzeResume } from "../controllers/resume";
import { uploadResume } from "../middlewares/uploadmiddleware";

const router = Router();

router.post(
  "/analyze",
  uploadResume.single("resume"),
  analyzeResume
);

export default router;