import { Input } from "../../../../components/CommonUI/input"
import { Label } from "../../../../components/CommonUI/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/CommonUI/select"

export default function AcademicDetailsForm({ formData, errors, onChange }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="collegeName" className="text-[#111827] font-medium">
          College/Institution Name *
        </Label>
        <Input
          id="collegeName"
          value={formData.collegeName}
          onChange={e => onChange("collegeName", e.target.value)}
          placeholder="Poornima College of Engineering"
          className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
            errors.collegeName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }`}
        />
        {errors.collegeName && (
          <p className="text-red-500 text-sm">{errors.collegeName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="userType" className="text-[#111827] font-medium">
            User Type *
          </Label>
          <Select
            onValueChange={value => onChange("userType", value)}
            value={formData.userType}
          >
            <SelectTrigger
              className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
                errors.userType ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="school">School Student</SelectItem>
              <SelectItem value="college">College Student</SelectItem>
              <SelectItem value="fresher">Fresher</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
          {errors.userType && (
            <p className="text-red-500 text-sm">{errors.userType}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentYear" className="text-[#111827] font-medium">
            Current Year
          </Label>
          <Select
            onValueChange={value => onChange("currentYear", value)}
            value={formData.currentYear}
          >
            <SelectTrigger className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]">
              <SelectValue placeholder="Select current year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1st-year">1st Year</SelectItem>
              <SelectItem value="2nd-year">2nd Year</SelectItem>
              <SelectItem value="3rd-year">3rd Year</SelectItem>
              <SelectItem value="4th-year">4th Year</SelectItem>
              <SelectItem value="final-year">Final Year</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
} 