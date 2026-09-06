import type { ResumeForm } from "../../types/resume";
import "./template.css";

interface ClassicTemplateProps {
  form: ResumeForm;
  previewExperience?: ResumeForm["experience"];
  previewProjects?: ResumeForm["projects"];
  previewAchievements?: ResumeForm["achievements"];
}

const ClassicTemplate = ({
  form,
  previewExperience,
  previewProjects,
  previewAchievements,
}: ClassicTemplateProps) => {
  const experience = previewExperience ?? form.experience;
  const projects = previewProjects ?? form.projects;
  const achievements = previewAchievements ?? form.achievements;

  return (
    <div className="resume-template classic-template">
      {/* ================= HEADER ================= */}

      <header className="classic-header">
        <h1>
          {form.firstName || "Your"} {form.lastName || "Name"}
        </h1>

        <h2>{form.jobTitle || "Professional Title"}</h2>

        <div className="classic-contact">
          {form.email && <span>{form.email}</span>}

          {form.phone && <span>{form.phone}</span>}

          {form.location && <span>{form.location}</span>}

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
      </header>

      {/* ================= SUMMARY ================= */}

      {form.summary && (
        <section className="classic-section">
          <h3>Professional Summary</h3>

          <p>{form.summary}</p>
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}

      {experience.length > 0 && (
        <section className="classic-section">
          <h3>Experience</h3>

          {experience.map((item, index) => (
            <article
              className="classic-experience"
              key={item.id || `experience-${index}`}
            >
              <div className="classic-item-header">
                <div>
                  <h4>{item.position || "Position"}</h4>

                  {item.company && (
                    <strong>{item.company}</strong>
                  )}
                </div>

                <div className="classic-item-meta">
                  {(item.startDate ||
                    item.endDate ||
                    item.current) && (
                    <span>
                      {item.startDate || "Start date"} –{" "}
                      {item.current
                        ? "Present"
                        : item.endDate || "End date"}
                    </span>
                  )}

                  {item.location && (
                    <span>{item.location}</span>
                  )}
                </div>
              </div>

              {item.description && (
                <p>{item.description}</p>
              )}
            </article>
          ))}
        </section>
      )}

      {/* ================= PROJECTS ================= */}

      {projects.length > 0 && (
        <section className="classic-section">
          <h3>Projects</h3>

          {projects.map((project, index) => (
            <article
              className="classic-project"
              key={project.id || `project-${index}`}
            >
              <div className="classic-project-title">
                <h4>{project.name}</h4>

                {project.role && (
                  <strong>{project.role}</strong>
                )}
              </div>

              {project.technologies && (
                <div className="classic-project-detail">
                  <strong>Technologies:</strong>{" "}
                  {project.technologies}
                </div>
              )}

              {project.url && (
                <div className="classic-project-detail">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Project Link
                  </a>
                </div>
              )}

              {project.description && (
                <p>{project.description}</p>
              )}
            </article>
          ))}
        </section>
      )}

      {/* ================= SKILLS ================= */}

      {form.skills && (
        <section className="classic-section">
          <h3>Skills</h3>

          <p>{form.skills}</p>
        </section>
      )}

      {/* ================= EDUCATION ================= */}

      {form.education.length > 0 && (
        <section className="classic-section">
          <h3>Education</h3>

          {form.education.map((education) => (
            <article
              className="classic-education"
              key={education.id}
            >
              <div className="classic-item-header">
                <div>
                  <h4>
                    {education.degree}

                    {education.field &&
                      ` - ${education.field}`}
                  </h4>

                  <strong>
                    {education.institution}
                  </strong>
                </div>

                {(education.startDate ||
                  education.endDate) && (
                  <div className="classic-item-meta">
                    <span>
                      {education.startDate}{" "}
                      {education.startDate &&
                        education.endDate &&
                        "–"}{" "}
                      {education.endDate}
                    </span>
                  </div>
                )}
              </div>

              {education.description && (
                <p>{education.description}</p>
              )}
            </article>
          ))}
        </section>
      )}

      {/* ================= ACHIEVEMENTS ================= */}

      {achievements.length > 0 && (
        <section className="classic-section">
          <h3>Achievements</h3>

          {achievements.map((achievement, index) => (
            <article
              className="classic-achievement"
              key={
                achievement.id ||
                `achievement-${index}`
              }
            >
              <h4>{achievement.title}</h4>

              <div className="classic-achievement-meta">
                {achievement.organization && (
                  <strong>
                    {achievement.organization}
                  </strong>
                )}

                {achievement.date && (
                  <span>
                    {achievement.organization && " • "}
                    {achievement.date}
                  </span>
                )}
              </div>

              {achievement.description && (
                <p>{achievement.description}</p>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;