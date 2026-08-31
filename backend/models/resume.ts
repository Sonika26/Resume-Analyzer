import mongoose, { Document, Schema } from "mongoose";

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;

  title: string;

  // Existing Resume Builder fields
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;

  // Additional personal links
  linkedin: string;
  github: string;
  portfolio: string;

  // Experience
  experience: {
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];

  // Education
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];

  // Projects
  projects: {
    name: string;
    description: string;
    technologies: string;
    url: string;
  }[];

  // Certifications
  certifications: {
    name: string;
    issuer: string;
    date: string;
    url: string;
  }[];

  // Languages
  languages: {
    name: string;
    level: string;
  }[];

  // Resume analysis
  analysis?: {
    atsScore?: number;
    grammarScore?: number;
    formattingScore?: number;
    overallScore?: number;
    suggestions?: string[];
    source?: string;
  };

  // Uploaded file information
  originalName?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  extractedText?: string;

  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    /*
     * OWNER
     *
     * Keep this compatible with your existing authentication/controller.
     */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /*
     * RESUME TITLE
     */
    title: {
      type: String,
      required: true,
      trim: true,
      default: "My Resume",
    },

    /*
     * UPLOADED FILE INFORMATION
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

    extractedText: {
      type: String,
    },

    /*
     * EXISTING RESUME BUILDER FIELDS
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
     * PERSONAL LINKS
     */
    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    github: {
      type: String,
      trim: true,
      default: "",
    },

    portfolio: {
      type: String,
      trim: true,
      default: "",
    },

    /*
     * EXPERIENCE
     */
    experience: {
      type: [
        {
          company: {
            type: String,
            default: "",
            trim: true,
          },

          position: {
            type: String,
            default: "",
            trim: true,
          },

          location: {
            type: String,
            default: "",
            trim: true,
          },

          startDate: {
            type: String,
            default: "",
          },

          endDate: {
            type: String,
            default: "",
          },

          current: {
            type: Boolean,
            default: false,
          },

          description: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },

    /*
     * EDUCATION
     */
    education: {
      type: [
        {
          institution: {
            type: String,
            default: "",
            trim: true,
          },

          degree: {
            type: String,
            default: "",
            trim: true,
          },

          field: {
            type: String,
            default: "",
            trim: true,
          },

          startDate: {
            type: String,
            default: "",
          },

          endDate: {
            type: String,
            default: "",
          },

          description: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },

    /*
     * PROJECTS
     */
    projects: {
      type: [
        {
          name: {
            type: String,
            default: "",
            trim: true,
          },

          description: {
            type: String,
            default: "",
          },

          technologies: {
            type: String,
            default: "",
          },

          url: {
            type: String,
            default: "",
            trim: true,
          },
        },
      ],
      default: [],
    },

    /*
     * CERTIFICATIONS
     */
    certifications: {
      type: [
        {
          name: {
            type: String,
            default: "",
            trim: true,
          },

          issuer: {
            type: String,
            default: "",
            trim: true,
          },

          date: {
            type: String,
            default: "",
          },

          url: {
            type: String,
            default: "",
            trim: true,
          },
        },
      ],
      default: [],
    },

    /*
     * LANGUAGES
     */
    languages: {
      type: [
        {
          name: {
            type: String,
            default: "",
            trim: true,
          },

          level: {
            type: String,
            default: "",
            trim: true,
          },
        },
      ],
      default: [],
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