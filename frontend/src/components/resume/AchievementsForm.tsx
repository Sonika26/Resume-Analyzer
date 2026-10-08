import type { ResumeForm, Achievement } from "../../types/resume";

interface AchievementsFormProps {
  form: ResumeForm;

  achievementForm: Achievement;

  onAchievementChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;

  onAddAchievement: () => void;

  onEditAchievement: (
    achievement: Achievement
  ) => void;

  onDeleteAchievement: (
    achievementId: string
  ) => void;

  onSaveAchievement: () => void;

  onCancelAchievement: () => void;

  isAchievementFormOpen: boolean;

  editingAchievementId: string | null;
}

const AchievementsForm = ({
  form,
  achievementForm,
  onAchievementChange,
  onAddAchievement,
  onEditAchievement,
  onDeleteAchievement,
  onSaveAchievement,
  onCancelAchievement,
  isAchievementFormOpen,
  editingAchievementId,
}: AchievementsFormProps) => {
  return (
    <div className="achievements-form-section">

      <div className="section-heading-row">

        <h2>Achievements</h2>

        {!isAchievementFormOpen && (
          <button
            type="button"
            className="add-section-btn"
            onClick={onAddAchievement}
          >
            + Add Achievement
          </button>
        )}

      </div>

      {/* ================= EXISTING ACHIEVEMENTS ================= */}

      {form.achievements.length > 0 && (
        <div className="achievement-list">

          {form.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="achievement-card"
            >

              <div className="achievement-card-content">

                <strong>
                  {achievement.title ||
                    "Untitled Achievement"}
                </strong>

                {achievement.organization && (
                  <span>
                    {achievement.organization}
                  </span>
                )}

                {achievement.date && (
                  <small>
                    {achievement.date}
                  </small>
                )}

                {achievement.description && (
                  <small>
                    {achievement.description}
                  </small>
                )}

              </div>

              <div className="achievement-card-actions">

                <button
                  type="button"
                  onClick={() =>
                    onEditAchievement(achievement)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDeleteAchievement(
                      achievement.id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* ================= ACHIEVEMENT FORM ================= */}

      {isAchievementFormOpen && (
        <div className="achievement-form">

          <label>
            Achievement Title

            <input
              name="title"
              value={achievementForm.title}
              onChange={onAchievementChange}
              placeholder="Employee of the Month"
            />
          </label>

          <label>
            Organization

            <input
              name="organization"
              value={achievementForm.organization}
              onChange={onAchievementChange}
              placeholder="Google"
            />
          </label>

          <label>
            Date

            <input
              type="month"
              name="date"
              value={achievementForm.date}
              onChange={onAchievementChange}
            />
          </label>

          <label>
            Description

            <textarea
              name="description"
              value={achievementForm.description}
              onChange={onAchievementChange}
              placeholder="Describe your achievement and its impact..."
              rows={6}
            />
          </label>

          <div className="achievement-form-actions">

            <button
              type="button"
              className="save-section-btn"
              onClick={onSaveAchievement}
            >
              {editingAchievementId
                ? "Update Achievement"
                : "Add Achievement"}
            </button>

            <button
              type="button"
              className="cancel-section-btn"
              onClick={onCancelAchievement}
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default AchievementsForm;