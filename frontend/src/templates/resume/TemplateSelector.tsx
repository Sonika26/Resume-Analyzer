import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  const selectedTemplate = templates.find(
    (template) => template.value === value
  );

  const handleSelect = (template: ResumeTemplate) => {
    onChange(template);
    setIsOpen(false);
  };

  return (
    <div className="template-selector">
      {/* Dropdown Button */}
      <button
        type="button"
        className="template-dropdown-button"
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <div>
          <strong>Resume Template</strong>

          <span>
            {selectedTemplate?.label || "Choose a template"}
          </span>
        </div>

        <span
          className={`template-dropdown-arrow ${
            isOpen ? "template-dropdown-arrow-open" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Template Options - Hidden until clicked */}
      {isOpen && (
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
              onClick={() => handleSelect(template.value)}
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
      )}
    </div>
  );
};

export default TemplateSelector;