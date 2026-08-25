import mongoose, { Document, Schema, Types } from "mongoose";

export interface IResume extends Document {

  userId: Types.ObjectId;

  originalName: string;
  fileName: string;
  fileType: string;
  fileSize: number;

  title?: string;

  firstName?: string;
  lastName?: string;
  jobTitle?: string;

  email?: string;
  phone?: string;
  location?: string;

  summary?: string;
  skills?: string;

  extractedText: string;

  analysis?: {
    atsScore?: number;
    grammarScore?: number;
    formattingScore?: number;
    overallScore?: number;
    suggestions?: string[];
    source?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}
const resumeSchema = new Schema<IResume>(
  {
    /*
     * OWNER OF THE RESUME
     */
  

    /*
     * RESUME TITLE
     *
     * Example:
     * "Frontend Developer Resume"
     * "React Developer Resume"
     */
    title: {
      type: String,
      required: true,
      trim: true,
      default: "My Resume",
    },

    /*
     * UPLOADED FILE INFORMATION
     *
     * These are optional because a resume can now
     * also be created directly inside the Resume Builder.
     */
    originalName: {
      type: String,
      trim: true,
    },

    fileName: {
      type: String,
    },

    fileType: {
      type: String,
    },

    fileSize: {
      type: Number,
    },

    /*
     * EXTRACTED TEXT
     */
    extractedText: {
      type: String,
    },

    /*
     * RESUME BUILDER FIELDS
     */
    firstName: {
      type: String,
      trim: true,
      default: "",
    },

    lastName: {
      type: String,
      trim: true,
      default: "",
    },

    jobTitle: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

    skills: {
      type: String,
      default: "",
    },

    /*
     * RESUME ANALYSIS
     */
    analysis: {
      atsScore: {
        type: Number,
        min: 0,
        max: 100,
      },

      grammarScore: {
        type: Number,
        min: 0,
        max: 100,
      },

      formattingScore: {
        type: Number,
        min: 0,
        max: 100,
      },

      overallScore: {
        type: Number,
        min: 0,
        max: 100,
      },

      suggestions: {
        type: [String],
        default: [],
      },

      source: {
        type: String,
        default: "Fallback",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model<IResume>("Resume", resumeSchema);

export default Resume;