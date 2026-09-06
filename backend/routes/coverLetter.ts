import { Router } from "express";
import { generateCoverLetterController } from "../controllers/coverLetter";

const router = Router();

router.post(
  "/generate",
  generateCoverLetterController
);

export default router;