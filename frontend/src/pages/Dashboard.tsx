import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Scorecards from "../components/Scorecards";
import api from "../services/dashboard";

import {
  FileText,
  Briefcase,
  User,
  Bell,
  ChevronRight,
  TrendingUp,
  WandSparkles,
  
} from "lucide-react";

interface Analysis {
  atsScore?: number;
  grammarScore?: number;
  formattingScore?: number;
  overallScore?: number;
}

interface DashboardResponse {
  hasResume: boolean;
  analysis: Analysis | null;
}

    

const Dashboard = () => {
  const username = localStorage.getItem("username") || "Sonika";


    const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

useEffect(() => {
    const fetchLatestAnalysis = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await api.get<DashboardResponse>("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Latest resume analysis:", response.data);

        if (response.data.hasResume && response.data.analysis) {
          setAnalysis(response.data.analysis);
        } else {
          setAnalysis(null);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Unable to load your resume analysis.");
      } finally {
        setLoading(false);
      }
    };
       fetchLatestAnalysis();
  }, []);

  const getStatus = (score: number): string => {
    if (score >= 85) {
      return "Excellent";
    }

    if (score >= 70) {
      return "Good";
    }

    return "Needs Work";
  };
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">


      {/* ================= MAIN CONTENT ================= */}

      <main className="min-h-screen">

        {/* ================= TOP HEADER ================= */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b-2 border-slate-200 bg-white/95 px-5 backdrop-blur-md md:px-8">

          <div>

            <p className="text-xs font-medium text-slate-400">
              Dashboard
            </p>

            <h1 className="mt-0.5 text-lg font-bold text-slate-900">
              Hello, {username} 👋
            </h1>

          </div>

          <div className="flex items-center gap-3">

            {/* Notification */}

            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              title="Notifications"
            >

              <Bell size={18} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-slate-900" />

            </button>

            {/* User */}

            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 sm:flex">

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900">
                <User
                  size={14}
                  className="text-white"
                />
              </div>

              <span className="text-sm font-semibold text-slate-700">
                {username}
              </span>

            </div>

          </div>

        </header>

        {/* ================= PAGE CONTENT ================= */}

        <section className="p-5 md:p-8">

          {/* ================= WELCOME SECTION ================= */}

          <div className="mb-7 rounded-2xl border-2 border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col justify-between gap-6 p-6 md:flex-row md:items-center md:p-7">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-[#f7f8fa] px-3 py-1">

                  <TrendingUp
                    size={13}
                    className="text-slate-600"
                  />

                  <span className="text-xs font-semibold text-slate-600">
                    Resume performance
                  </span>

                </div>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Your resume is looking good.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Here's how your resume is performing. Keep improving it
                  to increase your chances of getting noticed by recruiters.
                </p>

              </div>

              <NavLink
                to="/analyze"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Analyze Resume
                <ChevronRight size={17} />
              </NavLink>

            </div>

          </div>

          {/* ================= SCORECARDS ================= */}

          <div className="mb-8">

            <div className="mb-4 flex items-end justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Resume Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest resume performance scores.
                </p>

              </div>

              <NavLink
                to="/analyze"
                className="hidden items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 sm:flex"
              >
                View analysis
                <ChevronRight size={15} />
              </NavLink>

            </div>

             <div className="flex items-center mt-4 ml-3 flex-row gap-4">

              {loading ? (

                <>

                  <div className="h-40 w-[390px] rounded-2xl bg-slate-100 animate-pulse" />

                  <div className="h-40 w-[390px] rounded-2xl bg-slate-100 animate-pulse" />

                  <div className="h-40 w-[390px] rounded-2xl bg-slate-100 animate-pulse" />

                </>

              ) : error ? (

                <div className="text-sm text-red-500">
                  {error}
                </div>

              ) : analysis ? (

                <>

                  <Scorecards
                    title="Overall Score"
                    score={Math.round(
                      analysis.overallScore ?? 0
                    )}
                    color="#2563eb"
                    status={getStatus(
                      analysis.overallScore ?? 0
                    )}
                  />

                  <Scorecards
                    title="ATS Score"
                    score={Math.round(
                      analysis.atsScore ?? 0
                    )}
                    color="#3b82f6"
                    status={getStatus(
                      analysis.atsScore ?? 0
                    )}
                  />

                  <Scorecards
                    title="Grammar Score"
                    score={Math.round(
                      analysis.grammarScore ?? 0
                    )}
                    color="#64748b"
                    status={getStatus(
                      analysis.grammarScore ?? 0
                    )}
                  />

                </>

              ) : (

                <div className="text-sm text-slate-500">
                  No resume has been analyzed yet.
                </div>

              )}

            </div>

          </div>
          

          {/* ================= LOWER CONTENT ================= */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* ================= RESUME HEALTH ================= */}

            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

              <div className="mb-6 flex items-start justify-between">

                <div>

                  <h2 className="font-bold text-slate-900">
                    Resume Health
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Areas that can make your resume stronger.
                  </p>

                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                  84% Healthy
                </span>

              </div>

              <div className="space-y-6">

                {/* Content */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-sm font-semibold text-slate-700">
                      Content
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      88%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full w-[88%] rounded-full bg-indigo-500"
                    />

                  </div>

                </div>

                {/* Keywords */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-sm font-semibold text-slate-700">
                      Keywords
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      76%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full w-[76%] rounded-full bg-blue-500"
                    />

                  </div>

                </div>

                {/* Formatting */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-sm font-semibold text-slate-700">
                      Formatting
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      92%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full w-[92%] rounded-full bg-emerald-500"
                    />

                  </div>

                </div>

                {/* Impact */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-sm font-semibold text-slate-700">
                      Impact
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      71%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full w-[71%] rounded-full bg-amber-500"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* ================= QUICK ACTIONS ================= */}

            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">

              <div>

                <h2 className="font-bold text-slate-900">
                  Quick Actions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Continue improving your resume.
                </p>

              </div>

              <div className="mt-5 space-y-3">

                {/* Analyze */}

                <NavLink
                  to="/analyze"
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <FileText size={18} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-semibold text-slate-800">
                      Analyze Resume
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Find improvement areas
                    </p>

                  </div>

                  <ChevronRight
                    size={16}
                    className="text-slate-300 transition group-hover:text-slate-700"
                  />

                </NavLink>

                {/* Job Match */}

                <NavLink
                  to="/jobs"
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <Briefcase size={18} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-semibold text-slate-800">
                      Find Job Matches
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Discover suitable roles
                    </p>

                  </div>

                  <ChevronRight
                    size={16}
                    className="text-slate-300 transition group-hover:text-slate-700"
                  />

                </NavLink>

                {/* Resume Rewrite */}

                <NavLink
                  to="/resumerewrite"
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <WandSparkles size={18} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-semibold text-slate-800">
                      Rewrite Resume
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Improve your content with AI
                    </p>

                  </div>

                  <ChevronRight
                    size={16}
                    className="text-slate-300 transition group-hover:text-slate-700"
                  />

                </NavLink>

              </div>

            </div>

          </div>

          {/* ================= RECENT ACTIVITY ================= */}

          <div className="mt-6 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-bold text-slate-900">
                  Recent Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest resume actions.
                </p>

              </div>

              <button className="hidden text-sm font-semibold text-slate-600 hover:text-slate-900 sm:block">
                View all
              </button>

            </div>

            <div className="mt-5 divide-y divide-slate-100">

              <div className="flex items-center gap-4 py-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  <FileText
                    size={18}
                    className="text-slate-600"
                  />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-sm font-semibold text-slate-800">
                    Resume analyzed
                  </p>

                  <p className="text-xs text-slate-400">
                    Your resume was analyzed successfully.
                  </p>

                </div>

                <span className="text-xs text-slate-400">
                  Recently
                </span>

              </div>

              <div className="flex items-center gap-4 py-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  <Briefcase
                    size={18}
                    className="text-slate-600"
                  />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-sm font-semibold text-slate-800">
                    Job matching completed
                  </p>

                  <p className="text-xs text-slate-400">
                    New job opportunities are available.
                  </p>

                </div>

                <span className="text-xs text-slate-400">
                  Recently
                </span>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Dashboard;