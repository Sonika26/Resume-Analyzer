import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Scorecards from "../components/Scorecards";

import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Lightbulb,
  Home,
  User,
  LogOut,
  FilePenLine,
  WandSparkles,
  Bell,
  ChevronRight,
  TrendingUp,
  Sparkles,
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

const navItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Analyze Resume",
    path: "/analyze",
    icon: FileText,
  },
  {
    name: "Job Match",
    path: "/jobs",
    icon: Briefcase,
  },
  {
    name: "Resume Tips",
    path: "/tips",
    icon: Lightbulb,
  },
  {
    name: "Cover Letter",
    path: "/coverletter",
    icon: FilePenLine,
  },
  {
    name: "Resume Rewrite",
    path: "/resumerewrite",
    icon: WandSparkles,
  },
  {
    name: "Home",
    path: "/home",
    icon: Home,
  },
];

const Dashboard = () => {
  const username = localStorage.getItem("username") || "Sonika";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

useEffect(() => {
    const fetchLatestAnalysis = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load dashboard: ${response.status}`
          );
        }

        const data: DashboardResponse =
          await response.json();

        console.log("Latest resume analysis:", data);

        if (data.hasResume && data.analysis) {
          setAnalysis(data.analysis);
        } else {
          setAnalysis(null);
        }
      } catch (error) {
        console.error("Dashboard error:", error);

        setError(
          "Unable to load your resume analysis."
        );
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

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-3 top-3 z-40 hidden h-[calc(100vh-24px)] w-64 flex-col rounded-2xl border-2 border-slate-200 bg-white shadow-xl lg:flex">

        {/* Logo */}

        <div className="flex h-20 items-center border-b-2 border-slate-200 px-6">

          <div className="text-[21px] font-extrabold tracking-tight">
            <span className="text-slate-900">
              Intelli
            </span>

            <span className="text-slate-500">
              Resume
            </span>
          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 px-4 py-7">

          <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <div className="space-y-1.5">

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-slate-100 text-slate-900 shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.4 : 2}
                        className={
                          isActive
                            ? "text-slate-900"
                            : "text-slate-400 group-hover:text-slate-700"
                        }
                      />

                      <span>
                        {item.name}
                      </span>

                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-slate-900" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}

          </div>

        </nav>

        {/* AI Suggestion Card */}

        <div className="px-4 pb-4">

          <div className="rounded-2xl border border-slate-200 bg-[#f7f8fa] p-4">

            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
              <Sparkles
                size={17}
                className="text-white"
              />
            </div>

            <h3 className="text-sm font-bold text-slate-800">
              Improve your resume
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Get AI-powered suggestions to make your resume stronger.
            </p>

            <NavLink
              to="/resumerewrite"
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              Improve resume
              <ChevronRight size={14} />
            </NavLink>

          </div>

        </div>

        {/* User Section */}

        <div className="border-t-2 border-slate-200 p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900">
              <User
                size={20}
                className="text-white"
              />
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-semibold text-slate-800">
                {username}
              </p>

              <p className="truncate text-xs text-slate-400">
                Resume account
              </p>

            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut size={17} />
            </button>

          </div>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="min-h-screen lg:ml-[286px]">

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