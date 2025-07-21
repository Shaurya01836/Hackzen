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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../../../../components/DashboardUI/alert-dialog";
import { Trash2 } from "lucide-react";
import { HackathonRegistration } from "../../RegistrationHackathon";
import { Input } from "../../../../../components/CommonUI/input";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

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
  // All hooks at the very top
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
  const [showJoinByCodeModal, setShowJoinByCodeModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joiningTeam, setJoiningTeam] = useState(false);
  const [pendingTeam, setPendingTeam] = useState(null); // team object after join, before registration
  const [showJoinRegistration, setShowJoinRegistration] = useState(false);
  const [joinError, setJoinError] = useState("");
  const navigate = useNavigate();

  // Add this handler at the top with other handlers
  const handleShowInviteModal = (team) => {
    if (team.leader._id?.toString() !== user?._id?.toString()) return;
    setSelectedTeam(team);
    setShowInviteModal(true);
  };

  useEffect(() => {
    if (hackathon && hackathon._id) {
      fetchUserTeams();
      fetchTeamInvites();
    }
  }, [hackathon && hackathon._id]);

  useEffect(() => {
    if (!hackathon || !hackathon._id) return;
    // Poll every 10 seconds
    const interval = setInterval(() => {
      fetchTeamInvites();
    }, 10000);
    return () => clearInterval(interval);
  }, [hackathon && hackathon._id]);

  // Handler for joining by code
  const handleJoinByCode = async () => {
    setJoiningTeam(true);
    setJoinError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/teams/join/${joinCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingTeam(res.data.team);
      setShowJoinByCodeModal(false);
      setShowJoinRegistration(true);
    } catch (err) {
      setJoinError(err?.response?.data?.error || "Invalid or expired team code");
    } finally {
      setJoiningTeam(false);
    }
  };

  // Handler for registration after joining by code
  const handleJoinRegistration = async (formData) => {
    console.log("handleJoinRegistration called", formData);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/registration",
        {
          hackathonId: hackathon._id,
          formData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: "Registered!", description: "You have joined the team and registered for the hackathon." });
      setShowJoinRegistration(false);
      fetchUserTeams();
      refreshRegistrationStatus();
      navigate("/dashboard/my-hackathons");
    } catch (err) {
      toast({ title: "Error", description: err?.response?.data?.message || "Registration failed" });
      navigate("/dashboard/my-hackathons"); // Always navigate for debug
    }
  };

  // Handler for deleting a team (with UI update/redirect)
  const handleDeleteTeam = async (teamId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/teams/${teamId}`,
        { headers: { Authorization: `Bearer ${token}` } });
      toast({ title: "Deleted", description: "Team has been deleted" });
      await fetchUserTeams();
      await refreshRegistrationStatus();
      setUserTeams([]); // Clear teams after deletion
      setTimeout(() => {
        toast({ title: "No Team", description: "You are no longer part of any team for this hackathon." });
        // Optionally redirect:
        // navigate("/dashboard/my-hackathons");
      }, 500);
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

  // Add handler for removing a member (leader only)
  const handleRemoveMember = async (teamId, memberId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/teams/${teamId}/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Removed", description: "Member removed from team." });
      fetchUserTeams();
      refreshRegistrationStatus();
    } catch (err) {
      toast({ title: "Error", description: err?.response?.data?.error || "Could not remove member" });
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
      console.log("Fetched team invites:", res.data);
      setTeamInvites(res.data);
    } catch (err) {
      console.error("Error fetching invites", err);
    }
  };

  // Conditional render after all hooks
  let notRegisteredContent = null;
  if (!isRegistered) {
    notRegisteredContent = (
      <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-6">
        <div>Register for the hackathon to create or join a team.</div>
        <Button
          variant="blue"
          size="lg"
          onClick={() => setShowJoinByCodeModal(true)}
        >
          Join Team by Code
        </Button>
        {/* Join by code modal */}
        {showJoinByCodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Join Team by Code</h2>
              <Input
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                placeholder="Enter team code"
                className="mb-4"
              />
              {joinError && <div className="text-red-600 mb-2">{joinError}</div>}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowJoinByCodeModal(false)}>Cancel</Button>
                <Button
                  variant="blue"
                  onClick={handleJoinByCode}
                  disabled={joiningTeam || !joinCode.trim()}
                >
                  {joiningTeam ? "Joining..." : "Join"}
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Registration form after joining by code */}
        {showJoinRegistration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-lg font-semibold text-blue-900">
                  You are joining team <span className="font-bold">{pendingTeam?.name}</span> for hackathon <span className="font-bold">{hackathon?.title}</span>!
                </p>
              </div>
              <HackathonRegistration
                hackathon={hackathon}
                onBack={() => setShowJoinRegistration(false)}
                onSuccess={handleJoinRegistration}
                inviteMode={true}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!isRegistered) return notRegisteredContent;

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

  // Use the same simple logic as the old working system
  const pendingInvites = teamInvites.filter(invite => invite.status === "pending");

  // Debug logging
  console.log("Team Management Debug:", {
    userTeams: userTeams.length,
    myTeam: userTeams[0]?._id,
    myTeamLeader: userTeams[0]?.leader?._id,
    currentUser: user?._id,
    isLeader: userTeams[0]?.leader._id?.toString() === user?._id?.toString(),
    teamInvites: teamInvites.length,
    pendingInvites: pendingInvites.length,
    pendingInvitesData: pendingInvites.map(invite => ({
      id: invite._id,
      email: invite.invitedEmail,
      status: invite.status,
      teamId: invite.team._id,
      teamLeader: invite.team.leader?._id,
      canRevoke: invite.team.leader?._id?.toString() === user?._id?.toString()
    }))
  });

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
                        className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border relative"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.name}</span>
                        {member._id === team.leader._id && (
                          <Badge variant="secondary">Leader</Badge>
                        )}
                        {/* Remove button for leader, Leave button for self */}
                        {team.leader._id?.toString() === user?._id?.toString() && member._id !== team.leader._id && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="ml-2 flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" /> Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove {member.name}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove <span className="font-semibold">{member.name}</span> from the team? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveMember(team._id, member._id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Yes, Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
                    {team.leader._id?.toString() === user?._id?.toString() && team.members.length < team.maxMembers && (
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
                        toast("Code copied!");
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Team?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the team <span className="font-semibold">{team.name}</span>? This action cannot be undone and all members will be removed from the team.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTeam(team._id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Yes, Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Leave Team
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Leave Team?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to leave the team <span className="font-semibold">{team.name}</span>? You will be removed from the team and the hackathon.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleLeaveTeam(team._id)}
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                              Yes, Leave
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Invites ({pendingInvites.length})</CardTitle>
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

                  {invite.status === "pending" ? (
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

    
    </section>
  );
}
