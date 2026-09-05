import mongoose, { Document, Schema } from "mongoose";

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;

  title: string;
  template: "classic" | "modern" | "minimal";

  // =========================
  // PERSONAL INFORMATION
  // =========================
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;

  // =========================
  // SUMMARY
  // =========================
  summary: string;

  // =========================
  // EXPERIENCE
  // =========================
  experience: {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];

  // =========================
  // EDUCATION
  // =========================
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];

  // =========================
  // PROJECTS
  // =========================
  projects: {
    id: string;
    name: string;
    role: string;
    description: string;
    technologies: string;
    url: string;
  }[];

  // =========================
  // ACHIEVEMENTS
  // =========================
  achievements: {
    id: string;
    title: string;
    organization: string;
    date: string;
    description: string;
  }[];

  // =========================
  // SKILLS
  // =========================
  skills: string;

  // =========================
  // UPLOADED RESUME
  // =========================
  originalName?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  extractedText?: string;

  // =========================
  // ANALYSIS
  // =========================
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
    // =========================
    // OWNER
    // =========================
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =========================
    // TITLE
    // =========================
    title: {
      type: String,
      required: true,
      trim: true,
      default: "My Resume",
    },
     template: {
      type: String,
      enum: [
        "classic",
        "modern",
        "minimal",
      ],
      default: "classic",
    },

    // =========================
    // PERSONAL INFORMATION
    // =========================
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

    // =========================
    // SUMMARY
    // =========================
    summary: {
      type: String,
      default: "",
    },

    // =========================
    // EXPERIENCE
    // =========================
    experience: [
      {
        id: {
          type: String,
          required: true,
        },

        company: {
          type: String,
          default: "",
        },

        position: {
          type: String,
          default: "",
        },

        location: {
          type: String,
          default: "",
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

    // =========================
    // EDUCATION
    // =========================
    education: [
      {
        id: {
          type: String,
          required: true,
        },

        institution: {
          type: String,
          default: "",
        },

        degree: {
          type: String,
          default: "",
        },

        field: {
          type: String,
          default: "",
        },

        location: {
          type: String,
          default: "",
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

    // =========================
    // PROJECTS
    // =========================
    projects: [
      {
        id: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          default: "",
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
        },
      },
    ],

    // =========================
    // ACHIEVEMENTS
    // =========================
    achievements: [
      {
        id: {
          type: String,
          required: true,
        },

        title: {
          type: String,
          default: "",
        },

        organization: {
          type: String,
          default: "",
        },

        date: {
          type: String,
          default: "",
        },

        description: {
          type: String,
          default: "",
        },
      },
    ],

    // =========================
    // SKILLS
    // =========================
    skills: {
      type: String,
      default: "",
    },

    // =========================
    // UPLOADED FILE
    // =========================
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

    // =========================
    // ANALYSIS
    // =========================
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

const Resume = mongoose.model<IResume>(
  "Resume",
  resumeSchema
);

export default Resume;