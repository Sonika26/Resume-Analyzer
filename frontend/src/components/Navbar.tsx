import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  FileText,
  Sparkles,
  ArrowUpRight,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem("token");

  const links = [
    { name: "Home", href: "/" },
    { name: "Analyze Resume", href: "/analyze" },
    { name: "Job Match", href: "/jobs" },
    { name: "Resume Tips", href: "/tips" },
  ];

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4">
      <div className="mx-auto max-w-7xl">

        {/* Main Navbar */}
        <div
          className="
            relative
            flex h-[72px] items-center justify-between
            rounded-2xl
            border border-white/70
            bg-white/80
            px-4 sm:px-6
            shadow-[0_8px_35px_rgba(91,70,110,0.08)]
            backdrop-blur-xl
          "
        >

          {/* Subtle background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -left-10 -top-16 h-32 w-32 rounded-full bg-[#C5B3D3]/20 blur-3xl" />
            <div className="absolute -right-10 -bottom-16 h-32 w-32 rounded-full bg-[#E8DDF0]/30 blur-3xl" />
          </div>

          {/* ================= LOGO ================= */}
          <Link
            to="/"
            className="relative z-10 flex items-center gap-3 group"
          >
            {/* Logo Icon */}
            <div className="relative">

              {/* Glow */}
              <div className="absolute inset-0 rounded-xl bg-[#C5B3D3]/40 blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />

              <div
                className="
                  relative
                  flex h-11 w-11 items-center justify-center
                  rounded-xl
                  bg-gradient-to-br from-[#CDBBDA] to-[#B49BC5]
                  shadow-[0_5px_15px_rgba(181,156,199,0.3)]
                  transition-all duration-300
                  group-hover:-rotate-3
                  group-hover:scale-105
                "
              >
                <FileText className="h-6 w-6 text-white" />

                <Sparkles
                  className="
                    absolute
                    -right-1.5
                    -top-1.5
                    h-4 w-4
                    fill-[#9B78B5]
                    text-[#9B78B5]
                  "
                />
              </div>
            </div>

            {/* Logo Text */}
            <div className="hidden sm:block leading-none">
              <div className="text-[20px] font-extrabold tracking-tight">
                <span className="text-slate-900">Intelli</span>
                <span className="text-[#B49BC5]">Resume</span>
              </div>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                AI Resume Analyzer
              </p>
            </div>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="relative z-10 hidden lg:flex items-center gap-1">

            {links.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    relative
                    rounded-xl
                    px-4 py-2.5
                    text-sm
                    font-medium
                    transition-all duration-300
                    ${
                      active
                        ? "bg-[#F4EFF7] text-[#8F6AA8]"
                        : "text-slate-600 hover:bg-[#F8F5FA] hover:text-[#8F6AA8]"
                    }
                  `}
                >
                  {item.name}

                  {/* Active indicator */}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#B49BC5]" />
                  )}
                </Link>
              );
            })}

            {/* Dashboard */}
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className={`
                  ml-2 flex items-center gap-1.5
                  rounded-xl
                  border
                  px-4 py-2.5
                  text-sm font-semibold
                  transition-all duration-300
                  ${
                    isActive("/dashboard")
                      ? "border-[#CDBBDA] bg-[#F4EFF7] text-[#8F6AA8]"
                      : "border-[#E9E1EE] bg-white text-slate-700 hover:border-[#CDBBDA] hover:text-[#8F6AA8]"
                  }
                `}
              >
                Dashboard
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </nav>

          {/* ================= RIGHT ACTIONS ================= */}
          <div className="relative z-10 hidden lg:flex items-center gap-3">

            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="
                    rounded-xl
                    px-4 py-2.5
                    text-sm font-semibold
                    text-slate-700
                    transition-all duration-300
                    hover:bg-[#F8F5FA]
                    hover:text-[#8F6AA8]
                  "
                >
                  Log In
                </button>

                <button
                  onClick={() => navigate("/get-started")}
                  className="
                    group
                    flex items-center gap-2
                    rounded-xl
                    bg-[#C5B3D3]
                    px-5 py-2.5
                    text-sm font-bold
                    text-slate-900
                    shadow-[0_6px_18px_rgba(181,156,199,0.25)]
                    transition-all duration-300
                    hover:bg-[#B8A2C8]
                    hover:-translate-y-0.5
                    hover:shadow-[0_10px_25px_rgba(181,156,199,0.35)]
                  "
                >
                  Get Started

                  <ArrowUpRight
                    className="
                      h-4 w-4
                      transition-transform duration-300
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="
                  flex items-center gap-2
                  rounded-xl
                  px-4 py-2.5
                  text-sm font-semibold
                  text-red-500
                  transition-all duration-300
                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>

          {/* ================= MOBILE BUTTON ================= */}
          <button
            className="
              relative z-10
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-[#F4EFF7]
              text-slate-700
              transition-all
              hover:bg-[#EDE4F1]
              lg:hidden
            "
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {open && (
          <div
            className="
              mt-2
              overflow-hidden
              rounded-2xl
              border border-white/80
              bg-white/95
              p-3
              shadow-[0_15px_40px_rgba(91,70,110,0.12)]
              backdrop-blur-xl
              lg:hidden
            "
          >
            <div className="flex flex-col gap-1">

              {links.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`
                      rounded-xl
                      px-4 py-3.5
                      text-sm font-semibold
                      transition-all
                      ${
                        active
                          ? "bg-[#F4EFF7] text-[#8F6AA8]"
                          : "text-slate-600 hover:bg-[#F8F5FA]"
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {isLoggedIn && (
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="
                    mt-1
                    rounded-xl
                    bg-[#F4EFF7]
                    px-4 py-3.5
                    text-sm font-semibold
                    text-[#8F6AA8]
                  "
                >
                  Dashboard
                </Link>
              )}

              <div className="my-2 h-px bg-[#EEE8F1]" />

              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-2">

                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="
                      rounded-xl
                      border border-[#E7DFEB]
                      px-4 py-3
                      text-center
                      text-sm font-semibold
                      text-slate-700
                    "
                  >
                    Log In
                  </Link>

                  <Link
                    to="/get-started"
                    onClick={() => setOpen(false)}
                    className="
                      rounded-xl
                      bg-[#C5B3D3]
                      px-4 py-3
                      text-center
                      text-sm font-bold
                      text-slate-900
                    "
                  >
                    Get Started
                  </Link>

                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="
                    flex items-center justify-center gap-2
                    rounded-xl
                    bg-red-50
                    px-4 py-3
                    text-sm font-semibold
                    text-red-500
                  "
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}