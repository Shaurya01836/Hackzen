import { Label } from "../../../../components/CommonUI/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/CommonUI/select"
import { Textarea } from "../../../../components/CommonUI/textarea"

export default function ExperienceMotivationForm({ formData, errors, onChange }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="experience_years" className="text-[#111827] font-medium">
          Years of Event Experience *
        </Label>
        <Select
          onValueChange={value => onChange("experience_years", value)}
          value={formData.experience_years}
        >
          <SelectTrigger className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]">
            <SelectValue placeholder="Select experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-1">0-1 years</SelectItem>
            <SelectItem value="2-3">2-3 years</SelectItem>
            <SelectItem value="4-5">4-5 years</SelectItem>
            <SelectItem value="5+">5+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="motivation" className="text-[#111827] font-medium">
          Why do you want to organize hackathons? *
        </Label>
        <Textarea
          id="motivation"
          value={formData.motivation}
          onChange={e => onChange("motivation", e.target.value)}
          placeholder="Share your motivation and goals..."
          className="min-h-[120px] border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] resize-none"
        />
      </div>
    </div>
  )
} 