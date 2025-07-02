"use client";
import { useState, useEffect } from "react";
import { Search, Code } from "lucide-react";
import { Input } from "../../../components/CommonUI/input";
import { Card, CardContent } from "../../../components/CommonUI/card";
import { Separator } from "../../../components/CommonUI/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/CommonUI/tabs";
import { ProjectCard } from "../../../components/CommonUI/ProjectCard";
import { ProjectDetail } from "../../../components/CommonUI/ProjectDetail";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/CommonUI/select";

export function ProjectArchive() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Mock data - replace with actual API call
  const mockProjects = [
    {
      id: "1",
      title: "AI-Powered Healthcare Assistant",
      description:
        "An intelligent healthcare assistant that helps patients track symptoms and get preliminary diagnoses using advanced machine learning algorithms.",
      longDescription:
        "This project was developed during the Healthcare Innovation Hackathon. It uses machine learning algorithms to analyze patient symptoms and provide preliminary health assessments. The system includes a chatbot interface, symptom tracking, and integration with medical databases. The AI model was trained on thousands of medical cases and provides accurate preliminary diagnoses with 85% accuracy rate.",
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Full Stack Developer",
      },
      hackathon: "Healthcare Innovation Challenge 2024",
      category: "Healthcare",
      technologies: ["React", "Node.js", "Python", "TensorFlow", "MongoDB"],
      githubUrl: "https://github.com/user/healthcare-ai",
      liveUrl: "https://healthcare-ai-demo.com",
      demoUrl: "https://youtube.com/watch?v=demo1",
      createdAt: "2024-01-15",
      stars: 156,
      forks: 23,
      views: 1250,
      likes: 89,
      featured: true,
      award: "1st Place Winner",
      images: [
        "https://www.hackquest.io/images/layout/learning_track_cover.png",
        "https://www.hackquest.io/images/layout/learning_track_cover.png",
      ],
      status: "completed",
    },
    {
      id: "2",
      title: "Blockchain Voting System",
      description:
        "A secure, transparent voting system built on blockchain technology for democratic elections with immutable record keeping.",
      longDescription:
        "This decentralized voting platform ensures election integrity through blockchain technology. Features include voter authentication, transparent vote counting, and immutable record keeping. Built on Ethereum with smart contracts handling all voting logic.",
      author: {
        name: "Alex Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Blockchain Developer",
      },
      hackathon: "Democracy Tech Hackathon 2024",
      category: "Blockchain",
      technologies: ["Solidity", "React", "Web3.js", "Ethereum", "IPFS"],
      githubUrl: "https://github.com/user/blockchain-voting",
      liveUrl: "https://vote-chain.com",
      createdAt: "2024-01-12",
      stars: 234,
      forks: 45,
      views: 2100,
      likes: 167,
      featured: true,
      award: "Best Innovation Award",
      images: [
        "https://www.hackquest.io/images/layout/learning_track_cover.png",
        "https://www.hackquest.io/images/layout/learning_track_cover.png",
      ],
      status: "completed",
    },
    {
      id: "3",
      title: "Smart City Traffic Optimizer",
      description:
        "IoT-based traffic management system that optimizes traffic flow in urban areas using machine learning and real-time data.",
      longDescription:
        "An intelligent traffic management system using IoT sensors and machine learning to optimize traffic flow, reduce congestion, and improve urban mobility. Deployed in 3 cities with 30% reduction in traffic congestion.",
      author: {
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "IoT Engineer",
      },
      hackathon: "Smart City Challenge 2024",
      category: "IoT",
      technologies: ["Arduino", "Python", "React", "AWS IoT", "TensorFlow"],
      githubUrl: "https://github.com/user/smart-traffic",
      demoUrl: "https://youtube.com/watch?v=demo3",
      createdAt: "2024-01-10",
      stars: 98,
      forks: 12,
      views: 780,
      likes: 45,
      featured: false,
      images: [
        "https://www.hackquest.io/images/layout/learning_track_cover.png",
        "https://www.hackquest.io/images/layout/learning_track_cover.png",
      ],
      status: "completed",
    },
    {
      id: "4",
      title: "Cybersecurity Threat Detector",
      description:
        "Real-time threat detection system using machine learning to identify security vulnerabilities and potential attacks.",
      longDescription:
        "Advanced cybersecurity tool that monitors network traffic and system behavior to detect potential threats and vulnerabilities in real-time. Uses advanced ML algorithms for anomaly detection.",
      author: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Security Engineer",
      },
      hackathon: "CyberSec Hackathon 2024",
      category: "Cybersecurity",
      technologies: ["Python", "Scikit-learn", "Flask", "Docker", "PostgreSQL"],
      githubUrl: "https://github.com/user/threat-detector",
      createdAt: "2024-01-08",
      stars: 67,
      forks: 8,
      views: 450,
      likes: 23,
      featured: false,
      images: [
        "https://www.hackquest.io/images/layout/learning_track_cover.png",
        "https://www.hackquest.io/images/layout/learning_track_cover.png",
      ],
      status: "in-progress",
    },
  ];

  const categories = [
    "all",
    "Healthcare",
    "Blockchain",
    "IoT",
    "Cybersecurity",
    "AI/ML",
    "Web Development",
    "Mobile",
  ];

  useEffect(() => {
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProjects = projects.filter((project) => project.featured);
  const awardWinningProjects = projects.filter((project) => project.award);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const renderLoadingCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-5">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="animate-pulse border-gray-200">
          <div className="h-48 bg-gray-200 rounded-t-xl"></div>
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-3 bg-gray-200 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderProjectGrid = (projectList, variant = "default") => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-5 mt-5">
      {projectList.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={handleProjectClick}
          variant={variant}
        />
      ))}
    </div>
  );

  if (selectedProject) {
    return (
      <ProjectDetail project={selectedProject} onBack={handleBackToProjects} />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-slate-50 via-purple-50 to-slate-100">
      <header className=" px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Code className="h-5 w-5 text-indigo-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-800">
                Project Archive
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6 overflow-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5">
          <div className="relative w-full ">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by title or tech..."
            
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="w-full md:w-64">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-lg px-5">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="awards">Award Winning</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {loading ? (
              renderLoadingCards()
            ) : filteredProjects.length === 0 ? (
              <div className="text-center text-gray-500 mt-16">
                No projects found.
              </div>
            ) : (
              renderProjectGrid(filteredProjects)
            )}
          </TabsContent>

          <TabsContent value="featured">
            {featuredProjects.length === 0 ? (
              <div className="text-center text-gray-500 mt-16">
                No featured projects.
              </div>
            ) : (
              renderProjectGrid(featuredProjects, "featured")
            )}
          </TabsContent>

          <TabsContent value="awards">
            {awardWinningProjects.length === 0 ? (
              <div className="text-center text-gray-500 mt-16">
                No award winning projects.
              </div>
            ) : (
              renderProjectGrid(awardWinningProjects, "award")
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
