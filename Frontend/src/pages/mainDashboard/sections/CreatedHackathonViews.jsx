import React from "react";
import { ProjectCard } from '../../../components/CommonUI/ProjectCard';
import { ProjectDetail } from '../../../components/CommonUI/ProjectDetail';
import { Button } from "../../../components/CommonUI/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/CommonUI/select";

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
  // Submissions View
  if (showSubmissionsView) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg min-h-[70vh]">
        {/* Sticky header for back button and title */}
        <div className="sticky top-0 z-10 bg-white pb-2 flex items-center gap-4">
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium" onClick={() => setShowSubmissionsView(false)}>
            ← Back to Overview
          </button>
          <h1 className="text-2xl font-bold text-indigo-900 mb-0">Submissions</h1>
        </div>
        {/* Dropdown filter for submission type */}
        {!selectedSubmissionId && (
          <div className="mb-6 flex items-center gap-4 mt-4">
            <label className="font-medium text-gray-700">Filter by Type:</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Project">Project</SelectItem>
                <SelectItem value="PPT">PPT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {selectedSubmissionId ? (
          (() => {
            const sub = submissions.find(s => s._id === selectedSubmissionId);
            if (!sub) return null;
            return (
              <div>
                <button className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium" onClick={() => setSelectedSubmissionId(null)}>
                  ← Back to Submissions
                </button>
                <ProjectDetail
                  project={{
                    ...sub,
                    ...(sub.projectId && typeof sub.projectId === 'object' ? sub.projectId : {}),
                  }}
                  onBack={() => setSelectedSubmissionId(null)}
                  hideBackButton={true}
                  onlyOverview={false}
                />
              </div>
            );
          })()
        ) : (
          <>
            {(() => {
              let filteredSubs = submissions;
              try {
                const safeSelectedType = typeof selectedType === 'string' && selectedType ? selectedType : 'All';
                filteredSubs = safeSelectedType.toLowerCase() === 'all'
                  ? submissions
                  : submissions.filter(sub => {
                      let type = 'project';
                      if (typeof sub.type === 'string' && sub.type) {
                        type = sub.type.toLowerCase();
                      } else if (sub.pptFile) {
                        type = 'ppt';
                      }
                      if (typeof type !== 'string' || typeof safeSelectedType !== 'string') {
                        return false;
                      }
                      return type === safeSelectedType.toLowerCase();
                    });
              } catch (err) {
                filteredSubs = submissions; // fallback to showing all
              }
              if (filteredSubs.length === 0) {
                return <div className="text-center text-gray-500">No submissions yet.</div>;
              }
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSubs.map((sub, idx) => (
                    <ProjectCard
                      key={sub._id ? String(sub._id) : `submission-${idx}`}
                      project={{
                        ...sub,
                        ...(sub.projectId && typeof sub.projectId === 'object' ? sub.projectId : {}),
                        title: sub.title || sub.originalName || (sub.projectId && sub.projectId.title) || 'Untitled',
                        name: sub.teamName || (sub.team && sub.team.name) || '-',
                        type: sub.type ? sub.type.toUpperCase() : (sub.pptFile ? 'PPT' : 'Project'),
                        status: sub.status || 'Submitted',
                        submittedBy: sub.submittedBy,
                        submittedAt: sub.submittedAt,
                        pptFile: sub.pptFile,
                      }}
                      onClick={() => setSelectedSubmissionId(sub._id)}
                      user={user}
                      judgeScores={[]}
                    />
                  ))}
                </div>
              );
            })()}
          </>
        )}
      </div>
    );
  }
  // Participants View
  if (showParticipantsView) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg min-h-[70vh]">
        <div className="sticky top-0 z-10 bg-white pb-2 flex items-center gap-4">
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium" onClick={() => setShowParticipantsView(false)}>
            ← Back to Overview
          </button>
          <h1 className="text-2xl font-bold text-indigo-900 mb-0">Participants</h1>
        </div>
        {participants.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">No participants registered yet.</div>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {participants.map((p, idx) => (
                  <tr key={p._id || p.userId || idx}>
                    <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.teamName || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg min-h-[70vh]">
          <div className="sticky top-0 z-10 bg-white pb-2 flex items-center gap-4">
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium" onClick={() => setSelectedTeamId(null)}>
              ← Back to Teams
            </button>
            <h1 className="text-2xl font-bold text-indigo-900 mb-0">{team?.name || 'Team Details'}</h1>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-indigo-800">{team?.name}</div>
                <div className="text-gray-600 text-sm mt-1">Team Leader: <span className="font-semibold">{team?.leader?.name}</span></div>
              </div>
              <div className="mt-2 sm:mt-0 text-sm text-gray-500">Members: {team?.members.length}</div>
            </div>
            {team?.members.length === 1 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm text-center">
                This team has only one member.
              </div>
            )}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {team?.members.map((member) => (
                  <tr key={member._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{team.leader._id === member._id ? "Team Leader" : "Member"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{userSubmissionMap[member._id] || "Not Started"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg min-h-[70vh]">
        <div className="sticky top-0 z-10 bg-white pb-2 flex items-center gap-4">
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium" onClick={() => setShowTeamsView(false)}>
            ← Back to Overview
          </button>
          <h1 className="text-2xl font-bold text-indigo-900 mb-0">Teams & Leaders</h1>
        </div>
        {teams.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">No teams found for this hackathon.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {teams.map((team) => (
              <div
                key={team._id}
                className="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition cursor-pointer border border-gray-100"
                onClick={() => setSelectedTeamId(team._id)}
              >
                <div className="text-lg font-bold text-indigo-700 mb-2">{team.name}</div>
                <div className="text-sm text-gray-500 mb-1">Team Leader: <span className="font-semibold text-gray-700">{team.leader?.name}</span></div>
                <div className="text-xs text-gray-400 mt-2">Members: {team.members.length}</div>
                {team.members.length === 1 && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-blue-800 text-xs text-center">
                    This team has only one member.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  // Default: nothing
  return null;
} 