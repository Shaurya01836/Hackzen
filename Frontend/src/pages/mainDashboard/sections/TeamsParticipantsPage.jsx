import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../components/AdminUI/table";
import DashboardPage from "../Page";

export default function TeamsParticipantsPage() {
  const { hackathonId, teamId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        // Fetch teams and submissions
        const [teamsRes, submissionsRes] = await Promise.all([
          fetch(`http://localhost:3000/api/teams/hackathon/${hackathonId}/all`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`http://localhost:3000/api/projects/hackathon/${hackathonId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const teamsData = await teamsRes.json();
        const submissionsData = await submissionsRes.json();
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    if (hackathonId) fetchData();
  }, [hackathonId]);

  // Build a map of userId to submission status
  const userSubmissionMap = {};
  submissions.forEach(sub => {
    if (sub.submittedBy && sub.submittedBy._id) {
      userSubmissionMap[sub.submittedBy._id] = sub.status || "Draft";
    }
  });

  // If teamId is present, filter to that team
  const displayTeams = teamId ? teams.filter(team => team._id === teamId) : teams;

  return (
    <DashboardPage section="teams-participants">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">
          {teamId ? "Team Participants" : "Teams & Members"}
        </h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : displayTeams.length === 0 ? (
          <div>No {teamId ? "team" : "teams"} found for this hackathon.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Member Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Submission Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayTeams.map((team) => (
                team.members.map((member, idx) => (
                  <TableRow
                    key={team._id + '-' + member._id}
                    style={!teamId ? { cursor: 'pointer' } : {}}
                    onClick={() => {
                      if (!teamId && idx === 0) navigate(`/dashboard/created-hackathons/${hackathonId}/teams/${team._id}`);
                    }}
                  >
                    <TableCell>{team.name}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{team.leader._id === member._id ? "Team Leader" : "Member"}</TableCell>
                    <TableCell>{userSubmissionMap[member._id] || "Not Started"}</TableCell>
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        )}
        {/* Back button for single team view */}
        {teamId && (
          <button
            className="mt-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => navigate(`/dashboard/created-hackathons/${hackathonId}/teams`)}
          >
            Back to All Teams
          </button>
        )}
      </div>
    </DashboardPage>
  );
} 