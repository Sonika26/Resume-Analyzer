import { useState } from "react";
import {
  Clipboard,
  Check,
  FileText,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { generateCoverLetter } from "../services/coverLetterApi";

const MAX_CHARACTERS = 5000;

const CoverLetterPage = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);


const [error, setError] = useState("");

const handleGenerate = async () => {
  if (!jobDescription.trim()) {
    return;
  }

  setIsGenerating(true);
  setError("");

  try {
    const result = await generateCoverLetter(jobDescription);
    setCoverLetter(result);
  } catch (err) {
    console.error(err);
    setError("Failed to generate cover letter. Please try again.");
  }
};

  const handleCopy = async () => {
    if (!coverLetter) return;

    await navigator.clipboard.writeText(coverLetter);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const charactersRemaining = MAX_CHARACTERS - jobDescription.length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
              <FileText className="h-5 w-5 text-white" />
            </div>

            <span className="text-lg font-semibold text-slate-900">
              Cover Letter Generator
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Page heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
            <Sparkles className="h-4 w-4" />
            AI-powered cover letters
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Create a tailored cover letter
          </h1>

          <p className="mt-3 text-lg text-slate-500">
            Paste the job description and generate a professional cover letter
            tailored to the position.
          </p>
        </div>

        {/* Generator */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Job Description */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Job Description
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Paste the job description for the position you're applying for.
              </p>
            </div>

            <textarea
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(
                  event.target.value.slice(0, MAX_CHARACTERS)
                )
              }
              placeholder="Paste the job description here..."
              className="min-h-[420px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />

            <div className="mt-2 flex justify-end">
              <span
                className={`text-xs ${
                  charactersRemaining < 500
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
              >
                {jobDescription.length} / {MAX_CHARACTERS}
              </span>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={!jobDescription.trim() || isGenerating}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Cover Letter
                </>
              )}
            </button>

            {error && (
              <p className="mt-3 text-sm text-red-500" role="alert">
                {error}
              </p>
            )}
          </section>

          {/* Cover Letter Output */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Your Cover Letter
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your generated cover letter will appear here.
                </p>
              </div>

              {coverLetter && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="min-h-[420px] rounded-xl border border-slate-200 bg-slate-50 p-6">
              {coverLetter ? (
                <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {coverLetter}
                </div>
              ) : (
                <div className="flex h-full min-h-[370px] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                    <FileText className="h-6 w-6 text-slate-400" />
                  </div>

                  <h3 className="font-medium text-slate-700">
                    No cover letter yet
                  </h3>

                  <p className="mt-1 max-w-sm text-sm text-slate-400">
                    Paste a job description and click "Generate Cover Letter"
                    to create your tailored letter.
                  </p>
                </div>
              )}
            </div>

            {coverLetter && (
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                Generate Again
              </button>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default CoverLetterPage;