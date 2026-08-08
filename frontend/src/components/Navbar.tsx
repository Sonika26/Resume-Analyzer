import { useState } from "react";
import { Menu, X, FileText, Sparkles } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", href: "#" },
    { name: "Analyze Resume", href: "#analyze" },
    { name: "Job Match", href: "#jobs" },
    { name: "Resume Tips", href: "#tips" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-[#E9E4EE]">
      <div className="max-w-7xl px-6 mx-15">
        <div className="flex  h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-[#C5B3D3] flex items-center justify-center shadow-md">
                <FileText className="w-7 h-7 text-white" />
              </div>

              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-[#8F6AA8] fill-[#8F6AA8]" />
            </div>

            <div>
              <h1 className="text-2xl  font-extrabold tracking-tight">
                <span className="text-slate-900">Intelli</span>
                <span className="text-[#C5B3D3]">Resume</span>
              </h1>

              <p className="text-sm text-slate-500">
                AI Resume Analyzer
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex mx-20 items-center gap-10">
            {links.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative font-medium text-slate-700 transition-all duration-300 hover:text-[#A58ABB] group"
              >
                {item.name}

                <span className="absolute left-0 -bottom-2 h-[3px] w-0 rounded-full bg-[#C5B3D3] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden  lg:flex gap-5 left-10 space-x-8">
            <button className="font-medium text-slate-700 hover:text-[#A58ABB] transition">
              Log In
            </button>

            <button className="rounded-xl bg-[#C5B3D3] px-6 py-3 font-semibold text-slate-900 shadow-md transition-all duration-300 hover:bg-[#B8A2C8] hover:scale-105 hover:shadow-lg">
              Get Started
            </button>
          </div>

          {/* Mobile Button */}
          <button
            className="lg:hidden text-slate-700"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t border-[#E9E4EE] bg-white">
          <div className="flex flex-col gap-5 px-6 py-6">
            {links.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-lg font-medium text-slate-700 hover:text-[#A58ABB]"
              >
                {item.name}
              </a>
            ))}

            <button className="rounded-xl border border-[#C5B3D3] py-3 font-medium text-slate-700">
              Log In
            </button>

            <button className="rounded-xl bg-[#C5B3D3] py-3 font-semibold text-slate-900">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}