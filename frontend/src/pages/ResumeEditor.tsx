import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getResumeById,
  updateResume,
} from "../services/resume";

import "./ResumeEditor.css";

interface ResumeForm {
  title: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
}

const emptyForm: ResumeForm = {
  title: "",
  firstName: "",
  lastName: "",
  jobTitle: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  skills: "",
};

const ResumeEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEditing = Boolean(id);

  const [form, setForm] = useState<ResumeForm>(emptyForm);

  const [loading, setLoading] = useState<boolean>(isEditing);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  /*
   * Load existing resume when editing.
   */
useEffect(() => {
  if (!id) return; // no need to setLoading(false) here

  const loadResume = async () => {
    try {
      setLoading(true);
      setError("");
      const resume = await getResumeById(id);
      setForm((prev) => ({
        ...prev,
        title: resume.title || resume.originalName || "My Resume",
        summary: resume.extractedText || "",
      }));
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
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      if (!form.title.trim()) {
        setError("Please enter a resume title.");
        return;
      }

      if (isEditing && id) {
        await updateResume(id, {
          title: form.title,
        });

        alert("Resume saved successfully.");
      } else {
        /*
         * Create endpoint will be connected
         * when we finish the backend builder API.
         */
        alert(
          "Resume creation API will be connected in the next backend step."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Unable to save resume.");
    } finally {
      setSaving(false);
    }
  };

  /*
   * Exit editor.
   */
  const handleExit = () => {
    navigate("/resume");
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

        <button onClick={handleExit}>
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
          onClick={handleExit}
        >
          ← Save & Exit
        </button>

        <div className="editor-title">
          <h1>Resume Builder</h1>

          <span className="saved-status">
            ✓ Saved in the cloud
          </span>
        </div>

        <div className="editor-actions">

          <button
            className="download-btn"
            type="button"
          >
            Download PDF
          </button>

          <button
            className="save-btn"
            onClick={handleSave}
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