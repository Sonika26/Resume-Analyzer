
import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";


import type { JobMatchAnalysis } from "../../services/jobMatchApi";

interface MatchResultsProps {
  analysis: JobMatchAnalysis;
}

type ResultTab = "Issues" | "Strengths" | "Keywords" | "Rewrites";

export default function MatchResults({ analysis }: MatchResultsProps) {
  const [activeTab, setActiveTab] = useState<ResultTab>("Issues");

  const [expandedIssues, setExpandedIssues] = useState<number[]>([]);

  const safeScore = (score: number) =>
    Math.max(0, Math.min(100, Number.isFinite(score) ? score : 0));

  const score = safeScore(analysis.matchScore);

  const categories = [
    { label: "Skills", score: safeScore(analysis.categoryScores.skills) },
    { label: "Keywords", score: safeScore(analysis.categoryScores.keywords) },
    {
      label: "Experience",
      score: safeScore(analysis.categoryScores.experience),
    },
    { label: "Education", score: safeScore(analysis.categoryScores.education) },
    {
      label: "Resume quality",
      score: safeScore(analysis.categoryScores.resumeQuality),
    },
  ];

  const issues = [
    ...analysis.missingSkills.map((text) => ({
      title: `Skill gap: ${text}`,
      description: `This skill was not clearly identified in your resume. Check whether you have relevant experience that demonstrates it.`,
      priority: "High",
      type: "Skill",
    })),
    ...analysis.missingKeywords.map((text) => ({
      title: `Missing keyword: ${text}`,
      description: `This term may be relevant to the target job. If it accurately describes your experience, consider using it in an appropriate resume section.`,
      priority: "Medium",
      type: "Keyword",
    })),
    ...analysis.formattingIssues.map((text) => ({
      title: text,
      description:
        "Review this aspect of your resume and improve it if needed.",
      priority: "Low",
      type: "Resume quality",
    })),
  ];

  const tabs: ResultTab[] = [
    "Issues",
    "Strengths",
    "Keywords",
    "Rewrites",
  ];

  const matchedKeywords = analysis.matchedSkills;
  const missingKeywords = analysis.missingKeywords;

  const toggleIssue = (index: number) => {
    setExpandedIssues((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  };

  const verdict =
    score >= 80
      ? "Strong alignment"
      : score >= 60
        ? "Moderate alignment"
        : score >= 40
          ? "Partial alignment"
          : "Low alignment";

  return (
    <section className="jm-results" aria-live="polite">
      {/* Dashboard heading */}
      <div className="jm-results-header jm-dashboard-heading">
        <div>
          <span className="jm-eyebrow">
            <Sparkles size={14} />
            JOB MATCH REPORT
          </span>
          <h2>Your compatibility analysis</h2>
          <p>
            See how your resume aligns with the job requirements
            and where you can improve.
          </p>
        </div>

        <span className="jm-verdict-badge">
          {verdict}
        </span>
      </div>

      {/* Top summary cards */}
      <div className="jm-dashboard-top">
        {/* Overall score */}
        <section className="jm-result-card jm-overall-card">
          <div className="jm-card-heading">
            <div>
              <h3>Job match score</h3>
              <p>Estimated resume compatibility</p>
            </div>
            <Target size={20} />
          </div>

          <div
            className="jm-score-gauge"
            style={{
              background: `conic-gradient(#496957 ${score * 3.6}deg, #edf0ed 0deg)`,
            }}
            role="img"
            aria-label={`Job match score ${score} out of 100`}
          >
            <div className="jm-score-gauge-inner">
              <span className="jm-score-gauge-label">MATCH SCORE</span>
              <strong>{score}</strong>
              <span className="jm-score-gauge-total">out of 100</span>
            </div>
          </div>

          <div className="jm-score-caption">
            <span className="jm-score-dot" />
            {verdict}
          </div>

          <p className="jm-disclaimer">
            This is an estimate, not a guaranteed employer ATS score.
          </p>
        </section>

        {/* Category breakdown */}
        <section className="jm-result-card jm-breakdown-card">
          <div className="jm-card-heading">
            <div>
              <h3>Score breakdown</h3>
              <p>Evaluation across five categories</p>
            </div>
            <CircleHelp size={19} />
          </div>

          <div className="jm-category-list">
            {categories.map((category) => (
              <div className="jm-category-item" key={category.label}>
                <div className="jm-category-label">
                  <span>{category.label}</span>
                  <strong>{category.score}%</strong>
                </div>

                <div
                  className="jm-progress-track"
                  role="progressbar"
                  aria-label={category.label}
                  aria-valuenow={category.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="jm-progress-fill jm-dashboard-progress"
                    style={{ width: `${category.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI verdict */}
        <section className="jm-result-card jm-verdict-card">
          <div className="jm-card-heading">
            <div>
              <h3>AI verdict</h3>
              <p>Analysis summary</p>
            </div>
            <Sparkles size={20} />
          </div>

          <div className="jm-verdict-title">{verdict}</div>

          <p className="jm-verdict-summary">
            {analysis.summary ||
              "Review the detailed results below to understand how your resume matches this role."}
          </p>

          <div className="jm-verdict-tip">
            <Lightbulb size={18} />
            <span>
              Focus on relevant skills and evidence of your
              achievements before applying.
            </span>
          </div>
        </section>
      </div>

      {/* Interactive tabs */}
      <section className="jm-detail-section">
        <div className="jm-tabs" role="tablist" aria-label="Analysis categories">
          {tabs.map((tab) => {
            const count =
              tab === "Issues"
                ? issues.length
                : tab === "Strengths"
                  ? analysis.strengths.length
                  : tab === "Keywords"
                    ? matchedKeywords.length + missingKeywords.length
                    : analysis.improvements.length;

            return (
              <button
                key={tab}
                type="button"
                role="tab"
                id={`jm-tab-${tab.toLowerCase()}`}
                aria-selected={activeTab === tab}
                aria-controls="jm-tab-panel"
                className={`jm-tab ${activeTab === tab ? "jm-tab-active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <span className="jm-tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        <div
          className="jm-tab-panel"
          id="jm-tab-panel"
          role="tabpanel"
          aria-labelledby={`jm-tab-${activeTab.toLowerCase()}`}
          key={activeTab}
        >
          {/* ISSUES */}
          {activeTab === "Issues" && (
            <div className="jm-tab-content">
              <div className="jm-panel-heading">
                <div>
                  <h3>Areas to review</h3>
                  <p>
                    Review potential gaps and recommendations for
                    improving your application.
                  </p>
                </div>
                <span className="jm-count-badge">{issues.length}</span>
              </div>

              {issues.length > 0 ? (
                <div className="jm-issue-list">
                  {issues.map((issue, index) => {
                    const isExpanded = expandedIssues.includes(index);

                    return (
                      <div className="jm-issue-item" key={`${issue.title}-${index}`}>
                        <button
                          type="button"
                          className="jm-issue-trigger"
                          aria-expanded={isExpanded}
                          onClick={() => toggleIssue(index)}
                        >
                          <span className="jm-issue-icon">
                            <AlertCircle size={17} />
                          </span>

                          <span className="jm-issue-main">
                            <strong>{issue.title}</strong>
                            <span>{issue.type}</span>
                          </span>

                          <span
                            className={`jm-priority jm-priority-${issue.priority.toLowerCase()}`}
                          >
                            {issue.priority}
                          </span>

                          <ChevronDown
                            size={17}
                            className={`jm-chevron ${isExpanded ? "jm-chevron-open" : ""}`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="jm-issue-details">
                            <p>{issue.description}</p>
                            <strong>Recommended action</strong>
                            <p>
                              Compare this finding with the job description
                              and your actual experience. Update your resume
                              only when the change is accurate.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="jm-empty-state">
                  <CheckCircle2 size={25} />
                  <h4>No specific issues were reported</h4>
                  <p>
                    Your analysis did not identify any missing skills,
                    missing keywords, or formatting issues.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STRENGTHS */}
          {activeTab === "Strengths" && (
            <div className="jm-tab-content">
              <div className="jm-panel-heading">
                <div>
                  <h3>Your strengths</h3>
                  <p>
                    Relevant experience and capabilities identified
                    in your resume.
                  </p>
                </div>
                <span className="jm-count-badge">
                  {analysis.strengths.length}
                </span>
              </div>

              {analysis.strengths.length > 0 ? (
                <div className="jm-strength-grid">
                  {analysis.strengths.map((strength, index) => (
                    <div className="jm-strength-card" key={`${strength}-${index}`}>
                      <CheckCircle2 size={19} />
                      <p>{strength}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="jm-empty-state">
                  No specific strengths were returned by the analysis.
                </div>
              )}

              <div className="jm-subsection">
                <h4>Matched skills</h4>
                {analysis.matchedSkills.length > 0 ? (
                  <div className="jm-tag-list">
                    {analysis.matchedSkills.map((skill, index) => (
                      <span className="jm-tag jm-tag--matched" key={`${skill}-${index}`}>
                        <CheckCircle2 size={13} />
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="jm-muted">No matched skills were reported.</p>
                )}
              </div>
            </div>
          )}

          {/* KEYWORDS */}
          {activeTab === "Keywords" && (
            <div className="jm-tab-content">
              <div className="jm-panel-heading">
                <div>
                  <h3>Keyword analysis</h3>
                  <p>
                    Compare identified skills and job-related terms.
                    Equivalent terminology may also be relevant.
                  </p>
                </div>
              </div>

              <div className="jm-keyword-columns">
                <div className="jm-keyword-panel">
                  <div className="jm-keyword-heading">
                    <CheckCircle2 size={18} />
                    <h4>Matched skills</h4>
                    <span>{matchedKeywords.length}</span>
                  </div>

                  {matchedKeywords.length > 0 ? (
                    <div className="jm-tag-list">
                      {matchedKeywords.map((keyword, index) => (
                        <span className="jm-tag jm-tag--matched" key={`${keyword}-${index}`}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="jm-muted">No matched skills identified.</p>
                  )}
                </div>

                <div className="jm-keyword-panel">
                  <div className="jm-keyword-heading jm-keyword-heading-missing">
                    <AlertCircle size={18} />
                    <h4>Missing keywords</h4>
                    <span>{missingKeywords.length}</span>
                  </div>

                  {missingKeywords.length > 0 ? (
                    <div className="jm-tag-list">
                      {missingKeywords.map((keyword, index) => (
                        <span className="jm-tag jm-tag--missing" key={`${keyword}-${index}`}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="jm-muted">No missing keywords reported.</p>
                  )}
                </div>
              </div>

              <p className="jm-keyword-note">
                Only add keywords that accurately reflect your skills
                and experience. A keyword appearing in a job description
                does not mean you should claim that skill.
              </p>
            </div>
          )}

          {/* REWRITES */}
          {activeTab === "Rewrites" && (
            <div className="jm-tab-content">
              <div className="jm-panel-heading">
                <div>
                  <h3>Improvement recommendations</h3>
                  <p>
                    Actionable ways to make your resume clearer and
                    more relevant to this job.
                  </p>
                </div>
                <span className="jm-count-badge">
                  {analysis.improvements.length}
                </span>
              </div>

              {analysis.improvements.length > 0 ? (
                <div className="jm-rewrite-list">
                  {analysis.improvements.map((item, index) => (
                    <article className="jm-rewrite-card" key={`${item}-${index}`}>
                      <div className="jm-rewrite-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <h4>Recommendation {index + 1}</h4>
                        <p>{item}</p>
                      </div>
                      <Lightbulb size={19} />
                    </article>
                  ))}
                </div>
              ) : (
                <div className="jm-empty-state">
                  No improvement recommendations were returned.
                </div>
              )}

              {analysis.formattingIssues.length > 0 && (
                <div className="jm-subsection">
                  <h4>Formatting recommendations</h4>
                  <ul className="jm-recommendation-list">
                    {analysis.formattingIssues.map((item, index) => (
                      <li key={`${item}-${index}`}>
                        <AlertCircle size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
