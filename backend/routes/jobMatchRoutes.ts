

import { Router } from "express";
import { analyzeJobMatch } from "../controllers/jobMatchController";
import { uploadResume } from "../middlewares/uploadmiddleware";


const router = Router();

router.post(
  "/analyze",
  
  uploadResume.single("resume"),
  analyzeJobMatch
);

export default router;