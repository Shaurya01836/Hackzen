"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  Github,
  Heart,
  Share2,
  Users,
  ExternalLink,
  Play,
  Clock,
  Award,
  Code,
  Layers,
  UserPlus,
  Copy,
  Edit,
  LogOut,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "../DashboardUI/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../DashboardUI/alert-dialog";
import { useToast } from "../../hooks/use-toast";
import axios from "axios";

export function ProjectDetail({ project, onBack }) {
  const { user } = useAuth();
  const { toast } = useToast();

  // Team management state
  const [userTeams, setUserTeams] = useState([]);
  const [projectTeams, setProjectTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copiedTeamId, setCopiedTeamId] = useState(null);
  const [showEditDescription, setShowEditDescription] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingDescription, setEditingDescription] = useState("");
  const [removeDialog, setRemoveDialog] = useState({
    open: false,
    teamId: null,
    memberId: null,
  });
  const [leaveDialog, setLeaveDialog] = useState({ open: false, teamId: null });
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [submittedUser, setSubmittedUser] = useState(null);

  // Fetch user teams for this project's hackathon
  useEffect(() => {
    if (project?.hackathon?._id) {
      fetchUserTeams();
    }
  }, [project]);

  // Fetch project teams (independent of hackathon)
  useEffect(() => {
    if (project?._id) {
      fetchProjectTeams();
    }
  }, [project]);

  const fetchUserTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/teams/hackathon/${project.hackathon._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const teams = await response.json();
        setUserTeams(teams);
      }
    } catch (error) {
      console.error("Failed to fetch user teams:", error);
    }
  };

  const fetchProjectTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/teams/project/${project._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const teams = await response.json();
        setProjectTeams(teams);
      }
    } catch (error) {
      console.error("Failed to fetch project teams:", error);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim() || !newTeamDescription.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newTeamName.trim(),
          description: newTeamDescription.trim(),
          projectId: project._id,
          maxMembers: 4,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Team Created!",
          description: `Team "${newTeamName}" has been created successfully`,
          duration: 3000,
        });
        setShowCreateTeamModal(false);
        setNewTeamName("");
        setNewTeamDescription("");
        fetchProjectTeams(); // Refresh teams
      } else {
        toast({
          title: "Failed to create team",
          description: data.message || "Something went wrong",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Error",
        description: "Failed to create team",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async () => {
    if (!inviteEmail.trim() || !selectedTeam) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/team-invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teamId: selectedTeam._id,
          invitedUserEmail: inviteEmail,
          hackathonId: project.hackathon._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Invite Sent!",
          description: `Invitation sent to ${inviteEmail}`,
          duration: 3000,
        });
        setShowInviteModal(false);
        setSelectedTeam(null);
        setInviteEmail("");
      } else {
        toast({
          title: "Failed to send invite",
          description: data.message || "Something went wrong",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditDescription = (team) => {
    setEditingTeamId(team._id);
    setEditingDescription(team.description);
    setShowEditDescription(true);
  };
  useEffect(() => {
    const fetchUser = async () => {
      if (typeof project.submittedBy === "string") {
        try {
          const res = await axios.get(
            `http://localhost:3000/api/users/${project.submittedBy}`
          );
          setSubmittedUser(res.data);
        } catch (err) {
          console.error("Error fetching submittedBy user:", err);
        }
      } else {
        // If already populated
        setSubmittedUser(project.submittedBy);
      }
    };

    fetchUser();
  }, [project]);
  const handleUpdateDescription = async () => {
    if (!editingDescription.trim() || !editingTeamId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/teams/${editingTeamId}/description`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ description: editingDescription }),
        }
      );

      if (response.ok) {
        toast({
          title: "Description Updated",
          description: "Team description has been updated successfully",
          duration: 3000,
        });
        setShowEditDescription(false);
        setEditingTeamId(null);
        setEditingDescription("");
        fetchUserTeams(); // Refresh teams
      } else {
        const data = await response.json();
        toast({
          title: "Failed to update description",
          description: data.message || "Something went wrong",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating description:", error);
      toast({
        title: "Error",
        description: "Failed to update description",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (teamId, memberId) => {
    setRemoveDialog({ open: true, teamId, memberId });
  };

  const confirmRemoveMember = async () => {
    if (!removeDialog.teamId || !removeDialog.memberId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/teams/${removeDialog.teamId}/members/${removeDialog.memberId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Member Removed",
          description: "Team member has been removed successfully",
          duration: 3000,
        });
        fetchUserTeams(); // Refresh teams
      } else {
        const data = await response.json();
        toast({
          title: "Failed to remove member",
          description: data.message || "Something went wrong",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        duration: 3000,
      });
    } finally {
      setLoading(false);
      setRemoveDialog({ open: false, teamId: null, memberId: null });
    }
  };

  const handleLeaveTeam = (teamId) => {
    setLeaveDialog({ open: true, teamId });
  };

  const confirmLeaveTeam = async () => {
    if (!leaveDialog.teamId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/teams/${leaveDialog.teamId}/leave`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Left Team",
          description: "You have successfully left the team",
          duration: 3000,
        });
        fetchUserTeams(); // Refresh teams
      } else {
        const data = await response.json();
        toast({
          title: "Failed to leave team",
          description: data.message || "Something went wrong",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error leaving team:", error);
      toast({
        title: "Error",
        description: "Failed to leave team",
        duration: 3000,
      });
    } finally {
      setLoading(false);
      setLeaveDialog({ open: false, teamId: null });
    }
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-slate-100 ">
      <header className="border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <Heart className="w-4 h-4" /> 7
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className=" px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <img
                src={project.logo?.url || "/placeholder.svg"}
                alt="Project Logo"
                className="w-20 h-20 object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {project.title}
              </h1>
              {project.oneLineIntro && (
                <p className="text-gray-700 italic text-md mb-2">
                  {project.oneLineIntro}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="hackathon">Hackathon</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Play className="w-5 h-5" /> Videos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-900">
                      {project.videoLink ? (
                        <iframe
                          src={project.videoLink}
                          title="Demo Video"
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <Play className="w-16 h-16" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                {project.description && (
                  <div
                    className="text-gray-600 text-lg leading-relaxed max-w-4xl"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                )}

                {project.skills && project.skills.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="px-3 py-1"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="hackathon" className="space-y-8">
                {project.hackathon ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Submitted Hackathon</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {project.hackathon.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {project.hackathon.prizeTrack || "Prize track info"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {project.hackathon.status || "Unknown"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <p>No hackathon linked.</p>
                )}
              </TabsContent>

              <TabsContent value="team" className="space-y-8">
                {/* Team Intro */}
                {project?.submittedBy && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-sm text-gray-500">
                        Team Leader
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={
                              project.submittedBy.profileImage ||
                              "/placeholder.svg"
                            }
                            alt={project.submittedBy.name || "Team Leader"}
                          />
                          <AvatarFallback>
                            {project.submittedBy.name?.[0]?.toUpperCase() ||
                              "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {project.submittedBy.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}

                {/* Project Team Management Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Project Team Management
                      </span>
                      <Button
                        onClick={() => setShowCreateTeamModal(true)}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Create Team
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {projectTeams.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Teams Yet
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Create a team to collaborate on this project and
                          invite members to join.
                        </p>
                        <Button
                          onClick={() => setShowCreateTeamModal(true)}
                          className="flex items-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          Create Your First Team
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {projectTeams.map((team) => (
                          <div
                            key={team._id}
                            className="mb-6 p-4 border rounded-lg bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-lg">
                                  {team.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  Team Code:{" "}
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                    {team.teamCode}
                                  </span>
                                </p>
                              </div>
                              <Badge
                                variant={
                                  team.members.length >= team.maxMembers
                                    ? "destructive"
                                    : "default"
                                }
                              >
                                {team.members.length}/{team.maxMembers} members
                              </Badge>
                            </div>
                            <div className="flex items-start justify-between mb-3">
                              <p className="text-gray-600 flex-1">
                                {team.description}
                              </p>
                              {team.leader._id === user?._id && (
                                <Button
                                  onClick={() => handleEditDescription(team)}
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            {/* Team Members */}
                            <div className="mb-4">
                              <h5 className="font-medium mb-2">
                                Team Members:
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {team.members.map((member) => (
                                  <div
                                    key={member._id}
                                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                                  >
                                    <Avatar className="w-6 h-6">
                                      <AvatarImage src={member.avatar} />
                                      <AvatarFallback>
                                        {member.name?.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">
                                      {member.name}
                                    </span>
                                    {member._id === team.leader._id && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        Leader
                                      </Badge>
                                    )}
                                    {team.leader._id === user?._id &&
                                      member._id !== user?._id && (
                                        <AlertDialog
                                          open={
                                            removeDialog.open &&
                                            removeDialog.teamId === team._id &&
                                            removeDialog.memberId === member._id
                                          }
                                          onOpenChange={(open) =>
                                            setRemoveDialog(
                                              open
                                                ? {
                                                    open: true,
                                                    teamId: team._id,
                                                    memberId: member._id,
                                                  }
                                                : {
                                                    open: false,
                                                    teamId: null,
                                                    memberId: null,
                                                  }
                                            )
                                          }
                                        >
                                          <AlertDialogTrigger asChild>
                                            <Button
                                              size="xs"
                                              variant="destructive"
                                            >
                                              Remove
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>
                                                Remove Team Member?
                                              </AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Are you sure you want to remove{" "}
                                                <b>{member.name}</b> from the
                                                team? They will be unregistered
                                                from the hackathon and need to
                                                register again if they want to
                                                participate. This action cannot
                                                be undone.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>
                                                Cancel
                                              </AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={confirmRemoveMember}
                                                disabled={loading}
                                              >
                                                Remove
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Team Actions */}
                            <div className="flex gap-2 mb-2">
                              {team.members.length < team.maxMembers && (
                                <Button
                                  onClick={() => {
                                    setSelectedTeam(team);
                                    setShowInviteModal(true);
                                  }}
                                  variant="outline"
                                  size="sm"
                                >
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  Invite Member
                                </Button>
                              )}
                              <div className="relative inline-block">
                                <Button
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      team.teamCode
                                    );
                                    setCopiedTeamId(team._id);
                                    toast({
                                      title: "Code copied!",
                                      description:
                                        "Team code copied to clipboard.",
                                    });
                                    setTimeout(
                                      () => setCopiedTeamId(null),
                                      1500
                                    );
                                  }}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Code
                                </Button>
                                {copiedTeamId === team._id && (
                                  <span
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1 text-xs font-semibold animate-fade-in-out z-10"
                                    style={{ pointerEvents: "none" }}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Code Copied!
                                  </span>
                                )}
                              </div>
                              {/* Leave team button for members (not leader) */}
                              {team.leader._id !== user?._id && (
                                <AlertDialog
                                  open={
                                    leaveDialog.open &&
                                    leaveDialog.teamId === team._id
                                  }
                                  onOpenChange={(open) =>
                                    setLeaveDialog(
                                      open
                                        ? { open: true, teamId: team._id }
                                        : { open: false, teamId: null }
                                    )
                                  }
                                >
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={loading}
                                      className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                    >
                                      <LogOut className="w-4 h-4 mr-2" />
                                      Leave Team
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Leave Team?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to leave this
                                        team? You will be unregistered from the
                                        hackathon and need to register again if
                                        you want to participate.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={confirmLeaveTeam}
                                        disabled={loading}
                                      >
                                        Leave Team
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Original Team Members Display */}
                {(project.team || []).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <Users className="w-5 h-5" /> Project Team Members
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {project.team.map((member, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 p-4 rounded-lg bg-gray-50"
                          >
                            <Avatar className="w-12 h-12">
                              <AvatarImage
                                src={member.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback>
                                {member.name?.[0] || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {member.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {member.role}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {project.submittedBy && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-500">
                    Team Leader
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={submittedUser?.profileImage || "/placeholder.svg"}
                        alt={submittedUser?.name || "Team Leader"}
                      />
                      <AvatarFallback>
                        {submittedUser?.name?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {submittedUser?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {project.repoLink && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-500">
                    Github
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                      <Github className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Repository</p>
                      <a
                        href={project.repoLink}
                        target="_blank"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {project.repoLink} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {project.category && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-500">
                    Sector
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Layers className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {project.category}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowInviteModal(false);
                setSelectedTeam(null);
                setInviteEmail("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">Invite Team Member</h3>
            <p className="text-gray-600 mb-4">
              Invite someone to join <strong>{selectedTeam.name}</strong>
            </p>
            <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
              <strong>Team Size:</strong> {selectedTeam.members.length}/
              {selectedTeam.maxMembers} members currently. This hackathon allows
              teams of {project.hackathon?.teamSize?.min || 1} to{" "}
              {project.hackathon?.teamSize?.max || 4} members.
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The recipient will receive an email with an invitation link
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSendInvite}
                  disabled={!inviteEmail.trim() || loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    "Send Invite"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInviteModal(false);
                    setSelectedTeam(null);
                    setInviteEmail("");
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Description Modal */}
      {showEditDescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowEditDescription(false);
                setEditingTeamId(null);
                setEditingDescription("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">
              Edit Team Description
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Team Description
                </label>
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  placeholder="Describe your team's goals, skills, and what you hope to achieve"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editingDescription.length}/300 characters
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleUpdateDescription}
                  disabled={!editingDescription.trim() || loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Description"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditDescription(false);
                    setEditingTeamId(null);
                    setEditingDescription("");
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowCreateTeamModal(false);
                setNewTeamName("");
                setNewTeamDescription("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">Create New Team</h3>
            <p className="text-gray-600 mb-4">
              Create a team to collaborate on this project
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Team Description *
                </label>
                <textarea
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  placeholder="Describe your team's goals and what you hope to achieve"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  required
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newTeamDescription.length}/300 characters
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCreateTeam}
                  disabled={
                    !newTeamName.trim() || !newTeamDescription.trim() || loading
                  }
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Team"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateTeamModal(false);
                    setNewTeamName("");
                    setNewTeamDescription("");
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
