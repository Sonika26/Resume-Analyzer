import {
  DragEvent,
  ChangeEvent,
  useRef,
  useState,
} from "react";

interface ResumeUploaderProps {
  resume: File | null;
  setResume: (file: File | null) => void;
}

export default function ResumeUploader({
  resume,
  setResume,
}: ResumeUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const validateFile = (file: File | undefined) => {
    if (!file) return;

    const extension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    const validExtensions = [".pdf", ".docx"];

    if (!validExtensions.includes(extension)) {
      setError("Please upload a PDF or DOCX file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5 MB.");
      return;
    }

    setError("");
    setResume(file);
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    validateFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    validateFile(file);
  };

  const removeFile = () => {
    setResume(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (resume) {
    return (
      <div>
        <div className="flex min-h-27.5 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-13.5 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[9px] font-extrabold text-slate-500">
              {resume.name.toLowerCase().endsWith(".pdf")
                ? "PDF"
                : "DOCX"}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-700">
                {resume.name}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                {formatFileSize(resume.size)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={removeFile}
            className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Remove resume"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {error && (
          <p className="mt-3 text-xs font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
      />

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={[
          "flex min-h-70 cursor-pointer flex-col items-center justify-center rounded-xl border-[1.5px] border-dashed p-8 text-center transition",
          isDragging
            ? "border-slate-500 bg-slate-100"
            : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-50",
        ].join(" ")}
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm">
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 16V4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M7 9L12 4L17 9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 20H19"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h3 className="text-sm font-semibold text-slate-700">
          Drop your resume here, or{" "}
          <span className="underline underline-offset-3">
            browse
          </span>
        </h3>

        <p className="mt-2 text-xs text-slate-400">
          PDF or DOCX · Maximum file size 5 MB
        </p>
      </div>

      {error && (
        <p className="mt-3 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}