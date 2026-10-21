
import { useState } from "react";

import ResumeUpload from "../components/job-match/ResumeUpload";
import JobDescriptionForm from "../components/job-match/JobDescription";
import MatchResults from "../components/job-match/MatchResult";

import {
  analyzeJobMatch,
  type JobMatchAnalysis,
} from "../services/jobMatchApi";

import "./job-match.css";

export default function JobMatch() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setAnalysis(null);

    if (!resume) {
      setError("Please upload your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }

    setLoading(true);

    try {
      const result = await analyzeJobMatch(
        resume,
        jobDescription.trim()
      );

      setAnalysis(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong during analysis."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="jm-page">
      <div className="jm-container">
        <header className="jm-header">
          <span className="jm-badge">CAREER TOOLS</span>

          <h1>Job Match Analyzer</h1>

          <p>
            Discover how well your resume matches a job.
            Identify skill gaps, highlight your strengths,
            and get practical recommendations.
          </p>
        </header>

        <form className="jm-form" onSubmit={handleAnalyze}>
          <section className="jm-panel">
            <div className="jm-section-heading">
              <span className="jm-step">01</span>
              <div>
                <h2>Your resume</h2>
                <p>Upload the resume you want to evaluate.</p>
              </div>
            </div>

            <ResumeUpload
              file={resume}
              onChange={setResume}
            />
          </section>

          <section className="jm-panel">
            <div className="jm-section-heading">
              <span className="jm-step">02</span>
              <div>
                <h2>Target job</h2>
                <p>
                  Add the job description to compare
                  against your resume.
                </p>
              </div>
            </div>

            <JobDescriptionForm
              value={jobDescription}
              onChange={setJobDescription}
            />
          </section>

          {error && (
            <div className="jm-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="jm-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Analyzing your resume..."
              : "Analyze Job Match"}
          </button>

          <p className="jm-privacy-note">
            Your resume contains personal information.
            Only upload documents you are authorized to share.
          </p>
        </form>

        {loading && (
          <div className="jm-loading" role="status">
            <span className="jm-spinner" />
            <p>
              Comparing your skills, experience, and
              qualifications with the job requirements...
            </p>
          </div>
        )}

        {analysis && !loading && (
          <MatchResults analysis={analysis} />
        )}
      </div>
    </main>
  );
}
