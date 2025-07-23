import { Input } from "../../../../components/CommonUI/input"
import { Label } from "../../../../components/CommonUI/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/CommonUI/select"
import { Textarea } from "../../../../components/CommonUI/textarea"

export default function ExpertiseBioForm({ formData, errors, onChange }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="expertise_areas" className="text-[#111827] font-medium">
          Areas of Expertise *
        </Label>
        <Input
          id="expertise_areas"
          value={formData.expertise_areas}
          onChange={e => onChange("expertise_areas", e.target.value)}
          placeholder="Web Development, AI/ML, Mobile Apps, etc."
          className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="judging_experience" className="text-[#111827] font-medium">
          Previous Judging Experience *
        </Label>
        <Select
          onValueChange={value => onChange("judging_experience", value)}
          value={formData.judging_experience}
        >
          <SelectTrigger className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]">
            <SelectValue placeholder="Select experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No previous experience</SelectItem>
            <SelectItem value="1-3">1-3 events</SelectItem>
            <SelectItem value="4-10">4-10 events</SelectItem>
            <SelectItem value="10+">10+ events</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio_judge" className="text-[#111827] font-medium">
          Professional Bio *
        </Label>
        <Textarea
          id="bio_judge"
          value={formData.bio_judge}
          onChange={e => onChange("bio_judge", e.target.value)}
          placeholder="Brief description of your background and expertise..."
          className="min-h-[120px] border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] resize-none"
        />
      </div>
    </div>
  )
} 