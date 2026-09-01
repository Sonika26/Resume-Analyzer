interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

const StepNavigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
}: StepNavigationProps) => {
  return (
    <div className="step-navigation">

      <button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 1}
      >
        ← Back
      </button>

      <span>
        Step {currentStep} of {totalSteps}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={currentStep === totalSteps}
      >
        Next →
      </button>

    </div>
  );
};

export default StepNavigation;