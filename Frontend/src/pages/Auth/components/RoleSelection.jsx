import { Card, CardContent } from "../../../components/CommonUI/card"
import { Check } from "lucide-react"

export default function RoleSelection({ roles, selectedRole, onSelect }) {
  return (
    <div className="space-y-4 mb-6">
      {roles.map(role => {
        const Icon = role.icon
        const isSelected = selectedRole === role.id
        return (
          <Card
            key={role.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
              isSelected
                ? "border-[#10B981] shadow-md bg-[#10B981]/5"
                : "border-gray-200 hover:border-[#4F46E5]/30"
            }`}
            onClick={() => onSelect(role.id)}
          >
            <CardContent className="pt-4">
              <div className="flex items-start gap-6">
                <div
                  className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-[#111827]">
                      {role.title}
                    </h3>
                    {isSelected && (
                      <div className="w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-[#6B7280] text-sm">
                    {role.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 