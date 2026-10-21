import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import Activity from "../models/Activity";
 
import protect from "../middlewares/authmiddleware";
 
const router = Router();
 
// Full path: /dashboard/activities (the dashboard page calls /dashboard/activities?limit=6)
router.get(
  "/dashboard/activities",
  protect,
  async (req: Request, res: Response): Promise<void> => {
    try {
      // `protect` sets req.user to the full user document, so the id is _id
      const user = req.user as { _id?: unknown } | undefined;
 
      if (!user?._id) {
        res.status(401).json({ message: "Not authorized" });
        return;
      }
 
      const limit = Math.min(Number(req.query.limit) || 10, 50);
 
      const activities = await Activity.find({
        user: new Types.ObjectId(String(user._id)),
      })
        .sort({ createdAt: -1 }) // newest first
        .limit(limit)
        .lean();
 
      res.status(200).json(activities); // the dashboard expects a plain array
    } catch (error) {
      console.error("Activities error:", error);
 
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  }
);
 
export default router;