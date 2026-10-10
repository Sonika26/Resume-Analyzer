
interface JobDescriptionFormProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JobDescriptionForm({
  value,
  onChange,
}: JobDescriptionFormProps) {
  return (
    <div className="jm-field">
      <label htmlFor="job-description">
        Job description
      </label>

      <p className="jm-help">
        Paste the job posting, including responsibilities,
        required skills, and qualifications.
      </p>

      <textarea
        id="job-description"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={
          "Example: We are looking for a React Developer...\n\nRequired skills:\n• React and TypeScript\n• REST APIs\n• Git\n• Responsive web development"
        }
        rows={10}
        maxLength={20000}
        required
      />

      <div className="jm-character-count">
        {value.length.toLocaleString()} / 20,000 characters
      </div>
    </div>
  );
}