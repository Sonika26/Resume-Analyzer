import type { ResumeTemplate } from "../../types/resume";

interface TemplateSelectorProps {
  value: ResumeTemplate;
  onChange: (template: ResumeTemplate) => void;
}

const templates: {
  value: ResumeTemplate;
  label: string;
  description: string;
}[] = [
  {
    value: "classic",
    label: "Classic",
    description: "Traditional and professional",
  },
  {
    value: "modern",
    label: "Modern",
    description: "Contemporary and polished",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Clean and simple",
  },
];

const TemplateSelector = ({
  value,
  onChange,
}: TemplateSelectorProps) => {
  return (
    <div className="template-selector">
      <div className="template-selector-title">
        <h3>Resume Template</h3>
        <p>Choose a style for your resume</p>
      </div>

      <div className="template-selector-options">
        {templates.map((template) => (
          <button
            key={template.value}
            type="button"
            className={`template-option ${
              value === template.value
                ? "template-option-active"
                : ""
            }`}
            onClick={() => onChange(template.value)}
          >
            <div className="template-option-preview">
              <div
                className={`template-mini-preview template-mini-${template.value}`}
              >
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="template-option-info">
              <strong>{template.label}</strong>
              <small>{template.description}</small>
            </div>

            {value === template.value && (
              <span className="template-selected">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;