import type { ResumeForm } from "../../types/resume";

interface MinimalTemplateProps {
  form: ResumeForm;
  previewExperience?: ResumeForm["experience"];
  previewProjects?: ResumeForm["projects"];
  previewAchievements?: ResumeForm["achievements"];
}

const MinimalTemplate = ({
  form,
  previewExperience,
  previewProjects,
  previewAchievements,
}: MinimalTemplateProps) => {
  const experience = previewExperience ?? form.experience;
  const projects = previewProjects ?? form.projects;
  const achievements =
    previewAchievements ?? form.achievements;

  return (
    <div className="resume-template minimal-template">
      {/* ================= HEADER ================= */}

      <header className="minimal-header">
        <h1>
          {form.firstName || "Your"}{" "}
          {form.lastName || "Name"}
        </h1>

        <div className="minimal-job-title">
          {form.jobTitle || "Professional Title"}
        </div>

        <div className="minimal-contact">
          {form.email && <span>{form.email}</span>}

          {form.phone && <span>{form.phone}</span>}

          {form.location && (
            <span>{form.location}</span>
          )}
        </div>

        {(form.linkedin ||
          form.github ||
          form.portfolio) && (
          <div className="minimal-links">
            {form.linkedin && (
              <a
                href={form.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                {form.linkedin}
              </a>
            )}

            {form.github && (
              <a
                href={form.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                {form.github}
              </a>
            )}

            {form.portfolio && (
              <a
                href={form.portfolio}
                target="_blank"
                rel="noopener noreferrer"
              >
                {form.portfolio}
              </a>
            )}
          </div>
        )}
      </header>

      {/* ================= SUMMARY ================= */}

      {form.summary && (
        <section className="minimal-section">
          <h2>Summary</h2>

          <p>{form.summary}</p>
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}

      {experience.length > 0 && (
        <section className="minimal-section">
          <h2>Experience</h2>

          {experience.map((item, index) => (
            <article
              className="minimal-entry"
              key={
                item.id ||
                `experience-${index}`
              }
            >
              <div className="minimal-entry-header">
                <div>
                  <h3>
                    {item.position ||
                      "Position"}
                  </h3>

                  {item.company && (
                    <div className="minimal-company">
                      {item.company}

                      {item.location && (
                        <span>
                          {" "}
                          · {item.location}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {(item.startDate ||
                  item.endDate ||
                  item.current) && (
                  <div className="minimal-date">
                    {item.startDate}

                    {(item.startDate ||
                      item.endDate ||
                      item.current) &&
                      " — "}

                    {item.current
                      ? "Present"
                      : item.endDate}
                  </div>
                )}
              </div>

              {item.description && (
                <p>{item.description}</p>
              )}
            </article>
          ))}
        </section>
      )}

      {/* ================= EDUCATION ================= */}

      {form.education.length > 0 && (
        <section className="minimal-section">
          <h2>Education</h2>

          {form.education.map((education) => (
            <article
              className="minimal-entry"
              key={education.id}
            >
              <div className="minimal-entry-header">
                <div>
                  <h3>
                    {education.degree}

                    {education.field &&
                      ` — ${education.field}`}
                  </h3>

                  <div className="minimal-company">
                    {education.institution}
                  </div>
                </div>

                {(education.startDate ||
                  education.endDate) && (
                  <div className="minimal-date">
                    {education.startDate}

                    {(education.startDate ||
                      education.endDate) &&
                      " — "}

                    {education.endDate}
                  </div>
                )}
              </div>

              {education.description && (
                <p>
                  {education.description}
                </p>
              )}
            </article>
          ))}
        </section>
      )}

      {/* ================= PROJECTS ================= */}

      {projects.length > 0 && (
        <section className="minimal-section">
          <h2>Projects</h2>

          {projects.map((project, index) => (
            <article
              className="minimal-entry"
              key={
                project.id ||
                `project-${index}`
              }
            >
              <div className="minimal-project-header">
                <div>
                  <h3>
                    {project.name}
                  </h3>

                  {project.role && (
                    <div className="minimal-company">
                      {project.role}
                    </div>
                  )}
                </div>

                {project.url && (
                  <a
                    className="minimal-project-link"
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.url}
                  </a>
                )}
              </div>

              {project.technologies && (
                <div className="minimal-technologies">
                  {project.technologies}
                </div>
              )}

              {project.description && (
                <p>
                  {project.description}
                </p>
              )}
            </article>
          ))}
        </section>
      )}

      {/* ================= SKILLS ================= */}

      {form.skills && (
        <section className="minimal-section">
          <h2>Skills</h2>

          <div className="minimal-skills">
            {form.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
              .map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                >
                  {skill}
                </span>
              ))}
          </div>
        </section>
      )}

      {/* ================= ACHIEVEMENTS ================= */}

      {achievements.length > 0 && (
        <section className="minimal-section">
          <h2>Achievements</h2>

          {achievements.map(
            (achievement, index) => (
              <article
                className="minimal-entry"
                key={
                  achievement.id ||
                  `achievement-${index}`
                }
              >
                <div className="minimal-entry-header">
                  <div>
                    <h3>
                      {achievement.title}
                    </h3>

                    {achievement.organization && (
                      <div className="minimal-company">
                        {
                          achievement.organization
                        }
                      </div>
                    )}
                  </div>

                  {achievement.date && (
                    <div className="minimal-date">
                      {achievement.date}
                    </div>
                  )}
                </div>

                {achievement.description && (
                  <p>
                    {achievement.description}
                  </p>
                )}
              </article>
            )
          )}
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;