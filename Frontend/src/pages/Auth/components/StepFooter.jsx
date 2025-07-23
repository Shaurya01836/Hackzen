import { Button } from "../../../components/CommonUI/button"
import { ArrowRight, Sparkles } from "lucide-react"

export default function StepFooter({
  validationErrors = {},
  errorMsg = "",
  successMsg = "",
  step = 1,
  currentStep = 1,
  isLastStep = false,
  loading = false,
  canProceed = true,
  handleRegister,
  handleNext,
  children
}) {
  return (
    <div className="flex-shrink-0 space-y-4">
      {Object.keys(validationErrors).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          Please fill in all required fields to continue.
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {successMsg}
        </div>
      )}
      {step === 2 ? (
        <></>
      ) : (
        <Button
          onClick={isLastStep ? handleRegister : handleNext}
          disabled={loading || !canProceed}
          className="w-full bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white font-medium py-3 h-12 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Processing...
            </>
          ) : isLastStep ? (
            <>
              Create Account
              <Sparkles className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      )}
      {children}
      {currentStep === 1 && step === 1 && (
        <div className="text-center text-sm text-[#6B7280]">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#4F46E5] hover:text-[#4F46E5]/80 font-medium"
          >
            Login
          </a>
        </div>
      )}
    </div>
  )
} 