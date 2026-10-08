export type ResumeTemplate = "classic" | "modern" | "minimal";

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  organization?: string;
  date?: string;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  role?: string;
  url?: string;
  description?: string;
  technologies?: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface ResumeForm {
  title: string;

  template: ResumeTemplate;

  firstName: string;
  lastName: string;
  jobTitle: string;

  email: string;
  phone: string;
  location: string;

  linkedin: string;
  github: string;
  portfolio: string;

  summary: string;

  /*
   * Keep skills as a string for now.
   *
   * We'll eventually convert the UI into
   * individual skill objects.
   */
  skills: string;

  experience: Experience[];
  education: Education[];
  projects: Project[];
  achievements: Achievement[];
}

export interface Resume extends ResumeForm {
  id: string;
}