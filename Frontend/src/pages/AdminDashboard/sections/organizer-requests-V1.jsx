import { useEffect, useState } from "react";
import { Button } from "../../../components/CommonUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card";
import { Loader2 } from "lucide-react";
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

  const handleDecision = async (id, decision) => {
    setUpdatingId(id);
    const endpoint = decision === "approve" ? `approve` : `reject`;
    try {
      const res = await fetch(`http://localhost:3000/api/organizations/${id}/${endpoint}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      toast.success(`✅ Application ${decision}d`);
      setRequests((prev) => prev.filter((org) => org._id !== id));
    } catch (err) {
      toast.error(`❌ Failed to ${decision}`);
    } finally {
      setUpdatingId(null);
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
      <h2 className="text-2xl font-bold text-gray-900">Pending Organization Applications</h2>
      {requests.length === 0 ? (
        <p className="text-gray-600">No pending applications right now.</p>
      ) : (
        requests.map((org) => (
          <Card key={org._id}>
            <CardHeader>
              <CardTitle>{org.name}</CardTitle>
              <p className="text-sm text-gray-500">Submitted by {org.contactPerson}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Email:</strong> {org.email}</p>
              <p><strong>Type:</strong> {org.organizationType}</p>
              <p><strong>Support:</strong> {org.supportNeeds.join(", ")}</p>
              <p><strong>Purpose:</strong> {org.purpose}</p>
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={() => handleDecision(org._id, "approve")}
                  disabled={updatingId === org._id}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {updatingId === org._id ? "Approving..." : "Approve"}
                </Button>
                <Button
                  onClick={() => handleDecision(org._id, "reject")}
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
