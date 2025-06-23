"use client";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Search,
  Calendar,
  Users,
  Trophy,
  MapPin,
  Clock,
  Star,
  Heart,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../../../components/CommonUI/card";
import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import { Input } from "../../../components/CommonUI/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/CommonUI/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/CommonUI/tabs";
import { cn } from "../../../lib/utils";
import { HackathonDetails } from "./HackathonDetails";

export function ExploreHackathons({ onBack }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

 useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/hackathons");
        console.log("Raw hackathons response:", res.data);
        const approvedHackathons = res.data.filter((h) => h.approvalStatus === "approved");
        setHackathons(approvedHackathons);
      } catch (err) {
        console.error("Hackathon fetch error:", err.message);
        setError("Failed to fetch hackathons");
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

// Check URL params on component mount and when hackathons are loaded
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const hackathonId = urlParams.get('hackathon');
    
    if (hackathonId && hackathons.length > 0) {
      const hackathon = hackathons.find(h => h._id === hackathonId);
      if (hackathon) {
        const transformedHackathon = transformHackathonData(hackathon);
        setSelectedHackathon(transformedHackathon);
      } else {
        // If hackathon ID is in URL but not found, clear the URL params
        const newParams = new URLSearchParams(location.search);
        newParams.delete('hackathon');
        newParams.delete('title');
        navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
      }
    }
  }, [hackathons, location.search, navigate, location.pathname]);

   // Transform hackathon data helper function
  const transformHackathonData = (hackathon) => {
    return {
      ...hackathon,
      name: hackathon.title,
      prize: hackathon.prizePool?.amount
        ? `$${hackathon.prizePool.amount.toLocaleString()} ${
            hackathon.prizePool.currency || "USD"
          }`
        : "TBA",
      participants: hackathon.participants?.length || 0,
      maxParticipants: hackathon.maxParticipants || 100,
      rating: 4.5,
      reviews: 12,
      difficulty: hackathon.difficultyLevel,
      status:
        hackathon.status === "upcoming"
          ? "Registration Open"
          : hackathon.status === "ongoing"
          ? "Ongoing"
          : "Ended",
      startDate: new Date(hackathon.startDate).toLocaleDateString(),
      endDate: new Date(hackathon.endDate).toLocaleDateString(),
      registrationDeadline: new Date(
        hackathon.registrationDeadline
      ).toLocaleDateString(),
      organizer: hackathon.organizer?.name || "Unknown Organizer",
      organizerLogo: hackathon.organizer?.logo || null,
      featured: hackathon.tags?.includes("featured") || false,
      sponsored: hackathon.tags?.includes("sponsored") || false,
      // Add default data for HackathonDetails component
      requirements: hackathon.requirements || [
        "Valid student/professional ID",
        "Team size: 2-4 members",
        "Original project submission",
        "Attend mandatory sessions"
      ],
      perks: hackathon.perks || [
        "Free accommodation",
        "Meals included",
        "Networking opportunities",
        "Workshop access",
        "Mentorship sessions"
      ],
      tags: hackathon.tags || [hackathon.category],
      problemStatements: hackathon.problemStatements || []
    };
  };


    // If a hackathon is selected, show the details component
  if (selectedHackathon) {
    return (
      <HackathonDetails
        hackathon={selectedHackathon}
        onBack={() => {
          setSelectedHackathon(null);
          // Remove hackathon parameter from URL but keep other params like view=explore-hackathons
          const newParams = new URLSearchParams(location.search);
          newParams.delete('hackathon');
          newParams.delete('title');
          navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
        }}
      />
    );
  }

  const categories = [
    "All Categories",
    "Artificial Intelligence",
    "Blockchain",
    "Cybersecurity",
    "FinTech",
    "Gaming",
    "Healthcare",
    "Sustainability",
    "Mobile Development",
    "Web Development",
    "IoT",
    "Data Science",
    "DevOps",
  ];

  const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];
  const locations = [
    "All Locations",
    "Virtual",
    "Online",
    "Hybrid",
    "New York",
    "Delhi",
  ];

  // Filter hackathons based on search and filters
  const filteredHackathons = hackathons.filter((hackathon) => {
    const matchesSearch =
      hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hackathon.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      hackathon.category === selectedCategory.replace(/\s+/g, " ");

    const matchesDifficulty =
      selectedDifficulty === "all" ||
      hackathon.difficultyLevel === selectedDifficulty.replace(/\s+/g, " ");

    const matchesLocation =
      selectedLocation === "all" ||
      hackathon.location
        ?.toLowerCase()
        .includes(selectedLocation.toLowerCase());

    return (
      matchesSearch && matchesCategory && matchesDifficulty && matchesLocation
    );
  });

  const featuredHackathons = filteredHackathons.filter((h) =>
    h.tags?.includes("featured")
  );
  const sponsoredHackathons = filteredHackathons.filter((h) =>
    h.tags?.includes("sponsored")
  );
  const upcomingHackathons = filteredHackathons.filter(
    (h) => h.status === "upcoming"
  );

   const handleHackathonClick = (hackathon) => {
    const transformedHackathon = transformHackathonData(hackathon);
    
    // Create URL-friendly slug from hackathon title
    const slug = hackathon.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Update URL with hackathon parameters while preserving existing params
    const newParams = new URLSearchParams(location.search);
    newParams.set('hackathon', hackathon._id);
    newParams.set('title', slug);
    
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: false });
    setSelectedHackathon(transformedHackathon);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderHackathonCard = (hackathon, featured = false) => (
     <Card
      key={hackathon._id}
      className={cn(
        "w-full flex flex-col md:flex-row gap-4 p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]",
        featured
          ? "ring-2 ring-purple-300 bg-gradient-to-r from-purple-50 to-pink-50"
          : "shadow-sm hover:shadow-md"
      )}
      onClick={() => handleHackathonClick(hackathon)}
    >
      {/* Left Side: Image */}
      <div className="md:w-1/3 w-full">
        <img
          src={
            hackathon.images?.banner?.url ||
            "https://www.hackquest.io/images/layout/hackathon_cover.png"
          }
          alt={hackathon.title}
          className="rounded-md object-cover w-full h-48 md:h-full"
        />
      </div>

      {/* Right Side: Content */}
      <div className="md:w-2/3 flex flex-col justify-between gap-3">
        {/* Header with badges */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-indigo-700 hover:text-indigo-800">
              {hackathon.title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              by{" "}
              <span className="font-medium">
                {hackathon.organizer?.name || "Unknown Organizer"}
              </span>
            </CardDescription>
          </div>
          <Badge className={getDifficultyColor(hackathon.difficultyLevel)}>
            {hackathon.difficultyLevel}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {hackathon.description || "No description available"}
        </p>

        {/* Grid Details */}
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>
              {new Date(hackathon.startDate).toLocaleDateString()} -{" "}
              {new Date(hackathon.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{hackathon.location || "TBA"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-gray-500" />
            <span>
              {hackathon.prizePool?.amount
                ? `$${hackathon.prizePool.amount.toLocaleString()} ${
                    hackathon.prizePool.currency || "USD"
                  }`
                : "Prize TBA"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>
              Register by{" "}
              {new Date(hackathon.registrationDeadline).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Participants and Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-500" />
            <span>
              {hackathon.participants?.length || 0}/
              {hackathon.maxParticipants || 100} participants
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-800">4.5</span>
            <span className="text-gray-500">(12 reviews)</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 border-indigo-200"
          >
            {hackathon.category}
          </Badge>
          {(hackathon.tags || []).slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              className="bg-gray-100 text-gray-700"
              variant="outline"
            >
              {tag}
            </Badge>
          ))}
          {hackathon.tags?.length > 3 && (
            <Badge variant="outline" className="bg-gray-50 text-gray-500">
              +{hackathon.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          className="gap-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={(e) => {
            e.stopPropagation();
            handleHackathonClick(hackathon);
          }}
        >
           <ExternalLink className="w-4 h-4" />
          View Details
        </Button>

          <Button
            size="sm"
            variant="outline"
            className="gap-1 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              // Handle save functionality
            }}
          >
            <Heart className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>
    </Card>
  );

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading hackathons...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="default"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Explore Hackathons
          </h1>
          <p className="text-sm text-gray-500">
            Discover and join exciting hackathons from around the world
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="pt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search hackathons..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-lg rounded-md border">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.slice(1).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-lg rounded-md border">
                <SelectItem value="all">All Levels</SelectItem>
                {difficulties.slice(1).map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-lg rounded-md border">
                <SelectItem value="all">All Locations</SelectItem>
                {locations.slice(1).map((location) => (
                  <SelectItem key={location} value={location.toLowerCase()}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredHackathons.length} of {hackathons.length} hackathons
        </p>
        {(searchTerm ||
          selectedCategory !== "all" ||
          selectedDifficulty !== "all" ||
          selectedLocation !== "all") && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedDifficulty("all");
              setSelectedLocation("all");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All Hackathons ({filteredHackathons.length})
          </TabsTrigger>
          <TabsTrigger value="featured">
            Featured ({featuredHackathons.length})
          </TabsTrigger>
          <TabsTrigger value="sponsored">
            Sponsored ({sponsoredHackathons.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Registration Open ({upcomingHackathons.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredHackathons.length > 0 ? (
            <div className="space-y-6">
              {filteredHackathons.map((hackathon) =>
                renderHackathonCard(hackathon)
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Hackathons Found
                </h3>
                <p className="text-gray-500 text-center">
                  Try adjusting your search criteria or filters.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          {featuredHackathons.length > 0 ? (
            <div className="space-y-6">
              {featuredHackathons.map((hackathon) =>
                renderHackathonCard(hackathon, true)
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Star className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Featured Hackathons
                </h3>
                <p className="text-gray-500 text-center">
                  Check back later for featured events.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sponsored" className="space-y-4">
          {sponsoredHackathons.length > 0 ? (
            <div className="space-y-6">
              {sponsoredHackathons.map((hackathon) =>
                renderHackathonCard(hackathon)
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Sponsored Hackathons
                </h3>
                <p className="text-gray-500 text-center">
                  No sponsored events available at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingHackathons.length > 0 ? (
            <div className="space-y-6">
              {upcomingHackathons.map((hackathon) =>
                renderHackathonCard(hackathon)
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Open Registrations
                </h3>
                <p className="text-gray-500 text-center">
                  All hackathons are currently closed for registration.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
