import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Lightbulb,
  Home,
  User,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="h-screen bg-[#f7f8fa]">

      <aside className="rounded-2xl fixed top-4 left-3 h-170 w-64 border-slate-200 border-2 bg-white shadow-2xl p-6">

        <div className="text-[20px] font-extrabold tracking-tight border-b-2 border-slate-200 p-3">
          <span className="text-slate-900">Intelli</span>
          <span className="text-slate-500">Resume</span>
        </div>

        <nav className="mt-10 flex flex-col space-y-7">

          <Link
            to="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/analyze"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <FileText size={20} />
            Analyze Resume
          </Link>

          <Link
            to="/jobs"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <Briefcase size={20} />
            Job Match
          </Link>

          <Link
            to="/tips"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <Lightbulb size={20} />
            Resume
          </Link>

          <Link
            to="/coverletter"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <Lightbulb size={20} />
            Cover Letter
          </Link>

          <Link
            to="/resumerewrite"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <Lightbulb size={20} />
            Resume rewrite
          </Link>

          <Link
            to="/home"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <Home size={20} />
            Home
          </Link>

          {/* bottom section */}
          <div className="mt-20 border-t-2 border-slate-200 pt-4">

            <div className="flex items-center flex-row gap-3">

              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                <User size={22} className="text-white" />
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  Sonika
                </p>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    window.location.reload();
                  }}
                  className="text-sm text-slate-500 hover:text-slate-900"
                >
                  Logout
                </button>
              </div>

            </div>

          </div>

        </nav>
      </aside>


      {/* ================= RIGHT SECTION ================= */}

      <div className="bg-white h-170 w-310 ml-70 top-4 shadow-2xl border-slate-200 fixed border-2 rounded-2xl">

        <div className="h-20 w-full bg-white border-b-2 border-slate-200 p-6">

          <h1 className="font-bold text-xl text-slate-900">
            Hello!
          </h1>

          <span className="text-sm font-bold text-slate-500">
            Here's how your resume is performing
          </span>

        </div>


        <div className="flex items-center mt-4 ml-3 flex-row gap-4">

          <div
            id="overall"
            className="bg-white border border-slate-200 shadow-sm h-40 w-97 rounded-2xl"
          >
          </div>


          <div
            id="ats score"
            className="bg-white border border-slate-200 shadow-sm h-40 w-97 rounded-2xl"
          >
          </div>


          <div
            id="grammar score"
            className="bg-white border border-slate-200 shadow-sm h-40 w-97 rounded-2xl"
          >
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;