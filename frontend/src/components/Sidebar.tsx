import { NavLink } from "react-router-dom";
import { Sparkles, ChevronRight, User, LogOut, LayoutDashboard, FileText, Briefcase, Lightbulb, FilePenLine, WandSparkles, Home } from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Analyze Resume",
    path: "/analyze",
    icon: FileText,
  },
  {
    name: "Resume",
    path: "/resume",
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

const Sidebar = () => {
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <aside className="fixed left-3 top-3 z-40 hidden h-[calc(100vh-24px)] w-64 flex-col rounded-2xl border-2 border-slate-200 bg-white shadow-xl lg:flex">
      {/* Logo */}
      <div className="flex h-20 items-center border-b-2 border-slate-200 px-6">
        <div className="text-[21px] font-extrabold tracking-tight">
          <span className="text-slate-900">Intelli</span>
          <span className="text-slate-500">Resume</span>
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
                    <span>{item.name}</span>
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
            <Sparkles size={17} className="text-white" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Improve your resume</h3>
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
            <User size={20} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">{username}</p>
            <p className="truncate text-xs text-slate-400">Resume account</p>
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
  );
};

export default Sidebar;
