
import { Router } from "express";
import { analyzeJobMatch } from "../controllers/jobMatchController";
import { uploadResume } from "../middlewares/uploadmiddleware";
import protect from "../middlewares/authmiddleware";
import { trackActivity } from "../middlewares/trackActivity";
 
const router = Router();
 
// `protect` is needed so we know which user to log the activity for.
// Your frontend must send the Authorization: Bearer <token> header on this call.
router.post(
  "/analyze",
  protect,
  uploadResume.single("resume"),
  trackActivity("job_match", "Job matching completed", "Roles were matched to your resume."),
  analyzeJobMatch
);
 
export default router;
 