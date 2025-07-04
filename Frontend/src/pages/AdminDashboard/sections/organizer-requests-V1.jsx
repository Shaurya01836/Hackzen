import { useEffect, useState } from "react";
import { Button } from "../../../components/CommonUI/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import { 
  Loader2, 
  Globe, 
  Mail, 
  Github, 
  CalendarDays, 
  Clock, 
  CheckCircle, 
  X, 
  Filter,
  Search,
  RefreshCw
} from "lucide-react";
import { toast } from "react-hot-toast";

export function OrganizerRequestsPage() {
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [allRequests, activeFilter, searchTerm]);

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/organizations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      
      // Debug: Log the data structure
      console.log('Fetched organizations:', data.map(org => ({
        name: org.name,
        approved: org.approved,
        rejected: org.rejected,
        type: typeof org.approved
      })));
      
      setAllRequests(data);
    } catch (err) {
      toast.error("❌ Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...allRequests];

    // Apply status filter
    switch (activeFilter) {
      case "pending":
        filtered = filtered.filter((org) => !org.approved && !org.rejected);
        break;
      case "approved":
        filtered = filtered.filter((org) => org.approved === true);
        break;
      case "rejected":
        filtered = filtered.filter((org) => org.rejected === true);
        break;
      default:
        // "all" - no filtering
        break;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((org) =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.organizationType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Debug logging
    console.log('Filter Debug:', {
      activeFilter,
      totalRequests: allRequests.length,
      filteredCount: filtered.length,
      sampleOrg: allRequests[0] ? {
        name: allRequests[0].name,
        approved: allRequests[0].approved,
        rejected: allRequests[0].rejected
      } : null
    });

    setFilteredRequests(filtered);
  };

  const handleDecision = async (org, decision) => {
    setUpdatingId(org._id);
    if (decision === "approve") {
      try {
        const res = await fetch(
          `http://localhost:3000/api/organizations/${org._id}/approve`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update status");
        toast.success(`✅ Application approved`);
        // Refresh to show updated status
        fetchAllRequests();
      } catch (err) {
        toast.error(`❌ Failed to approve`);
      } finally {
        setUpdatingId(null);
      }
    } else {
      // Reject logic (existing)
      try {
        const res = await fetch(
          `http://localhost:3000/api/organizations/${org._id}/reject`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update status");
        toast.success(`✅ Application rejected`);
        // Refresh to show updated status
        fetchAllRequests();
      } catch (err) {
        toast.error(`❌ Failed to reject`);
      } finally {
        setUpdatingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-600" />
        <p className="mt-4 text-gray-600">Loading requests...</p>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    total: allRequests.length,
    pending: allRequests.filter((org) => !org.approved && !org.rejected).length,
    approved: allRequests.filter((org) => org.approved).length,
    rejected: allRequests.filter((org) => org.rejected).length,
  };

  const getStatusBadge = (org) => {
    if (org.approved) {
      return (
        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-medium">
          <CheckCircle className="inline-block w-3 h-3 mr-1" />
          Approved
        </span>
      );
    } else if (org.rejected) {
      return (
        <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 font-medium">
          <X className="inline-block w-3 h-3 mr-1" />
          Rejected
        </span>
      );
    } else {
      return (
        <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-medium">
          <Clock className="inline-block w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Organization Applications
          </h2>
          <p className="text-gray-600 mt-1">
            Manage and review organization applications
          </p>
        </div>
        <Button
          onClick={fetchAllRequests}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
     

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, contact person, email, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                onClick={() => setActiveFilter("all")}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                All
              </Button>
              <Button
                variant={activeFilter === "pending" ? "default" : "outline"}
                onClick={() => setActiveFilter("pending")}
                className={`flex items-center gap-2 ${
                  activeFilter === "pending" 
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
                    : "bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-300"
                }`}
              >
                <Clock className="w-4 h-4" />
                Pending
              </Button>
              <Button
                variant={activeFilter === "approved" ? "default" : "outline"}
                onClick={() => setActiveFilter("approved")}
                className={`flex items-center gap-2 ${
                  activeFilter === "approved" 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Approved
              </Button>
              <Button
                variant={activeFilter === "rejected" ? "default" : "outline"}
                onClick={() => setActiveFilter("rejected")}
                className={`flex items-center gap-2 ${
                  activeFilter === "rejected" 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "bg-red-50 hover:bg-red-100 text-red-700 border-red-300"
                }`}
              >
                <X className="w-4 h-4" />
                Rejected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg">No applications found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? "Try adjusting your search terms" : "No applications match the selected filter"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredRequests.length} of {allRequests.length} applications
            </p>
          </div>
          
          {filteredRequests.map((org) => (
            <Card key={org._id} className={`${
              org.approved ? "border-green-200 bg-green-50" : 
              org.rejected ? "border-red-200 bg-red-50" : 
              "border-yellow-200 bg-yellow-50"
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold">{org.name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      Submitted by <span className="font-medium">{org.contactPerson}</span>
                    </p>
                  </div>
                  {getStatusBadge(org)}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-gray-700">
                <p><Mail className="inline-block w-4 h-4 mr-1" /> <strong>Email:</strong> {org.email}</p>
                <p><strong>Type:</strong> {org.organizationType || "N/A"}</p>
                <p><strong>Support Needs:</strong> {org.supportNeeds?.join(", ") || "None"}</p>
                <p><strong>Purpose:</strong> {org.purpose || "N/A"}</p>

                {org.website && (
                  <p>
                    <Globe className="inline-block w-4 h-4 mr-1" />
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {org.website}
                    </a>
                  </p>
                )}

                {org.github && (
                  <p>
                    <Github className="inline-block w-4 h-4 mr-1" />
                    <a
                      href={org.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {org.github}
                    </a>
                  </p>
                )}

                <p>
                  <CalendarDays className="inline-block w-4 h-4 mr-1" />
                  <strong>Created At:</strong>{" "}
                  {new Date(org.createdAt).toLocaleString()}
                  {org.rejectedAt && (
                    <span className="ml-2 text-red-600">
                      (Rejected: {new Date(org.rejectedAt).toLocaleDateString()})
                    </span>
                  )}
                </p>

                {!org.approved && !org.rejected ? (
                  <div className="flex gap-4 mt-4">
                    <Button
                      onClick={() => handleDecision(org, "approve")}
                      disabled={updatingId === org._id}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {updatingId === org._id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleDecision(org, "reject")}
                      disabled={updatingId === org._id}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {updatingId === org._id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                ) : org.rejected ? (
                  <div className="mt-4 text-sm text-red-600">
                    Rejected on {new Date(org.rejectedAt).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-green-600">
                    Approved on {new Date(org.updatedAt).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
