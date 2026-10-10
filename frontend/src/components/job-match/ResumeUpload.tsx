
import { useRef } from "react";

interface ResumeUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ResumeUpload({
  file,
  onChange,
}: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selected = event.target.files?.[0];

    if (!selected) return;

    const extension = selected.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (!["pdf", "docx"].includes(extension ?? "")) {
      onChange(null);
      alert("Please select a PDF or DOCX file.");
      event.target.value = "";
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      onChange(null);
      alert("Your resume must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    onChange(selected);
  }

  return (
    <div className="jm-upload">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        hidden
      />

      <button
        type="button"
        className="jm-upload-area"
        onClick={() => inputRef.current?.click()}
      >
        <span className="jm-upload-icon">↑</span>

        <strong>
          {file ? "Resume selected" : "Upload your resume"}
        </strong>

        <span>
          {file
            ? file.name
            : "Click to browse or select a PDF/DOCX file"}
        </span>

        <small>Maximum file size: 5 MB</small>
      </button>

      {file && (
        <button
          type="button"
          className="jm-remove-file"
          onClick={() => {
            onChange(null);
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
        >
          Remove resume
        </button>
      )}
    </div>
  );
}