import type { ResumeForm } from "../../types/resume";

interface SummaryFormProps {
  form: ResumeForm;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const SummaryForm = ({
  form,
  onChange,
}: SummaryFormProps) => {
  return (
    <div className="form-fields">

      <label>
        Professional Summary

        <textarea
          name="summary"
          value={form.summary}
          onChange={onChange}
          placeholder="Write your professional summary..."
          rows={10}
        />
      </label>

    </div>
  );
};

export default SummaryForm;