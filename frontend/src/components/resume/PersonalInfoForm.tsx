import type { ResumeForm } from "../../types/resume";

interface PersonalInfoFormProps {
  form: ResumeForm;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const PersonalInfoForm = ({
  form,
  onChange,
}: PersonalInfoFormProps) => {
  return (
    <div className="form-fields">

      <label>
        First Name
        <input
          name="firstName"
          value={form.firstName}
          onChange={onChange}
          placeholder="First Name"
        />
      </label>

      <label>
        Last Name
        <input
          name="lastName"
          value={form.lastName}
          onChange={onChange}
          placeholder="Last Name"
        />
      </label>

      <label>
        Job Title
        <input
          name="jobTitle"
          value={form.jobTitle}
          onChange={onChange}
          placeholder="Frontend Developer"
        />
      </label>

      <label>
        Email
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="email@example.com"
        />
      </label>

      <label>
        Phone
        <input
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder="+91 9876543210"
        />
      </label>

      <label>
        Location
        <input
          name="location"
          value={form.location}
          onChange={onChange}
          placeholder="Bangalore, India"
        />
      </label>

      <label>
        LinkedIn
        <input
          type="url"
          name="linkedin"
          value={form.linkedin}
          onChange={onChange}
          placeholder="https://linkedin.com/in/yourname"
        />
      </label>

      <label>
        GitHub
        <input
          type="url"
          name="github"
          value={form.github}
          onChange={onChange}
          placeholder="https://github.com/yourname"
        />
      </label>

      <label>
        Portfolio
        <input
          type="url"
          name="portfolio"
          value={form.portfolio}
          onChange={onChange}
          placeholder="https://yourportfolio.com"
        />
      </label>

    </div>
  );
};

export default PersonalInfoForm;