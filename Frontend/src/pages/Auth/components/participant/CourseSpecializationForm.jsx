import { Input } from "../../../../components/CommonUI/input"
import { Label } from "../../../../components/CommonUI/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/CommonUI/select"

export default function CourseSpecializationForm({ formData, errors, onChange }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="course" className="text-[#111827] font-medium">
          Course *
        </Label>
        <Input
          id="course"
          value={formData.course}
          onChange={e => onChange("course", e.target.value)}
          placeholder="B.Tech, B.E., BCA, etc."
          className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
            errors.course ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }`}
        />
        {errors.course && (
          <p className="text-red-500 text-sm">{errors.course}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="courseDuration" className="text-[#111827] font-medium">
            Course Duration *
          </Label>
          <Select
            onValueChange={value => onChange("courseDuration", value)}
            value={formData.courseDuration}
          >
            <SelectTrigger
              className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
                errors.courseDuration ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-year">1 Year</SelectItem>
              <SelectItem value="2-years">2 Years</SelectItem>
              <SelectItem value="3-years">3 Years</SelectItem>
              <SelectItem value="4-years">4 Years</SelectItem>
              <SelectItem value="5-years">5 Years</SelectItem>
              <SelectItem value="6-years">6 Years</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.courseDuration && (
            <p className="text-red-500 text-sm">{errors.courseDuration}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="domain" className="text-[#111827] font-medium">
            Domain
          </Label>
          <Select
            onValueChange={value => onChange("domain", value)}
            value={formData.domain}
          >
            <SelectTrigger className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="computer-science">Computer Science</SelectItem>
              <SelectItem value="information-technology">Information Technology</SelectItem>
              <SelectItem value="data-science">Data Science</SelectItem>
              <SelectItem value="artificial-intelligence">Artificial Intelligence</SelectItem>
              <SelectItem value="machine-learning">Machine Learning</SelectItem>
              <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
              <SelectItem value="web-development">Web Development</SelectItem>
              <SelectItem value="mobile-development">Mobile Development</SelectItem>
              <SelectItem value="game-development">Game Development</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="management">Management</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="courseSpecialization" className="text-[#111827] font-medium">
          Course Specialization *
        </Label>
        <Input
          id="courseSpecialization"
          value={formData.courseSpecialization}
          onChange={e => onChange("courseSpecialization", e.target.value)}
          placeholder="Computer Science, Information Technology, etc."
          className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
            errors.courseSpecialization ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }`}
        />
        {errors.courseSpecialization && (
          <p className="text-red-500 text-sm">{errors.courseSpecialization}</p>
        )}
      </div>
    </div>
  )
} 