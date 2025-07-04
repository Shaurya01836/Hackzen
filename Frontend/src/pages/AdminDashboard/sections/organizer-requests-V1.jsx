import { useEffect, useState } from "react";
import { Button } from "../../../components/CommonUI/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import { Loader2, Globe, Mail, Github, CalendarDays } from "lucide-react";
import { toast } from "react-hot-toast";

export function OrganizerRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/organizations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      // Show pending applications and recently rejected applications (within last 30 days)
      const pending = data.filter((org) => !org.approved && !org.rejected);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentlyRejected = data.filter((org) => 
        org.rejected && 
        new Date(org.rejectedAt) > thirtyDaysAgo
      );
      setRequests([...pending, ...recentlyRejected]);
    } catch (err) {
      toast.error("❌ Failed to load requests");
    } finally {
      setLoading(false);
    }
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
        // Don't remove from list, just refresh to show updated status
        fetchPendingRequests();
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
        // Don't remove from list, just refresh to show updated status
        fetchPendingRequests();
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Organization Applications
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-600">No applications right now.</p>
      ) : (
        requests.map((org) => (
          <Card key={org._id} className={org.rejected ? "border-red-200 bg-red-50" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">{org.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    Submitted by <span className="font-medium">{org.contactPerson}</span>
                  </p>
                </div>
                {org.rejected && (
                  <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                    Rejected
                  </span>
                )}
                {org.rejectedAt && !org.rejected && !org.approved && (
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                    Resubmitted
                  </span>
                )}
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

              {!org.rejected ? (
                <div className="flex gap-4 mt-4">
                  <Button
                    onClick={() => handleDecision(org, "approve")}
                    disabled={updatingId === org._id}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {updatingId === org._id ? "Approving..." : "Approve"}
                  </Button>
                  <Button
                    onClick={() => handleDecision(org, "reject")}
                    disabled={updatingId === org._id}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {updatingId === org._id ? "Rejecting..." : "Reject"}
                  </Button>
                </div>
              ) : (
                <div className="mt-4 text-sm text-red-600">
                  Rejected on {new Date(org.rejectedAt).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
