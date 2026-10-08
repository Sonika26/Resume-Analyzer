import { useEffect, useRef, useState } from "react";
import type { Resume } from "../services/resume";

import {
  FileText,
  Pencil,
  CalendarDays,
  Upload,
  Sparkles,
  Download,
  Share2,
  Trash2,
  MoreVertical,
} from "lucide-react";

interface ResumeCardProps {
  resume: Resume;
  onEdit: (resumeId: string) => void;
  onDelete: (resumeId: string) => void;
}

const ResumeCard = ({ resume, onEdit, onDelete }: ResumeCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const title =
    resume.title || resume.originalName || "Untitled Resume";

  const isUploaded = resume.source === "upload";

  const formattedDate = new Date(
    resume.createdAt
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Edit
  const handleEdit = () => {
    setMenuOpen(false);
    onEdit(resume._id);
  };

  // Download
  const handleDownload = () => {
    setMenuOpen(false);

    console.log("Download resume:", resume._id);

    // Download API can be connected here.
  };

  // Share
  const handleShare = async () => {
    setMenuOpen(false);

    try {
      const shareUrl = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title: title,
          text: "Check out my resume.",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);

        alert("Resume link copied to clipboard.");
      }
    } catch (error) {
      // User cancelled sharing
      console.log("Share cancelled:", error);
    }
  };

  // Delete
 const handleDelete = () => {
  setMenuOpen(false);

  const confirmed = window.confirm(
    `Are you sure you want to delete "${title}"?`
  );

  if (!confirmed) {
    return;
  }

  console.log("Delete resume:", resume._id);

  onDelete(resume._id);
};

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white">
      {/* Top accent */}
      <div className="h-1 rounded-t-2xl bg-slate-900" />

      <div className="p-5">
        {/* HEADER */}
        <div className="flex items-start gap-4">
          {/* File icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <FileText
              size={22}
              strokeWidth={1.8}
              className="text-slate-700"
            />
          </div>

          {/* Title */}
          <div className="min-w-0 flex-1">
            <h3
              title={title}
              className="truncate text-base font-bold text-slate-900"
            >
              {title}
            </h3>

            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
              <CalendarDays size={13} />

              <span>
                Created {formattedDate}
              </span>
            </div>
          </div>

          {/* THREE DOT MENU */}
          <div
            ref={menuRef}
            className="relative shrink-0"
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              aria-label="Resume options"
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <MoreVertical size={18} />
            </button>

            {/* DROPDOWN */}
            {menuOpen && (
              <div className="absolute right-0 top-11 z-50 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                {/* EDIT */}
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <Pencil size={16} />

                  <span>Edit Resume</span>
                </button>

                {/* DOWNLOAD */}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <Download size={16} />

                  <span>Download</span>
                </button>

                {/* SHARE */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <Share2 size={16} />

                  <span>Share</span>
                </button>

                {/* DIVIDER */}
                <div className="my-1 border-t border-slate-100" />

                {/* DELETE */}
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={16} />

                  <span>Delete Resume</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RESUME INFO */}
        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                {isUploaded ? (
                  <Upload
                    size={16}
                    strokeWidth={1.8}
                    className="text-blue-600"
                  />
                ) : (
                  <Sparkles
                    size={16}
                    strokeWidth={1.8}
                    className="text-emerald-600"
                  />
                )}
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Resume Type
                </p>

                <p className="mt-0.5 text-sm font-semibold text-slate-700">
                  {isUploaded
                    ? "Uploaded Resume"
                    : "Created Resume"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-[11px] font-semibold text-emerald-700">
                Ready
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-400">
              Resume
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Ready to edit
            </p>
          </div>

          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            <Pencil
              size={14}
              strokeWidth={2}
            />

            Edit Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;