import type { Experience } from "../../types/resume";

interface ExperienceFormProps {
  experiences: Experience[];

  experienceForm: Experience;

  editingExperienceId: string | null;

  isExperienceFormOpen: boolean;

  onAdd: () => void;

  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  onSave: () => void;

  onEdit: (experience: Experience) => void;

  onDelete: (id: string) => void;

  onCancel: () => void;
}

const ExperienceForm = ({
  experiences,
  experienceForm,
  editingExperienceId,
  isExperienceFormOpen,
  onAdd,
  onChange,
  onSave,
  onEdit,
  onDelete,
  onCancel,
}: ExperienceFormProps) => {
  return (
    <div className="experience-editor-section">

      <div className="section-heading-row">
        <h2>Experience</h2>

        {!isExperienceFormOpen && (
          <button
            type="button"
            className="add-section-btn"
            onClick={onAdd}
          >
            + Add Experience
          </button>
        )}
      </div>

      {experiences.length > 0 && (
        <div className="experience-list">

          {experiences.map((experience) => (
            <div
              key={experience.id}
              className="experience-card"
            >

              <div className="experience-card-content">

                <strong>
                  {experience.position ||
                    "Untitled Position"}
                </strong>

                <span>
                  {experience.company || "Company"}
                </span>

                {experience.location && (
                  <small>
                    {experience.location}
                  </small>
                )}

                <small>
                  {experience.startDate ||
                    "Start date"}

                  {" – "}

                  {experience.current
                    ? "Present"
                    : experience.endDate ||
                      "End date"}
                </small>

              </div>

              <div className="experience-card-actions">

                <button
                  type="button"
                  onClick={() =>
                    onEdit(experience)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDelete(experience.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {isExperienceFormOpen && (
        <div className="experience-form">

          <label>
            Company

            <input
              name="company"
              value={experienceForm.company}
              onChange={onChange}
              placeholder="Google"
            />
          </label>

          <label>
            Position

            <input
              name="position"
              value={experienceForm.position}
              onChange={onChange}
              placeholder="Frontend Developer"
            />
          </label>

          <label>
            Location

            <input
              name="location"
              value={experienceForm.location}
              onChange={onChange}
              placeholder="Bangalore, India"
            />
          </label>

          <label>
            Start Date

            <input
              type="month"
              name="startDate"
              value={experienceForm.startDate}
              onChange={onChange}
            />
          </label>

          <label>
            End Date

            <input
              type="month"
              name="endDate"
              value={experienceForm.endDate}
              onChange={onChange}
              disabled={experienceForm.current}
            />
          </label>

          <label className="checkbox-label">

            <input
              type="checkbox"
              name="current"
              checked={experienceForm.current}
              onChange={onChange}
            />

            I currently work here

          </label>

          <label>
            Description

            <textarea
              name="description"
              value={experienceForm.description}
              onChange={onChange}
              placeholder="Describe your responsibilities and achievements..."
              rows={6}
            />

          </label>

          <div className="experience-form-actions">

            <button
              type="button"
              className="save-section-btn"
              onClick={onSave}
            >
              {editingExperienceId
                ? "Update Experience"
                : "Add Experience"}
            </button>

            <button
              type="button"
              className="cancel-section-btn"
              onClick={onCancel}
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default ExperienceForm;