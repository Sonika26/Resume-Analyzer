import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getResumeById,
  createResume,
  updateResume,
  downloadResumePdf,
} from "../services/resume";

import PersonalInfoForm from "../components/resume/PersonalInfoForm";
import SummaryForm from "../components/resume/SummaryForm";
import ExperienceForm from "../components/resume/ExperienceForm";
import EducationForm from "../components/resume/EducationForm";
import SkillsForm from "../components/resume/SkillsForm";
import ProjectsForm from "../components/resume/ProjectsForm";
import AchievementsForm from "../components/resume/AchievementsForm";

import TemplateSelector from "../templates/resume/TemplateSelector";
import ClassicTemplate from "../templates/resume/ClassicTemplate";
import ModernTemplate from "../templates/resume/ModernTemplate";
import MinimalTemplate from "../templates/resume/MinimalTemplate";
import "../templates/resume/template.css";

import type {
  ResumeForm,
  Experience,
  Project,
  Achievement,
} from "../types/resume";

import "./ResumeEditor.css";

const emptyForm: ResumeForm = {
  title: "",
  template: "classic",

  firstName: "",
  lastName: "",
  jobTitle: "",

  email: "",
  phone: "",
  location: "",

  linkedin: "",
  github: "",
  portfolio: "",

  summary: "",

  skills: "",

  experience: [],
  education: [],
  projects: [],
  achievements: [],
};

const emptyExperience: Experience = {
  id: "",
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
};

const emptyProject: Project = {
  id: "",
  name: "",
  role: "",
  url: "",
  description: "",
  technologies: "",
};

const emptyAchievement: Achievement = {
  id: "",
  title: "",
  organization: "",
  date: "",
  description: "",
};

const ResumeEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEditing = Boolean(id);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const [form, setForm] = useState<ResumeForm>(emptyForm);

  const [loading, setLoading] = useState<boolean>(isEditing);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  /*
   * ============================
   * EXPERIENCE STATE
   * ============================
   */

  const [experienceForm, setExperienceForm] =
    useState<Experience>(emptyExperience);

  const [editingExperienceId, setEditingExperienceId] =
    useState<string | null>(null);

  const [isExperienceFormOpen, setIsExperienceFormOpen] =
    useState(false);

  /*
   * ============================
   * PROJECT STATE
   * ============================
   */

  const [projectForm, setProjectForm] =
    useState<Project>(emptyProject);

  const [editingProjectId, setEditingProjectId] =
    useState<string | null>(null);

  const [isProjectFormOpen, setIsProjectFormOpen] =
    useState(false);

  /*
   * ============================
   * ACHIEVEMENT STATE
   * ============================
   */

  const [achievementForm, setAchievementForm] =
    useState<Achievement>(emptyAchievement);

  const [editingAchievementId, setEditingAchievementId] =
    useState<string | null>(null);

  const [isAchievementFormOpen, setIsAchievementFormOpen] =
    useState(false);

  /*
   * ============================
   * LOAD RESUME
   * ============================
   */

  useEffect(() => {
    if (!id) return;

    const loadResume = async () => {
      try {
        setLoading(true);
        setError("");

        const resume = await getResumeById(id);
        console.log("RESUME FROM API:", resume);
       console.log("LINKEDIN:", resume.linkedin);
       console.log("GITHUB:", resume.github);
       console.log("PORTFOLIO:", resume.portfolio);

        setForm({
          

           title: resume.title || "",

          template: resume.template || "classic",

          firstName: resume.firstName || "",
          lastName: resume.lastName || "",
          jobTitle: resume.jobTitle || "",

          email: resume.email || "",
          phone: resume.phone || "",
          location: resume.location || "",

          linkedin: resume.linkedin || "",
          github: resume.github || "",
          portfolio: resume.portfolio || "",

          summary: resume.summary || "",
          skills: resume.skills || "",

          experience: resume.experience || [],
          education: resume.education || [],
          projects: resume.projects || [],

          achievements:
            "achievements" in resume &&
            Array.isArray(resume.achievements)
              ? resume.achievements
              : [],
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load this resume.");
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [id]);

  /*
   * ============================
   * STEP NAVIGATION
   * ============================
   */

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((previous) => previous + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((previous) => previous - 1);
    }
  };

  /*
   * ============================
   * GENERAL FORM CHANGE
   * ============================
   */

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  /*
   * ============================
   * EXPERIENCE
   * ============================
   */

  const handleExperienceChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const checked = (
        event.target as HTMLInputElement
      ).checked;

      setExperienceForm((previous) => ({
        ...previous,
        [name]: checked,
      }));

      return;
    }

    setExperienceForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddExperience = () => {
    setExperienceForm(emptyExperience);
    setEditingExperienceId(null);
    setIsExperienceFormOpen(true);
    setError("");
  };

  const handleSaveExperience = () => {
    if (!experienceForm.company.trim()) {
      setError("Please enter the company name.");
      return;
    }

    if (!experienceForm.position.trim()) {
      setError("Please enter the position.");
      return;
    }

    setError("");

    if (editingExperienceId) {
      setForm((previous) => ({
        ...previous,
        experience: previous.experience.map(
          (experience) =>
            experience.id === editingExperienceId
              ? {
                  ...experienceForm,
                  id: editingExperienceId,
                }
              : experience
        ),
      }));
    } else {
      const newExperience: Experience = {
        ...experienceForm,
        id: crypto.randomUUID(),
      };

      setForm((previous) => ({
        ...previous,
        experience: [
          ...previous.experience,
          newExperience,
        ],
      }));
    }

    setExperienceForm(emptyExperience);
    setEditingExperienceId(null);
    setIsExperienceFormOpen(false);
    setSaved(false);
  };

  const handleEditExperience = (
    experience: Experience
  ) => {
    setExperienceForm(experience);
    setEditingExperienceId(experience.id);
    setIsExperienceFormOpen(true);
    setError("");
  };

  const handleDeleteExperience = (
    experienceId: string
  ) => {
    setForm((previous) => ({
      ...previous,
      experience: previous.experience.filter(
        (experience) =>
          experience.id !== experienceId
      ),
    }));

    setSaved(false);
  };

  const handleCancelExperience = () => {
    setExperienceForm(emptyExperience);
    setEditingExperienceId(null);
    setIsExperienceFormOpen(false);
    setError("");
  };

  /*
   * ============================
   * EDUCATION
   * ============================
   */

  /*
   * ============================
   * PROJECTS
   * ============================
   */

  const handleProjectChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setProjectForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddProject = () => {
    setProjectForm(emptyProject);
    setEditingProjectId(null);
    setIsProjectFormOpen(true);
    setError("");
  };

  const handleSaveProject = () => {
    if (!projectForm.name.trim()) {
      setError("Please enter the project name.");
      return;
    }

    setError("");

    if (editingProjectId) {
      setForm((previous) => ({
        ...previous,
        projects: previous.projects.map(
          (project) =>
            project.id === editingProjectId
              ? {
                  ...projectForm,
                  id: editingProjectId,
                }
              : project
        ),
      }));
    } else {
      const newProject: Project = {
        ...projectForm,
        id: crypto.randomUUID(),
      };

      setForm((previous) => ({
        ...previous,
        projects: [
          ...previous.projects,
          newProject,
        ],
      }));
    }

    setProjectForm(emptyProject);
    setEditingProjectId(null);
    setIsProjectFormOpen(false);
    setSaved(false);
  };

  const handleEditProject = (
    project: Project
  ) => {
    setProjectForm(project);
    setEditingProjectId(project.id);
    setIsProjectFormOpen(true);
    setError("");
  };

  const handleDeleteProject = (
    projectId: string
  ) => {
    setForm((previous) => ({
      ...previous,
      projects: previous.projects.filter(
        (project) =>
          project.id !== projectId
      ),
    }));

    setSaved(false);
  };

  const handleCancelProject = () => {
    setProjectForm(emptyProject);
    setEditingProjectId(null);
    setIsProjectFormOpen(false);
    setError("");
  };

  /*
   * ============================
   * ACHIEVEMENTS
   * ============================
   */

  const handleAchievementChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setAchievementForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddAchievement = () => {
    setAchievementForm(emptyAchievement);
    setEditingAchievementId(null);
    setIsAchievementFormOpen(true);
    setError("");
  };

  const handleSaveAchievement = () => {
    if (!achievementForm.title.trim()) {
      setError(
        "Please enter the achievement title."
      );
      return;
    }

    setError("");

    if (editingAchievementId) {
      setForm((previous) => ({
        ...previous,
        achievements:
          previous.achievements.map(
            (achievement) =>
              achievement.id ===
              editingAchievementId
                ? {
                    ...achievementForm,
                    id: editingAchievementId,
                  }
                : achievement
          ),
      }));
    } else {
      const newAchievement: Achievement = {
        ...achievementForm,
        id: crypto.randomUUID(),
      };

      setForm((previous) => ({
        ...previous,
        achievements: [
          ...previous.achievements,
          newAchievement,
        ],
      }));
    }

    setAchievementForm(emptyAchievement);
    setEditingAchievementId(null);
    setIsAchievementFormOpen(false);
    setSaved(false);
  };

  const handleEditAchievement = (
    achievement: Achievement
  ) => {
    setAchievementForm(achievement);
    setEditingAchievementId(achievement.id);
    setIsAchievementFormOpen(true);
    setError("");
  };

  const handleDeleteAchievement = (
    achievementId: string
  ) => {
    setForm((previous) => ({
      ...previous,
      achievements:
        previous.achievements.filter(
          (achievement) =>
            achievement.id !== achievementId
        ),
    }));

    setSaved(false);
  };

  const handleCancelAchievement = () => {
    setAchievementForm(emptyAchievement);
    setEditingAchievementId(null);
    setIsAchievementFormOpen(false);
    setError("");
  };

  /*
   * ============================
   * SAVE RESUME
   * ============================
   */

  const handleSave = async (): Promise<
    string | null
  > => {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      if (!form.title.trim()) {
        setError("Please enter a resume title.");
        return null;
      }

      const resumeData = {
        title: form.title,
        template: form.template,

        firstName: form.firstName,
        lastName: form.lastName,
        jobTitle: form.jobTitle,

        email: form.email,
        phone: form.phone,
        location: form.location,

        linkedin: form.linkedin,
        github: form.github,
        portfolio: form.portfolio,

        summary: form.summary,
        skills: form.skills,

        experience: form.experience,
        education: form.education,
        projects: form.projects,
        achievements: form.achievements,
      };

      /*
       * EDIT EXISTING RESUME
       */

      if (isEditing && id) {
        const updatedResume =
          await updateResume(
            id,
            resumeData
          );

        setSaved(true);

        return updatedResume._id;
      }
      console.log("TEMPLATE BEING SAVED:", form.template);

      /*
       * CREATE NEW RESUME
       */

      const newResume =
        await createResume(resumeData);

      setSaved(true);

      navigate(
        `/resume/${newResume._id}/edit`,
        {
          replace: true,
        }
      );

      return newResume._id;
    } catch (err: any) {
      console.error(
        "Save resume error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to save resume."
      );

      return null;
    } finally {
      setSaving(false);
    }
  };

  /*
   * ============================
   * SAVE AND EXIT
   * ============================
   */

  const handleSaveAndExit = async () => {
    const resumeId = await handleSave();

    if (resumeId) {
      navigate("/resume");
    }
  };

  const handleExitWithoutSave = () => {
    navigate("/resume");
  };

  /*
   * ============================
   * DOWNLOAD PDF
   * ============================
   */

  const handleDownloadPdf = async () => {
    try {
      setError("");

      let resumeId: string | null =
        id ?? null;

      if (!resumeId) {
        resumeId = await handleSave();
      }

      if (!resumeId) {
        setError(
          "Please save the resume before downloading."
        );
        return;
      }

      const blob =
        await downloadResumePdf(resumeId);

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `${form.title || "resume"}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(
        "Download PDF error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to download PDF."
      );
    }
  };

  /*
   * ============================
   * LOADING
   * ============================
   */

  if (loading) {
    return (
      <div className="resume-editor-loading">
        <p>Loading resume...</p>
      </div>
    );
  }

  if (
    error &&
    isEditing &&
    !form.title
  ) {
    return (
      <div className="resume-editor-loading">
        <p className="editor-error">
          {error}
        </p>

        <button
          onClick={handleSaveAndExit}
        >
          Back to Resumes
        </button>
      </div>
    );
  }

  /*
   * ============================
   * LIVE PREVIEW DATA
   * ============================
   */

  const previewExperience =
    isExperienceFormOpen &&
    experienceForm.company.trim()
      ? editingExperienceId
        ? form.experience.map(
            (experience) =>
              experience.id ===
              editingExperienceId
                ? experienceForm
                : experience
          )
        : [
            ...form.experience,
            experienceForm,
          ]
      : form.experience;

  const previewProjects =
    isProjectFormOpen &&
    projectForm.name.trim()
      ? editingProjectId
        ? form.projects.map(
            (project) =>
              project.id ===
              editingProjectId
                ? projectForm
                : project
          )
        : [
            ...form.projects,
            projectForm,
          ]
      : form.projects;

  const previewAchievements =
    isAchievementFormOpen &&
    achievementForm.title.trim()
      ? editingAchievementId
        ? form.achievements.map(
            (achievement) =>
              achievement.id ===
              editingAchievementId
                ? achievementForm
                : achievement
          )
        : [
            ...form.achievements,
            achievementForm,
          ]
      : form.achievements;

  /*
   * ============================
   * RENDER
   * ============================
   */

  return (
    <div className="resume-editor">

      {/* ================= HEADER ================= */}

      <header className="resume-editor-header">

        <button
          className="save-exit-btn"
          onClick={handleSaveAndExit}
          disabled={saving}
        >
          ←{" "}
          {saving
            ? "Saving..."
            : "Save & Exit"}
        </button>

        <button
          onClick={handleExitWithoutSave}
        >
          Back to Resumes
        </button>

        <div className="editor-title">

          <h1>Resume Builder</h1>

          <span className="saved-status">
            {saving
              ? "Saving..."
              : saved
              ? "✓ Saved in the cloud"
              : "Unsaved changes"}
          </span>

        </div>

        <div className="editor-actions">

          <button
            className="download-btn"
            type="button"
            onClick={handleDownloadPdf}
            disabled={saving}
          >
            Download PDF
          </button>

          <button
            className="save-btn"
            onClick={() => handleSave()}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save"}
          </button>

        </div>

      </header>

      {/* ================= EDITOR BODY ================= */}

      <div className="resume-editor-body">

        {/* ================= LEFT SIDE ================= */}

        <aside className="resume-editor-sidebar">

          <div className="resume-name-section">

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Resume title"
              className="resume-title-input"
            />

          </div>

          {/* ================= TEMPLATE SELECTOR ================= */}

          <TemplateSelector
            value={form.template}
            onChange={(template) => {
              setForm((current) => ({
                ...current,
                template,
              }));

              setSaved(false);
            }}
          />

          {/* ================= STEP 1 ================= */}

          {currentStep === 1 && (
            <div className="editor-section">

              <h2>
                Personal Information
              </h2>

              <PersonalInfoForm
                form={form}
                onChange={handleChange}
              />

            </div>
          )}

          {/* ================= STEP 2 ================= */}

          {currentStep === 2 && (
            <div className="editor-section">

              <h2>
                Professional Summary
              </h2>

              <SummaryForm
                form={form}
                onChange={handleChange}
              />

            </div>
          )}

          {/* ================= STEP 3 ================= */}

          {currentStep === 3 && (
            <div className="editor-section">

              <ExperienceForm
                experiences={form.experience}
                experienceForm={
                  experienceForm
                }
                onChange={
                  handleExperienceChange
                }
                onAdd={
                  handleAddExperience
                }
                onEdit={
                  handleEditExperience
                }
                onDelete={
                  handleDeleteExperience
                }
                onSave={
                  handleSaveExperience
                }
                onCancel={
                  handleCancelExperience
                }
                isExperienceFormOpen={
                  isExperienceFormOpen
                }
                editingExperienceId={
                  editingExperienceId
                }
              />

            </div>
          )}

          {/* ================= STEP 4 ================= */}

          {currentStep === 4 && (
            <div className="editor-section">

              <ProjectsForm
                form={form}
                onChange={handleChange}
                projectForm={projectForm}
                onProjectChange={
                  handleProjectChange
                }
                onAddProject={
                  handleAddProject
                }
                onEditProject={
                  handleEditProject
                }
                onDeleteProject={
                  handleDeleteProject
                }
                onSaveProject={
                  handleSaveProject
                }
                onCancelProject={
                  handleCancelProject
                }
                isProjectFormOpen={
                  isProjectFormOpen
                }
                editingProjectId={
                  editingProjectId
                }
              />

            </div>
          )}

          {/* ================= STEP 5 ================= */}

          {currentStep === 5 && (
            <div className="editor-section">

              <h2>
                Skills
              </h2>

              <SkillsForm
                form={form}
                onChange={handleChange}
              />

            </div>
          )}

          {/* ================= STEP 6 ================= */}

          {currentStep === 6 && (
            <div className="editor-section">

              <h2>
                Education
              </h2>

              <EducationForm
                education={form.education}
                onChange={(education) => {
                  setForm((previous) => ({
                    ...previous,
                    education,
                  }));

                  setSaved(false);
                }}
              />

            </div>
          )}

          {/* ================= STEP 7 ================= */}

          {currentStep === 7 && (
            <div className="editor-section">

              <AchievementsForm
                form={form}
                achievementForm={
                  achievementForm
                }
                onAchievementChange={
                  handleAchievementChange
                }
                onAddAchievement={
                  handleAddAchievement
                }
                onEditAchievement={
                  handleEditAchievement
                }
                onDeleteAchievement={
                  handleDeleteAchievement
                }
                onSaveAchievement={
                  handleSaveAchievement
                }
                onCancelAchievement={
                  handleCancelAchievement
                }
                isAchievementFormOpen={
                  isAchievementFormOpen
                }
                editingAchievementId={
                  editingAchievementId
                }
              />

            </div>
          )}

          {/* ================= STEP NAVIGATION ================= */}

          <div className="step-navigation">

            <button
              type="button"
              onClick={
                handlePreviousStep
              }
              disabled={currentStep === 1}
            >
              ← Back
            </button>

            <span>
              Step {currentStep} of{" "}
              {totalSteps}
            </span>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={
                currentStep === totalSteps
              }
            >
              Next →
            </button>

          </div>

        </aside>

        {/* ================= RIGHT SIDE ================= */}

        <main className="resume-preview-area">

          <div className="resume-paper resume-template-paper">

            {form.template === "classic" && (
              <ClassicTemplate
                form={form}
                previewExperience={
                  previewExperience
                }
                previewProjects={
                  previewProjects
                }
                previewAchievements={
                  previewAchievements
                }
              />
            )}

            {form.template === "modern" && (
              <ModernTemplate
                form={form}
                previewExperience={
                  previewExperience
                }
                previewProjects={
                  previewProjects
                }
                previewAchievements={
                  previewAchievements
                }
              />
            )}

            {form.template === "minimal" && (
              <MinimalTemplate
                form={form}
                previewExperience={
                  previewExperience
                }
                previewProjects={
                  previewProjects
                }
                previewAchievements={
                  previewAchievements
                }
              />
            )}

          </div>

        </main>

      </div>

    </div>
  );
};

export default ResumeEditor;