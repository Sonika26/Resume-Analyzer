import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getResumeById,
  createResume,
  updateResume,
  downloadResumePdf,
} from "../services/resume";

import type { ResumeForm } from "../types/resume";

import "./ResumeEditor.css";


const emptyForm: ResumeForm = {
  title: "",

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
  certifications: [],
  languages: [],
};

const ResumeEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEditing = Boolean(id);

  const [form, setForm] = useState<ResumeForm>(emptyForm);

  const [loading, setLoading] = useState<boolean>(isEditing);

  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  const [error, setError] = useState("");


  /*
   * Load existing resume when editing.
   */
useEffect(() => {
  if (!id) return;

  const loadResume = async () => {
    try {
      setLoading(true);
      setError("");

      const resume = await getResumeById(id);

    setForm({
  title:
    resume.title ||
    resume.originalName ||
    "My Resume",

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
  certifications: resume.certifications || [],
  languages: resume.languages || [],
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
   * Handle form changes.
   */
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * Save resume.
   */
  const handleSave = async (): Promise<string | null> => {
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
  certifications: form.certifications,
  languages: form.languages,
};

    /*
     * EDIT EXISTING RESUME
     */
    if (isEditing && id) {
      const updatedResume = await updateResume(
        id,
        resumeData
      );

      setSaved(true);

      return updatedResume._id;
    }

    /*
     * CREATE NEW RESUME
     */
    const newResume = await createResume(
      resumeData
    );

    setSaved(true);

    /*
     * Move the browser to the newly created
     * resume's edit page.
     */
    navigate(
      `/resume/${newResume._id}/edit`,
      {
        replace: true,
      }
    );

    return newResume._id;
  } catch (err: any) {
    console.error("Save resume error:", err);

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
   * Exit editor.
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

const handleDownloadPdf = async () => {
  try {
    setError("");

    /*
     * A new resume doesn't have an ID yet.
     *
     * Save it first.
     */
    let resumeId: string | null = id ?? null;

    if (!resumeId) {
      resumeId = await handleSave();
    }

    if (!resumeId) {
      setError("Please save the resume before downloading.");
      return;
    }

    const blob = await downloadResumePdf(
      resumeId
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${form.title || "resume"}.pdf`;

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

  if (loading) {
    return (
      <div className="resume-editor-loading">
        <p>Loading resume...</p>
      </div>
    );
  }

  if (error && isEditing && !form.title) {
    return (
      <div className="resume-editor-loading">
        <p className="editor-error">{error}</p>

        <button onClick={handleSaveAndExit}>
          Back to Resumes
        </button>
      </div>
    );
  }

  return (
    <div className="resume-editor">

      {/* ================= HEADER ================= */}

      <header className="resume-editor-header">

  <button
    className="save-exit-btn"
    onClick={handleSaveAndExit}
    disabled={saving}
  >
    ← {saving ? "Saving..." : "Save & Exit"}
  </button>

  <button onClick={handleExitWithoutSave}>
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
      {saving ? "Saving..." : "Save"}
    </button>

  </div>

</header>

      {/* ================= EDITOR BODY ================= */}

      <div className="resume-editor-body">

        {/* LEFT SIDE */}

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

          <div className="editor-section">

            <h2>Personal Information</h2>

            <label>
              First Name

              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
            </label>

            <label>
              Last Name

              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </label>

            <label>
              Job Title

              <input
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                placeholder="Frontend Developer"
              />
            </label>

            <label>
              Email

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </label>

            <label>
              Phone

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </label>

            <label>
              Location

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Bangalore, India"
              />
            </label>
            <label>
  LinkedIn

  <input
    type="url"
    name="linkedin"
    value={form.linkedin}
    onChange={handleChange}
    placeholder="https://linkedin.com/in/yourname"
  />
</label>

<label>
  GitHub

  <input
    type="url"
    name="github"
    value={form.github}
    onChange={handleChange}
    placeholder="https://github.com/yourname"
  />
</label>

<label>
  Portfolio

  <input
    type="url"
    name="portfolio"
    value={form.portfolio}
    onChange={handleChange}
    placeholder="https://yourportfolio.com"
  />
</label>
          </div>

          <div className="editor-section">

            <h2>Professional Summary</h2>

            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              placeholder="Write your professional summary..."
              rows={8}
            />

          </div>

          <div className="editor-section">

            <h2>Skills</h2>

            <textarea
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, TypeScript, Node.js..."
              rows={5}
            />

          </div>

        </aside>

        {/* RIGHT SIDE */}

        <main className="resume-preview-area">

          <div className="resume-paper">

            <h1>
              {form.firstName || "Your"}{" "}
              {form.lastName || "Name"}
            </h1>

            <h2>
              {form.jobTitle || "Professional Title"}
            </h2>

            <div className="preview-contact">

              {form.email && (
                <span>{form.email}</span>
              )}

              {form.phone && (
                <span>{form.phone}</span>
              )}

              {form.location && (
                <span>{form.location}</span>
              )}
              {form.linkedin && (
    <a
      href={form.linkedin}
      target="_blank"
      rel="noopener noreferrer"
    >
      LinkedIn
    </a>
  )}

  {form.github && (
    <a
      href={form.github}
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub
    </a>
  )}

  {form.portfolio && (
    <a
      href={form.portfolio}
      target="_blank"
      rel="noopener noreferrer"
    >
      Portfolio
    </a>
  )}

            </div>

            <hr />

            <section>
              <h3>PROFESSIONAL SUMMARY</h3>

              <p>
                {form.summary ||
                  "Your professional summary will appear here."}
              </p>
            </section>

            <section>
              <h3>SKILLS</h3>

              <p>
                {form.skills ||
                  "Your skills will appear here."}
              </p>
            </section>

          </div>

        </main>

      </div>

    </div>
  );
};

export default ResumeEditor;