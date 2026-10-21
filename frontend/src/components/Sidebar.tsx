import { NavLink } from "react-router-dom";
import {
  Sparkles,
  Handshake,
  ChevronRight,
  User,
  LogOut,
  LayoutDashboard,
  FileText,
  Briefcase,
  FilePenLine,
  Home,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Analyze Resume", path: "/analyze", icon: FileText },
  { name: "Job Match", path: "/jobmatch", icon: Handshake },
  { name: "Resume", path: "/resume", icon: Briefcase },
  { name: "Cover Letter", path: "/coverletter", icon: FilePenLine },
  { name: "Home", path: "/", icon: Home },
];

const Sidebar = () => {
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <aside
      className="
        group/sidebar fixed left-3 top-3 z-40
        hidden lg:flex flex-col
        h-[calc(100vh-24px)]
        w-[68px] hover:w-64
        overflow-hidden
        rounded-2xl border border-slate-200
        bg-white shadow-xl
        transition-[width] duration-300 ease-in-out
      "
    >
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center overflow-hidden border-b border-slate-200 px-[19px]">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900">
            <Sparkles size={17} className="text-white" />
          </div>

          <div className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100">
            <span className="text-[18px] font-extrabold tracking-tight text-slate-900">
              Intelli
            </span>
            <span className="text-[18px] font-extrabold tracking-tight text-slate-500">
              Resume
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-2 py-6">
        <p className="mb-4 h-4 whitespace-nowrap px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100">
          Workspace
        </p>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={item.name}
                className={({ isActive }) =>
                  `group/link relative flex h-11 w-full items-center gap-3 overflow-hidden rounded-xl px-[14px] text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 h-7 w-[3px] rounded-r-full bg-slate-900" />
                    )}

                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.4 : 2}
                      className={`shrink-0 ${
                        isActive
                          ? "text-slate-900"
                          : "text-slate-400 group-hover/link:text-slate-700"
                      }`}
                    />

                    <span className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100">
                      {item.name}
                    </span>

                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900 opacity-0 group-hover/sidebar:opacity-100" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* AI Suggestion Card */}
      <div className="shrink-0 overflow-hidden px-2 pb-3">
        <div className="rounded-xl border border-slate-200 bg-[#f7f8fa] p-2 group-hover/sidebar:p-4 transition-all duration-300">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900">
            <Sparkles size={17} className="text-white" />
          </div>

          <div className="overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
            <h3 className="mt-3 whitespace-nowrap text-sm font-bold text-slate-800">
              Improve your resume
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Get AI-powered suggestions to make your resume stronger.
            </p>

            <NavLink
              to="/resumerewrite"
              className="mt-3 flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              Improve resume
              <ChevronRight size={14} />
            </NavLink>
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="shrink-0 overflow-hidden border-t border-slate-200 p-2 group-hover/sidebar:p-4 transition-all duration-300">
        <div className="flex h-10 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900"
            title={username}
          >
            <User size={20} className="text-white" />
          </div>

          <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100">
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
            aria-label="Logout"
            className="shrink-0 rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-slate-900 group-hover/sidebar:opacity-100"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;