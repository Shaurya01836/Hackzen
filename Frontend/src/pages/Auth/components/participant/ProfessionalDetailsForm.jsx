import { Input } from "../../../../components/CommonUI/input"
import { Label } from "../../../../components/CommonUI/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/CommonUI/select"

export default function ProfessionalDetailsForm({ formData, errors, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-[#111827] font-medium">
            Company Name
          </Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={e => onChange("companyName", e.target.value)}
            placeholder="Your current company"
            className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle" className="text-[#111827] font-medium">
            Job Title
          </Label>
          <Input
            id="jobTitle"
            value={formData.jobTitle}
            onChange={e => onChange("jobTitle", e.target.value)}
            placeholder="Software Developer, Student, etc."
            className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearsOfExperience" className="text-[#111827] font-medium">
          Years of Experience
        </Label>
        <Select
          onValueChange={value => onChange("yearsOfExperience", value)}
          value={formData.yearsOfExperience}
        >
          <SelectTrigger className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]">
            <SelectValue placeholder="Select experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-1">0-1 years</SelectItem>
            <SelectItem value="1-2">1-2 years</SelectItem>
            <SelectItem value="2-3">2-3 years</SelectItem>
            <SelectItem value="3-5">3-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 