import mongoose, { Document, Schema } from "mongoose";

export interface IResume extends Document {
  originalName: string;
  fileName: string;
  fileType: string;
  fileSize: number;

  extractedText: string;

  analysis?: {
    atsScore?: number;
    grammarScore?: number;
    formattingScore?: number;
    overallScore?: number;

    suggestions?: string[];
    source?: string; // "OpenAI" or "Fallback"
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
      atsScore: { type: Number, min: 0, max: 100 },
      grammarScore: { type: Number, min: 0, max: 100 },
      formattingScore: { type: Number, min: 0, max: 100 },
      overallScore: { type: Number, min: 0, max: 100 },

      suggestions: {
        type: [String],
        default: [],
      },

      source: {
        type: String,
        default: "Fallback",
      }
    }
  },
  { timestamps: true }
);

const Resume = mongoose.model<IResume>("Resume", resumeSchema);

export default Resume;
