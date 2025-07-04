import { useEffect, useState } from "react";
import { Button } from "../../../components/CommonUI/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import { Loader2, CheckCircle, X, Clock, User, Mail, Globe, Github } from "lucide-react";
import { toast } from "react-hot-toast";

export function PendingChangesPage() {
  const [pendingChanges, setPendingChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchPendingChanges();
  }, []);

  const fetchPendingChanges = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/organizations/pending-changes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setPendingChanges(data);
    } catch (err) {
      toast.error("❌ Failed to load pending changes");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (org, decision) => {
    setUpdatingId(org._id);
    try {
      const res = await fetch(
        `http://localhost:3000/api/organizations/${org._id}/${decision}-changes`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      toast.success(`✅ Changes ${decision}d successfully`);
      fetchPendingChanges(); // Refresh the list
    } catch (err) {
      toast.error(`❌ Failed to ${decision} changes`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-600" />
        <p className="mt-4 text-gray-600">Loading pending changes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Pending Organization Changes
      </h2>

      {pendingChanges.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No pending changes</p>
            <p className="text-gray-400 text-sm mt-2">
              All organization changes have been reviewed
            </p>
          </CardContent>
        </Card>
      ) : (
        pendingChanges.map((org) => (
          <Card key={org._id} className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">{org.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    Changes submitted by <span className="font-medium">{org.createdBy?.name || org.createdBy?.email}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted on {new Date(org.pendingChanges.submittedAt).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                  Pending Review
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Current vs Proposed Changes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Information */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Current Information</h4>
                  <div className="space-y-2 text-sm">
                    {[
                      "name",
                      "contactPerson",
                      "email",
                      "organizationType",
                      "purpose",
                      "supportNeeds",
                      "website",
                      "github"
                    ].map((field) => {
                      const oldValue = field === "supportNeeds"
                        ? org[field]?.join(", ") || "None"
                        : org[field] || (field === "purpose" ? "N/A" : "");
                      const newValue = field === "supportNeeds"
                        ? org.pendingChanges[field]?.join(", ") || "None"
                        : org.pendingChanges[field] || (field === "purpose" ? "N/A" : "");
                      const changed = oldValue !== newValue;
                      return (
                        <p
                          key={field}
                          className={
                            changed
                              ? "bg-blue-50 border-l-4 border-blue-500 px-2 py-1 rounded"
                              : "bg-gray-50 px-2 py-1 rounded"
                          }
                        >
                          <strong>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> {oldValue}
                          {changed && (
                            <span className="ml-2 text-blue-500 font-semibold">(changed)</span>
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* Proposed Changes */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Proposed Changes</h4>
                  <div className="space-y-2 text-sm">
                    {[
                      "name",
                      "contactPerson",
                      "email",
                      "organizationType",
                      "purpose",
                      "supportNeeds",
                      "website",
                      "github"
                    ].map((field) => {
                      const oldValue = field === "supportNeeds"
                        ? org[field]?.join(", ") || "None"
                        : org[field] || (field === "purpose" ? "N/A" : "");
                      const newValue = field === "supportNeeds"
                        ? org.pendingChanges[field]?.join(", ") || "None"
                        : org.pendingChanges[field] || (field === "purpose" ? "N/A" : "");
                      const changed = oldValue !== newValue;
                      return (
                        <p
                          key={field}
                          className={
                            changed
                              ? "bg-blue-50 border-l-4 border-blue-500 px-2 py-1 rounded"
                              : "bg-gray-50 px-2 py-1 rounded"
                          }
                        >
                          <strong>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> {newValue}
                          {changed && (
                            <span className="ml-2 text-blue-500 font-semibold">(requested)</span>
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
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
                      Approve Changes
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
                      Reject Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
} 