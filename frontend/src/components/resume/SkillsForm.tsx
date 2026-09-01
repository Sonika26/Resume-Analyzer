import type { ResumeForm } from "../../types/resume";

interface SkillsFormProps {
  form: ResumeForm;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const SkillsForm = ({
  form,
  onChange,
}: SkillsFormProps) => {
  return (
    <div className="form-fields">

      <label>
        Skills

        <textarea
          name="skills"
          value={form.skills}
          onChange={onChange}
          placeholder="React, TypeScript, Node.js..."
          rows={8}
        />

      </label>

    </div>
  );
};

export default SkillsForm;