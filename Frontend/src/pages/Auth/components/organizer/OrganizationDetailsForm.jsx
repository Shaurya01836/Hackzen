import { Input } from "../../../../components/CommonUI/input"
import { Label } from "../../../../components/CommonUI/label"

export default function OrganizationDetailsForm({ formData, errors, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="organization" className="text-[#111827] font-medium">
            Organization *
          </Label>
          <Input
            id="organization"
            value={formData.organization}
            onChange={e => onChange("organization", e.target.value)}
            placeholder="Company or University"
            className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="position" className="text-[#111827] font-medium">
            Position/Title *
          </Label>
          <Input
            id="position"
            value={formData.position}
            onChange={e => onChange("position", e.target.value)}
            placeholder="Event Manager, Professor, etc."
            className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
          />
        </div>
      </div>
    </div>
  )
} 