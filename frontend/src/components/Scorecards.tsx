import React from "react";

interface ScoreCardProps {
  title: string;
  score: number;
  color: string;
  status: string;
}

const Scorecards: React.FC<ScoreCardProps> = ({ title, score, color, status }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white border border-slate-200 shadow-sm h-40 w-[390px] rounded-2xl p-5 flex items-center gap-6">
      {/* Circular Score */}
      <div className="relative w-28 h-28 flex-shrink-0">
        <svg
          width="112"
          height="112"
          viewBox="0 0 112 112"
          className="-rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="9"
          />

          {/* Progress circle */}
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Score in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{score}</span>
          <span className="text-[10px] text-slate-400">/100</span>
        </div>
      </div>

      {/* Card Information */}
      <div className="flex flex-col">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>

        <div
          className="mt-2 w-fit px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            color: color,
            backgroundColor: `${color}15`,
          }}
        >
          ● {status}
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Based on your recent resume analysis
        </p>
      </div>
    </div>
  );
};

export default Scorecards;
