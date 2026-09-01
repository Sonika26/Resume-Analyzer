import type { ResumeForm } from "../../types/resume";

interface ProjectsFormProps {
  form: ResumeForm;
}

const ProjectsForm = ({
  form,
}: ProjectsFormProps) => {
  return (
    <div className="form-fields">

      <p className="section-placeholder">
        Projects section coming next.
      </p>

      <p>
        You currently have{" "}
        {form.projects.length} project
        {form.projects.length !== 1 ? "s" : ""}.
      </p>

    </div>
  );
};

export default ProjectsForm;