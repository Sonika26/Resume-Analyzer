import type { ResumeForm } from "../../types/resume";

interface ModernTemplateProps {
  form: ResumeForm;
  previewExperience?: ResumeForm["experience"];
  previewProjects?: ResumeForm["projects"];
  previewAchievements?: ResumeForm["achievements"];
}

const ModernTemplate = ({
  form,
  previewExperience,
  previewProjects,
  previewAchievements,
}: ModernTemplateProps) => {
  const experience = previewExperience ?? form.experience;
  const projects = previewProjects ?? form.projects;
  const achievements = previewAchievements ?? form.achievements;

  return (
    <div className="resume-template modern-template">
      {/* ================= HEADER ================= */}

      <header className="modern-header">
        <div className="modern-header-main">
          <div>
            <h1>
              {form.firstName || "Your"}{" "}
              {form.lastName || "Name"}
            </h1>

            <h2>
              {form.jobTitle || "Professional Title"}
            </h2>
          </div>

          <div className="modern-contact">
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
        </div>

        {(form.linkedin ||
          form.github ||
          form.portfolio) && (
          <div className="modern-links">
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
        )}
      </header>

      {/* ================= SUMMARY ================= */}

      {form.summary && (
        <section className="modern-section">
          <div className="modern-section-heading">
            <span className="modern-section-number">
              01
            </span>

            <h3>Profile</h3>
          </div>

          <div className="modern-section-content">
            <p>{form.summary}</p>
          </div>
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}

      {experience.length > 0 && (
        <section className="modern-section">
          <div className="modern-section-heading">
            <span className="modern-section-number">
              02
            </span>

            <h3>Experience</h3>
          </div>

          <div className="modern-section-content">
            {experience.map((item, index) => (
              <article
                className="modern-experience"
                key={
                  item.id ||
                  `experience-${index}`
                }
              >
                <div className="modern-experience-date">
                  {(item.startDate ||
                    item.endDate ||
                    item.current) && (
                    <>
                      <span>
                        {item.startDate ||
                          "Start date"}
                      </span>

                      <span className="modern-date-separator">
                        —
                      </span>

                      <span>
                        {item.current
                          ? "Present"
                          : item.endDate ||
                            "End date"}
                      </span>
                    </>
                  )}
                </div>

                <div className="modern-experience-body">
                  <h4>
                    {item.position ||
                      "Position"}
                  </h4>

                  {item.company && (
                    <div className="modern-company">
                      {item.company}

                      {item.location && (
                        <span>
                          {" "}
                          · {item.location}
                        </span>
                      )}
                    </div>
                  )}

                  {item.description && (
                    <p>{item.description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ================= PROJECTS ================= */}

      {projects.length > 0 && (
        <section className="modern-section">
          <div className="modern-section-heading">
            <span className="modern-section-number">
              03
            </span>

            <h3>Projects</h3>
          </div>

          <div className="modern-section-content">
            {projects.map((project, index) => (
              <article
                className="modern-project"
                key={
                  project.id ||
                  `project-${index}`
                }
              >
                <div className="modern-project-top">
                  <div>
                    <h4>{project.name}</h4>

                    {project.role && (
                      <span className="modern-project-role">
                        {project.role}
                      </span>
                    )}
                  </div>

                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project ↗
                    </a>
                  )}
                </div>

                {project.technologies && (
                  <div className="modern-technologies">
                    {project.technologies}
                  </div>
                )}

                {project.description && (
                  <p>{project.description}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ================= SKILLS ================= */}

      {form.skills && (
        <section className="modern-section">
          <div className="modern-section-heading">
            <span className="modern-section-number">
              04
            </span>

            <h3>Skills</h3>
          </div>

          <div className="modern-section-content">
            <div className="modern-skills">
              {form.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
                .map((skill, index) => (
                  <span
                    className="modern-skill"
                    key={`${skill}-${index}`}
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= EDUCATION ================= */}

      {form.education.length > 0 && (
        <section className="modern-section">
          <div className="modern-section-heading">
            <span className="modern-section-number">
              05
            </span>

            <h3>Education</h3>
          </div>

          <div className="modern-section-content">
            {form.education.map((education) => (
              <article
                className="modern-education"
                key={education.id}
              >
                <div className="modern-education-date">
                  {education.startDate &&
                    education.endDate && (
                      <>
                        {education.startDate} —
                        {education.endDate}
                      </>
                    )}
                </div>

                <div>
                  <h4>
                    {education.degree}

                    {education.field &&
                      ` — ${education.field}`}
                  </h4>

                  <strong>
                    {education.institution}
                  </strong>

                  {education.description && (
                    <p>
                      {education.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ================= ACHIEVEMENTS ================= */}

      {achievements.length > 0 && (
        <section className="modern-section">
          <div className="modern-section-heading">
            <span className="modern-section-number">
              06
            </span>

            <h3>Achievements</h3>
          </div>

          <div className="modern-section-content">
            {achievements.map(
              (achievement, index) => (
                <article
                  className="modern-achievement"
                  key={
                    achievement.id ||
                    `achievement-${index}`
                  }
                >
                  <div className="modern-achievement-marker">
                    ●
                  </div>

                  <div>
                    <h4>
                      {achievement.title}
                    </h4>

                    {(achievement.organization ||
                      achievement.date) && (
                      <div className="modern-achievement-meta">
                        {achievement.organization && (
                          <strong>
                            {
                              achievement.organization
                            }
                          </strong>
                        )}

                        {achievement.date && (
                          <span>
                            {achievement.organization &&
                              " · "}
                            {achievement.date}
                          </span>
                        )}
                      </div>
                    )}

                    {achievement.description && (
                      <p>
                        {achievement.description}
                      </p>
                    )}
                  </div>
                </article>
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernTemplate;