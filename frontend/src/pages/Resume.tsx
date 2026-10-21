
import { useCallback, useEffect, useState } from "react";
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
import {
  getResumes,
  deleteResume,
  type Resume,
} from "../services/resume";

const Resumes = () => {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Fetch resumes
  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getResumes();
      setResumes(data);
    } catch (err: unknown) {
      console.error("Failed to fetch resumes:", err);

      const message =
        err &&
        typeof err === "object" &&
        "response" in err
          ? (
              err as {
                response?: {
                  data?: { message?: string };
                };
              }
            ).response?.data?.message
          : undefined;

      setError(
        message ||
          "Failed to load your resumes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchResumes();
  }, [fetchResumes]);

  // Navigate to resume editor
  const handleEdit = (resumeId: string) => {
    navigate(`/resume/${resumeId}/edit`);
  };

  // Create a new resume
  const handleNewResume = () => {
    navigate("/resumes/new");
  };

  // Delete resume
  const handleDelete = async (resumeId: string) => {
    try {
      await deleteResume(resumeId);

      setResumes((previous) =>
        previous.filter((resume) => resume._id !== resumeId)
      );
    } catch (err: unknown) {
      console.error("Failed to delete resume:", err);

      const message =
        err &&
        typeof err === "object" &&
        "response" in err
          ? (
              err as {
                response?: {
                  data?: { message?: string };
                };
              }
            ).response?.data?.message
          : undefined;

      window.alert(
        message || "Failed to delete resume. Please try again."
      );
    }
  };

  // Update the renamed resume in React state
  const handleResumeRenamed = (updatedResume: Resume) => {
  setResumes((previousResumes) =>
    previousResumes.map((item) =>
      item._id === updatedResume._id
        ? { ...item, ...updatedResume }
        : item
    )
  );
};
  // Filter resumes by search
  const filteredResumes = resumes.filter((resume) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      resume.title,
      resume.originalName,
      resume.firstName,
      resume.lastName,
      resume.jobTitle,
    ]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(query));
  });

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
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

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                My Resumes
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                Manage your resumes, improve your content, and keep
                everything ready for your next opportunity.
              </p>
            </div>

            <button
              type="button"
              onClick={handleNewResume}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus size={18} />
              New Resume
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-7 md:px-8 md:py-9">
        {!loading && !error && (
          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Resumes
              </p>
              <p className="mt-2 text-3xl font-bold">
                {resumes.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Ready to Apply
              </p>
              <p className="mt-2 text-3xl font-bold">
                {resumes.length}
              </p>
              <Sparkles
                size={20}
                className="mt-2 text-emerald-600"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Workspace
              </p>
              <p className="mt-2 text-3xl font-bold">Active</p>
              <Pencil
                size={20}
                className="mt-2 text-blue-600"
              />
            </div>
          </div>
        )}

        {!loading && !error && resumes.length > 0 && (
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">
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
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="flex min-h-64 items-center justify-center">
            <RefreshCw
              size={28}
              className="animate-spin text-slate-500"
            />
            <span className="ml-3 text-slate-500">
              Loading resumes...
            </span>
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center">
            <h2 className="text-lg font-bold">
              Unable to load your resumes
            </h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              type="button"
              onClick={() => void fetchResumes()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && resumes.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <FileText
              size={32}
              className="mx-auto text-slate-500"
            />
            <h2 className="mt-6 text-2xl font-bold">
              Create your first resume
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Create a professional resume and keep everything
              organized in one place.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleNewResume}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                <Plus size={17} />
                Create Resume
              </button>

              <button
                type="button"
                onClick={() => navigate("/analyze")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold"
              >
                <Upload size={17} />
                Upload Resume
              </button>
            </div>
          </div>
        )}

        {!loading && !error && resumes.length > 0 && (
          filteredResumes.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredResumes.map((resume) => (
                <div
                  key={resume._id}
                  className="group relative overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <ResumeCard
                    resume={resume}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRenamed={handleResumeRenamed}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Search
                size={28}
                className="mx-auto text-slate-400"
              />
              <h3 className="mt-4 text-lg font-bold">
                No resumes found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try searching with a different resume name.
              </p>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default Resumes;
