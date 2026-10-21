
import { NextFunction, Request, Response } from "express";
import { logActivity } from "../utils/logActivity";
import { ActivityType } from "../models/Activity";
 
/**
 * Put this in a route AFTER `protect`. When the request finishes with a
 * 2xx status, one activity row is saved for the logged-in user.
 * Failed requests (4xx / 5xx) are never logged.
 *
 *   router.post("/analyze", protect, upload, trackActivity("resume_analyzed", "Resume analyzed"), analyzeResume);
 *
 * OPTIONAL: a controller can add details (like a score) with one line
 * before it sends its response:
 *
 *   res.locals.activity = { description: `Overall score: ${score}`, score };
 */
export const trackActivity =
  (type: ActivityType, title: string, description?: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    res.on("finish", () => {
      const user = req.user as { _id?: unknown } | undefined;
      if (res.statusCode < 200 || res.statusCode >= 300 || !user?._id) return;
 
      const extra = res.locals.activity as
        | { description?: string; score?: number }
        | undefined;
 
      void logActivity(
        String(user._id),
        type,
        title,
        extra?.description ?? description,
        extra?.score !== undefined ? { score: extra.score } : {}
      );
    });
 
    next();
  };
 
