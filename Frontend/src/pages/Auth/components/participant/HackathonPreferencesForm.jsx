import { Input } from "../../../../components/CommonUI/input"
import { Label } from "../../../../components/CommonUI/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/CommonUI/select"
import { Textarea } from "../../../../components/CommonUI/textarea"

export default function HackathonPreferencesForm({ formData, errors, onChange }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="preferredHackathonTypes" className="text-[#111827] font-medium">
          Preferred Hackathon Types
        </Label>
        <Input
          id="preferredHackathonTypes"
          value={formData.preferredHackathonTypes}
          onChange={e => onChange("preferredHackathonTypes", e.target.value)}
          placeholder="web-development, ai-ml, blockchain, etc. (comma separated)"
          className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="teamSizePreference" className="text-[#111827] font-medium">
          Team Size Preference
        </Label>
        <Select
          onValueChange={value => onChange("teamSizePreference", value)}
          value={formData.teamSizePreference}
        >
          <SelectTrigger className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]">
            <SelectValue placeholder="Select preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solo">Solo</SelectItem>
            <SelectItem value="2-3">2-3 members</SelectItem>
            <SelectItem value="4-5">4-5 members</SelectItem>
            <SelectItem value="6+">6+ members</SelectItem>
            <SelectItem value="any">Any size</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-[#111827] font-medium">
          Bio
        </Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={e => onChange("bio", e.target.value)}
          placeholder="Tell us about yourself, your interests, and what you hope to achieve..."
          className="min-h-[120px] border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] resize-none"
        />
      </div>
    </div>
  )
} 