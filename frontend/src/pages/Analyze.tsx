import { useState } from "react";
import ResumeUploader from "../components/ResumeUploader";
import apiResume from "../services/apiresume";


interface Scores {
  atsScore: number;
  grammarScore: number;
  formattingScore: number;
  overallScore: number;
  suggestions?: string[];
}

export default function AnalyzeResume() {
  const [resume, setResume] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scores, setScores] = useState<Scores | null>(null);


  const handleAnalyze = async () => {
    if (!resume) return;

    setIsAnalyzing(true);
    setScores(null);

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      const response = await apiResume.post("/analyze", formData);
      const result = response.data;

      console.log("Analysis Result:", result);

      if (result.success) {
        setScores({
          atsScore: result.data.analysis.atsScore,
          grammarScore: result.data.analysis.grammarScore,
          formattingScore: result.data.analysis.formattingScore,
          overallScore: result.data.analysis.overallScore,
          suggestions: result.data.analysis.suggestions,
        });
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <section className="mx-auto mb-8 max-w-2xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            AI Resume Analyzer
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-slate-900 sm:text-4xl">
            Analyze your resume.
            <span className="block text-slate-400">
              Get hired faster.
            </span>
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
            Get an instant assessment of your resume's ATS compatibility,
            grammar, formatting, and overall quality.
          </p>
        </section>

        {/* Upload Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <ResumeUploader
            resume={resume}
            setResume={setResume}
          />

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!resume || isAnalyzing}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
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

        {/* Results */}
        {scores && (
          <section className="mt-6">

            {/* Results Header */}
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  Analysis complete
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                  Resume performance
                </h2>
              </div>

              <div className="hidden text-right sm:block">
                <p className="text-xs text-slate-400">
                  Score out of 100
                </p>
              </div>
            </div>

            {/* Main Analysis Card */}
            <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">

              {/* Radar / Overall */}
              <div className="flex flex-col items-center justify-center border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Overall Score
                </div>

                <div className="relative mt-2">
                  <RadarChart scores={scores} />

                  {/* Center score */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold tracking-tight text-slate-900">
                      {Math.round(scores.overallScore)}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      out of 100
                    </span>
                  </div>
                </div>

                <ScoreMessage score={scores.overallScore} />
              </div>

              {/* Score Details */}
              <div className="p-6">
                <div className="mb-5">
                  <h3 className="text-sm font-bold text-slate-900">
                    Score breakdown
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Here's how your resume performs across key areas.
                  </p>
                </div>

                <div className="space-y-4">
                  <ScoreRow
                    title="ATS Compatibility"
                    description="How well your resume works with applicant tracking systems."
                    score={scores.atsScore}
                  />

                  <ScoreRow
                    title="Grammar & Writing"
                    description="Clarity, spelling, grammar, and writing quality."
                    score={scores.grammarScore}
                  />

                  <ScoreRow
                    title="Formatting"
                    description="Structure, organization, and resume formatting."
                    score={scores.formattingScore}
                  />

                  <ScoreRow
                    title="Overall"
                    description="Combined performance across all categories."
                    score={scores.overallScore}
                    highlighted
                  />
                </div>
              </div>
            </div>

            {/* Compact Score Cards */}
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <MiniScoreCard
                title="ATS Score"
                score={scores.atsScore}
              />

              <MiniScoreCard
                title="Grammar"
                score={scores.grammarScore}
              />

              <MiniScoreCard
                title="Formatting"
                score={scores.formattingScore}
              />

              <MiniScoreCard
                title="Overall"
                score={scores.overallScore}
              />
            </div>

            {/* Suggestions */}
            {scores.suggestions && scores.suggestions.length > 0 && (
              <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    ✦
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Recommended improvements
                    </h2>
                    <p className="text-xs text-slate-500">
                      Small changes that can improve your resume score.
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {scores.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-500 shadow-sm">
                        {index + 1}
                      </span>

                      <p className="text-xs leading-5 text-slate-600">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </section>
        )}
      </div>
    </main>
  );
}


/* ------------------------------------------------ */
/* RADAR CHART */
/* ------------------------------------------------ */

function RadarChart({ scores }: { scores: Scores }) {
  const size = 240;
  const center = size / 2;
  const radius = 82;

  const values = [
    scores.atsScore,
    scores.grammarScore,
    scores.formattingScore,
    scores.overallScore,
  ];

  const labels = [
    "ATS",
    "Grammar",
    "Formatting",
    "Overall",
  ];

  const getPoint = (
    index: number,
    value: number
  ) => {
    const angle =
      -Math.PI / 2 + (index * 2 * Math.PI) / 4;

    const distance = (value / 100) * radius;

    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    };
  };

  const getGridPoint = (
    index: number,
    scale: number
  ) => {
    const angle =
      -Math.PI / 2 + (index * 2 * Math.PI) / 4;

    const distance = radius * scale;

    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const gridPolygons = gridLevels.map((level) =>
    Array.from({ length: 4 }, (_, index) => {
      const point = getGridPoint(index, level);
      return `${point.x},${point.y}`;
    }).join(" ")
  );

  const scorePolygon = values
    .map((value, index) => {
      const point = getPoint(index, value);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="overflow-visible"
    >
      {/* Grid */}
      {gridPolygons.map((polygon, index) => (
        <polygon
          key={index}
          points={polygon}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {Array.from({ length: 4 }, (_, index) => {
        const point = getGridPoint(index, 1);

        return (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        );
      })}

      {/* Score area */}
      <polygon
        points={scorePolygon}
        fill="#0f172a"
        fillOpacity="0.10"
        stroke="#0f172a"
        strokeWidth="2"
      />

      {/* Score points */}
      {values.map((value, index) => {
        const point = getPoint(index, value);

        return (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="white"
            stroke="#0f172a"
            strokeWidth="2"
          />
        );
      })}

      {/* Labels */}
      {labels.map((label, index) => {
        const point = getGridPoint(index, 1.25);

        let textAnchor: "start" | "middle" | "end" = "middle";

        if (point.x < center - 10) {
          textAnchor = "end";
        } else if (point.x > center + 10) {
          textAnchor = "start";
        }

        return (
          <text
            key={label}
            x={point.x}
            y={point.y}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            className="fill-slate-500 text-[10px] font-semibold"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}


/* ------------------------------------------------ */
/* SCORE ROW */
/* ------------------------------------------------ */

function ScoreRow({
  title,
  description,
  score,
  highlighted = false,
}: {
  title: string;
  description: string;
  score: number;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3.5 ${
        highlighted
          ? "border-slate-200 bg-slate-50"
          : "border-slate-100 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-slate-800">
            {title}
          </h4>

          <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
            {description}
          </p>
        </div>

        <span className="shrink-0 text-lg font-bold text-slate-900">
          {Math.round(score)}
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900 transition-all duration-700"
          style={{
            width: `${Math.min(100, Math.max(0, score))}%`,
          }}
        />
      </div>
    </div>
  );
}


/* ------------------------------------------------ */
/* MINI SCORE CARD */
/* ------------------------------------------------ */

function MiniScoreCard({
  title,
  score,
}: {
  title: string;
  score: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500">
          {title}
        </span>

        <span className="text-[10px] font-medium text-slate-400">
          / 100
        </span>
      </div>

      <div className="mt-2 flex items-end justify-between">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          {Math.round(score)}
        </span>

        <ScoreBadge score={score} />
      </div>
    </div>
  );
}


/* ------------------------------------------------ */
/* SCORE BADGE */
/* ------------------------------------------------ */

function ScoreBadge({ score }: { score: number }) {
  let label = "Needs work";

  if (score >= 85) {
    label = "Excellent";
  } else if (score >= 70) {
    label = "Good";
  } else if (score >= 55) {
    label = "Fair";
  }

  return (
    <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-500">
      {label}
    </span>
  );
}


/* ------------------------------------------------ */
/* OVERALL MESSAGE */
/* ------------------------------------------------ */

function ScoreMessage({ score }: { score: number }) {
  let title = "Room for improvement";
  let description =
    "A few improvements could make your resume stronger.";

  if (score >= 85) {
    title = "Excellent resume";
    description =
      "Your resume is performing strongly across the key areas.";
  } else if (score >= 70) {
    title = "Strong foundation";
    description =
      "Your resume is in good shape, with a few areas to improve.";
  } else if (score >= 55) {
    title = "Good starting point";
    description =
      "Some targeted improvements can significantly strengthen it.";
  }

  return (
    <div className="mt-1 max-w-xs text-center">
      <h3 className="text-sm font-bold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}