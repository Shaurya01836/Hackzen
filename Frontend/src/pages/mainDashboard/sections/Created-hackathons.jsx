"use client";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Users,
  Calendar,
  Trophy,
  Settings,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Check,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import {
  ACard,
  ACardContent,
  ACardDescription,
  ACardHeader,
  ACardTitle,
} from "../../../components/DashboardUI/AnimatedCard";
import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/CommonUI/tabs";
import { Progress } from "../../../components/DashboardUI/progress";
import HackathonDetailModal from "./HackathonDetailModal";
import HackathonEditModal from "./HackathonEditModal"; // Adjust path

export function CreatedHackathons({ onCreateNew }) {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const hackathonToDelete = useRef(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/hackathons/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setHackathons(data);
      } catch (err) {
        console.error("Failed to load hackathons", err);
      }
    };

    fetchHackathons();
  }, []);

  const liveHackathons = hackathons.filter((h) => h.status === "ongoing");
  const completedHackathons = hackathons.filter((h) => h.status === "ended");
  const draftHackathons = hackathons.filter((h) => h.status === "draft");
  const pendingHackathons = hackathons.filter((h) => h.approvalStatus === "pending");
  const approvedHackathons = hackathons.filter((h) => h.approvalStatus === "approved");
  const rejectedHackathons = hackathons.filter((h) => h.approvalStatus === "rejected");
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editHackathon, setEditHackathon] = useState(null);

  const handleEdit = (hackathon) => {
    setEditHackathon(hackathon);
  };

  const handleViewDetails = (hackathon) => {
    setSelectedHackathon(hackathon);
    setShowModal(true);
  };

  const registrationOpenHackathons = hackathons.filter(
    (h) => new Date(h.registrationDeadline) > new Date()
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-green-500";
      case "ended":
        return "bg-gray-500";
      case "draft":
        return "bg-yellow-500";
      case "upcoming":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getApprovalStatusColor = (approvalStatus) => {
    switch (approvalStatus) {
      case "approved":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getApprovalStatusText = (approvalStatus) => {
    switch (approvalStatus) {
      case "approved":
        return "✅ Approved - Visible to participants";
      case "pending":
        return "⏳ Pending - Awaiting admin approval";
      case "rejected":
        return "❌ Rejected - Please review and resubmit";
      default:
        return "⏳ Pending - Awaiting admin approval";
    }
  };

  const handleDelete = (hackathon) => {
    hackathonToDelete.current = hackathon;
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    const hackathon = hackathonToDelete.current;
    if (!hackathon) return;
    setDeletingId(hackathon._id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/hackathons/${hackathon._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete hackathon");
      setHackathons((prev) => prev.filter((h) => h._id !== hackathon._id));
      setShowDeleteDialog(false);
      hackathonToDelete.current = null;
    } catch (err) {
      alert("Error deleting hackathon");
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    hackathonToDelete.current = null;
  };

  const renderHackathonCard = (hackathon) => (
    <Card key={hackathon._id} className="">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{hackathon.title}</CardTitle>
            <CardDescription className="mt-1">
              {hackathon.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${getStatusColor(hackathon.status)}`}
            >
              {hackathon.status}
            </Badge>
            <Badge
              variant="outline"
              className={`${getApprovalStatusColor(hackathon.approvalStatus)}`}
            >
              {hackathon.approvalStatus || "pending"}
            </Badge>
          </div>
        </div>
        {/* Approval Status Info */}
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            {getApprovalStatusText(hackathon.approvalStatus)}
          </p>
          {hackathon.approvalStatus === "pending" && (
            <p className="text-xs text-blue-600 mt-1">
              💡 Once approved by admin, your hackathon will be visible in the explore section for participants to register.
            </p>
          )}
          {hackathon.approvalStatus === "rejected" && (
            <p className="text-xs text-red-600 mt-1">
              💡 Please review the feedback and make necessary changes before resubmitting.
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>
              {new Date(hackathon.startDate).toLocaleDateString()} -{" "}
              {new Date(hackathon.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-gray-500" />
            <span>
              {hackathon.prizePool?.amount
                ? `$${hackathon.prizePool.amount}`
                : "No Prize"}{" "}
              prize pool
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>
              {hackathon.participantCount || 0}/{hackathon.maxParticipants}{" "}
              participants
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <span>{hackathon.submissions?.length || 0} submissions</span>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Participation</span>
              <span>
                {Math.round(
                  ((hackathon.participants?.length || 0) /
                    hackathon.maxParticipants) *
                    100
                )}
                %
              </span>
            </div>
            <Progress
              value={
                ((hackathon.participantCount || 0) /
                  hackathon.maxParticipants) *
                100
              }
              className="h-2"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Badge variant="outline">{hackathon.category}</Badge>
          <Badge variant="outline">
            {hackathon.judges?.length || 0} judges
          </Badge>
          <Badge variant="outline">{hackathon.tags?.join(", ")}</Badge>
          {hackathon.approvalStatus === "approved" && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              <Eye className="w-3 h-3 mr-1" />
              Visible in Explore
            </Badge>
          )}
          {hackathon.approvalStatus === "pending" && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              For admin approval
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex items-center gap-1"
            onClick={() => handleViewDetails(hackathon)}
          >
            <Eye className="w-3 h-3" />
            View Details
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => handleEdit(hackathon)}
          >
            <Edit className="w-3 h-3" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <BarChart3 className="w-3 h-3" />
            Analytics
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1 text-red-600 hover:text-red-700"
            onClick={() => handleDelete(hackathon)}
            disabled={deletingId === hackathon._id}
          >
            <Trash2 className="w-3 h-3" />
            {deletingId === hackathon._id ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Created Hackathons
            </h1>
            <p className="text-sm text-gray-500">
              Manage and monitor your organized events
            </p>
          </div>
        </div>
        <Button className="flex items-center gap-2" onClick={() => navigate("/dashboard/explore-hackathons")}>
          <Plus className="w-4 h-4" />
          Explore Hackathons
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{hackathons.length}</p>
                <p className="text-sm text-gray-500">Total Events</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {hackathons.reduce(
                    (sum, h) => sum + (h.participantCount || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-gray-500">Total Participants</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {hackathons.reduce(
                    (sum, h) => sum + (h.submissions?.length || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-gray-500">Total Submissions</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{liveHackathons.length}</p>
                <p className="text-sm text-gray-500">Active Now</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{pendingHackathons.length}</p>
                <p className="text-sm text-gray-500">Pending Approval</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Check className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{approvedHackathons.length}</p>
                <p className="text-sm text-gray-500">Approved</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="registration">Registration Open</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hackathons.map(renderHackathonCard)}
          </div>
        </TabsContent>
        <TabsContent value="live" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {liveHackathons.map(renderHackathonCard)}
          </div>
        </TabsContent>
        <TabsContent value="registration" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {registrationOpenHackathons.map(renderHackathonCard)}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedHackathons.map(renderHackathonCard)}
          </div>
        </TabsContent>
        <TabsContent value="draft" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {draftHackathons.map(renderHackathonCard)}
          </div>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingHackathons.map(renderHackathonCard)}
          </div>
        </TabsContent>
        <TabsContent value="approved" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {approvedHackathons.map(renderHackathonCard)}
          </div>
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rejectedHackathons.map(renderHackathonCard)}
          </div>
        </TabsContent>
      </Tabs>
      <HackathonDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        hackathon={selectedHackathon}
      />
      {editHackathon && (
        <HackathonEditModal
          hackathon={editHackathon}
          onClose={() => setEditHackathon(null)}
          onUpdated={() => {
            setEditHackathon(null);
            window.location.reload(); // OR re-fetch if you prefer
          }}
        />
      )}
      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-lg font-bold mb-2">Delete Hackathon?</h2>
            <p className="mb-4 text-gray-700">Are you sure you want to delete this hackathon? This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="flex-1"
              >
                {deletingId !== null ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="outline"
                onClick={cancelDelete}
                className="flex-1"
                disabled={deletingId !== null}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
