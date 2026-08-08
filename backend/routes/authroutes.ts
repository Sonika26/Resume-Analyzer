import { Router } from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController";
import { protect } from "../middlewares/authmiddleware";

// If using Zod validation
// import { signupSchema, loginSchema } from "../validators/authSchema";
// import { zodValidate } from "../middleware/zodValidate";

const router = Router();

// Public routes
router.get("/signup", registerUser);
router.post("/signup", registerUser);
router.post("/login", loginUser);

// Protected route
router.get("/me", protect, getMe);

export default router;
