import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  Search,
  Pencil,
  Sparkles,
  Upload,
  RefreshCw,
} from "lucide-react";

import ResumeCard from "../components/ResumeCards";
import { getResumes, type Resume } from "../services/resume";

const Resumes = () => {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const handleDelete = (resumeId: string) => {
  setResumes((prevResumes) =>
    prevResumes.filter(
      (resume) => resume._id !== resumeId
    )
  );
};

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getResumes();
      setResumes(data);
    } catch (error: any) {
      console.error("Failed to fetch resumes:", error);

      setError(
        error?.response?.data?.message ||
        "Failed to load your resumes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleEdit = (resumeId: string) => {
    navigate(`/resume/${resumeId}/edit`);
  };

  const handleNewResume = () => {
    navigate("/resumes/new");
  };

  const filteredResumes = resumes.filter((resume) => {
    if (!search.trim()) {
        return true;
      }

      const searchText = search.toLowerCase();

      return JSON.stringify(resume)
      .toLowerCase()
      .includes(searchText);
  });

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-7 md:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
                  <FileText size={18} className="text-white" />
                </div>

                <span className="text-sm font-semibold text-slate-500">
                  Resume Workspace
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                My Resumes
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                Manage your resumes, improve your content, and keep everything
                ready for your next opportunity.
              </p>
            </div>

            <button
            onClick={handleNewResume}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
            >
            <Plus size={18} />
            New Resume
          </button>
        </div>
      </div>
    </header>

    {/* Main */}
    <main className="mx-auto max-w-7xl px-5 py-7 md:px-8 md:py-9">
      {/* Stats */}
      {!loading && !error && (
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Resumes
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {resumes.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <FileText size={20} className="text-slate-700" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Ready to Apply
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {resumes.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <Sparkles size={20} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Workspace
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  Active
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <Pencil size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>
    )}

    {/* Toolbar */}
    {!loading && !error && resumes.length > 0 && (
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Your resume collection
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose a resume to edit or continue improving.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
          type="text"
          placeholder="Search resumes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </div>
      </div>
  )}

  {/* Loading */}
  {loading && (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
        key={item}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
        <div className="h-2 animate-pulse bg-slate-200" />

        <div className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
          </div>

          <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />

          <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />

          <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-slate-100" />

          <div className="mt-7 h-10 w-full animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
))}
</div>
)}

{/* Error */}
{!loading && error && (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <RefreshCw size={22} className="text-red-500" />
      </div>

      <h2 className="mt-5 text-lg font-bold text-slate-900">
        Unable to load your resumes
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {error}
      </p>

      <button
      onClick={fetchResumes}
      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
      <RefreshCw size={16} />
      Try Again
    </button>
  </div>
</div>
)}

{/* Empty */}
{!loading && !error && resumes.length === 0 && (
  <div className="flex min-h-[500px] items-center justify-center">
    <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 shadow-sm">
        <FileText size={28} className="text-white" />
      </div>

      <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
        Create your first resume
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
        You don't have any resumes yet. Create a professional resume
        and keep everything organized in one place.
      </p>

      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <button
        onClick={handleNewResume}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
        <Plus size={17} />
        Create Resume
      </button>

      <button
      onClick={() => navigate("/analyze")}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
      <Upload size={17} />
      Upload Resume
    </button>
  </div>
</div>
</div>
)}

{/* Resume Grid */}
{!loading && !error && resumes.length > 0 && (
  <>
  {filteredResumes.length > 0 ? (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {filteredResumes.map((resume) => (
        <div
        key={resume._id}
        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
        >
       <ResumeCard
        key={resume._id}
        resume={resume}
        onEdit={handleEdit}
        onDelete={handleDelete}
       />
      </div>
))}
</div>
) : (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
    <Search
    size={28}
    className="mx-auto text-slate-300"
    />

    <h3 className="mt-4 text-lg font-bold text-slate-900">
      No resumes found
    </h3>

    <p className="mt-2 text-sm text-slate-500">
      Try searching with a different resume name.
    </p>
  </div>
)}
</>
)}
</main>
</div>
);
};

export default Resumes;