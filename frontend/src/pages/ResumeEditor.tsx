import { useEffect, useState } from "react";
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
import CertificationsForm from "../components/resume/CertificationsForm";
import LanguagesForm from "../components/resume/LanguagesForm";
import StepNavigation from "../components/resume/StepNavigation";

import type {
  ResumeForm,
  Experience,
} from "../types/resume";

import "./ResumeEditor.css";


/*
 * =========================================================
 * EMPTY RESUME FORM
 * =========================================================
 */

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


/*
 * =========================================================
 * EMPTY EXPERIENCE
 * =========================================================
 */

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


/*
 * =========================================================
 * RESUME EDITOR
 * =========================================================
 */

const ResumeEditor = () => {

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const isEditing = Boolean(id);


  /*
   * =======================================================
   * STEP STATE
   * =======================================================
   */

  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 8;


  /*
   * =======================================================
   * RESUME STATE
   * =======================================================
   */

  const [form, setForm] =
    useState<ResumeForm>(emptyForm);


  /*
   * =======================================================
   * GENERAL UI STATE
   * =======================================================
   */

  const [loading, setLoading] =
    useState<boolean>(isEditing);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");


  /*
   * =======================================================
   * EXPERIENCE STATE
   * =======================================================
   */

  const [experienceForm, setExperienceForm] =
    useState<Experience>(emptyExperience);

  const [editingExperienceId, setEditingExperienceId] =
    useState<string | null>(null);

  const [isExperienceFormOpen, setIsExperienceFormOpen] =
    useState(false);


  /*
   * =======================================================
   * LOAD EXISTING RESUME
   * =======================================================
   */

  useEffect(() => {

    if (!id) return;

    const loadResume = async () => {

      try {

        setLoading(true);
        setError("");

        const resume =
          await getResumeById(id);


        setForm({

          title:
            resume.title ||
            resume.originalName ||
            "My Resume",

          firstName:
            resume.firstName || "",

          lastName:
            resume.lastName || "",

          jobTitle:
            resume.jobTitle || "",

          email:
            resume.email || "",

          phone:
            resume.phone || "",

          location:
            resume.location || "",

          linkedin:
            resume.linkedin || "",

          github:
            resume.github || "",

          portfolio:
            resume.portfolio || "",

          summary:
            resume.summary || "",

          skills:
            resume.skills || "",

          experience:
            resume.experience || [],

          education:
            resume.education || [],

          projects:
            resume.projects || [],

          certifications:
            resume.certifications || [],

          languages:
            resume.languages || [],

        });

      } catch (err) {

        console.error(err);

        setError(
          "Unable to load this resume."
        );

      } finally {

        setLoading(false);

      }

    };

    loadResume();

  }, [id]);


  /*
   * =======================================================
   * STEP NAVIGATION
   * =======================================================
   */

  const handleNextStep = () => {

    if (currentStep < totalSteps) {

      setCurrentStep(
        (previous) => previous + 1
      );

    }

  };


  const handlePreviousStep = () => {

    if (currentStep > 1) {

      setCurrentStep(
        (previous) => previous - 1
      );

    }

  };


  /*
   * =======================================================
   * GENERAL FORM CHANGE
   * =======================================================
   */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) => {

    const {
      name,
      value,
    } = event.target;


    setForm((previous) => ({

      ...previous,

      [name]: value,

    }));

  };


  /*
   * =======================================================
   * EXPERIENCE FORM CHANGE
   * =======================================================
   */

  const handleExperienceChange = (
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) => {

    const {
      name,
      value,
      type,
    } = event.target;


    /*
     * CHECKBOX
     */

    if (type === "checkbox") {

      const checked =
        (event.target as HTMLInputElement)
          .checked;


      setExperienceForm(
        (previous) => ({

          ...previous,

          [name]: checked,

        })
      );

      return;
    }


    /*
     * TEXT / DATE / TEXTAREA
     */

    setExperienceForm(
      (previous) => ({

        ...previous,

        [name]: value,

      })
    );

  };


  /*
   * =======================================================
   * ADD / UPDATE EXPERIENCE
   * =======================================================
   */

  const handleSaveExperience = () => {

    /*
     * Validate company
     */

    if (
      !experienceForm.company.trim()
    ) {

      setError(
        "Please enter the company name."
      );

      return;
    }


    /*
     * Validate position
     */

    if (
      !experienceForm.position.trim()
    ) {

      setError(
        "Please enter the position."
      );

      return;
    }


    setError("");


    /*
     * UPDATE EXISTING EXPERIENCE
     */

    if (editingExperienceId) {

      setForm((previous) => ({

        ...previous,

        experience:
          previous.experience.map(
            (experience) =>

              experience.id ===
              editingExperienceId

                ? {
                    ...experienceForm,

                    id:
                      editingExperienceId,
                  }

                : experience
          ),

      }));

    }

    /*
     * ADD NEW EXPERIENCE
     */

    else {

      const newExperience:
        Experience = {

        ...experienceForm,

        id:
          crypto.randomUUID(),

      };


      setForm((previous) => ({

        ...previous,

        experience: [

          ...previous.experience,

          newExperience,

        ],

      }));

    }


    /*
     * RESET EXPERIENCE FORM
     */

    setExperienceForm(
      emptyExperience
    );

    setEditingExperienceId(
      null
    );

    setIsExperienceFormOpen(
      false
    );

  };


  /*
   * =======================================================
   * EDIT EXPERIENCE
   * =======================================================
   */

  const handleEditExperience = (
    experience: Experience
  ) => {

    setExperienceForm(
      experience
    );

    setEditingExperienceId(
      experience.id
    );

    setIsExperienceFormOpen(
      true
    );

    setError("");

  };


  /*
   * =======================================================
   * DELETE EXPERIENCE
   * =======================================================
   */

  const handleDeleteExperience = (
    experienceId: string
  ) => {

    setForm((previous) => ({

      ...previous,

      experience:
        previous.experience.filter(
          (experience) =>
            experience.id !==
            experienceId
        ),

    }));


    if (
      editingExperienceId ===
      experienceId
    ) {

      setExperienceForm(
        emptyExperience
      );

      setEditingExperienceId(
        null
      );

      setIsExperienceFormOpen(
        false
      );

    }

  };


  /*
   * =======================================================
   * CANCEL EXPERIENCE
   * =======================================================
   */

  const handleCancelExperience = () => {

    setExperienceForm(
      emptyExperience
    );

    setEditingExperienceId(
      null
    );

    setIsExperienceFormOpen(
      false
    );

    setError("");

  };


  /*
   * =======================================================
   * SAVE RESUME
   * =======================================================
   */

  const handleSave = async (): Promise<
    string | null
  > => {

    try {

      setSaving(true);

      setSaved(false);

      setError("");


      /*
       * Validate title
       */

      if (!form.title.trim()) {

        setError(
          "Please enter a resume title."
        );

        return null;

      }


      /*
       * Resume data
       */

      const resumeData = {

        title:
          form.title,

        firstName:
          form.firstName,

        lastName:
          form.lastName,

        jobTitle:
          form.jobTitle,

        email:
          form.email,

        phone:
          form.phone,

        location:
          form.location,

        linkedin:
          form.linkedin,

        github:
          form.github,

        portfolio:
          form.portfolio,

        summary:
          form.summary,

        skills:
          form.skills,

        experience:
          form.experience,

        education:
          form.education,

        projects:
          form.projects,

        certifications:
          form.certifications,

        languages:
          form.languages,

      };


      /*
       * ===================================================
       * UPDATE EXISTING RESUME
       * ===================================================
       */

      if (
        isEditing &&
        id
      ) {

        const updatedResume =
          await updateResume(
            id,
            resumeData
          );


        setSaved(true);


        return updatedResume._id;

      }


      /*
       * ===================================================
       * CREATE NEW RESUME
       * ===================================================
       */

      const newResume =
        await createResume(
          resumeData
        );


      setSaved(true);


      /*
       * Move to edit page
       */

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
   * =======================================================
   * SAVE AND EXIT
   * =======================================================
   */

  const handleSaveAndExit =
    async () => {

      const resumeId =
        await handleSave();


      if (resumeId) {

        navigate("/resume");

      }

    };


  /*
   * =======================================================
   * EXIT WITHOUT SAVE
   * =======================================================
   */

  const handleExitWithoutSave =
    () => {

      navigate("/resume");

    };


  /*
   * =======================================================
   * DOWNLOAD PDF
   * =======================================================
   */

  const handleDownloadPdf =
    async () => {

      try {

        setError("");


        /*
         * Existing resume
         */

        let resumeId:
          string | null =
          id ?? null;


        /*
         * New resume
         */

        if (!resumeId) {

          resumeId =
            await handleSave();

        }


        if (!resumeId) {

          setError(
            "Please save the resume before downloading."
          );

          return;

        }


        /*
         * Get PDF
         */

        const blob =
          await downloadResumePdf(
            resumeId
          );


        /*
         * Create download URL
         */

        const url =
          window.URL.createObjectURL(
            blob
          );


        const link =
          document.createElement(
            "a"
          );


        link.href = url;


        link.download =
          `${form.title || "resume"}.pdf`;


        document.body.appendChild(
          link
        );


        link.click();


        link.remove();


        window.URL.revokeObjectURL(
          url
        );

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
   * =======================================================
   * LOADING SCREEN
   * =======================================================
   */

  if (loading) {

    return (

      <div className="resume-editor-loading">

        <p>
          Loading resume...
        </p>

      </div>

    );

  }


  /*
   * =======================================================
   * ERROR SCREEN
   * =======================================================
   */

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
          onClick={
            handleExitWithoutSave
          }
        >
          Back to Resumes
        </button>

      </div>

    );

  }


  /*
   * =======================================================
   * MAIN EDITOR
   * =======================================================
   */

  return (

    <div className="resume-editor">


      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="resume-editor-header">


        <button
          className="save-exit-btn"
          onClick={
            handleSaveAndExit
          }
          disabled={saving}
        >

          ←{" "}

          {saving
            ? "Saving..."
            : "Save & Exit"}

        </button>


        <button
          onClick={
            handleExitWithoutSave
          }
        >
          Back to Resumes
        </button>


        <div className="editor-title">

          <h1>
            Resume Builder
          </h1>


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
            onClick={
              handleDownloadPdf
            }
            disabled={saving}
          >
            Download PDF
          </button>


          <button
            className="save-btn"
            type="button"
            onClick={() =>
              handleSave()
            }
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "Save"}

          </button>


        </div>

      </header>


      {/* ===================================================
          EDITOR BODY
      =================================================== */}

      <div className="resume-editor-body">


        {/* =================================================
            LEFT SIDEBAR
        ================================================= */}

        <aside className="resume-editor-sidebar">


          {/* =================================================
              RESUME TITLE
          ================================================= */}

          <div className="resume-name-section">

            <input
              name="title"
              value={form.title}
              onChange={
                handleChange
              }
              placeholder="Resume title"
              className="resume-title-input"
            />

          </div>


          {/* =================================================
              STEP 1 - PERSONAL INFORMATION
          ================================================= */}

          {currentStep === 1 && (

            <div className="editor-section">

              <h2>
                Personal Information
              </h2>


              <PersonalInfoForm
                form={form}
                onChange={
                  handleChange
                }
              />

            </div>

          )}


          {/* =================================================
              STEP 2 - SUMMARY
          ================================================= */}

          {currentStep === 2 && (

            <div className="editor-section">

              <h2>
                Professional Summary
              </h2>


              <SummaryForm
                form={form}
                onChange={
                  handleChange
                }
              />

            </div>

          )}


          {/* =================================================
              STEP 3 - EXPERIENCE
          ================================================= */}

          {currentStep === 3 && (

            <div className="editor-section">

              <ExperienceForm

                experiences={
                  form.experience
                }

                experienceForm={
                  experienceForm
                }

                editingExperienceId={
                  editingExperienceId
                }

                isExperienceFormOpen={
                  isExperienceFormOpen
                }

                onAdd={() => {

                  setExperienceForm(
                    emptyExperience
                  );

                  setEditingExperienceId(
                    null
                  );

                  setIsExperienceFormOpen(
                    true
                  );

                  setError("");

                }}

                onChange={
                  handleExperienceChange
                }

                onSave={
                  handleSaveExperience
                }

                onEdit={
                  handleEditExperience
                }

                onDelete={
                  handleDeleteExperience
                }

                onCancel={
                  handleCancelExperience
                }

              />

            </div>

          )}


          {/* =================================================
              STEP 4 - EDUCATION
          ================================================= */}

          {currentStep === 4 && (

            <div className="editor-section">

              <h2>
                Education
              </h2>


              <EducationForm
                form={form}
              />

            </div>

          )}


          {/* =================================================
              STEP 5 - SKILLS
          ================================================= */}

          {currentStep === 5 && (

            <div className="editor-section">

              <h2>
                Skills
              </h2>


              <SkillsForm
                form={form}
                onChange={
                  handleChange
                }
              />

            </div>

          )}


          {/* =================================================
              STEP 6 - PROJECTS
          ================================================= */}

          {currentStep === 6 && (

            <div className="editor-section">

              <h2>
                Projects
              </h2>


              <ProjectsForm
                form={form}
              />

            </div>

          )}


          {/* =================================================
              STEP 7 - CERTIFICATIONS
          ================================================= */}

          {currentStep === 7 && (

            <div className="editor-section">

              <h2>
                Certifications
              </h2>


              <CertificationsForm
                form={form}
              />

            </div>

          )}


          {/* =================================================
              STEP 8 - LANGUAGES
          ================================================= */}

          {currentStep === 8 && (

            <div className="editor-section">

              <h2>
                Languages
              </h2>


              <LanguagesForm
                form={form}
              />

            </div>

          )}

        </aside>


        {/* =================================================
            RIGHT SIDE - LIVE PREVIEW
        ================================================= */}

        <main className="resume-preview-area">


          <div className="resume-paper">


            {/* =================================================
                NAME
            ================================================= */}

            <h1>

              {form.firstName ||
                "Your"}{" "}

              {form.lastName ||
                "Name"}

            </h1>


            {/* =================================================
                JOB TITLE
            ================================================= */}

            <h2>

              {form.jobTitle ||
                "Professional Title"}

            </h2>


            {/* =================================================
                CONTACT
            ================================================= */}

            <div className="preview-contact">


              {form.email && (

                <span>
                  {form.email}
                </span>

              )}


              {form.phone && (

                <span>
                  {form.phone}
                </span>

              )}


              {form.location && (

                <span>
                  {form.location}
                </span>

              )}


              {form.linkedin && (

                <a
                  href={
                    form.linkedin
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>

              )}


              {form.github && (

                <a
                  href={
                    form.github
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>

              )}


              {form.portfolio && (

                <a
                  href={
                    form.portfolio
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio
                </a>

              )}

            </div>


            <hr />


            {/* =================================================
                SUMMARY PREVIEW
            ================================================= */}

            {form.summary && (

              <section>

                <h3>
                  PROFESSIONAL SUMMARY
                </h3>


                <p>
                  {form.summary}
                </p>

              </section>

            )}


            {/* =================================================
                EXPERIENCE PREVIEW
            ================================================= */}

            {form.experience.length >
              0 && (

              <section
                className="resume-section"
              >

                <h3>
                  EXPERIENCE
                </h3>


                {form.experience.map(
                  (experience) => (

                    <div
                      key={
                        experience.id
                      }
                      className="preview-experience"
                    >


                      <div className="preview-experience-header">


                        <div>

                          <h4>
                            {
                              experience.position
                            }
                          </h4>


                          <strong>
                            {
                              experience.company
                            }
                          </strong>

                        </div>


                        <div className="preview-experience-meta">


                          {experience.startDate && (

                            <span>

                              {
                                experience.startDate
                              }

                              {" – "}

                              {experience.current
                                ? "Present"
                                : experience.endDate ||
                                  ""}

                            </span>

                          )}


                          {experience.location && (

                            <span>
                              {
                                experience.location
                              }
                            </span>

                          )}

                        </div>

                      </div>


                      {experience.description && (

                        <p>
                          {
                            experience.description
                          }
                        </p>

                      )}

                    </div>

                  )
                )}

              </section>

            )}


            {/* =================================================
                SKILLS PREVIEW
            ================================================= */}

            {form.skills && (

              <section>

                <h3>
                  SKILLS
                </h3>


                <p>
                  {form.skills}
                </p>

              </section>

            )}


            {/* =================================================
                EMPTY PREVIEW
            ================================================= */}

            {!form.summary &&
              form.experience.length === 0 &&
              !form.skills && (

                <section>

                  <p>
                    Your resume preview
                    will appear here as
                    you enter information.
                  </p>

                </section>

              )}

          </div>

        </main>

      </div>


      {/* ===================================================
          STEP NAVIGATION
      =================================================== */}

      <StepNavigation

        currentStep={
          currentStep
        }

        totalSteps={
          totalSteps
        }

        onPrevious={
          handlePreviousStep
        }

        onNext={
          handleNextStep
        }

      />

    </div>

  );

};


export default ResumeEditor;