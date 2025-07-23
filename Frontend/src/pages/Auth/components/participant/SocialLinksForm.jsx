import { Input } from "../../../../components/CommonUI/input"
import { Label } from "../../../../components/CommonUI/label"

export default function SocialLinksForm({ formData, errors, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website" className="text-[#111827] font-medium">
            Website
          </Label>
          <Input
            id="website"
            value={formData.website}
            onChange={e => onChange("website", e.target.value)}
            placeholder="https://your-website.com"
            className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin" className="text-[#111827] font-medium">
            LinkedIn Profile
          </Label>
          <Input
            id="linkedin"
            value={formData.linkedin}
            onChange={e => onChange("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="github" className="text-[#111827] font-medium">
            GitHub Profile
          </Label>
          <Input
            id="github"
            value={formData.github}
            onChange={e => onChange("github", e.target.value)}
            placeholder="https://github.com/username"
            className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="githubUsername" className="text-[#111827] font-medium">
            GitHub Username
          </Label>
          <Input
            id="githubUsername"
            value={formData.githubUsername}
            onChange={e => onChange("githubUsername", e.target.value)}
            placeholder="username"
            className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolio" className="text-[#111827] font-medium">
          Portfolio Website
        </Label>
        <Input
          id="portfolio"
          value={formData.portfolio}
          onChange={e => onChange("portfolio", e.target.value)}
          placeholder="https://your-portfolio.com"
          className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="twitter" className="text-[#111827] font-medium">
            Twitter/X
          </Label>
          <Input
            id="twitter"
            value={formData.twitter}
            onChange={e => onChange("twitter", e.target.value)}
            placeholder="@username"
            className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram" className="text-[#111827] font-medium">
            Instagram
          </Label>
          <Input
            id="instagram"
            value={formData.instagram}
            onChange={e => onChange("instagram", e.target.value)}
            placeholder="@username"
            className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telegram" className="text-[#111827] font-medium">
            Telegram
          </Label>
          <Input
            id="telegram"
            value={formData.telegram}
            onChange={e => onChange("telegram", e.target.value)}
            placeholder="@username"
            className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discord" className="text-[#111827] font-medium">
            Discord
          </Label>
          <Input
            id="discord"
            value={formData.discord}
            onChange={e => onChange("discord", e.target.value)}
            placeholder="username#1234"
            className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
          />
        </div>
      </div>
    </div>
  )
} 