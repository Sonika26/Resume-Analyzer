import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Briefcase,
  FileSearch,
  LayoutTemplate,
  SpellCheck,
  WandSparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

/* ============================ Types ============================ */

interface User {
  fullName: string;
  email?: string;
}

/* ========================== Page content ======================= */

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: FileSearch,
    title: "ATS compatibility",
    text: "Checks that recruiter software can read your sections, dates and keywords, so your resume isn't filtered out before a person sees it.",
  },
  {
    icon: SpellCheck,
    title: "Grammar and writing",
    text: "Finds spelling mistakes, tense slips and weak phrasing, like bullets that start with \u201cResponsible for\u201d instead of what you achieved.",
  },
  {
    icon: LayoutTemplate,
    title: "Formatting and structure",
    text: "Flags inconsistent fonts, cluttered spacing and missing sections that make a resume harder to skim.",
  },
  {
    icon: WandSparkles,
    title: "AI rewrite",
    text: "Turn the issues we find into improved wording you can copy straight into your resume.",
  },
  {
    icon: Briefcase,
    title: "Job matches",
    text: "See roles that fit your skills and experience, based on your analyzed resume.",
  },
];

const STEPS = [
  { title: "Upload your resume", text: "Add the version you currently send to employers." },
  { title: "Read your scores", text: "Get an overall score plus ATS, grammar and formatting results, with each issue pointed out." },
  { title: "Fix and check again", text: "Apply the suggestions, upload again and watch your score change." },
];

const SAMPLE_FINDINGS: { tone: "amber" | "red" | "green"; text: string }[] = [
  { tone: "amber", text: "Start this bullet with an action verb, like \u201cLed\u201d." },
  { tone: "red", text: "Spelling: \u201crecieve\u201d should be \u201creceive\u201d." },
  { tone: "green", text: "Strong result. Numbers make bullets credible." },
];

const TONE_DOT: Record<"amber" | "red" | "green", string> = {
  amber: "bg-amber-400",
  red: "bg-red-500",
  green: "bg-emerald-500",
};

/* ============================ Page ============================= */

function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let cancelled = false;
    api
      .get("/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!cancelled) setUser(res.data.user);
      })
      .catch((err) => console.error("Error fetching user:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  const firstName = user?.fullName?.trim().split(" ")[0];

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <Navbar />

      <main>
        {/* ======================= HERO ======================= */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:pb-28">
          <div>
            {firstName && (
              <p className="mb-5 text-sm font-medium text-slate-500">
                Welcome back, {firstName}.{" "}
                <NavLink
                  to="/dashboard"
                  className="font-semibold text-indigo-600 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
                >
                  Open your dashboard
                </NavLink>
              </p>
            )}

            <h1 className="max-w-xl text-4xl font-bold tracking-[-0.035em] text-slate-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              Find out why your resume isn't getting replies.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              Upload your resume and get scored on ATS compatibility, grammar and formatting, with a specific fix for
              every issue we find.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <NavLink
                to="/analyze"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Analyze my resume
                <ArrowRight size={16} />
              </NavLink>

              <a
                href="#how-it-works"
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                See how it works
              </a>
            </div>
          </div>

          <ResumePreview />
        </section>

        {/* ===================== FEATURES ===================== */}
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="text-3xl font-bold tracking-tight">One review, every angle.</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
                Most resumes fail for small, fixable reasons. We check the things recruiters and screening software
                notice first.
              </p>
            </div>

            <ul className="divide-y divide-slate-200 border-y border-slate-200">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-5 py-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                    <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-600">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="max-w-md text-3xl font-bold tracking-tight">From upload to better resume in three steps.</h2>

          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative">
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-12 right-[-1rem] top-5 hidden h-px bg-slate-300 md:block"
                  />
                )}
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1.5 max-w-xs text-sm leading-6 text-slate-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ======================= FINAL CTA ======================= */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-slate-900 p-8 sm:p-12 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Your next application deserves a stronger resume.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                It takes a minute to see where your resume stands and what to change first.
              </p>
            </div>

            <NavLink
              to="/analyze"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Analyze my resume
              <ArrowRight size={16} />
            </NavLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-400 sm:px-6 lg:px-8">
          Built to help job seekers understand and improve their resumes before applying.
        </p>
      </footer>
    </div>
  );
}

/* ================== Hero: marked-up resume ===================== */

// A sample resume with reviewer-style marks. This is the one memorable visual on the page.
function ResumePreview() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -right-3 -top-4 z-10 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white py-2.5 pl-3 pr-4 shadow-lg">
        <ScoreRing score={84} />
        <div>
          <p className="text-sm font-bold text-slate-900">Overall score</p>
          <p className="text-xs text-slate-500">Example report</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-7 pt-12 shadow-[0_20px_60px_rgba(15,23,42,0.10)] sm:p-9 sm:pt-14">
        <p className="text-xl font-bold text-slate-900">Alex Morgan</p>
        <p className="mt-0.5 text-sm text-slate-500">Product Designer</p>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-sm font-semibold text-slate-800">Senior Designer, Northwind</p>
          <p className="text-xs text-slate-400">2021 to present</p>

          <ul className="mt-4 space-y-3 text-[13px] leading-6 text-slate-700">
            <li className="flex gap-2.5">
              <Dot />
              <span>
                <Mark tone="amber">Responsible for</Mark> redesigning the onboarding flow, which{" "}
                <Mark tone="green">increased activation by 23%</Mark>.
              </span>
            </li>
            <li className="flex gap-2.5">
              <Dot />
              <span>
                Ran research sessions to{" "}
                <span className="underline decoration-red-500 decoration-wavy underline-offset-4">recieve</span>{" "}
                feedback from 40+ customers each quarter.
              </span>
            </li>
            <li className="flex gap-2.5">
              <Dot />
              <span className="flex-1 space-y-2 pt-2" aria-hidden="true">
                <span className="block h-2 w-full rounded bg-slate-100" />
                <span className="block h-2 w-2/3 rounded bg-slate-100" />
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg lg:absolute lg:-bottom-10 lg:-left-8 lg:mt-0 lg:w-72">
        <p className="text-xs font-semibold text-slate-500">What we found</p>
        <ul className="mt-3 space-y-2.5">
          {SAMPLE_FINDINGS.map((f) => (
            <li key={f.text} className="flex items-start gap-2.5 text-xs leading-5 text-slate-700">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TONE_DOT[f.tone]}`} />
              {f.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Dot() {
  return <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />;
}

function Mark({ tone, children }: { tone: "amber" | "green"; children: ReactNode }) {
  const bg = tone === "amber" ? "bg-amber-200/70" : "bg-emerald-200/70";
  return <mark className={`rounded px-0.5 text-inherit ${bg}`}>{children}</mark>;
}

// Animates from empty to the score once on load. Respects reduced motion.
function ScoreRing({ score }: { score: number }) {
  const [filled, setFilled] = useState(false);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={radius} fill="none" strokeWidth="5" className="stroke-slate-100" />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={filled ? circumference * (1 - score / 100) : circumference}
          className="stroke-indigo-600 transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">
        {score}
      </span>
    </div>
  );
}

export default Home;
