export default function ProgressBar({ currentStep, getMaxSteps }) {
  if (currentStep === 1) return null

  const maxSteps = getMaxSteps() - 1
  const currentFormStep = currentStep - 1
  const progress = (currentFormStep / maxSteps) * 100

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>
          Step {currentFormStep} of {maxSteps}
        </span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
} 