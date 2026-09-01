import type { ResumeForm } from "../../types/resume";

interface LanguagesFormProps {
  form: ResumeForm;
}

const LanguagesForm = ({
  form,
}: LanguagesFormProps) => {
  return (
    <div className="form-fields">

      <p className="section-placeholder">
        Languages section coming next.
      </p>

      <p>
        You currently have{" "}
        {form.languages.length} language
        {form.languages.length !== 1
          ? "s"
          : ""}.
      </p>

    </div>
  );
};

export default LanguagesForm;