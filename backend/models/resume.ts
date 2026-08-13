import mongoose, { Document, Schema } from "mongoose";

export interface IResume extends Document {
  originalName: string;
  fileName: string;
  fileType: string;
  fileSize: number;

  extractedText: string;

  analysis?: {
    atsScore?: number;
    summary?: string;

    skills?: string[];

    strengths?: string[];

    weaknesses?: string[];

    suggestions?: string[];

    experience?: string[];

    education?: string[];

    missingSkills?: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    extractedText: {
      type: String,
      required: true,
    },

    analysis: {
      atsScore: {
        type: Number,
        min: 0,
        max: 100,
      },

      summary: String,

      skills: {
        type: [String],
        default: [],
      },

      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      suggestions: {
        type: [String],
        default: [],
      },

      experience: {
        type: [String],
        default: [],
      },

      education: {
        type: [String],
        default: [],
      },

      missingSkills: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model<IResume>("Resume", resumeSchema);

export default Resume;