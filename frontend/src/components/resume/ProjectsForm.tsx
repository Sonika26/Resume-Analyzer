import type { ResumeForm, Project } from "../../types/resume";

interface ProjectsFormProps {
  form: ResumeForm;

  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  projectForm: Project;
  onProjectChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onSaveProject: () => void;
  onCancelProject: () => void;
  isProjectFormOpen: boolean;
  editingProjectId: string | null;
}

const ProjectsForm = ({
  form,
  projectForm,
  onProjectChange,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onSaveProject,
  onCancelProject,
  isProjectFormOpen,
  editingProjectId,
}: ProjectsFormProps) => {
  return (
    <div className="projects-form-section">

      <div className="section-heading-row">
        <h2>Projects</h2>

        {!isProjectFormOpen && (
          <button
            type="button"
            className="add-section-btn"
            onClick={onAddProject}
          >
            + Add Project
          </button>
        )}
      </div>

      {/* Existing Projects */}

      {form.projects.length > 0 && (
        <div className="project-list">

          {form.projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
            >
              <div className="project-card-content">

                <strong>
                  {project.name || "Untitled Project"}
                </strong>

                {project.role && (
                  <span>
                    {project.role}
                  </span>
                )}

                {project.description && (
                  <small>
                    {project.description}
                  </small>
                )}

              </div>

              <div className="project-card-actions">

                <button
                  type="button"
                  onClick={() => onEditProject(project)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDeleteProject(project.id)
                  }
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>
      )}

      {/* Project Form */}

      {isProjectFormOpen && (
        <div className="project-form">

          <label>
            Project Name

            <input
              name="name"
              value={projectForm.name}
              onChange={onProjectChange}
              placeholder="Resume Builder"
            />
          </label>

          <label>
            Role

            <input
              name="role"
              value={projectForm.role}
              onChange={onProjectChange}
              placeholder="Full Stack Developer"
            />
          </label>

          <label>
            Project Link

            <input
              type="url"
              name="url"
              value={projectForm.url ||""}
              onChange={onProjectChange}
              placeholder="https://github.com/your-project"
            />
          </label>

          <label>
            Technologies

            <input
              name="technologies"
              value={projectForm.technologies}
              onChange={onProjectChange}
              placeholder="React, Node.js, MongoDB"
            />
          </label>

          <label>
            Description

            <textarea
              name="description"
              value={projectForm.description}
              onChange={onProjectChange}
              placeholder="Describe what you built and your achievements..."
              rows={6}
            />
          </label>

          <div className="project-form-actions">

            <button
              type="button"
              className="save-section-btn"
              onClick={onSaveProject}
            >
              {editingProjectId
                ? "Update Project"
                : "Add Project"}
            </button>

            <button
              type="button"
              className="cancel-section-btn"
              onClick={onCancelProject}
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default ProjectsForm;