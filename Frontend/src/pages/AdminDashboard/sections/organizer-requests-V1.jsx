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
      const pending = data.filter((org) => !org.approved);
      setRequests(pending);
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
        setRequests((prev) => prev.filter((o) => o._id !== org._id));
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
        setRequests((prev) => prev.filter((o) => o._id !== org._id));
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
        Pending Organization Applications
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-600">No pending applications right now.</p>
      ) : (
        requests.map((org) => (
          <Card key={org._id}>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{org.name}</CardTitle>
              <p className="text-sm text-gray-500">
                Submitted by <span className="font-medium">{org.contactPerson}</span>
              </p>
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
              </p>

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
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
