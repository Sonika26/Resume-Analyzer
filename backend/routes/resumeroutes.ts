import { Router } from "express";
import {analyzeResume } from "../controllers/resume";
import { uploadResume } from "../middlewares/uploadmiddleware";
import Resume from "../models/resume"
import protect from "../middlewares/authmiddleware"

const router = Router();

router.post(
  "/analyze",
  uploadResume.single("resume"),
  analyzeResume
);


     
   

export default router;