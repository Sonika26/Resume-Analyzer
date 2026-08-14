import { useState } from "react";
import ResumeUploader from "../components/ResumeUploader";

export default function AnalyzeResume() {
  const [resume, setResume] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scores, setScores] = useState<{
    atsScore: number;
    grammarScore: number;
    formattingScore: number;
    overallScore: number;
    suggestions?: string[];
  } | null>(null);

  const handleAnalyze = async () => {
    if (!resume) return;

    setIsAnalyzing(true);
    setScores(null);

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      const response = await fetch("http://localhost:5000/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Analysis Result:", result);

      if (result.success) {
        setScores({
          atsScore: result.data.atsScore,
          grammarScore: result.data.grammarScore,
          formattingScore: result.data.formattingScore,
          overallScore: result.data.overallScore,
          suggestions: result.data.suggestions,
        });
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
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
        </section>

        {/* Upload Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md sm:p-7">
          <ResumeUploader resume={resume} setResume={setResume} />

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
              "Analyze Resume"
            )}
          </button>
        </section>

        {/* Scoreboard */}
        {scores && (
          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ScoreCard title="ATS Score" value={scores.atsScore} />
            <ScoreCard title="Grammar Score" value={scores.grammarScore} />
            <ScoreCard title="Formatting Score" value={scores.formattingScore} />
            <ScoreCard title="Overall Score" value={scores.overallScore} />
          </section>
        )}

        {/* Suggestions */}
        {scores?.suggestions && (
          <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Suggestions
            </h2>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
              {scores.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

interface ScoreCardProps {
  title: string;
  value: number;
}

function ScoreCard({ title, value }: ScoreCardProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
