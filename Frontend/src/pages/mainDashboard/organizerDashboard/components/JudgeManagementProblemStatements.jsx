import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../../components/CommonUI/card";
import { Button } from "../../../../components/CommonUI/button";
import { Badge } from "../../../../components/CommonUI/badge";
import { Edit, Trash2, Target } from "lucide-react";

export default function JudgeManagementProblemStatements({ hackathon, onEdit, onDelete }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Problem Statements
        </CardTitle>
        <CardDescription>
          Manage problem statements for the hackathon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hackathon?.problemStatements?.map((ps, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-white flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={ps.type === "sponsored" ? "default" : "secondary"}>
                    {ps.type === "sponsored" ? "Sponsored" : "General"}
                  </Badge>
                  {ps.type === "sponsored" && (
                    <span className="text-sm text-gray-600">{ps.sponsorCompany}</span>
                  )}
                </div>
                <p className="text-gray-700">
                  {typeof ps === "object" ? ps.statement : ps}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button size="sm" variant="outline" onClick={() => onEdit && onEdit(ps, index)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600" onClick={() => onDelete && onDelete(ps, index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 