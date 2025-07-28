import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../../components/CommonUI/card";
import { Button } from "../../../../components/CommonUI/button";
import { Badge } from "../../../../components/CommonUI/badge";
import { Globe, Building, Shield, Edit, Trash2, User, Mail, Star, UserCheck, Plus, AlertCircle } from "lucide-react";

export default function JudgeManagementJudges({ judgeAssignments, getJudgeTypeIcon, getJudgeTypeLabel, getStatusBadge, removeJudgeAssignment }) {
  const totalJudges = judgeAssignments.platform.length + judgeAssignments.sponsor.length + judgeAssignments.hybrid.length;

  const JudgeCard = ({ assignment, type, bgColor, iconBg }) => (
    <div className={`group relative p-6 border-0 rounded-xl ${bgColor} hover:from-indigo-50 hover:to-indigo-100 transition-all duration-300`}>
      {/* Judge Profile Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Judge Avatar */}
          <div className="relative">
            <div className={`w-14 h-14 rounded-full ${iconBg} flex items-center justify-center text-xl font-bold text-white shadow-lg`}>
              {assignment.judge?.name?.[0]?.toUpperCase() || assignment.judge?.email?.[0]?.toUpperCase() || <User className="w-7 h-7" />}
            </div>

          </div>

          {/* Judge Information */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {assignment.judge?.name || "Unknown Judge"}
              </h3>
              {getJudgeTypeIcon(assignment.judge?.type)}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{assignment.judge?.email}</span>
            </div>
            <div className="flex items-center gap-3">
            
              <Badge 
                variant={type === 'platform' ? 'secondary' : type === 'sponsor' ? 'default' : 'outline'}
                className={
                  type === 'platform' 
                    ? "bg-blue-100 text-blue-700 border-blue-200" 
                    : type === 'sponsor'
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-purple-100 text-purple-700 border-purple-200"
                }
              >
                {getJudgeTypeLabel(assignment.judge?.type)}
              </Badge>
              <div className="">
              {getStatusBadge(assignment.status)}
            </div>
              
              {assignment.judge?.sponsorCompany && (
                <Badge variant="outline" className="bg-white text-gray-600">
                  <Building className="w-3 h-3 mr-1" />
                  {assignment.judge.sponsorCompany}
                </Badge>
              )}
              
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="sm" 
            variant="outline" 
            className="border-gray-300 hover:bg-white hover:border-indigo-300 hover:text-indigo-600"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
            onClick={() => removeJudgeAssignment(assignment._id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>

      {/* Additional Judge Details */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <UserCheck className="w-4 h-4" />
              <span>Judge ID: {assignment._id?.slice(-6)}</span>
            </div>
            {assignment.maxSubmissionsPerJudge && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>Max: {assignment.maxSubmissionsPerJudge} submissions</span>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-400">
            Added: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyState = ({ type, icon: Icon, description, actionText }) => (
    <div className="text-center py-16">
      <div className="p-4 bg-gray-100 rounded-full mb-4 w-20 h-20 flex items-center justify-center mx-auto">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No {type} Judges Yet
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        {description}
      </p>
      <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
        <Plus className="w-4 h-4 mr-2" />
        {actionText}
      </Button>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Judge Management</h2>
        <p className="text-gray-600">
          Manage and organize judges by their roles and permissions within the hackathon
        </p>
      </div>

  

      {/* Platform Judges */}
       <Card className="shadow-none hover:shadow-none">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Platform Judges</CardTitle>
                <CardDescription>
                  Judges who can evaluate general problem statements and platform-wide challenges
                </CardDescription>
              </div>
            </div>
            {judgeAssignments.platform.length > 0 && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {judgeAssignments.platform.length} judges
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {judgeAssignments.platform.length === 0 ? (
            <EmptyState 
              type="Platform"
              icon={Globe}
              description="Platform judges can evaluate general problem statements and have broad access to judge submissions across the platform."
              actionText="Add Platform Judge"
            />
          ) : (
            <div className="space-y-6">
              {judgeAssignments.platform.map((assignment) => (
                <JudgeCard 
                  key={assignment._id}
                  assignment={assignment}
                  type="platform"
                  bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
                  iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sponsor Judges */}
      <Card className="shadow-none hover:shadow-none">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Sponsor Judges</CardTitle>
                <CardDescription>
                  Company representatives who can only evaluate their organization's sponsored challenges
                </CardDescription>
              </div>
            </div>
            {judgeAssignments.sponsor.length > 0 && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {judgeAssignments.sponsor.length} judges
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {judgeAssignments.sponsor.length === 0 ? (
            <EmptyState 
              type="Sponsor"
              icon={Building}
              description="Sponsor judges represent companies and can only evaluate problem statements from their own organization."
              actionText="Add Sponsor Judge"
            />
          ) : (
            <div className="space-y-6">
              {judgeAssignments.sponsor.map((assignment) => (
                <JudgeCard 
                  key={assignment._id}
                  assignment={assignment}
                  type="sponsor"
                  bgColor="bg-gradient-to-br from-green-50 to-green-100"
                  iconBg="bg-gradient-to-br from-green-500 to-green-600"
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hybrid Judges */}
       <Card className="shadow-none hover:shadow-none">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Hybrid Judges</CardTitle>
                <CardDescription>
                  Versatile judges with access to evaluate both general and sponsored problem statements
                </CardDescription>
              </div>
            </div>
            {judgeAssignments.hybrid.length > 0 && (
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                {judgeAssignments.hybrid.length} judges
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {judgeAssignments.hybrid.length === 0 ? (
            <EmptyState 
              type="Hybrid"
              icon={Shield}
              description="Hybrid judges have comprehensive access to evaluate all types of problem statements across the platform."
              actionText="Add Hybrid Judge"
            />
          ) : (
            <div className="space-y-6">
              {judgeAssignments.hybrid.map((assignment) => (
                <JudgeCard 
                  key={assignment._id}
                  assignment={assignment}
                  type="hybrid"
                  bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
                  iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Judge Guidelines */}
      {totalJudges > 0 && (
        <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6 pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Judge Role Guidelines</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Platform judges</strong> can evaluate all general problem statements and have broad access</li>
                  <li>• <strong>Sponsor judges</strong> are restricted to their company's sponsored challenges only</li>
                  <li>• <strong>Hybrid judges</strong> have comprehensive access to all problem statement types</li>
                  <li>• All judges can be assigned specific teams and submission limits for balanced evaluation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
