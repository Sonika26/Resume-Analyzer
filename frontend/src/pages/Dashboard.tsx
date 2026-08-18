import { NavLink  } from "react-router-dom";
import {useState , useEffect} from "react";
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">

        {/* Logo */}
        <div className="flex h-20 items-center border-b border-slate-200 px-7">
          <div className="text-2xl font-extrabold tracking-tight">
            <span className="text-slate-900">Intelli</span>
            <span className="text-indigo-500">Resume</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-7">

          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
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
                    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.3 : 2}
                        className={
                          isActive
                            ? "text-indigo-600"
                            : "text-slate-400 group-hover:text-slate-700"
                        }
                      />

                      <span>{item.name}</span>

                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Upgrade Card */}
        <div className="px-4 pb-4">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-lg">

            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <Sparkles size={18} />
            </div>

            <h3 className="text-sm font-semibold">
              Improve your resume
            </h3>

            <p className="mt-1 text-xs leading-5 text-indigo-100">
              Get AI-powered suggestions to make your resume stand out.
            </p>

            <button className="mt-4 flex items-center gap-1 text-xs font-semibold text-white hover:text-indigo-100">
              Improve resume
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* User Section */}
        <div className="border-t border-slate-200 p-4">

          <div className="flex items-center gap-3 rounded-xl p-2">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900">
              <User size={19} className="text-white" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                Sonika
              </p>

              <p className="truncate text-xs text-slate-400">
                Resume account
              </p>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
            >
              <LogOut size={17} />
            </button>

          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="min-h-screen lg:ml-72">

        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md md:px-8">

          <div>
            <p className="text-sm text-slate-400">
              Tuesday, August 18
            </p>

            <h1 className="text-lg font-bold text-slate-900">
              Good evening, Sonika 👋
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
              <Bell size={18} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
            </button>

            <div className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900">
                <User size={14} className="text-white" />
              </div>

              <span className="text-sm font-medium text-slate-700">
                Sonika
              </span>
            </div>

          </div>
        </header>

        {/* Dashboard Content */}
        <section className="p-5 md:p-8">

          {/* Welcome Banner */}
          <div className="mb-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col justify-between gap-6 p-6 md:flex-row md:items-center md:p-7">

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  <TrendingUp size={13} />
                  Resume performance
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Your resume is looking good.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Keep improving your resume to increase your chances of
                  getting noticed by recruiters and ATS systems.
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

          {/* Score Cards */}
          <div className="mb-8">

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Resume Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Here's how your resume is performing.
                </p>
              </div>
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
                color="#6366f1"
                status={getStatus(
                  analysis.overallScore ?? 0
                )}
              />

              <Scorecards
                title="ATS Score"
                score={Math.round(
                  analysis.atsScore ?? 0
                )}
                color="#2563eb"
                status={getStatus(
                  analysis.atsScore ?? 0
                )}
              />

              <Scorecards
                title="Grammar Score"
                score={Math.round(
                  analysis.grammarScore ?? 0
                )}
                color="#10b981"
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

          {/* Lower Dashboard */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Resume Health */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h2 className="font-bold text-slate-900">
                    Resume Health
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Areas that can make your resume stronger.
                  </p>
                </div>

                <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  84% Healthy
                </span>

              </div>

              <div className="space-y-6">

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Content
                    </span>

                    <span className="font-semibold text-slate-900">
                      88%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[88%] rounded-full bg-indigo-500" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Keywords
                    </span>

                    <span className="font-semibold text-slate-900">
                      76%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[76%] rounded-full bg-blue-500" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Formatting
                    </span>

                    <span className="font-semibold text-slate-900">
                      92%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[92%] rounded-full bg-emerald-500" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Impact
                    </span>

                    <span className="font-semibold text-slate-900">
                      71%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[71%] rounded-full bg-amber-500" />
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Continue improving your career profile.
              </p>

              <div className="mt-5 space-y-3">

                <NavLink
                  to="/analyze"
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-indigo-200 hover:bg-indigo-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-white">
                    <FileText size={18} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      Analyze Resume
                    </p>

                    <p className="text-xs text-slate-400">
                      Find improvement areas
                    </p>
                  </div>

                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-indigo-500"
                  />
                </NavLink>

                <NavLink
                  to="/jobs"
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-white">
                    <Briefcase size={18} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      Find Job Matches
                    </p>

                    <p className="text-xs text-slate-400">
                      Discover suitable roles
                    </p>
                  </div>

                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-blue-500"
                  />
                </NavLink>

                <NavLink
                  to="/resumerewrite"
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-violet-200 hover:bg-violet-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600 group-hover:bg-white">
                    <WandSparkles size={18} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      Rewrite Resume
                    </p>

                    <p className="text-xs text-slate-400">
                      Improve your content with AI
                    </p>
                  </div>

                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-violet-500"
                  />
                </NavLink>

              </div>
            </div>

          </div>

        </section>
      </main>
    </div>
  );
};

export default Dashboard;