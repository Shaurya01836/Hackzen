import React from "react";
import { ProjectCard } from '../../../../components/CommonUI/ProjectCard';
import ProjectDetail from '../../../../components/CommonUI/ProjectDetail';
import { Button } from "../../../../components/CommonUI/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/CommonUI/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/CommonUI/select";
import { 
  ArrowLeft, 
  Users, 
  Users2,
  Folder, 
  FileCheck, 
  AlertCircle,
  Trophy,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function CreatedHackathonViews({
  showSubmissionsView,
  showParticipantsView,
  showTeamsView,
  submissions,
  participants,
  teams,
  selectedSubmissionId,
  setSelectedSubmissionId,
  selectedTeamId,
  setSelectedTeamId,
  selectedType = 'All',
  setSelectedType = () => {},
  setShowSubmissionsView = () => {},
  setShowParticipantsView = () => {},
  setShowTeamsView = () => {},
  user,
}) {
  // Filtering logic for submissions
  const filteredSubmissions = selectedType === 'All'
    ? submissions
    : selectedType === 'Project'
      ? submissions.filter(s => s.type?.toLowerCase() === 'project' || (!s.pptFile && !s.type))
      : selectedType === 'PPT'
        ? submissions.filter(s => s.type?.toLowerCase() === 'ppt' || s.pptFile)
        : submissions;

  // Submissions View
  if (showSubmissionsView) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          {/* Enhanced Header */}
          <div className="sticky top-0 z-20 backdrop-blur-sm bg-white/80 rounded-xl shadow-sm mb-6">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-gray-100"
                  onClick={() => setShowSubmissionsView(false)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
              </div>
              
              {/* Enhanced Filter */}
              {!selectedSubmissionId && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">View:</span>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-40 bg-white">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Submissions</SelectItem>
                      <SelectItem value="Project">Projects Only</SelectItem>
                      <SelectItem value="PPT">Presentations Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Content Area */}
          <div className="space-y-6">
            {selectedSubmissionId ? (
              (() => {
                const sub = submissions.find(s => s._id === selectedSubmissionId);
                return (
                  <Card className="overflow-hidden">
                    <CardContent className="p-6 pt-6">
                      <Button
                        variant="ghost"
                        className="mb-6 flex items-center gap-2"
                        onClick={() => setSelectedSubmissionId(null)}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Submissions
                      </Button>
                      <ProjectDetail
                        project={{
                          ...sub,
                          ...(sub?.projectId && typeof sub.projectId === 'object' && sub.type !== 'ppt' ? sub.projectId : {}),
                        }}
                        hideBackButton={true}
                        onlyOverview={false}
                      />
                    </CardContent>
                  </Card>
                );
              })()
            ) : (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card className="overflow-hidden">
                  <CardContent className="p-6 pt-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                          <FileCheck className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {submissions.length}
                          </div>
                          <div className="text-sm text-gray-500">Total Submissions</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <CardContent className="p-6 pt-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-xl">
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {submissions.filter(s => s.status === 'Submitted').length}
                          </div>
                          <div className="text-sm text-gray-500">Completed</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden">
                      <CardContent className="p-6 pt-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-xl">
                          <Folder className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {submissions.filter(s => s.type?.toLowerCase() === 'project' || (!s.pptFile && !s.type)).length}
                          </div>
                          <div className="text-sm text-gray-500">Projects</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden">
                     <CardContent className="p-6 pt-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-50 rounded-xl">
                          <FileCheck className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {submissions.filter(s => s.pptFile || s.type?.toLowerCase() === 'ppt').length}
                          </div>
                          <div className="text-sm text-gray-500">Presentations</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Submissions Grid */}
                {filteredSubmissions.length === 0 ? (
                  <Card className="overflow-hidden">
                    <CardContent className="text-center py-12 pt-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Folder className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                      <p className="text-gray-500">Submissions will appear here once participants start submitting their work.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSubmissions.map((sub, idx) => (
                      <ProjectCard
                        key={sub._id ? String(sub._id) : `submission-${idx}`}
                        project={{
                          ...sub,
                          ...(sub.projectId && typeof sub.projectId === 'object' ? sub.projectId : {}),
                          title: sub.title || sub.originalName || (sub.projectId && sub.projectId.title) || 'Untitled',
                          name: sub.teamName || (sub.team && sub.team.name) || '-',
                          type: sub.type ? sub.type.toLowerCase() : (sub.pptFile ? 'ppt' : 'project'),
                          status: sub.status || 'Submitted',
                          submittedBy: sub.submittedBy,
                          submittedAt: sub.submittedAt,
                          pptFile: sub.pptFile,
                          ...(sub.type === 'ppt' || sub.pptFile ? { logo: { url: '/assets/ppt.png' }, views: sub.views ?? 0 } : {}),
                        }}
                        onClick={() => setSelectedSubmissionId(sub._id)}
                        user={user}
                        judgeScores={[]}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Participants View
  if (showParticipantsView) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          {/* Enhanced Header */}
          <div className="sticky top-0 z-20 backdrop-blur-sm bg-white/80 rounded-xl shadow-sm mb-6">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-gray-100"
                  onClick={() => setShowParticipantsView(false)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Participants</h1>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6 pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <Users className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{participants.length}</div>
                    <div className="text-sm text-gray-500">Total Participants</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardContent className="p-6 pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <Users2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {participants.filter(p => p.teamName).length}
                    </div>
                    <div className="text-sm text-gray-500">In Teams</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardContent className="p-6 pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {participants.filter(p => !p.teamName).length}
                    </div>
                    <div className="text-sm text-gray-500">Individual</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participants Table */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Participants List</CardTitle>
            </CardHeader>
            <CardContent>
              {participants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No participants yet</h3>
                  <p className="text-gray-500">Participants will appear here once they register.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {participants.map((p, idx) => (
                        <tr key={p._id || p.userId || idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium">
                                {p.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{p.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {p.teamName ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {p.teamName}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">Individual</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Teams View
  if (showTeamsView) {
    if (selectedTeamId) {
      const team = teams.find(t => t._id === selectedTeamId);
      // Build a map of userId to submission status
      const userSubmissionMap = {};
      submissions.forEach(sub => {
        if (sub.submittedBy && sub.submittedBy._id) {
          userSubmissionMap[sub.submittedBy._id] = sub.status || "Draft";
        }
      });

      return (
        <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 min-h-screen">
          <div className="max-w-7xl mx-auto p-6">
            {/* Enhanced Header */}
            <div className="sticky top-0 z-20 backdrop-blur-sm bg-white/80 rounded-xl shadow-sm mb-6">
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-gray-100"
                    onClick={() => setSelectedTeamId(null)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Teams
                  </Button>
                  <h1 className="text-2xl font-bold text-gray-900">{team?.name || 'Team Details'}</h1>
                </div>
              </div>
            </div>

            {/* Team Info Card */}
            <Card className="overflow-hidden mb-6">
              <CardHeader className="pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Users2 className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{team?.name}</CardTitle>
                      <p className="text-sm text-gray-500">Led by {team?.leader?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-600">
                      {team?.members.length} Members
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Team Members Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {team?.members.map((member) => (
                        <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {team.leader._id === member._id ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Team Leader
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">Member</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              userSubmissionMap[member._id] === "Submitted" 
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {userSubmissionMap[member._id] || "Not Started"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Teams Overview
    return (
      <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          {/* Enhanced Header */}
          <div className="sticky top-0 z-20 backdrop-blur-sm bg-white/80 rounded-xl shadow-sm mb-6">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-gray-100"
                  onClick={() => setShowTeamsView(false)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Teams Overview</h1>
              </div>
            </div>
          </div>

          {/* Teams Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6 pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <Users2 className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{teams.length}</div>
                    <div className="text-sm text-gray-500">Total Teams</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
               <CardContent className="p-6 pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {teams.reduce((acc, team) => acc + team.members.length, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Members</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
               <CardContent className="p-6 pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <Trophy className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {teams.length > 0 ? Math.round(teams.reduce((acc, team) => acc + team.members.length, 0) / teams.length) : 0}
                    </div>
                    <div className="text-sm text-gray-500">Avg Team Size</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
               <CardContent className="p-6 pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {teams.filter(team => 
                        team.members.some(member => 
                          submissions.some(sub => sub.submittedBy?._id === member._id)
                        )
                      ).length}
                    </div>
                    <div className="text-sm text-gray-500">Active Teams</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teams Grid */}
          {teams.length === 0 ? (
            <Card className="overflow-hidden">
              <CardContent className="text-center py-12 pt-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Users2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
                <p className="text-gray-500">Teams will appear here once they are formed.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card 
                  key={team._id}
                  className="" 
                  onClick={() => setSelectedTeamId(team._id)}
                >
                  <CardContent className="p-6 pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <Users2 className="w-6 h-6 text-indigo-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{team.name}</h3>
                        <p className="text-sm text-gray-500">{team.members.length} Members</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                          {team.leader?.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-600 flex-1">{team.leader?.name}</span>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">
                          Leader
                        </span>
                      </div>
                      
                      {/* Team Members Preview */}
                      {team.members.length > 1 && (
                        <div className="flex items-center gap-1">
                          <div className="flex -space-x-1">
                            {team.members.slice(0, 3).map((member, idx) => (
                              <div 
                                key={member._id || idx}
                                className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                              >
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                            ))}
                            {team.members.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                +{team.members.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {team.members.length > 1 ? `${team.members.length - 1} other members` : ''}
                          </span>
                        </div>
                      )}
                      
                      {/* Team Status */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">Status</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: nothing
  return null;
}