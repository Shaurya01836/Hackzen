import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateHackathon from "./Create-hackathon";

export default function EditHackathonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHackathon() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/api/hackathons/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch hackathon");
        const data = await res.json();
        setHackathon(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHackathon();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/hackathons/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Hackathon updated successfully!");
        navigate("/dashboard/created-hackathons");
      } else {
        alert("Failed to update hackathon. Please try again.");
      }
    } catch (err) {
      alert("Error updating hackathon: " + err.message);
    }
  };

  if (loading) return <div className="p-10 text-center text-lg">Loading hackathon...</div>;
  if (error) return <div className="p-10 text-center text-red-600 font-bold">{error}</div>;
  if (!hackathon) return <div className="p-10 text-center text-red-600 font-bold">Hackathon not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100">
      <CreateHackathon
        initialData={hackathon}
        onSubmit={handleUpdate}
        onBack={() => navigate("/dashboard/created-hackathons")}
      />
    </div>
  );
} 