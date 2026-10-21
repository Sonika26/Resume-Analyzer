
import mongoose, { Document, Schema, Types } from "mongoose";

export type ActivityType =
  | "resume_uploaded"
  | "resume_analyzed"
  | "job_match"
  | "resume_rewrite";

export interface IActivity extends Document {
  user: Types.ObjectId;
  type: ActivityType;
  title: string;
  description?: string;
  score?: number; // optional: shows a score chip on the dashboard
  badge?: string; // optional: e.g. "V3 created"
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    // Change "User" if your user model is registered under a different name
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["resume_uploaded", "resume_analyzed", "job_match", "resume_rewrite"],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    score: { type: Number },
    badge: { type: String },
  },
  { timestamps: true } // adds createdAt / updatedAt, which the dashboard reads
);

// Makes "latest activity for this user" fast
activitySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<IActivity>("Activity", activitySchema);
