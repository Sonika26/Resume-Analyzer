import puppeteer from "puppeteer";

export type ResumeTemplate =
  | "classic"
  | "modern"
  | "minimal";

interface ResumeData {
  title?: string;

  template?: ResumeTemplate;

  firstName?: string;
  lastName?: string;
  jobTitle?: string;

  email?: string;
  phone?: string;
  location?: string;

  linkedin?: string;
  github?: string;
  portfolio?: string;

  summary?: string;
  skills?: string;

  experience?: Array<{
    id?: string;
    company?: string;
    position?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }>;

  education?: Array<{
    id?: string;
    institution?: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;

  projects?: Array<{
    id?: string;
    name?: string;
    role?: string;
    url?: string;
    description?: string;
    technologies?: string;
  }>;

  achievements?: Array<{
    id?: string;
    title?: string;
    organization?: string;
    date?: string;
    description?: string;
  }>;
}

/* =========================================================
   HTML SAFETY
========================================================= */

const escapeHtml = (value: unknown): string => {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/* =========================================================
   BULLET CONVERTER
========================================================= */

const descriptionToBullets = (
  value?: string
): string => {
  if (!value?.trim()) return "";

  const lines = value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) =>
      line
        .replace(/^[\s•●▪◦*-]+/, "")
        .trim()
    )
    .filter(Boolean);

  if (!lines.length) return "";

  return `
    <ul class="resume-bullets">
      ${lines
        .map(
          (line) =>
            `<li>${escapeHtml(line)}</li>`
        )
        .join("")}
    </ul>
  `;
};

/* =========================================================
   CONTACT
========================================================= */

const buildContact = (
  resume: ResumeData
): string => {
  const items = [
    resume.phone,
    resume.email,
    resume.location,
    resume.linkedin
      ? `<a href="${escapeHtml(
          resume.linkedin
        )}">LinkedIn</a>`
      : "",
    resume.github
      ? `<a href="${escapeHtml(
          resume.github
        )}">GitHub</a>`
      : "",
    resume.portfolio
      ? `<a href="${escapeHtml(
          resume.portfolio
        )}">Portfolio</a>`
      : "",
  ].filter(Boolean);

  return items
    .map((item) => `<span>${item}</span>`)
    .join(`<span class="contact-separator">|</span>`);
};

/* =========================================================
   FULL NAME
========================================================= */

const getFullName = (
  resume: ResumeData
): string => {
  return (
    `${resume.firstName || ""} ${
      resume.lastName || ""
    }`.trim() || "Your Name"
  );
};

/* =========================================================
   CLASSIC TEMPLATE
========================================================= */

const buildClassicHtml = (
  resume: ResumeData
): string => {
  const fullName = getFullName(resume);

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<style>

/* =====================================================
   A4 PAGE
===================================================== */

@page {
  size: A4;
  margin: 0;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #ffffff;
}

body {
  font-family:
    "Times New Roman",
    Times,
    serif;

  color: #111111;

  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* =====================================================
   MAIN RESUME
===================================================== */

.resume {
  width: 210mm;
  min-height: 297mm;

  padding:
    14mm
    17mm
    14mm
    17mm;

  margin: 0 auto;

  background: #ffffff;
}

/* =====================================================
   HEADER
===================================================== */

.resume-header {
  text-align: center;

  margin-bottom: 9px;
}

.resume-name {
  margin: 0;

  font-size: 18px;
  line-height: 1.15;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 0.3px;
}

.resume-title {
  margin-top: 2px;

  font-size: 11px;
  line-height: 1.3;

  font-weight: 400;
}

.resume-contact {
  margin-top: 5px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  gap: 0 5px;

  font-size: 8.5px;
  line-height: 1.4;
}

.resume-contact span,
.resume-contact a {
  color: #111111;

  text-decoration: none;
}

.contact-separator {
  margin: 0 1px;
}

/* =====================================================
   HEADER LINE
===================================================== */

.resume-header-divider {
  width: 100%;

  height: 1px;

  margin-top: 7px;

  background: #111111;
}

/* =====================================================
   SECTIONS
===================================================== */

.resume-section {
  margin-top: 11px;

  break-inside: avoid;
}

.resume-section-title {
  margin: 0 0 5px;

  padding-bottom: 2px;

  border-bottom: 1px solid #555555;

  font-size: 10px;

  line-height: 1.25;

  font-weight: 700;

  letter-spacing: 0.6px;

  text-transform: uppercase;
}

/* =====================================================
   SUMMARY
===================================================== */

.resume-summary {
  margin: 0;

  font-size: 9.2px;

  line-height: 1.45;

  text-align: left;
}

/* =====================================================
   EXPERIENCE
===================================================== */

.resume-entry {
  margin-bottom: 7px;

  break-inside: avoid;
}

.resume-entry:last-child {
  margin-bottom: 0;
}

.resume-entry-header {
  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  gap: 10px;
}

.resume-entry-main {
  min-width: 0;
}

.resume-entry-title {
  margin: 0;

  font-size: 10px;

  line-height: 1.25;

  font-weight: 700;
}

.resume-entry-company {
  margin-top: 1px;

  font-size: 9px;

  line-height: 1.25;

  font-weight: 700;
}

.resume-entry-meta {
  flex-shrink: 0;

  text-align: right;

  font-size: 8.5px;

  line-height: 1.3;
}

/* =====================================================
   BULLETS
===================================================== */

.resume-bullets {
  margin: 3px 0 0;

  padding-left: 15px;
}

.resume-bullets li {
  margin-bottom: 1px;

  padding-left: 1px;

  font-size: 8.8px;

  line-height: 1.35;
}

.resume-bullets li:last-child {
  margin-bottom: 0;
}

/* =====================================================
   PROJECTS
===================================================== */

.project-title {
  margin: 0;

  font-size: 10px;

  line-height: 1.25;

  font-weight: 700;
}

.project-role {
  margin-top: 1px;

  font-size: 8.8px;

  font-weight: 400;
}

.project-technologies {
  margin-top: 1px;

  font-size: 8.6px;

  line-height: 1.3;
}

.project-link {
  display: inline-block;

  margin-top: 1px;

  font-size: 8.3px;

  color: #111111;

  text-decoration: underline;
}

/* =====================================================
   SKILLS
===================================================== */

.skills-text {
  margin: 0;

  font-size: 8.8px;

  line-height: 1.45;

  white-space: pre-line;
}

/* =====================================================
   EDUCATION
===================================================== */

.education-degree {
  margin: 0;

  font-size: 10px;

  line-height: 1.25;

  font-weight: 700;
}

.education-institution {
  margin-top: 1px;

  font-size: 8.8px;

  line-height: 1.3;

  font-weight: 400;
}

.education-meta {
  margin-top: 1px;

  font-size: 8.5px;

  line-height: 1.3;
}

.education-description {
  margin-top: 2px;

  font-size: 8.7px;

  line-height: 1.35;
}

/* =====================================================
   ACHIEVEMENTS
===================================================== */

.achievement-title {
  margin: 0;

  font-size: 9.8px;

  line-height: 1.25;

  font-weight: 700;
}

.achievement-meta {
  margin-top: 1px;

  font-size: 8.5px;
}

.achievement-description {
  margin-top: 2px;

  font-size: 8.7px;

  line-height: 1.35;
}

/* =====================================================
   PAGE CONTROL
===================================================== */

.resume-section,
.resume-entry {
  page-break-inside: avoid;
}

</style>
</head>

<body>

<div class="resume">

  <!-- HEADER -->

  <header class="resume-header">

    <h1 class="resume-name">
      ${escapeHtml(fullName)}
    </h1>

    ${
      resume.jobTitle
        ? `
      <div class="resume-title">
        ${escapeHtml(resume.jobTitle)}
      </div>
      `
        : ""
    }

    ${
      resume.email ||
      resume.phone ||
      resume.location ||
      resume.linkedin ||
      resume.github ||
      resume.portfolio
        ? `
      <div class="resume-contact">
        ${buildContact(resume)}
      </div>
      `
        : ""
    }

    <div class="resume-header-divider"></div>

  </header>


  <!-- SUMMARY -->

  ${
    resume.summary?.trim()
      ? `
    <section class="resume-section">

      <h2 class="resume-section-title">
        OBJECTIVE
      </h2>

      <p class="resume-summary">
        ${escapeHtml(resume.summary)}
      </p>

    </section>
    `
      : ""
  }


  <!-- EXPERIENCE -->

  ${
    resume.experience?.length
      ? `
    <section class="resume-section">

      <h2 class="resume-section-title">
        EXPERIENCE
      </h2>

      ${resume.experience
        .map(
          (experience) => `
        <article class="resume-entry">

          <div class="resume-entry-header">

            <div class="resume-entry-main">

              <h3 class="resume-entry-title">
                ${escapeHtml(
                  experience.position ||
                    "Position"
                )}
              </h3>

              ${
                experience.company
                  ? `
                <div class="resume-entry-company">
                  ${escapeHtml(
                    experience.company
                  )}
                </div>
                `
                  : ""
              }

            </div>

            <div class="resume-entry-meta">

              ${
                experience.startDate ||
                experience.endDate ||
                experience.current
                  ? `
                ${escapeHtml(
                  experience.startDate || ""
                )}
                ${
                  experience.startDate ||
                  experience.endDate ||
                  experience.current
                    ? " – "
                    : ""
                }
                ${escapeHtml(
                  experience.current
                    ? "Present"
                    : experience.endDate || ""
                )}
                `
                  : ""
              }

              ${
                experience.location
                  ? `
                <div>
                  ${escapeHtml(
                    experience.location
                  )}
                </div>
                `
                  : ""
              }

            </div>

          </div>

          ${
            experience.description
              ? descriptionToBullets(
                  experience.description
                )
              : ""
          }

        </article>
        `
        )
        .join("")}

    </section>
    `
      : ""
  }


  <!-- PROJECTS -->

  ${
    resume.projects?.length
      ? `
    <section class="resume-section">

      <h2 class="resume-section-title">
        PROJECTS
      </h2>

      ${resume.projects
        .map(
          (project) => `
        <article class="resume-entry">

          <h3 class="project-title">
            ${escapeHtml(
              project.name || "Project"
            )}
          </h3>

          ${
            project.role
              ? `
            <div class="project-role">
              ${escapeHtml(project.role)}
            </div>
            `
              : ""
          }

          ${
            project.technologies
              ? `
            <div class="project-technologies">
              <strong>Technologies:</strong>
              ${escapeHtml(
                project.technologies
              )}
            </div>
            `
              : ""
          }

          ${
            project.url
              ? `
            <a
              class="project-link"
              href="${escapeHtml(
                project.url
              )}"
            >
              ${escapeHtml(project.url)}
            </a>
            `
              : ""
          }

          ${
            project.description
              ? descriptionToBullets(
                  project.description
                )
              : ""
          }

        </article>
        `
        )
        .join("")}

    </section>
    `
      : ""
  }


  <!-- SKILLS -->

  ${
    resume.skills?.trim()
      ? `
    <section class="resume-section">

      <h2 class="resume-section-title">
        SKILLS
      </h2>

      <p class="skills-text">
        ${escapeHtml(resume.skills)}
      </p>

    </section>
    `
      : ""
  }


  <!-- EDUCATION -->

  ${
    resume.education?.length
      ? `
    <section class="resume-section">

      <h2 class="resume-section-title">
        EDUCATION
      </h2>

      ${resume.education
        .map(
          (education) => `
        <article class="resume-entry">

          <h3 class="education-degree">
            ${escapeHtml(
              education.degree ||
                "Degree"
            )}

            ${
              education.field
                ? ` — ${escapeHtml(
                    education.field
                  )}`
                : ""
            }
          </h3>

          ${
            education.institution
              ? `
            <div class="education-institution">
              ${escapeHtml(
                education.institution
              )}
            </div>
            `
              : ""
          }

          ${
            education.startDate ||
            education.endDate
              ? `
            <div class="education-meta">
              ${escapeHtml(
                education.startDate || ""
              )}
              ${
                education.startDate ||
                education.endDate
                  ? " – "
                  : ""
              }
              ${escapeHtml(
                education.endDate || ""
              )}
            </div>
            `
              : ""
          }

          ${
            education.description
              ? `
            <div class="education-description">
              ${escapeHtml(
                education.description
              )}
            </div>
            `
              : ""
          }

        </article>
        `
        )
        .join("")}

    </section>
    `
      : ""
  }


  <!-- ACHIEVEMENTS -->

  ${
    resume.achievements?.length
      ? `
    <section class="resume-section">

      <h2 class="resume-section-title">
        ACHIEVEMENTS
      </h2>

      ${resume.achievements
        .map(
          (achievement) => `
        <article class="resume-entry">

          <h3 class="achievement-title">
            ${escapeHtml(
              achievement.title ||
                "Achievement"
            )}
          </h3>

          ${
            achievement.organization ||
            achievement.date
              ? `
            <div class="achievement-meta">

              ${
                achievement.organization
                  ? escapeHtml(
                      achievement.organization
                    )
                  : ""
              }

              ${
                achievement.organization &&
                achievement.date
                  ? " • "
                  : ""
              }

              ${
                achievement.date
                  ? escapeHtml(
                      achievement.date
                    )
                  : ""
              }

            </div>
            `
              : ""
          }

          ${
            achievement.description
              ? `
            <div class="achievement-description">
              ${escapeHtml(
                achievement.description
              )}
            </div>
            `
              : ""
          }

        </article>
        `
        )
        .join("")}

    </section>
    `
      : ""
  }

</div>

</body>
</html>
`;
};

/* =========================================================
   MODERN TEMPLATE
========================================================= */

const buildModernHtml = (
  resume: ResumeData
): string => {
  const fullName = getFullName(resume);

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<style>

@page {
  size: A4;
  margin: 0;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: white;
}

body {
  font-family:
    Arial,
    Helvetica,
    sans-serif;

  color: #1f2937;

  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.resume {
  width: 210mm;
  min-height: 297mm;

  padding: 13mm 15mm;

  background: white;
}

/* HEADER */

.modern-header {
  border-bottom: 2px solid #111827;

  padding-bottom: 9px;

  margin-bottom: 12px;
}

.modern-header-main {
  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  gap: 20px;
}

.modern-name {
  font-size: 24px;

  line-height: 1.1;

  font-weight: 700;

  letter-spacing: -0.5px;

  color: #111827;
}

.modern-job-title {
  margin-top: 4px;

  font-size: 11px;

  color: #4b5563;
}

.modern-contact {
  max-width: 48%;

  text-align: right;

  font-size: 8.5px;

  line-height: 1.55;

  color: #4b5563;
}

.modern-contact div {
  margin-bottom: 1px;
}

.modern-contact a {
  color: #374151;

  text-decoration: none;
}

/* LAYOUT */

.modern-layout {
  display: grid;

  grid-template-columns:
    38mm 1fr;

  gap: 11mm;
}

/* SIDEBAR */

.modern-sidebar {
  border-right: 1px solid #d1d5db;

  padding-right: 7mm;
}

.modern-sidebar-section {
  margin-bottom: 13px;
}

.modern-sidebar-title {
  margin: 0 0 5px;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 1px;

  text-transform: uppercase;

  color: #111827;
}

.modern-sidebar-text {
  margin: 0;

  font-size: 8.5px;

  line-height: 1.5;

  color: #4b5563;

  white-space: pre-line;
}

.modern-education-item {
  margin-bottom: 8px;
}

.modern-education-degree {
  font-size: 8.8px;

  font-weight: 700;

  line-height: 1.35;
}

.modern-education-institution {
  margin-top: 2px;

  font-size: 8.2px;

  line-height: 1.35;

  color: #4b5563;
}

.modern-education-date {
  margin-top: 2px;

  font-size: 7.8px;

  color: #6b7280;
}

/* MAIN */

.modern-main {
  min-width: 0;
}

.modern-section {
  margin-bottom: 13px;

  break-inside: avoid;
}

.modern-section-title {
  margin: 0 0 6px;

  font-size: 10px;

  line-height: 1.2;

  font-weight: 700;

  letter-spacing: 1px;

  text-transform: uppercase;

  color: #111827;
}

.modern-section-title::after {
  content: "";

  display: block;

  width: 28px;

  height: 2px;

  margin-top: 3px;

  background: #111827;
}

.modern-summary {
  margin: 0;

  font-size: 8.9px;

  line-height: 1.55;

  color: #4b5563;
}

/* EXPERIENCE */

.modern-entry {
  margin-bottom: 10px;

  break-inside: avoid;
}

.modern-entry-header {
  display: flex;

  justify-content: space-between;

  gap: 10px;
}

.modern-entry-title {
  margin: 0;

  font-size: 9.8px;

  font-weight: 700;

  line-height: 1.3;

  color: #111827;
}

.modern-entry-company {
  margin-top: 1px;

  font-size: 8.7px;

  font-weight: 600;

  color: #4b5563;
}

.modern-entry-date {
  flex-shrink: 0;

  font-size: 8px;

  text-align: right;

  color: #6b7280;
}

.modern-entry-location {
  margin-top: 1px;

  font-size: 7.8px;

  color: #6b7280;
}

.modern-bullets {
  margin: 4px 0 0;

  padding-left: 14px;
}

.modern-bullets li {
  margin-bottom: 2px;

  font-size: 8.4px;

  line-height: 1.4;

  color: #4b5563;
}

/* PROJECTS */

.modern-project-name {
  margin: 0;

  font-size: 9.7px;

  font-weight: 700;
}

.modern-project-tech {
  margin-top: 2px;

  font-size: 8px;

  color: #6b7280;
}

.modern-project-role {
  margin-top: 1px;

  font-size: 8px;

  color: #6b7280;
}

.modern-project-link {
  font-size: 7.8px;

  color: #374151;

  text-decoration: underline;
}

/* ACHIEVEMENTS */

.modern-achievement-title {
  font-size: 9px;

  font-weight: 700;
}

.modern-achievement-meta {
  margin-top: 1px;

  font-size: 8px;

  color: #6b7280;
}

.modern-achievement-description {
  margin-top: 2px;

  font-size: 8.3px;

  line-height: 1.4;
}

</style>
</head>

<body>

<div class="resume">

  <header class="modern-header">

    <div class="modern-header-main">

      <div>

        <div class="modern-name">
          ${escapeHtml(fullName)}
        </div>

        ${
          resume.jobTitle
            ? `
          <div class="modern-job-title">
            ${escapeHtml(resume.jobTitle)}
          </div>
          `
            : ""
        }

      </div>

      <div class="modern-contact">

        ${
          resume.phone
            ? `<div>${escapeHtml(
                resume.phone
              )}</div>`
            : ""
        }

        ${
          resume.email
            ? `<div>${escapeHtml(
                resume.email
              )}</div>`
            : ""
        }

        ${
          resume.location
            ? `<div>${escapeHtml(
                resume.location
              )}</div>`
            : ""
        }

        ${
          resume.linkedin
            ? `
          <div>
            <a href="${escapeHtml(
              resume.linkedin
            )}">
              LinkedIn
            </a>
          </div>
          `
            : ""
        }

        ${
          resume.github
            ? `
          <div>
            <a href="${escapeHtml(
              resume.github
            )}">
              GitHub
            </a>
          </div>
          `
            : ""
        }

        ${
          resume.portfolio
            ? `
          <div>
            <a href="${escapeHtml(
              resume.portfolio
            )}">
              Portfolio
            </a>
          </div>
          `
            : ""
        }

      </div>

    </div>

  </header>


  <div class="modern-layout">

    <!-- SIDEBAR -->

    <aside class="modern-sidebar">

      ${
        resume.skills?.trim()
          ? `
        <section class="modern-sidebar-section">

          <h2 class="modern-sidebar-title">
            Skills
          </h2>

          <p class="modern-sidebar-text">
            ${escapeHtml(resume.skills)}
          </p>

        </section>
        `
          : ""
      }


      ${
        resume.education?.length
          ? `
        <section class="modern-sidebar-section">

          <h2 class="modern-sidebar-title">
            Education
          </h2>

          ${resume.education
            .map(
              (education) => `
            <div class="modern-education-item">

              <div class="modern-education-degree">
                ${escapeHtml(
                  education.degree ||
                    "Degree"
                )}
                ${
                  education.field
                    ? ` — ${escapeHtml(
                        education.field
                      )}`
                    : ""
                }
              </div>

              ${
                education.institution
                  ? `
                <div class="modern-education-institution">
                  ${escapeHtml(
                    education.institution
                  )}
                </div>
                `
                  : ""
              }

              ${
                education.startDate ||
                education.endDate
                  ? `
                <div class="modern-education-date">
                  ${escapeHtml(
                    education.startDate || ""
                  )}
                  ${
                    education.startDate ||
                    education.endDate
                      ? " – "
                      : ""
                  }
                  ${escapeHtml(
                    education.endDate || ""
                  )}
                </div>
                `
                  : ""
              }

            </div>
            `
            )
            .join("")}

        </section>
        `
          : ""
      }

    </aside>


    <!-- MAIN -->

    <main class="modern-main">

      ${
        resume.summary?.trim()
          ? `
        <section class="modern-section">

          <h2 class="modern-section-title">
            Profile
          </h2>

          <p class="modern-summary">
            ${escapeHtml(resume.summary)}
          </p>

        </section>
        `
          : ""
      }


      ${
        resume.experience?.length
          ? `
        <section class="modern-section">

          <h2 class="modern-section-title">
            Experience
          </h2>

          ${resume.experience
            .map(
              (experience) => `
            <article class="modern-entry">

              <div class="modern-entry-header">

                <div>

                  <h3 class="modern-entry-title">
                    ${escapeHtml(
                      experience.position ||
                        "Position"
                    )}
                  </h3>

                  ${
                    experience.company
                      ? `
                    <div class="modern-entry-company">
                      ${escapeHtml(
                        experience.company
                      )}
                    </div>
                    `
                      : ""
                  }

                </div>

                <div class="modern-entry-date">

                  ${
                    experience.startDate ||
                    experience.endDate ||
                    experience.current
                      ? `
                    ${escapeHtml(
                      experience.startDate ||
                        ""
                    )}
                    ${
                      experience.startDate ||
                      experience.endDate ||
                      experience.current
                        ? " – "
                        : ""
                    }
                    ${escapeHtml(
                      experience.current
                        ? "Present"
                        : experience.endDate ||
                            ""
                    )}
                    `
                      : ""
                  }

                  ${
                    experience.location
                      ? `
                    <div class="modern-entry-location">
                      ${escapeHtml(
                        experience.location
                      )}
                    </div>
                    `
                      : ""
                  }

                </div>

              </div>

              ${
                experience.description
                  ? `
                <ul class="modern-bullets">

                  ${experience.description
                    .replace(
                      /\r\n/g,
                      "\n"
                    )
                    .replace(/\r/g, "\n")
                    .split("\n")
                    .map((line) =>
                      line
                        .replace(
                          /^[\\s•●▪◦*-]+/,
                          ""
                        )
                        .trim()
                    )
                    .filter(Boolean)
                    .map(
                      (line) =>
                        `<li>${escapeHtml(
                          line
                        )}</li>`
                    )
                    .join("")}

                </ul>
                `
                  : ""
              }

            </article>
            `
            )
            .join("")}

        </section>
        `
          : ""
      }


      ${
        resume.projects?.length
          ? `
        <section class="modern-section">

          <h2 class="modern-section-title">
            Projects
          </h2>

          ${resume.projects
            .map(
              (project) => `
            <article class="modern-entry">

              <h3 class="modern-project-name">
                ${escapeHtml(
                  project.name ||
                    "Project"
                )}
              </h3>

              ${
                project.role
                  ? `
                <div class="modern-project-role">
                  ${escapeHtml(
                    project.role
                  )}
                </div>
                `
                  : ""
              }

              ${
                project.technologies
                  ? `
                <div class="modern-project-tech">
                  <strong>
                    Technologies:
                  </strong>
                  ${escapeHtml(
                    project.technologies
                  )}
                </div>
                `
                  : ""
              }

              ${
                project.url
                  ? `
                <a
                  class="modern-project-link"
                  href="${escapeHtml(
                    project.url
                  )}"
                >
                  ${escapeHtml(
                    project.url
                  )}
                </a>
                `
                  : ""
              }

              ${
                project.description
                  ? `
                <ul class="modern-bullets">

                  ${project.description
                    .replace(
                      /\r\n/g,
                      "\n"
                    )
                    .replace(/\r/g, "\n")
                    .split("\n")
                    .map((line) =>
                      line
                        .replace(
                          /^[\\s•●▪◦*-]+/,
                          ""
                        )
                        .trim()
                    )
                    .filter(Boolean)
                    .map(
                      (line) =>
                        `<li>${escapeHtml(
                          line
                        )}</li>`
                    )
                    .join("")}

                </ul>
                `
                  : ""
              }

            </article>
            `
            )
            .join("")}

        </section>
        `
          : ""
      }


      ${
        resume.achievements?.length
          ? `
        <section class="modern-section">

          <h2 class="modern-section-title">
            Achievements
          </h2>

          ${resume.achievements
            .map(
              (achievement) => `
            <article class="modern-entry">

              <div class="modern-achievement-title">
                ${escapeHtml(
                  achievement.title ||
                    "Achievement"
                )}
              </div>

              ${
                achievement.organization ||
                achievement.date
                  ? `
                <div class="modern-achievement-meta">

                  ${
                    achievement.organization
                      ? escapeHtml(
                          achievement.organization
                        )
                      : ""
                  }

                  ${
                    achievement.organization &&
                    achievement.date
                      ? " • "
                      : ""
                  }

                  ${
                    achievement.date
                      ? escapeHtml(
                          achievement.date
                        )
                      : ""
                  }

                </div>
                `
                  : ""
              }

              ${
                achievement.description
                  ? `
                <div class="modern-achievement-description">
                  ${escapeHtml(
                    achievement.description
                  )}
                </div>
                `
                  : ""
              }

            </article>
            `
            )
            .join("")}

        </section>
        `
          : ""
      }

    </main>

  </div>

</div>

</body>
</html>
`;
};

/* =========================================================
   MINIMAL TEMPLATE
========================================================= */

const buildMinimalHtml = (
  resume: ResumeData
): string => {
  const fullName = getFullName(resume);

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<style>

@page {
  size: A4;
  margin: 0;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: white;
}

body {
  font-family:
    Arial,
    Helvetica,
    sans-serif;

  color: #222222;

  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.resume {
  width: 210mm;
  min-height: 297mm;

  padding:
    17mm
    20mm
    16mm
    20mm;

  background: white;
}

/* HEADER */

.minimal-header {
  text-align: center;

  margin-bottom: 16px;
}

.minimal-name {
  margin: 0;

  font-size: 20px;

  line-height: 1.15;

  font-weight: 700;

  letter-spacing: 1px;

  text-transform: uppercase;
}

.minimal-title {
  margin-top: 4px;

  font-size: 10px;

  color: #555555;
}

.minimal-contact {
  margin-top: 6px;

  font-size: 8px;

  line-height: 1.4;

  color: #555555;
}

.minimal-contact a {
  color: #333333;

  text-decoration: none;
}

/* SECTION */

.minimal-section {
  margin-top: 13px;

  break-inside: avoid;
}

.minimal-section-title {
  margin: 0 0 7px;

  font-size: 9.5px;

  font-weight: 700;

  letter-spacing: 1.2px;

  text-transform: uppercase;

  color: #333333;
}

.minimal-section-title::before {
  content: "";

  display: inline-block;

  width: 22px;

  height: 1px;

  margin-right: 6px;

  margin-bottom: 3px;

  background: #333333;
}

/* TEXT */

.minimal-text {
  margin: 0;

  font-size: 8.8px;

  line-height: 1.55;

  color: #444444;
}

/* ENTRIES */

.minimal-entry {
  margin-bottom: 9px;

  break-inside: avoid;
}

.minimal-entry-title {
  margin: 0;

  font-size: 9.5px;

  line-height: 1.3;

  font-weight: 700;
}

.minimal-entry-company {
  margin-top: 1px;

  font-size: 8.6px;

  font-weight: 600;
}

.minimal-entry-meta {
  margin-top: 1px;

  font-size: 8px;

  color: #666666;
}

.minimal-bullets {
  margin: 3px 0 0;

  padding-left: 14px;
}

.minimal-bullets li {
  margin-bottom: 2px;

  font-size: 8.5px;

  line-height: 1.4;

  color: #444444;
}

/* PROJECT */

.minimal-project-title {
  margin: 0;

  font-size: 9.5px;

  font-weight: 700;
}

.minimal-project-tech {
  margin-top: 2px;

  font-size: 8px;

  color: #666666;
}

.minimal-project-link {
  display: inline-block;

  margin-top: 1px;

  font-size: 7.8px;

  color: #333333;

  text-decoration: underline;
}

</style>
</head>

<body>

<div class="resume">

  <!-- HEADER -->

  <header class="minimal-header">

    <h1 class="minimal-name">
      ${escapeHtml(fullName)}
    </h1>

    ${
      resume.jobTitle
        ? `
      <div class="minimal-title">
        ${escapeHtml(resume.jobTitle)}
      </div>
      `
        : ""
    }

    <div class="minimal-contact">

      ${
        resume.phone
          ? `${escapeHtml(resume.phone)}`
          : ""
      }

      ${
        resume.phone &&
        resume.email
          ? " | "
          : ""
      }

      ${
        resume.email
          ? `${escapeHtml(resume.email)}`
          : ""
      }

      ${
        resume.location
          ? ` | ${escapeHtml(
              resume.location
            )}`
          : ""
      }

      ${
        resume.github
          ? ` | <a href="${escapeHtml(
              resume.github
            )}">GitHub</a>`
          : ""
      }

      ${
        resume.linkedin
          ? ` | <a href="${escapeHtml(
              resume.linkedin
            )}">LinkedIn</a>`
          : ""
      }

      ${
        resume.portfolio
          ? ` | <a href="${escapeHtml(
              resume.portfolio
            )}">Portfolio</a>`
          : ""
      }

    </div>

  </header>


  <!-- SUMMARY -->

  ${
    resume.summary?.trim()
      ? `
    <section class="minimal-section">

      <h2 class="minimal-section-title">
        Objective
      </h2>

      <p class="minimal-text">
        ${escapeHtml(resume.summary)}
      </p>

    </section>
    `
      : ""
  }


  <!-- EXPERIENCE -->

  ${
    resume.experience?.length
      ? `
    <section class="minimal-section">

      <h2 class="minimal-section-title">
        Experience
      </h2>

      ${resume.experience
        .map(
          (experience) => `
        <article class="minimal-entry">

          <h3 class="minimal-entry-title">
            ${escapeHtml(
              experience.position ||
                "Position"
            )}
          </h3>

          ${
            experience.company
              ? `
            <div class="minimal-entry-company">
              ${escapeHtml(
                experience.company
              )}
            </div>
            `
              : ""
          }

          ${
            experience.startDate ||
            experience.endDate ||
            experience.current
              ? `
            <div class="minimal-entry-meta">

              ${escapeHtml(
                experience.startDate || ""
              )}

              ${
                experience.startDate ||
                experience.endDate ||
                experience.current
                  ? " – "
                  : ""
              }

              ${escapeHtml(
                experience.current
                  ? "Present"
                  : experience.endDate || ""
              )}

              ${
                experience.location
                  ? ` | ${escapeHtml(
                      experience.location
                    )}`
                  : ""
              }

            </div>
            `
              : ""
          }

          ${
            experience.description
              ? `
            <ul class="minimal-bullets">

              ${experience.description
                .replace(
                  /\r\n/g,
                  "\n"
                )
                .replace(/\r/g, "\n")
                .split("\n")
                .map((line) =>
                  line
                    .replace(
                      /^[\\s•●▪◦*-]+/,
                      ""
                    )
                    .trim()
                )
                .filter(Boolean)
                .map(
                  (line) =>
                    `<li>${escapeHtml(
                      line
                    )}</li>`
                )
                .join("")}

            </ul>
            `
              : ""
          }

        </article>
        `
        )
        .join("")}

    </section>
    `
      : ""
  }


  <!-- PROJECTS -->

  ${
    resume.projects?.length
      ? `
    <section class="minimal-section">

      <h2 class="minimal-section-title">
        Projects
      </h2>

      ${resume.projects
        .map(
          (project) => `
        <article class="minimal-entry">

          <h3 class="minimal-project-title">
            ${escapeHtml(
              project.name ||
                "Project"
            )}
          </h3>

          ${
            project.technologies
              ? `
            <div class="minimal-project-tech">
              <strong>
                Technologies:
              </strong>
              ${escapeHtml(
                project.technologies
              )}
            </div>
            `
              : ""
          }

          ${
            project.url
              ? `
            <a
              class="minimal-project-link"
              href="${escapeHtml(
                project.url
              )}"
            >
              ${escapeHtml(
                project.url
              )}
            </a>
            `
              : ""
          }

          ${
            project.description
              ? `
            <ul class="minimal-bullets">

              ${project.description
                .replace(
                  /\r\n/g,
                  "\n"
                )
                .replace(/\r/g, "\n")
                .split("\n")
                .map((line) =>
                  line
                    .replace(
                      /^[\\s•●▪◦*-]+/,
                      ""
                    )
                    .trim()
                )
                .filter(Boolean)
                .map(
                  (line) =>
                    `<li>${escapeHtml(
                      line
                    )}</li>`
                )
                .join("")}

            </ul>
            `
              : ""
          }

        </article>
        `
        )
        .join("")}

    </section>
    `
      : ""
  }


  <!-- SKILLS -->

  ${
    resume.skills?.trim()
      ? `
    <section class="minimal-section">

      <h2 class="minimal-section-title">
        Skills
      </h2>

      <p class="minimal-text">
        ${escapeHtml(resume.skills)}
      </p>

    </section>
    `
      : ""
  }


  <!-- EDUCATION -->

  ${
    resume.education?.length
      ? `
    <section class="minimal-section">

      <h2 class="minimal-section-title">
        Education
      </h2>

      ${resume.education
        .map(
          (education) => `
        <article class="minimal-entry">

          <h3 class="minimal-entry-title">

            ${escapeHtml(
              education.degree ||
                "Degree"
            )}

            ${
              education.field
                ? ` — ${escapeHtml(
                    education.field
                  )}`
                : ""
            }

          </h3>

          ${
            education.institution
              ? `
            <div class="minimal-entry-company">
              ${escapeHtml(
                education.institution
              )}
            </div>
            `
              : ""
          }

          ${
            education.startDate ||
            education.endDate
              ? `
            <div class="minimal-entry-meta">

              ${escapeHtml(
                education.startDate || ""
              )}

              ${
                education.startDate ||
                education.endDate
                  ? " – "
                  : ""
              }

              ${escapeHtml(
                education.endDate || ""
              )}

            </div>
            `
              : ""
          }

          ${
            education.description
              ? `
            <div class="minimal-text">
              ${escapeHtml(
                education.description
              )}
            </div>
            `
              : ""
          }

        </article>
        `
        )
        .join("")}

    </section>
    `
      : ""
  }


  <!-- ACHIEVEMENTS -->

  ${
    resume.achievements?.length
      ? `
    <section class="minimal-section">

      <h2 class="minimal-section-title">
        Achievements
      </h2>

      ${resume.achievements
        .map(
          (achievement) => `
        <article class="minimal-entry">

          <h3 class="minimal-entry-title">
            ${escapeHtml(
              achievement.title ||
                "Achievement"
            )}
          </h3>

          ${
            achievement.organization ||
            achievement.date
              ? `
            <div class="minimal-entry-meta">

              ${
                achievement.organization
                  ? escapeHtml(
                      achievement.organization
                    )
                  : ""
              }

              ${
                achievement.organization &&
                achievement.date
                  ? " | "
                  : ""
              }

              ${
                achievement.date
                  ? escapeHtml(
                      achievement.date
                    )
                  : ""
              }

            </div>
            `
              : ""
          }

          ${
            achievement.description
              ? `
            <div class="minimal-text">
              ${escapeHtml(
                achievement.description
              )}
            </div>
            `
              : ""
          }

        </article>
        `
        )
        .join("")}

    </section>
    `
      : ""
  }

</div>

</body>
</html>
`;
};

/* =========================================================
   SELECT TEMPLATE
========================================================= */

const buildResumeHtml = (
  resume: ResumeData
): string => {
  const template =
    resume.template || "classic";

  switch (template) {
    case "modern":
      return buildModernHtml(resume);

    case "minimal":
      return buildMinimalHtml(resume);

    case "classic":
    default:
      return buildClassicHtml(resume);
  }
};

/* =========================================================
   GENERATE PDF
========================================================= */

export const generateResumePdf = async (
  resume: ResumeData
): Promise<Buffer> => {

  const browser = await puppeteer.launch({
    headless: true,

    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  try {

    const page =
      await browser.newPage();

    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1,
    });

    /*
     * IMPORTANT:
     * The template is selected here.
     *
     * classic  -> Classic PDF
     * modern   -> Modern PDF
     * minimal  -> Minimal PDF
     */

    const html =
      buildResumeHtml(resume);

    await page.setContent(html, {
      waitUntil: "load",
    });

    await page.evaluate(async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }
    });

    await page.emulateMediaType(
      "print"
    );

    const pdf = await page.pdf({
      format: "A4",

      printBackground: true,

      preferCSSPageSize: true,

      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    return Buffer.from(pdf);

  } finally {

    await browser.close();

  }
};