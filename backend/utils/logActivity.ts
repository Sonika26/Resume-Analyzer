import { Types } from "mongoose";
import Activity, { ActivityType } from "../models/Activity";

interface ActivityExtras {
  score?: number;
  badge?: string;
}

/**
 * Save one activity for a user.
 * It never throws, so a logging problem can't make analyze/rewrite fail.
 *
 * await logActivity(userId, "resume_analyzed", "Resume analyzed", "Overall score: 82", { score: 82 });
 */
export async function logActivity(
  userId: string | Types.ObjectId,
  type: ActivityType,
  title: string,
  description?: string,
  extra: ActivityExtras = {}
): Promise<void> {
  try {
    await Activity.create({ user: userId, type, title, description, ...extra });
  } catch (err) {
    console.error("logActivity failed:", err instanceof Error ? err.message : err);
  }
}
