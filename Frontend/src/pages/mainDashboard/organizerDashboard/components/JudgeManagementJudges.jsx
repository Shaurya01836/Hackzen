import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../../components/CommonUI/card";
import { Button } from "../../../../components/CommonUI/button";
import { Globe, Building, Shield, Edit, Trash2 } from "lucide-react";

export default function JudgeManagementJudges({ judgeAssignments, getJudgeTypeIcon, getJudgeTypeLabel, getStatusBadge, removeJudgeAssignment }) {
  return (
    <>
      {/* Platform Judges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Platform Judges ({judgeAssignments.platform.length})
          </CardTitle>
          <CardDescription>
            Judges who can evaluate general problem statements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {judgeAssignments.platform.map((assignment) => (
              <div
                key={assignment._id}
                className="p-4 border rounded-lg bg-white flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getJudgeTypeIcon(assignment.judge.type)}
                    <div>
                      <p className="font-medium">{assignment.judge.email}</p>
                      <p className="text-sm text-gray-600">
                        {getJudgeTypeLabel(assignment.judge.type)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(assignment.status)}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => removeJudgeAssignment(assignment._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {judgeAssignments.platform.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No platform judges assigned yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Sponsor Judges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-green-500" />
            Sponsor Judges ({judgeAssignments.sponsor.length})
          </CardTitle>
          <CardDescription>
            Judges who can only evaluate their company's sponsored problem statements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {judgeAssignments.sponsor.map((assignment) => (
              <div
                key={assignment._id}
                className="p-4 border rounded-lg bg-white flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getJudgeTypeIcon(assignment.judge.type)}
                    <div>
                      <p className="font-medium">{assignment.judge.email}</p>
                      <p className="text-sm text-gray-600">
                        {assignment.judge.sponsorCompany}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(assignment.status)}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => removeJudgeAssignment(assignment._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {judgeAssignments.sponsor.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No sponsor judges assigned yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Hybrid Judges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            Hybrid Judges ({judgeAssignments.hybrid.length})
          </CardTitle>
          <CardDescription>
            Judges who can evaluate both general and sponsored problem statements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {judgeAssignments.hybrid.map((assignment) => (
              <div
                key={assignment._id}
                className="p-4 border rounded-lg bg-white flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getJudgeTypeIcon(assignment.judge.type)}
                    <div>
                      <p className="font-medium">{assignment.judge.email}</p>
                      <p className="text-sm text-gray-600">
                        {getJudgeTypeLabel(assignment.judge.type)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(assignment.status)}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => removeJudgeAssignment(assignment._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {judgeAssignments.hybrid.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No hybrid judges assigned yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
} 