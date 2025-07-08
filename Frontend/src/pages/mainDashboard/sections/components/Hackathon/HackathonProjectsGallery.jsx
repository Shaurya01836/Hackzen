"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../../../../../components/CommonUI/card";
import { Skeleton } from "../../../../../components/DashboardUI/skeleton";
import { ProjectCard } from "../../../../../components/CommonUI/ProjectCard"; // ✅ adjust path as needed

export default function HackathonProjectsGallery({ hackathonId }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/projects/hackathon/${hackathonId}`
        );
        setProjects(res.data || []);
      } catch (err) {
        console.error("Error fetching hackathon projects", err);
      } finally {
        setLoading(false);
      }
    };

    if (hackathonId) fetchProjects();
  }, [hackathonId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-40 w-full" />
            <CardContent className="space-y-3 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return <p className="text-center text-gray-500">No projects submitted yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
