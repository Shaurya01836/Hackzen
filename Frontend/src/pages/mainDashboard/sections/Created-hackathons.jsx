"use client";
import { useEffect, useState, useRef } from "react";
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
  MapPin,
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
import CustomSubmissionForm from "./CustomSubmissionForm";
import InnerCreatedCard from "./InnerCreatedCard"; // Adjust path
import { cn } from "../../../lib/utils";

export function CreatedHackathons({ onCreateNew }) {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editHackathon, setEditHackathon] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionHackathon, setSubmissionHackathon] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showInnerCard, setShowInnerCard] = useState(false);
  const [innerCardHackathon, setInnerCardHackathon] = useState(null);
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
  const pendingHackathons = hackathons.filter(
    (h) => h.approvalStatus === "pending"
  );
  const approvedHackathons = hackathons.filter(
    (h) => h.approvalStatus === "approved"
  );
  const rejectedHackathons = hackathons.filter(
    (h) => h.approvalStatus === "rejected"
  );

  const registrationOpenHackathons = hackathons.filter(
    (h) => new Date(h.registrationDeadline) > new Date()
  );

  const handleEdit = (hackathon) => {
    setEditHackathon(hackathon);
  };

  const handleViewDetails = (hackathon) => {
    setSelectedHackathon(hackathon);
    setShowModal(true);
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
      const res = await fetch(
        `http://localhost:3000/api/hackathons/${hackathon._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
        return "bg-green-900 text-white";
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

  const handleCardClick = (hackathon) => {
    setInnerCardHackathon(hackathon);
    setShowInnerCard(true);
  };

  // Prevent card click when clicking on action buttons
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const renderHackathonCard = (hackathon, featured = false) => {
    const registrationDeadline = new Date(hackathon.registrationDeadline);
    const today = new Date();
    const daysLeft = Math.ceil(
      (registrationDeadline - today) / (1000 * 60 * 60 * 24)
    );

    const deadlineLabel = isNaN(daysLeft)
      ? "TBA"
      : daysLeft > 0
      ? `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`
      : "Closed";

    return (
      <Card
        key={hackathon._id}
        className={cn(
          "w-full max-w-xs flex flex-col overflow-hidden cursor-pointer rounded-xl transition-transform duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg",
          featured && "ring-2 ring-purple-300"
        )}
        onClick={() => handleCardClick(hackathon)}
      >
        {/* Thumbnail with prize badge */}
        <div className="relative h-40 w-full">
          <img
            src={
              hackathon.imageUrl ||
              "https://www.hackquest.io/images/layout/hackathon_cover.png"
            }
            alt={hackathon.title}
            className="w-full h-full object-cover transition-transform duration-300"
          />

          {/* Prize Pool Badge */}
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-400 text-yellow-900 font-semibold shadow-md">
              <Trophy className="w-3 h-3 mr-1" />
              {hackathon.prizePool?.amount
                ? `$${hackathon.prizePool.amount.toLocaleString()}`
                : "TBA"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          {/* Title */}
          <h3 className="text-md font-semibold text-indigo-700 leading-tight line-clamp-2 h-10">
            {hackathon.title}
          </h3>

          {/* Date and Participants */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(hackathon.startDate).toLocaleDateString("en-GB")} -{" "}
                {new Date(hackathon.endDate).toLocaleDateString("en-GB")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>
                {hackathon.participantCount || 0}/{hackathon.maxParticipants}{" "}
                participants
              </span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              <span>{hackathon.submissions?.length || 0} submissions</span>
            </div>
          </div>

          {/* Location + Registration Deadline */}
          <div className="text-xs text-gray-500 flex justify-between items-center pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {hackathon.location || "TBA"}
            </span>
            <span className="flex items-center gap-1 text-red-600 font-medium">
              <Clock className="w-3 h-3" />
              {deadlineLabel}
            </span>
          </div>
        </div>
      </Card>
    );
  };

  if (showInnerCard && innerCardHackathon) {
    return (
      <InnerCreatedCard
        hackathon={innerCardHackathon}
        onBack={() => setShowInnerCard(false)}
      />
    );
  }

  return (
    <>
      {showSubmissionForm ? (
        <CustomSubmissionForm
          hackathon={submissionHackathon}
          onCancel={() => {
            setShowSubmissionForm(false);
            setSubmissionHackathon(null);
          }}
        />
      ) : (
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
            <Button className="flex items-center gap-2" onClick={onCreateNew}>
              <Plus className="w-4 h-4" />
              Create New Hackathon
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-10 w-full">
            <ACard>
              <ACardContent className="pt-8 pb-8">
                <div className="flex items-center gap-6">
                  <Trophy className="w-12 h-12 text-purple-500" />
                  <div>
                    <p className="text-3xl font-extrabold">
                      {hackathons.length}
                    </p>
                    <p className="text-base text-gray-500">Total Events</p>
                  </div>
                </div>
              </ACardContent>
            </ACard>
            <ACard>
              <ACardContent className="pt-8 pb-8">
                <div className="flex items-center gap-6">
                  <Settings className="w-12 h-12 text-orange-500" />
                  <div>
                    <p className="text-3xl font-extrabold">
                      {liveHackathons.length}
                    </p>
                    <p className="text-base text-gray-500">Active Now</p>
                  </div>
                </div>
              </ACardContent>
            </ACard>
            <ACard>
              <ACardContent className="pt-8 pb-8">
                <div className="flex items-center gap-6">
                  <Clock className="w-12 h-12 text-yellow-500" />
                  <div>
                    <p className="text-3xl font-extrabold">
                      {pendingHackathons.length}
                    </p>
                    <p className="text-base text-gray-500">Pending Approval</p>
                  </div>
                </div>
              </ACardContent>
            </ACard>
            <ACard>
              <ACardContent className="pt-8 pb-8">
                <div className="flex items-center gap-6">
                  <Check className="w-12 h-12 text-green-500" />
                  <div>
                    <p className="text-3xl font-extrabold">
                      {approvedHackathons.length}
                    </p>
                    <p className="text-base text-gray-500">Approved</p>
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
                <p className="mb-4 text-gray-700">
                  Are you sure you want to delete this hackathon? This action
                  cannot be undone.
                </p>
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
      )}
    </>
  );
}
