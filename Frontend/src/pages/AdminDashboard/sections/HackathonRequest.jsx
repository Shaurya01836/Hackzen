"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import { Input } from "../../../components/CommonUI/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/AdminUI/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/AdminUI/dropdown-menu";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  Shuffle,
  AlertTriangle,
  Info,
  Calendar,
  Users,
  Trophy,
  MapPin,
  Loader2,
} from "lucide-react";
import ModalHackathonDetails from "./ModalHackathonDetails";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/DashboardUI/alert-dialog";
import { useToast } from "../../../hooks/use-toast";

export function HackathonRequest() {
  const [organizerRequests, setOrganizerRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [quickPreview, setQuickPreview] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/hackathons/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrganizerRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch hackathon requests", err);
        toast({
          title: "Error",
          description: "Failed to fetch hackathon requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [toast]);

  const updateApprovalStatus = async (id, status) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      await axios.patch(
        `http://localhost:3000/api/hackathons/${id}/approval`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOrganizerRequests((prev) =>
        prev.map((h) => (h._id === id ? { ...h, approvalStatus: status } : h))
      );

      toast({
        title: "Success",
        description: `Hackathon ${status === "approved" ? "approved" : "rejected"} successfully`,
        variant: status === "approved" ? "default" : "destructive",
      });
    } catch (err) {
      console.error("Failed to update approval status", err);
      toast({
        title: "Error",
        description: "Failed to update approval status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleAction = (hackathon, action) => {
    setPendingAction({ hackathon, action });
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    if (pendingAction) {
      const { hackathon, action } = pendingAction;
      updateApprovalStatus(hackathon._id, action);
      setShowConfirmDialog(false);
      setPendingAction(null);
    }
  };

  const filteredRequests = organizerRequests.filter((request) => {
    const matchesSearch =
      request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.organizer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || request.approvalStatus === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <Check className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <X className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-lg font-medium">Loading requests...</span>
      </div>
    );

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-3xl font-bold text-black">Organizer Requests</h1>
        <div className="flex gap-2">
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200" variant="outline">
            <Clock className="w-4 h-4 mr-1" />
            {organizerRequests.filter((r) => r.approvalStatus === "pending").length} Pending
          </Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
            <Check className="w-4 h-4 mr-1" />
            {organizerRequests.filter((r) => r.approvalStatus === "approved").length} Approved
          </Badge>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
          <Input
            placeholder="Search by event or organizer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white text-black"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-black">
              <Filter className="w-4 h-4 mr-2" />
              Status: {statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-black text-lg">
            Requests ({filteredRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Organizer</TableHead>
                <TableHead className="text-black">Event</TableHead>
                <TableHead className="text-black">Status</TableHead>
                <TableHead className="text-black">Quick Info</TableHead>
                <TableHead className="text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="text-black font-medium">
                      {req.organizer?.name || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {req.organizer?.email || "No email"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-black font-medium">{req.title}</div>
                    <div className="text-sm text-gray-500">
                      {req.category} • {req.difficultyLevel}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(req.approvalStatus)} flex items-center gap-1`}>
                      {getStatusIcon(req.approvalStatus)}
                      {req.approvalStatus || "pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(req.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        ${req.prizePool?.amount?.toLocaleString() || "TBA"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {req.maxParticipants || "Unlimited"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Quick Preview Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedHackathon(req)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>

                      {/* Action Buttons for Pending Requests */}
                      {req.approvalStatus === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAction(req, "approved")}
                            disabled={actionLoading[req._id]}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {actionLoading[req._id] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleAction(req, "rejected")}
                            disabled={actionLoading[req._id]}
                          >
                            {actionLoading[req._id] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </>
                            )}
                          </Button>
                        </>
                      )}

                      {/* View Full Details Button (removed) */}
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedHackathon(req)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Info className="w-4 h-4" />
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Preview Modal (removed, now handled by ModalHackathonDetails) */}
      {/* {quickPreview && (...)} */}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.action === "approved" ? "Approve Hackathon" : "Reject Hackathon"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {pendingAction?.action === "approved" ? "approve" : "reject"} "{pendingAction?.hackathon?.title}"?
              {pendingAction?.action === "rejected" && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">This action cannot be undone.</span>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={pendingAction?.action === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {pendingAction?.action === "approved" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal for viewing details */}
      {selectedHackathon && (
        <ModalHackathonDetails
          isOpen={!!selectedHackathon}
          onClose={() => setSelectedHackathon(null)}
          hackathon={selectedHackathon}
        />
      )}
    </div>
  );
}
