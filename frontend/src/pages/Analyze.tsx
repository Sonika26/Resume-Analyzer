import { useState } from "react";
import ResumeUploader from "../components/ResumeUploader";

export default function AnalyzeResume() {
  const [resume, setResume] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!resume) return;

    setIsAnalyzing(true);

    // Backend integration will go here
     const formData = new FormData();
     formData.append("resume", resume);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Resume ready for analysis:", resume);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] px-4 py-2 sm:px-6 lg:py-20">
      <div className="mx-auto mt-1 max-w-4xl">
        {/* Header */}
        <section className="mx-auto mt-0 mb-10 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            AI Resume Analyzer
          </div>

          <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-slate-900 sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
            Analyze your resume.
            <span className="block text-slate-500">
              Get hired faster.
            </span>
          </h1>

          <p className="mx-auto mt-3  max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Upload your resume and get an AI-powered analysis of your
            experience, skills, ATS compatibility, and areas for improvement.
          </p>
        </section>

        {/* Main Card */}
        <section className="rounded-2xl  border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(16,24,40,0.06)] sm:p-7">
          {/* Card Header */}
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Upload your resume
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Supported formats: PDF and DOCX
              </p>
            </div>

            <div className="hidden items-center gap-1.5 text-xs font-medium text-slate-500 sm:flex">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 3L19 6V11C19 15.5 16.1 19.7 12 21C7.9 19.7 5 15.5 5 11V6L12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12L11 14L15 10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Secure
            </div>
          </div>

          {/* Uploader */}
          <ResumeUploader
            resume={resume}
            setResume={setResume}
          />

          {/* Analyze Button */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!resume || isAnalyzing}
            className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isAnalyzing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Analyzing resume...
              </>
            ) : (
              <>
                Analyze Resume

                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M13 6L19 12L13 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>

          <p className="mt-3 text-center text-[11px] text-slate-400">
            Your resume is used only for analysis. We respect your privacy.
          </p>
        </section>

        {/* Features */}
        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          <Feature
            title="Resume parsing"
            description="Extract experience, skills and education automatically."
            icon={
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 19V5C4 4.45 4.45 4 5 4H15L20 9V19C20 19.55 19.55 20 19 20H5C4.45 20 4 19.55 4 19Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M14 4V9H19"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
              </svg>
            }
          />

          <Feature
            title="ATS insights"
            description="Identify issues that could hurt your ATS score."
            icon={
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 19V10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10 19V5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M16 19V13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M22 19V8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            }
          />

          <Feature
            title="AI recommendations"
            description="Get actionable suggestions to improve your resume."
            icon={
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 3L14.7 8.3L20.5 9.1L16.3 13.2L17.3 19L12 16.3L6.7 19L7.7 13.2L3.5 9.1L9.3 8.3L12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </section>
      </div>
    </main>
  );
}

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function Feature({
  title,
  description,
  icon,
}: FeatureProps) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-white/70 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600">
        {icon}
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-700">
          {title}
        </h3>

        <p className="mt-1 text-[11px] leading-5 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}