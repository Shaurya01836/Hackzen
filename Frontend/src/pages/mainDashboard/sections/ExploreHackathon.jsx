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
import {
  RCard,
  RCardContent,
  RCardDescription,
  RCardTitle,
} from "../../../components/CommonUI/RippleCard";
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
import { HackathonRegistration } from "./RegistrationHackathon";
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
const [registeredHackathonIds, setRegisteredHackathonIds] = useState([]);


useEffect(() => {
  const fetchRegisteredHackathons = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:3000/api/registrations/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRegisteredHackathonIds(res.data.registeredHackathonIds || []);
    } catch (err) {
      console.error("Error fetching registered hackathons", err);
    }
  };

  fetchRegisteredHackathons();
}, []);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/hackathons");
        console.log("Raw hackathons response:", res.data);
        const approvedHackathons = res.data.filter(
          (h) => h.approvalStatus === "approved"
        );
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
    const hackathonId = urlParams.get("hackathon");

    if (hackathonId && hackathons.length > 0) {
      const hackathon = hackathons.find((h) => h._id === hackathonId);
      if (hackathon) {
        const transformedHackathon = transformHackathonData(hackathon);
        setSelectedHackathon(transformedHackathon);
      } else {
        // If hackathon ID is in URL but not found, clear the URL params
        const newParams = new URLSearchParams(location.search);
        newParams.delete("hackathon");
        newParams.delete("title");
        navigate(`${location.pathname}?${newParams.toString()}`, {
          replace: true,
        });
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
        "Attend mandatory sessions",
      ],
      perks: hackathon.perks || [
        "Free accommodation",
        "Meals included",
        "Networking opportunities",
        "Workshop access",
        "Mentorship sessions",
      ],
      tags: hackathon.tags || [hackathon.category],
      problemStatements: hackathon.problemStatements || [],
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
          newParams.delete("hackathon");
          newParams.delete("title");
          navigate(`${location.pathname}?${newParams.toString()}`, {
            replace: true,
          });
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
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Update URL with hackathon parameters while preserving existing params
    const newParams = new URLSearchParams(location.search);
    newParams.set("hackathon", hackathon._id);
    newParams.set("title", slug);

    navigate(`${location.pathname}?${newParams.toString()}`, {
      replace: false,
    });
    setSelectedHackathon(transformedHackathon);
  };

  const getDifficultyVariant = (difficulty) => {
  switch (difficulty) {
    case "Beginner":
      return "default";
    case "Intermediate":
      return "secondary";
    case "Advanced":
      return "destructive";
    default:
      return "default";
  }
};


const renderHackathonCard = (hackathon, featured = false) => (
  
  <RCard
    key={hackathon._id}
    className={cn(
      "w-full overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.01] group",
      featured
        ? "ring-2 ring-purple-300 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-lg"
        : "shadow-md hover:shadow-xl bg-white border border-gray-100"
    )}
    onClick={() => handleHackathonClick(hackathon)}
  >
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Side: Image Section */}
      <div className="relative md:w-80 w-full md:h-auto h-48 flex-shrink-0">
        <img
          src={
            hackathon.images?.banner?.url ||
            "https://www.hackquest.io/images/layout/hackathon_cover.png"
          }
          alt={hackathon.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Gradient overlay for mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />
        
        {/* Badges overlay */}
       <div className="absolute top-3 left-3 flex flex-col gap-2">
  <Badge variant={getDifficultyVariant(hackathon.difficultyLevel)}>
    {hackathon.difficultyLevel}
  </Badge>
  {featured && (
    <Badge variant="featured">
      <Star className="w-3 h-3 mr-1" />
      Featured
    </Badge>
  )}
</div>


        {/* Prize badge - top right */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-semibold shadow-lg">
            <Trophy className="w-3 h-3 mr-1" />
            {hackathon.prizePool?.amount
              ? `$${hackathon.prizePool.amount.toLocaleString()}`
              : "TBA"}
          </Badge>
        </div>
      </div>

      {/* Right Side: Content Section */}
      <div className="flex-1 p-6 flex flex-col justify-between min-h-0">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <RCardTitle className="text-xl font-semibold text-indigo-700 hover:text-indigo-800 transition-colors leading-tight">
                {hackathon.title}
              </RCardTitle>
              <RCardDescription className="text-sm text-gray-600 mt-1">
                by <span className="font-medium text-gray-800">{hackathon.organizer?.name || "Unknown Organizer"}</span>
              </RCardDescription>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-800">4.5</span>
              <span className="text-sm text-gray-500">(12)</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {hackathon.description || "No description available"}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-xl flex-shrink-0">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duration</p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {new Date(hackathon.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(hackathon.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl flex-shrink-0">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</p>
              <p className="text-sm font-semibold text-gray-800 truncate">{hackathon.location || "TBA"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-xl flex-shrink-0">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Participants</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-800">
                  {hackathon.participants?.length || 0}/{hackathon.maxParticipants || 100}
                </p>
                <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-300"
                    style={{ 
                      width: `${Math.min(((hackathon.participants?.length || 0) / (hackathon.maxParticipants || 100)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-xl flex-shrink-0">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Deadline</p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {new Date(hackathon.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              {hackathon.category}
            </Badge>
            {(hackathon.tags || []).slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
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
          <div className="flex gap-3">
            <Button
              size="sm"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200 px-6 py-2 rounded-lg font-medium"
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
              className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 transition-colors duration-200 px-4 py-2 rounded-lg"
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
      </div>
    </div>
  </RCard>
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