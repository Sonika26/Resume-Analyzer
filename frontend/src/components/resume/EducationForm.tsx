import type { ResumeForm } from "../../types/resume";

interface EducationFormProps {
  form: ResumeForm;
}

const EducationForm = ({
  form,
}: EducationFormProps) => {
  return (
    <div className="form-fields">

      <p className="section-placeholder">
        Education section coming next.
      </p>

      <p>
        You currently have{" "}
        {form.education.length} education
        {form.education.length !== 1 ? "s" : ""}.
      </p>

    </div>
  );
};

export default EducationForm;