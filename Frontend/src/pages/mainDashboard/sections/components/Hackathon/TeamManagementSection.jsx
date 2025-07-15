"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../../../../components/CommonUI/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/CommonUI/card";
import { AlertCircle, Users, UserPlus, Copy, Edit, LogOut } from "lucide-react";
import { Badge } from "../../../../../components/CommonUI/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../../components/DashboardUI/avatar";

import InviteModal from "./TeamModals/InviteModal";
import JoinTeamModal from "./TeamModals/JoinTeamModal";
import EditDescriptionModal from "./TeamModals/EditDescriptionModal";
import UnregisterDialog from "./TeamModals/UnregisterDialog";
import RevokeInviteDialog from "./TeamModals/RevokeInviteDialog";

export default function TeamManagementSection({
  hackathon,
  isRegistered,
  setIsRegistered,
  refreshRegistrationStatus,
  sectionRef,
  user,
  toast,
  setShowRegistration,
}) {
  if (!isRegistered) {
    return (
      <div className="p-8 text-center text-gray-500">
        Register for the hackathon to create or join a team.
      </div>
    );
  }

  const [userTeams, setUserTeams] = useState([]);
  const [teamInvites, setTeamInvites] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [copiedTeamId, setCopiedTeamId] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showJoinTeam, setShowJoinTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showUnregisterDialog, setShowUnregisterDialog] = useState(false);
  const [revokeInviteData, setRevokeInviteData] = useState(null);
  const [showCreateTeam, setShowCreateTeam] = useState(false);

  const handleJoinTeam = async (teamCode) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/teams/join/${teamCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { projectId: hackathon._id },
        }
      );
      toast({
        title: "Joined!",
        description: `You joined team: ${res.data.name}`,
      });
      setShowJoinTeam(false);
      fetchUserTeams();
      refreshRegistrationStatus();
    } catch (err) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to join team",
      });
    }
  };

  const handleEditDescription = async (teamId, newDescription) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/teams/${teamId}/description`,
        { description: newDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: "Updated", description: "Team description updated" });
      setEditingTeam(null);
      fetchUserTeams();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update team description",
      });
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Deleted", description: "Team has been deleted" });
      fetchUserTeams();
      refreshRegistrationStatus();
    } catch (err) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Could not delete team",
      });
    }
  };

  const handleLeaveTeam = async (teamId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/teams/${teamId}/leave`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Left Team", description: "You have left the team." });
      fetchUserTeams();
      refreshRegistrationStatus();
    } catch (err) {
      toast({ title: "Error", description: "Could not leave team" });
    }
  };

  const fetchUserTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/teams/hackathon/${hackathon._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Fetched teams:", res.data);
      setUserTeams(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast({ title: "Session expired", description: "Please log in again." });
      } else {
        console.error("Error fetching teams", err);
      }
    }
  };

  const fetchTeamInvites = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/team-invites/hackathon/${hackathon._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeamInvites(res.data);
    } catch (err) {
      console.error("Error fetching invites", err);
    }
  };

  useEffect(() => {
    if (hackathon && hackathon._id) {
      fetchUserTeams();
      fetchTeamInvites();
    }
  }, [hackathon && hackathon._id]);

  const myTeam = userTeams[0];

  const handleShowInviteModal = (team) => {
    if (team.leader._id?.toString() !== user?._id?.toString()) return;
    setSelectedTeam(team);
    setShowInviteModal(true);
  };

  const pendingInvites = teamInvites.filter(invite => invite.status === "pending");

  return (
    <section ref={sectionRef} className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">
        Team Management
      </h2>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                My Teams
              </span>
              {userTeams.length === 0 && (
                <div className="flex justify-center gap-4 mb-4">
                  <Button
                    onClick={() => setShowCreateTeam(true)}
                    variant="primary"
                    size="sm"
                  >
                    Create Team
                  </Button>
                  <Button
                    onClick={() => setShowJoinTeam(true)}
                    variant="outline"
                    size="sm"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Team
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userTeams.length > 0 && (
              <div className="mb-4 text-green-700 text-center font-medium">
                You already have a team for this hackathon. Manage your team below.
              </div>
            )}
            {userTeams.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                You are not part of any team yet.
              </div>
            ) : (
              userTeams.map((team) => (
                <div
                  key={team._id}
                  className="mb-4 p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{team.name}</h4>
                      <p className="text-sm text-gray-500">
                        Code:{" "}
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {team.teamCode}
                        </span>
                      </p>
                    </div>
                    <Badge variant="default">
                      {team.members.length}/{team.maxMembers}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {team.members.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.name}</span>
                        {member._id === team.leader._id && (
                          <Badge variant="secondary">Leader</Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  {team.description && (
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-medium text-gray-600">
                        Description:
                      </span>{" "}
                      {team.description}
                    </p>
                  )}

                  <div className="flex gap-2 mt-3 flex-wrap">
                    {team.members.length < team.maxMembers &&
                      team.leader._id?.toString() === user?._id?.toString() && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShowInviteModal(team)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(team.teamCode);
                        setCopiedTeamId(team._id);
                        toast({
                          title: "Copied",
                          description: "Team code copied",
                        });
                        setTimeout(() => setCopiedTeamId(null), 1500);
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </Button>

                    {team.leader._id?.toString() === user?._id?.toString() ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingTeam(team)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteTeam(team._id)}
                        >
                          Delete
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                        onClick={() => handleLeaveTeam(team._id)}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Leave
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Pending Invites */}
        {pendingInvites.length > 0 && myTeam && myTeam.leader._id?.toString() === user?._id?.toString() && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Invites</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingInvites.map((invite) => (
                <div
                  key={invite._id}
                  className="flex justify-between items-center border p-3 rounded-lg mb-2"
                >
                  <div>
                    <p className="font-medium">{invite.invitedEmail}</p>
                    <p className="text-sm text-gray-500">
                      Invited by <strong>{invite.invitedBy.name}</strong> to{" "}
                      <strong>{invite.team.name}</strong>
                    </p>
                    <div className="mt-1">
                      <Badge
                        variant={
                          invite.status === "pending"
                            ? "default"
                            : invite.status === "accepted"
                            ? "success"
                            : "destructive"
                        }
                      >
                        {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {invite.status === "pending" && invite.team.leader?._id?.toString() === user?._id?.toString() ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setRevokeInviteData(invite)}
                    >
                      Revoke
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      {invite.status === "accepted" ? "Joined" : "Declined"}
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <InviteModal
        show={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        team={selectedTeam}
        hackathon={hackathon}
        onInviteSent={fetchTeamInvites}
      />

      <JoinTeamModal
        open={showJoinTeam}
        onClose={() => setShowJoinTeam(false)}
        onJoin={handleJoinTeam}
      />

      <EditDescriptionModal
        team={editingTeam}
        open={!!editingTeam}
        onClose={() => setEditingTeam(null)}
        onSave={(desc) => handleEditDescription(editingTeam._id, desc)}
      />

      <RevokeInviteDialog
        open={!!revokeInviteData}
        invite={revokeInviteData}
        onClose={() => setRevokeInviteData(null)}
        onRevoked={fetchTeamInvites}
      />

      <Button onClick={fetchUserTeams} variant="outline" size="sm">
        Refresh Teams
      </Button>
    </section>
  );
}
