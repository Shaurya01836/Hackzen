import { Input } from "../../../../components/CommonUI/input"
import { Label } from "../../../../components/CommonUI/label"

export default function SkillsInterestsForm({ formData, errors, onChange }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="skills" className="text-[#111827] font-medium">
          Technical Skills *
        </Label>
        <Input
          id="skills"
          value={formData.skills}
          onChange={e => onChange("skills", e.target.value)}
          placeholder="JavaScript, Python, React, etc. (comma separated)"
          className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
            errors.skills ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }`}
        />
        {errors.skills && (
          <p className="text-red-500 text-sm">{errors.skills}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests" className="text-[#111827] font-medium">
          Interests
        </Label>
        <Input
          id="interests"
          value={formData.interests}
          onChange={e => onChange("interests", e.target.value)}
          placeholder="AI, Web Development, Blockchain, etc. (comma separated)"
          className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
        />
      </div>
    </div>
  )
} 