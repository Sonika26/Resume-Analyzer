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

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto max-w-7xl">

        {/* ================================================== */}
        {/* MAIN NAVBAR */}
        {/* ================================================== */}

        <div
          className="
            relative
            flex h-[68px] items-center justify-between
            overflow-hidden
            rounded-2xl
            border border-slate-200/80
            bg-white/90
            px-4
            shadow-[0_8px_35px_rgba(15,23,42,0.07)]
            backdrop-blur-xl
            sm:px-6
          "
        >

          {/* Subtle background decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -left-12 -top-16 h-32 w-32 rounded-full bg-slate-200/40 blur-3xl" />

            <div className="absolute -bottom-16 -right-12 h-32 w-32 rounded-full bg-blue-100/30 blur-3xl" />
          </div>


          {/* ================================================== */}
          {/* LOGO */}
          {/* ================================================== */}

          <Link
            to="/"
            className="group relative z-10 flex items-center gap-3"
          >

            {/* Logo Icon */}
            <div className="relative">

              {/* Logo glow */}
              <div
                className="
                  absolute inset-0
                  rounded-xl
                  bg-slate-400/20
                  blur-lg
                  opacity-70
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "
              />

              {/* Logo box */}
              <div
                className="
                  relative
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  bg-slate-900
                  shadow-[0_5px_15px_rgba(15,23,42,0.18)]
                  transition-all
                  duration-300
                  group-hover:-rotate-3
                  group-hover:scale-105
                "
              >
                <FileText className="h-5 w-5 text-white" />

                <Sparkles
                  className="
                    absolute
                    -right-1.5
                    -top-1.5
                    h-3.5
                    w-3.5
                    fill-slate-500
                    text-slate-500
                  "
                />
              </div>
            </div>


            {/* Logo Text */}
            <div className="hidden leading-none sm:block">
              <div className="text-[19px] font-extrabold tracking-tight">
                <span className="text-slate-900">
                  Intelli
                </span>

                <span className="text-slate-500">
                  Resume
                </span>
              </div>

              <p
                className="
                  mt-1
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.16em]
                  text-slate-400
                "
              >
                AI Resume Analyzer
              </p>
            </div>
          </Link>


          {/* ================================================== */}
          {/* DESKTOP NAVIGATION */}
          {/* ================================================== */}

          <nav className="relative z-10 hidden items-center gap-1 lg:flex">

            {links.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    relative
                    rounded-xl
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    transition-all
                    duration-300

                    ${
                      active
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >
                  {item.name}

                  {/* Active indicator */}
                  {active && (
                    <span
                      className="
                        absolute
                        bottom-1
                        left-1/2
                        h-1
                        w-1
                        -translate-x-1/2
                        rounded-full
                        bg-slate-900
                      "
                    />
                  )}
                </Link>
              );
            })}


            {/* Dashboard */}
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className={`
                  ml-2
                  flex items-center gap-1.5
                  rounded-xl
                  border
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-300

                  ${
                    isActive("/dashboard")
                      ? "border-slate-300 bg-slate-100 text-slate-900"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >
                Dashboard

                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </nav>


          {/* ================================================== */}
          {/* RIGHT ACTIONS */}
          {/* ================================================== */}

          <div className="relative z-10 hidden items-center gap-2.5 lg:flex">

            {!isLoggedIn ? (
              <>
                {/* Login */}
                <button
                  onClick={() => navigate("/login")}
                  className="
                    rounded-xl
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-700
                    transition-all
                    duration-300
                    hover:bg-slate-50
                    hover:text-slate-900
                  "
                >
                  Log In
                </button>


                {/* Get Started */}
                <button
                  onClick={() => navigate("/get-started")}
                  className="
                    group
                    flex items-center gap-2
                    rounded-xl
                    bg-slate-900
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    shadow-[0_6px_18px_rgba(15,23,42,0.16)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-slate-800
                    hover:shadow-[0_10px_25px_rgba(15,23,42,0.22)]
                  "
                >
                  Get Started

                  <ArrowUpRight
                    className="
                      h-4
                      w-4
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </button>
              </>
            ) : (

              /* Logout */
              <button
                onClick={handleLogout}
                className="
                  flex items-center gap-2
                  rounded-xl
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-500
                  transition-all
                  duration-300
                  hover:bg-slate-50
                  hover:text-slate-900
                "
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>


          {/* ================================================== */}
          {/* MOBILE MENU BUTTON */}
          {/* ================================================== */}

          <button
            className="
              relative
              z-10
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-slate-100
              text-slate-700
              transition-all
              hover:bg-slate-200
              lg:hidden
            "
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>


        {/* ================================================== */}
        {/* MOBILE MENU */}
        {/* ================================================== */}

        {open && (
          <div
            className="
              mt-2
              overflow-hidden
              rounded-2xl
              border border-slate-200
              bg-white/95
              p-3
              shadow-[0_15px_40px_rgba(15,23,42,0.10)]
              backdrop-blur-xl
              lg:hidden
            "
          >

            <div className="flex flex-col gap-1">

              {/* Navigation links */}
              {links.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      transition-all

                      ${
                        active
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                );
              })}


              {/* Dashboard */}
              {isLoggedIn && (
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="
                    mt-1
                    rounded-xl
                    bg-slate-100
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-slate-900
                  "
                >
                  Dashboard
                </Link>
              )}


              {/* Divider */}
              <div className="my-2 h-px bg-slate-100" />


              {/* Authentication actions */}
              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-2">

                  {/* Login */}
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="
                      rounded-xl
                      border border-slate-200
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      text-slate-700
                      transition-all
                      hover:bg-slate-50
                    "
                  >
                    Log In
                  </Link>


                  {/* Get Started */}
                  <Link
                    to="/get-started"
                    onClick={() => setOpen(false)}
                    className="
                      rounded-xl
                      bg-slate-900
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-bold
                      text-white
                      transition-all
                      hover:bg-slate-800
                    "
                  >
                    Get Started
                  </Link>

                </div>
              ) : (

                /* Mobile Logout */
                <button
                  onClick={handleLogout}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-slate-100
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-slate-600
                    transition-all
                    hover:bg-slate-200
                    hover:text-slate-900
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