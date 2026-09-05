import type { Education } from "../../types/resume";

interface EducationFormProps {
  education: Education[];

  onChange: (education: Education[]) => void;
}

const emptyEducation: Education = {
  id: "",
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  description: "",
};

const EducationForm = ({
  education,
  onChange,
}: EducationFormProps) => {
  const addEducation = () => {
    const newEducation: Education = {
      ...emptyEducation,
      id: crypto.randomUUID(),
    };

    onChange([
      ...education,
      newEducation,
    ]);
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    onChange(
      education.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const deleteEducation = (id: string) => {
    onChange(
      education.filter(
        (item) => item.id !== id
      )
    );
  };

  return (
    <div className="education-form">

      {education.map((item) => (
        <div
          key={item.id}
          className="education-card"
        >

          <label>
            Institution

            <input
              value={item.institution}
              onChange={(event) =>
                updateEducation(
                  item.id,
                  "institution",
                  event.target.value
                )
              }
              placeholder="University of Bangalore"
            />
          </label>

          <label>
            Degree

            <input
              value={item.degree}
              onChange={(event) =>
                updateEducation(
                  item.id,
                  "degree",
                  event.target.value
                )
              }
              placeholder="Bachelor of Technology"
            />
          </label>

          <label>
            Field of Study

            <input
              value={item.field}
              onChange={(event) =>
                updateEducation(
                  item.id,
                  "field",
                  event.target.value
                )
              }
              placeholder="Computer Science"
            />
          </label>

          <label>
            Start Date

            <input
              type="month"
              value={item.startDate}
              onChange={(event) =>
                updateEducation(
                  item.id,
                  "startDate",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            End Date

            <input
              type="month"
              value={item.endDate}
              onChange={(event) =>
                updateEducation(
                  item.id,
                  "endDate",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Description

            <textarea
              value={item.description}
              onChange={(event) =>
                updateEducation(
                  item.id,
                  "description",
                  event.target.value
                )
              }
              placeholder="Describe your education, achievements, coursework..."
              rows={5}
            />
          </label>

          <button
            type="button"
            className="delete-section-btn"
            onClick={() =>
              deleteEducation(item.id)
            }
          >
            Delete Education
          </button>

        </div>
      ))}

      <button
        type="button"
        className="add-section-btn"
        onClick={addEducation}
      >
        + Add Education
      </button>

    </div>
  );
};

export default EducationForm;