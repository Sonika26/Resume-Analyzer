import { NavLink } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import Scorecards from "../components/Scorecards";
import api from "../services/dashboard";

import {
  FileText,
  Briefcase,
  User,
  ChevronRight,
  WandSparkles,
  Upload,
  Inbox,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

/* ============================ Types ============================ */

type MetricKey = "atsScore" | "grammarScore" | "formattingScore";

interface Analysis {
  atsScore?: number;
  grammarScore?: number;
  formattingScore?: number;
  overallScore?: number;
  analyzedAt?: string; // optional: ISO date of the latest analysis
}

interface HistoryPoint {
  overallScore: number;
  analyzedAt: string;
}

interface DashboardResponse {
  hasResume: boolean;
  analysis: Analysis | null;
  history?: HistoryPoint[]; // optional: past analyses, used for the trend
}

type ActivityType =
  | "resume_uploaded"
  | "resume_analyzed"
  | "job_match"
  | "resume_rewrite";

interface Activity {
  _id: string;
  type: ActivityType;
  title: string;
  description?: string;
  createdAt: string;
}

/* ========================== Static config ====================== */

const ACTIVITY_META: Record<ActivityType, { icon: LucideIcon; to: string }> = {
  resume_uploaded: { icon: Upload, to: "/analyze" },
  resume_analyzed: { icon: FileText, to: "/analyze" },
  job_match: { icon: Briefcase, to: "/jobs" },
  resume_rewrite: { icon: WandSparkles, to: "/resumerewrite" },
};

const METRICS: {
  key: MetricKey;
  label: string;
  color: string;
  fix: string;
  to: string;
}[] = [
  {
    key: "atsScore",
    label: "ATS score",
    color: "#3b82f6",
    fix: "Add keywords from the job description and use standard section headings like Experience and Education.",
    to: "/analyze",
  },
  {
    key: "grammarScore",
    label: "Grammar score",
    color: "#64748b",
    fix: "Fix tense and spelling issues, and shorten long sentences. The AI rewrite can do this for you.",
    to: "/resumerewrite",
  },
  {
    key: "formattingScore",
    label: "Formatting score",
    color: "#10b981",
    fix: "Use one font, consistent bullet styles and clear spacing between sections.",
    to: "/analyze",
  },
];

const QUICK_ACTIONS: { to: string; icon: LucideIcon; title: string; sub: string }[] = [
  { to: "/analyze", icon: FileText, title: "Analyze resume", sub: "Find improvement areas" },
  { to: "/jobs", icon: Briefcase, title: "Find job matches", sub: "Discover suitable roles" },
  { to: "/resumerewrite", icon: WandSparkles, title: "Rewrite resume", sub: "Improve your content with AI" },
];

const GOOD_SCORE = 85;

/* ============================ Helpers ========================== */

const getStatus = (score: number): string => {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  return "Needs Work";
};

const greeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const timeAgo = (iso: string): string => {
  const diffSec = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, secs] of steps) {
    if (Math.abs(diffSec) >= secs) return rtf.format(Math.round(diffSec / secs), unit);
  }
  return "just now";
};

const dayGroup = (iso: string): string => {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86400000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return "Earlier";
};

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

/* ============================ Data hook ======================== */

// Small fetch hook: handles loading, error, retry, and ignores results
// that arrive after the component has unmounted.
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    api
      .get<T>(url, authConfig())
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err) => {
        console.error(`Request failed: ${url}`, err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { data, loading, error, reload };
}

/* ======================= Small components ====================== */

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`} />
);

const RetryButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
  >
    <RefreshCw size={14} />
    Try again
  </button>
);

const ScoreRing = ({ score }: { score: number }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;

  return (
    <div className="relative h-36 w-36 shrink-0" role="img" aria-label={`Overall score ${score} out of 100`}>
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" strokeWidth="10" className="stroke-slate-100" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-indigo-600 transition-[stroke-dashoffset] duration-700 motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tracking-tight text-slate-900">{score}</span>
        <span className="text-xs font-medium text-slate-400">out of 100</span>
      </div>
    </div>
  );
};

const Sparkline = ({ values }: { values: number[] }) => {
  const w = 180;
  const h = 56;
  const pad = 5;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return { x, y };
  });
  const last = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-14 w-44" aria-hidden="true">
      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-indigo-300"
      />
      <circle cx={last.x} cy={last.y} r="4" className="fill-indigo-600" />
    </svg>
  );
};

/* =============================== Page ========================== */

const Dashboard = () => {
  const username = localStorage.getItem("username") || "there";

  const dash = useApi<DashboardResponse>("/dashboard");
  const acts = useApi<Activity[]>("/dashboard/activities?limit=6");

  const analysis = dash.data?.hasResume ? dash.data.analysis : null;
  const overall = Math.round(analysis?.overallScore ?? 0);

  // Score history, oldest first. Only shown when at least two analyses exist.
  const trend = useMemo(() => {
    const history = [...(dash.data?.history ?? [])].sort(
      (a, b) => new Date(a.analyzedAt).getTime() - new Date(b.analyzedAt).getTime()
    );
    if (history.length < 2) return null;
    const values = history.map((p) => Math.round(p.overallScore));
    return { values, delta: values[values.length - 1] - values[values.length - 2] };
  }, [dash.data]);

  // Metrics below the "good" line, lowest first, each with a concrete fix.
  const fixes = useMemo(() => {
    if (!analysis) return [];
    return METRICS.map((m) => ({ ...m, value: Math.round(analysis[m.key] ?? 0) }))
      .filter((m) => m.value < GOOD_SCORE)
      .sort((a, b) => a.value - b.value);
  }, [analysis]);

  const headline = !analysis
    ? "Upload a resume to get your first score."
    : overall >= 85
    ? "Your resume is in great shape."
    : overall >= 70
    ? "Your resume is solid, with room to grow."
    : "Your resume needs some work.";

  const subline = !analysis
    ? "We'll check ATS compatibility, grammar and formatting, then tell you what to fix first."
    : fixes.length > 0
    ? `${fixes[0].label.replace(/^\w/, (c) => c.toUpperCase())} is your lowest at ${fixes[0].value}. Fixing it will move your overall score the most.`
    : "All three scores are strong. Try matching your resume against open roles.";

  // Group activities under Today / Yesterday / Earlier, keeping server order.
  const groupedActivities = useMemo(() => {
    const groups: { label: string; items: Activity[] }[] = [];
    for (const a of acts.data ?? []) {
      const label = dayGroup(a.createdAt);
      const group = groups.find((g) => g.label === label);
      if (group) group.items.push(a);
      else groups.push({ label, items: [a] });
    }
    return groups;
  }, [acts.data]);

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      {/* ============ Header ============ */}
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur-md md:px-8">
        <div>
          <p className="text-xs font-medium text-slate-400">Dashboard</p>
          <h1 className="mt-0.5 text-lg font-bold">
            {greeting()}, {username}
          </h1>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900">
            <User size={14} className="text-white" />
          </div>
          <span className="hidden text-sm font-semibold text-slate-700 sm:inline">{username}</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-5 md:p-8">
        {/* ============ Hero ============ */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {dash.loading ? (
            <div className="flex items-center gap-8">
              <Skeleton className="h-36 w-36 !rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-7 w-2/3" />
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          ) : dash.error ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-red-600">We couldn't load your resume scores. Check your connection and try again.</p>
              <RetryButton onClick={dash.reload} />
            </div>
          ) : (
            <div className="flex flex-col gap-8 md:flex-row md:items-center">
              {analysis && <ScoreRing score={overall} />}

              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{headline}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{subline}</p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <NavLink
                    to="/analyze"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {analysis ? "Analyze again" : "Analyze resume"}
                    <ChevronRight size={17} />
                  </NavLink>

                  {analysis && (
                    <NavLink
                      to="/resumerewrite"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <WandSparkles size={16} />
                      Rewrite with AI
                    </NavLink>
                  )}

                  {analysis?.analyzedAt && (
                    <span className="text-xs text-slate-400">Last analyzed {timeAgo(analysis.analyzedAt)}</span>
                  )}
                </div>
              </div>

              {trend && (
                <div className="md:border-l md:border-slate-100 md:pl-8">
                  <p className="text-xs font-medium text-slate-400">Overall score over time</p>
                  <div className="mt-2">
                    <Sparkline values={trend.values} />
                  </div>
                  <p
                    className={`mt-1 inline-flex items-center gap-1 text-sm font-semibold ${
                      trend.delta >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {trend.delta >= 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                    {trend.delta > 0 ? "+" : ""}
                    {trend.delta} since last analysis
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ============ Score cards ============ */}
        <section aria-labelledby="overview-heading">
          <div className="mb-4">
            <h2 id="overview-heading" className="text-lg font-bold">
              Resume overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">Scores from your latest analysis.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dash.loading ? (
              <>
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
              </>
            ) : analysis ? (
              METRICS.map((m) => {
                const value = Math.round(analysis[m.key] ?? 0);
                return (
                  <Scorecards key={m.key} title={m.label} score={value} color={m.color} status={getStatus(value)} />
                );
              })
            ) : !dash.error ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <Inbox className="mx-auto text-slate-300" size={28} />
                <p className="mt-3 text-sm font-semibold text-slate-700">No resume analyzed yet</p>
                <p className="mt-1 text-sm text-slate-500">Your scores will show up here after your first analysis.</p>
              </div>
            ) : null}
          </div>
        </section>

        {/* ============ Fix next + Quick actions ============ */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
            <h2 className="font-bold">What to fix next</h2>
            <p className="mt-1 text-sm text-slate-500">Ordered by how much each area is holding your score back.</p>

            {dash.loading ? (
              <div className="mt-5 space-y-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            ) : !analysis ? (
              <p className="mt-6 text-sm text-slate-500">Analyze a resume to get personalized fixes.</p>
            ) : fixes.length === 0 ? (
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
                <CheckCircle2 className="shrink-0 text-emerald-600" size={20} />
                <p className="text-sm text-emerald-800">
                  Nothing urgent. Every score is {GOOD_SCORE} or higher.
                </p>
              </div>
            ) : (
              <ul className="mt-5 space-y-3">
                {fixes.map((f) => (
                  <li key={f.key}>
                    <NavLink
                      to={f.to}
                      className="group flex items-start gap-4 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
                    >
                      <span
                        className={`mt-0.5 shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold ${
                          f.value >= 70 ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {f.value}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">Improve your {f.label.toLowerCase()}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{f.fix}</p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="mt-1 shrink-0 text-slate-300 transition group-hover:text-slate-700"
                      />
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold">Quick actions</h2>
            <p className="mt-1 text-sm text-slate-500">Continue improving your resume.</p>

            <div className="mt-5 space-y-3">
              {QUICK_ACTIONS.map(({ to, icon: Icon, title, sub }) => (
                <NavLink
                  key={to}
                  to={to}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">{title}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{sub}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 transition group-hover:text-slate-700" />
                </NavLink>
              ))}
            </div>
          </section>
        </div>

        {/* ============ Recent activity ============ */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold">Recent activity</h2>
              <p className="mt-1 text-sm text-slate-500">Your latest resume actions.</p>
            </div>
            <NavLink to="/activity" className="hidden text-sm font-semibold text-slate-600 hover:text-slate-900 sm:block">
              View all
            </NavLink>
          </div>

          <div className="mt-5">
            {acts.loading ? (
              <div className="space-y-3">
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
              </div>
            ) : acts.error ? (
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-red-600">We couldn't load your recent activity.</p>
                <RetryButton onClick={acts.reload} />
              </div>
            ) : groupedActivities.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <Inbox className="mx-auto text-slate-300" size={26} />
                <p className="mt-3 text-sm font-semibold text-slate-700">Nothing here yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Analyze or rewrite your resume and your actions will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {groupedActivities.map((group) => (
                  <div key={group.label}>
                    <h3 className="text-xs font-semibold text-slate-400">{group.label}</h3>
                    <ul className="mt-1 divide-y divide-slate-100">
                      {group.items.map((a) => {
                        const { icon: Icon, to } = ACTIVITY_META[a.type] ?? ACTIVITY_META.resume_analyzed;
                        return (
                          <li key={a._id}>
                            <NavLink
                              to={to}
                              className="flex items-center gap-4 py-3.5 transition hover:bg-slate-50/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                <Icon size={18} className="text-slate-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-800">{a.title}</p>
                                {a.description && <p className="truncate text-xs text-slate-400">{a.description}</p>}
                              </div>
                              <time dateTime={a.createdAt} className="shrink-0 text-xs text-slate-400">
                                {timeAgo(a.createdAt)}
                              </time>
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
