
import type { JobMatchAnalysis } from "../../services/jobMatchApi";

interface MatchResultsProps {
  analysis: JobMatchAnalysis;
}

export default function MatchResults({
  analysis,
}: MatchResultsProps) {
  const categories = [
    ["Skills match", analysis.categoryScores.skills],
    ["Keyword match", analysis.categoryScores.keywords],
    ["Experience alignment", analysis.categoryScores.experience],
    ["Education", analysis.categoryScores.education],
    ["Resume quality", analysis.categoryScores.resumeQuality],
  ] as const;

  function renderList(title: string, items: string[]) {
    return (
      <section className="jm-result-card">
        <h3>{title}</h3>

        {items.length > 0 ? (
          <ul>
            {items.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="jm-muted">No items to report.</p>
        )}
      </section>
    );
  }

  return (
    <section className="jm-results" aria-live="polite">
      <div className="jm-score-card">
        <p className="jm-eyebrow">JOB COMPATIBILITY</p>

        <div className="jm-score">
          {analysis.matchScore}%
        </div>

        <h2>Resume match score</h2>

        <p>
          {analysis.summary ||
            "Review the breakdown and recommendations below."}
        </p>

        <small>
          This is an estimated compatibility score, not a
          guaranteed score from an employer's ATS.
        </small>
      </div>

      <section className="jm-result-card">
        <h3>Score breakdown</h3>

        {categories.map(([label, score]) => (
          <div className="jm-score-row" key={label}>
            <div className="jm-score-label">
              <span>{label}</span>
              <strong>{score}%</strong>
            </div>

            <div
              className="jm-progress-track"
              role="progressbar"
              aria-label={label}
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="jm-progress-fill"
                style={{
                  width: `${Math.max(0, Math.min(100, score))}%`,
                }}
              />
            </div>
          </div>
        ))}
      </section>

      <div className="jm-results-grid">
        {renderList("Strengths", analysis.strengths)}
        {renderList("Matched skills", analysis.matchedSkills)}
        {renderList("Missing skills", analysis.missingSkills)}
        {renderList("Missing keywords", analysis.missingKeywords)}
        {renderList("Recommended improvements", analysis.improvements)}
        {renderList("Formatting issues", analysis.formattingIssues)}
      </div>
    </section>
  );
}