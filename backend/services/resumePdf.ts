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

@page { size: A4; margin: 0; }

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: #ffffff;
}

body {
  font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
  color: #1f2937;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.resume {
  width: 210mm;
  min-height: 297mm;
  padding: 15mm 16mm 16mm;
  margin: 0 auto;
  background: #ffffff;
  color: #1f2937;
  line-height: 1.45;
  overflow: hidden;
  word-break: normal;
}

.resume-header {
  text-align: left;
  margin-bottom: 0;
}

.resume-name {
  margin: 0;
  color: #111827;
  font-size: 31px;
  line-height: 1.08;
  font-weight: 750;
  letter-spacing: -0.8px;
  text-transform: none;
}

.resume-title {
  margin: 7px 0 13px;
  color: #4b5563;
  font-size: 13px;
  line-height: 1.3;
  font-weight: 500;
  letter-spacing: 0.15px;
}

.resume-contact {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 4px 13px;
  color: #5f6875;
  font-size: 9.5px;
  line-height: 1.45;
}

.resume-contact span,
.resume-contact a {
  color: #5f6875;
  text-decoration: none;
  white-space: nowrap;
}

.contact-separator { margin: 0; }

.resume-header-divider {
  width: 100%;
  height: 1px;
  margin: 17px 0 21px;
  background: #cfd4da;
}

.resume-section {
  margin: 0 0 22px;
  break-inside: avoid;
}

.resume-section:last-child { margin-bottom: 0; }

.resume-section-title {
  margin: 0 0 9px;
  padding-bottom: 5px;
  border-bottom: 1px solid #d9dde3;
  color: #1f2937;
  font-size: 10px;
  line-height: 1.25;
  font-weight: 750;
  letter-spacing: 1.35px;
  text-transform: uppercase;
}

.resume-summary {
  margin: 0;
  color: #4b5563;
  font-size: 10px;
  line-height: 1.6;
  text-align: left;
}

.resume-entry {
  margin: 0 0 17px;
  break-inside: avoid;
}

.resume-entry:last-child { margin-bottom: 0; }

.resume-entry-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 5px;
}

.resume-entry-main { min-width: 0; }

.resume-entry-title {
  margin: 0 0 2px;
  color: #111827;
  font-size: 11.5px;
  line-height: 1.3;
  font-weight: 750;
}

.resume-entry-company {
  display: block;
  margin-top: 0;
  color: #596273;
  font-size: 9.8px;
  line-height: 1.35;
  font-weight: 600;
}

.resume-entry-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  flex-shrink: 0;
  color: #6b7280;
  font-size: 8.8px;
  line-height: 1.4;
  text-align: right;
}

.resume-bullets {
  margin: 5px 0 0;
  padding-left: 17px;
}

.resume-bullets li {
  margin-bottom: 2px;
  padding-left: 1px;
  color: #4b5563;
  font-size: 9.7px;
  line-height: 1.58;
}

.resume-bullets li:last-child { margin-bottom: 0; }

.project-title {
  margin: 0 0 3px;
  color: #111827;
  font-size: 11.5px;
  line-height: 1.35;
  font-weight: 750;
}

.project-role {
  color: #596273;
  font-size: 9.5px;
  font-weight: 600;
}

.project-technologies {
  margin-top: 2px;
  color: #5f6875;
  font-size: 9.2px;
  line-height: 1.5;
}

.project-technologies strong { color: #374151; font-weight: 650; }

.project-link {
  display: inline-block;
  margin-top: 1px;
  color: #4b5563;
  font-size: 9px;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.skills-text {
  margin: 0;
  color: #4b5563;
  font-size: 10px;
  line-height: 1.6;
  white-space: pre-line;
}

.education-degree {
  margin: 0 0 3px;
  color: #111827;
  font-size: 11.5px;
  line-height: 1.35;
  font-weight: 750;
}

.education-institution {
  display: block;
  margin-top: 0;
  color: #596273;
  font-size: 9.7px;
  line-height: 1.4;
  font-weight: 600;
}

.education-meta {
  margin-top: 2px;
  color: #6b7280;
  font-size: 8.8px;
  line-height: 1.4;
}

.education-description,
.achievement-description {
  margin-top: 4px;
  color: #4b5563;
  font-size: 9.5px;
  line-height: 1.55;
}

.achievement-title {
  display: inline;
  margin: 0;
  color: #111827;
  font-size: 10.8px;
  line-height: 1.4;
  font-weight: 750;
}

.achievement-meta {
  margin-top: 1px;
  color: #6b7280;
  font-size: 9px;
}

.resume-section,
.resume-entry { page-break-inside: avoid; }

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

@page { size: A4; margin: 0; }

* { box-sizing: border-box; }

html, body { margin: 0; padding: 0; background: #ffffff; }

body {
  font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
  color: #1f2937;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.resume {
  width: 210mm;
  min-height: 297mm;
  padding: 15mm 16mm 16mm;
  background: #ffffff;
  line-height: 1.45;
  overflow: hidden;
  word-break: normal;
}

.modern-header {
  border-bottom: 2px solid #111827;
  padding-bottom: 12px;
  margin-bottom: 18px;
}

.modern-header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.modern-name {
  font-size: 31px;
  line-height: 1.08;
  font-weight: 750;
  letter-spacing: -0.8px;
  color: #111827;
}

.modern-job-title {
  margin-top: 7px;
  font-size: 13px;
  line-height: 1.3;
  color: #4b5563;
  font-weight: 500;
}

.modern-contact {
  max-width: 48%;
  text-align: right;
  font-size: 9.5px;
  line-height: 1.55;
  color: #5f6875;
}

.modern-contact div { margin-bottom: 2px; }
.modern-contact a { color: #374151; text-decoration: none; }

.modern-layout {
  display: grid;
  grid-template-columns: 44mm 1fr;
  gap: 11mm;
}

.modern-sidebar {
  border-right: 1px solid #d1d5db;
  padding-right: 7mm;
}

.modern-sidebar-section { margin-bottom: 20px; }

.modern-sidebar-title {
  margin: 0 0 9px;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 1.35px;
  text-transform: uppercase;
  color: #1f2937;
}

.modern-sidebar-text {
  margin: 0;
  font-size: 10px;
  line-height: 1.6;
  color: #4b5563;
  white-space: pre-line;
}

.modern-education-item { margin-bottom: 14px; }
.modern-education-degree { font-size: 10px; font-weight: 750; line-height: 1.4; }
.modern-education-institution { margin-top: 3px; font-size: 9.5px; line-height: 1.4; color: #596273; }
.modern-education-date { margin-top: 3px; font-size: 8.8px; color: #6b7280; }

.modern-main { min-width: 0; }
.modern-section { margin-bottom: 22px; break-inside: avoid; }

.modern-section-title {
  margin: 0 0 9px;
  padding-bottom: 5px;
  font-size: 10px;
  line-height: 1.25;
  font-weight: 750;
  letter-spacing: 1.35px;
  text-transform: uppercase;
  color: #1f2937;
  border-bottom: 1px solid #d9dde3;
}

.modern-section-title::after {
  content: "";
  display: block;
  width: 28px;
  height: 2px;
  margin-top: 5px;
  background: #111827;
}

.modern-summary { margin: 0; font-size: 10px; line-height: 1.6; color: #4b5563; }
.modern-entry { margin-bottom: 17px; break-inside: avoid; }
.modern-entry-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 5px; }
.modern-entry-title { margin: 0 0 2px; font-size: 11.5px; font-weight: 750; line-height: 1.3; color: #111827; }
.modern-entry-company { margin-top: 0; font-size: 9.8px; line-height: 1.35; font-weight: 600; color: #596273; }
.modern-entry-date { flex-shrink: 0; font-size: 8.8px; line-height: 1.4; text-align: right; color: #6b7280; }
.modern-entry-location { margin-top: 1px; font-size: 8.8px; color: #6b7280; }
.modern-bullets { margin: 5px 0 0; padding-left: 17px; }
.modern-bullets li { margin-bottom: 2px; font-size: 9.7px; line-height: 1.58; color: #4b5563; }
.modern-project-name { margin: 0 0 3px; font-size: 11.5px; font-weight: 750; line-height: 1.35; color: #111827; }
.modern-project-tech { margin-top: 2px; font-size: 9.2px; line-height: 1.5; color: #5f6875; }
.modern-project-tech strong { color: #374151; font-weight: 650; }
.modern-project-role { margin-top: 1px; font-size: 9.5px; color: #596273; }
.modern-project-link { font-size: 9px; color: #4b5563; text-decoration: underline; text-underline-offset: 2px; }
.modern-achievement-title { font-size: 10.8px; font-weight: 750; line-height: 1.4; color: #111827; }
.modern-achievement-meta { margin-top: 1px; font-size: 9px; color: #6b7280; }
.modern-achievement-description { margin-top: 4px; font-size: 9.5px; line-height: 1.55; color: #4b5563; }

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

@page { size: A4; margin: 0; }

* { box-sizing: border-box; }

html, body { margin: 0; padding: 0; background: #ffffff; }

body {
  font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
  color: #1f2937;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.resume {
  width: 210mm;
  min-height: 297mm;
  padding: 15mm 16mm 16mm;
  background: #ffffff;
  line-height: 1.45;
  overflow: hidden;
  word-break: normal;
}

.minimal-header { text-align: center; margin-bottom: 20px; }
.minimal-name { margin: 0; font-size: 31px; line-height: 1.08; font-weight: 750; letter-spacing: -0.8px; color: #111827; text-transform: none; }
.minimal-title { margin-top: 7px; font-size: 13px; line-height: 1.3; color: #4b5563; font-weight: 500; }
.minimal-contact { margin-top: 9px; font-size: 9.5px; line-height: 1.45; color: #5f6875; }
.minimal-contact a { color: #374151; text-decoration: none; }

.minimal-section { margin-top: 0; margin-bottom: 22px; break-inside: avoid; }
.minimal-section-title { margin: 0 0 9px; padding-bottom: 5px; border-bottom: 1px solid #d9dde3; font-size: 10px; line-height: 1.25; font-weight: 750; letter-spacing: 1.35px; text-transform: uppercase; color: #1f2937; }
.minimal-section-title::before { content: ""; display: inline-block; width: 28px; height: 2px; margin-right: 7px; margin-bottom: 3px; background: #111827; }
.minimal-text { margin: 0; font-size: 10px; line-height: 1.6; color: #4b5563; }
.minimal-entry { margin-bottom: 17px; break-inside: avoid; }
.minimal-entry-title { margin: 0 0 3px; font-size: 11.5px; line-height: 1.35; font-weight: 750; color: #111827; }
.minimal-entry-company { margin-top: 0; font-size: 9.8px; line-height: 1.35; font-weight: 600; color: #596273; }
.minimal-entry-meta { margin-top: 2px; font-size: 8.8px; line-height: 1.4; color: #6b7280; }
.minimal-bullets { margin: 5px 0 0; padding-left: 17px; }
.minimal-bullets li { margin-bottom: 2px; font-size: 9.7px; line-height: 1.58; color: #4b5563; }
.minimal-project-title { margin: 0 0 3px; font-size: 11.5px; line-height: 1.35; font-weight: 750; color: #111827; }
.minimal-project-tech { margin-top: 2px; font-size: 9.2px; line-height: 1.5; color: #5f6875; }
.minimal-project-tech strong { color: #374151; font-weight: 650; }
.minimal-project-link { display: inline-block; margin-top: 2px; font-size: 9px; color: #4b5563; text-decoration: underline; text-underline-offset: 2px; }

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
}