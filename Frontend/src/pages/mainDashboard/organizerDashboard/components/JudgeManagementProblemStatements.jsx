import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../../components/CommonUI/card";
import { Button } from "../../../../components/CommonUI/button";
import { Badge } from "../../../../components/CommonUI/badge";
import { Edit, Trash2, Target, FileText, Building, Globe, Plus, AlertCircle } from "lucide-react";

export default function JudgeManagementProblemStatements({ hackathon, onEdit, onDelete }) {
  const problemStatements = hackathon?.problemStatements || [];
  const sponsoredCount = problemStatements.filter(ps => ps.type === "sponsored").length;
  const generalCount = problemStatements.filter(ps => ps.type === "general").length;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Problem Statements Management</h2>
        <p className="text-gray-600">
          Create and manage problem statements that participants will work on during the hackathon
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-indigo-50 to-indigo-100">
          <CardContent className="p-6 pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-900">
                  {problemStatements.length}
                </p>
                <p className="text-sm font-medium text-indigo-700">Total Statements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6 pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-600 rounded-xl">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-900">
                  {sponsoredCount}
                </p>
                <p className="text-sm font-medium text-green-700">Sponsored</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-900">
                  {generalCount}
                </p>
                <p className="text-sm font-medium text-blue-700">General</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Problem Statements List */}
      <Card className="shadow-none hover:shadow-none">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Active Problem Statements</CardTitle>
                <CardDescription>
                  Manage and organize problem statements for participants
                </CardDescription>
              </div>
            </div>
            {problemStatements.length > 0 && (
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                {problemStatements.length} statements
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {problemStatements.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-100 rounded-full mb-4 w-20 h-20 flex items-center justify-center mx-auto">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Problem Statements Yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Get started by adding your first problem statement. Participants will choose from these challenges during the hackathon.
              </p>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add First Problem Statement
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {problemStatements.map((ps, index) => (
                <div
                  key={index}
                  className="group relative p-6 border-0 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-indigo-100 transition-all duration-300"
                >
                  {/* Problem Statement Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        ps.type === "sponsored" 
                          ? "bg-green-100" 
                          : "bg-blue-100"
                      }`}>
                        {ps.type === "sponsored" ? (
                          <Building className={`w-5 h-5 ${
                            ps.type === "sponsored" ? "text-green-600" : "text-blue-600"
                          }`} />
                        ) : (
                          <Globe className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <Badge 
                            variant={ps.type === "sponsored" ? "default" : "secondary"}
                            className={
                              ps.type === "sponsored" 
                                ? "bg-green-100 text-green-700 border-green-200" 
                                : "bg-blue-100 text-blue-700 border-blue-200"
                            }
                          >
                            {ps.type === "sponsored" ? "Sponsored Challenge" : "General Challenge"}
                          </Badge>
                          <Badge variant="outline" className="bg-white text-gray-600">
                            PS #{index + 1}
                          </Badge>
                        </div>
                        {ps.type === "sponsored" && ps.sponsorCompany && (
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full">
                              {ps.sponsorCompany}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onEdit && onEdit(ps, index)}
                        className="border-gray-300 hover:bg-white hover:border-indigo-300 hover:text-indigo-600"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                        onClick={() => onDelete && onDelete(ps, index)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Problem Statement Content */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Problem Description</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {typeof ps === "object" ? ps.statement : ps}
                    </p>
                  </div>

                  {/* Additional Details */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>Problem Statement</span>
                      </div>
                      {ps.difficulty && (
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>Difficulty: {ps.difficulty}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      Last modified: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information Section */}
      {problemStatements.length > 0 && (
        <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6 pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Problem Statement Guidelines</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>General statements</strong> can be judged by any platform or hybrid judge</li>
                  <li>• <strong>Sponsored statements</strong> require specific company judges or hybrid judges</li>
                  <li>• Each statement should provide clear objectives and evaluation criteria</li>
                  <li>• Consider including technical requirements and expected deliverables</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
