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

export function ExploreHackathons() {
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
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "http://localhost:3000/api/registration/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Safely extract hackathon IDs from registrations, filtering out null values
        const registeredHackathonIds = res.data
          .filter(registration => registration.hackathonId && registration.hackathonId._id)
          .map(registration => registration.hackathonId._id);
        
        console.log('Registered hackathon IDs:', registeredHackathonIds);
        setRegisteredHackathonIds(registeredHackathonIds);
      } catch (err) {
        console.error("Error fetching registered hackathons", err);
        // Set empty array as fallback
        setRegisteredHackathonIds([]);
      }
    };

    fetchRegisteredHackathons();
  }, []);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/hackathons");
        console.log("Raw hackathons response:", res.data);
        setHackathons(res.data);
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
    // Check if user came from My Hackathons
    const urlParams = new URLSearchParams(location.search);
    const source = urlParams.get("source");
    
    return (
      <HackathonDetails
        hackathon={selectedHackathon}
        backButtonLabel={source === "my-hackathons" ? "Back to My Hackathons" : "Back to Explore"}
        onBack={() => {
          setSelectedHackathon(null);
          // Remove hackathon parameter from URL but keep other params like view=explore-hackathons
          const newParams = new URLSearchParams(location.search);
          newParams.delete("hackathon");
          newParams.delete("title");
          newParams.delete("source");
          
          // If user came from My Hackathons, navigate back there
          if (source === "my-hackathons") {
            navigate("/dashboard/my-hackathons", { replace: true });
          } else {
            navigate(`${location.pathname}?${newParams.toString()}`, {
              replace: true,
            });
          }
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
  const now = new Date();
  const upcomingHackathons = filteredHackathons.filter(
    (h) => new Date(h.registrationDeadline) > now
  );
  const closedHackathons = filteredHackathons.filter(
    (h) => new Date(h.registrationDeadline) < now
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

  const renderHackathonCard = (hackathon, featured = false) => {
    const registrationDeadline = new Date(hackathon.registrationDeadline);
    const today = new Date();
    const daysLeft = Math.ceil(
      (registrationDeadline - today) / (1000 * 60 * 60 * 24)
    );
    const deadlineLabel = isNaN(daysLeft)
      ? "TBA"
      : daysLeft > 0
      ? `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`
      : "Closed";

    return (
      <RCard
        key={hackathon._id}
        className={cn(
          "w-full max-w-xs flex flex-col overflow-hidden cursor-pointer rounded-xl transition-transform duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg",
          featured && "ring-2 ring-purple-300"
        )}
        onClick={() => handleHackathonClick(hackathon)}
      >
        {/* Thumbnail */}
        <div className="relative h-40 w-full">
          <img
            src={
              hackathon.images?.banner?.url ||
              "https://www.hackquest.io/images/layout/hackathon_cover.png"
            }
            alt={hackathon.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Prize Pool Badge */}
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-400 text-yellow-900 font-semibold shadow-md">
              <Trophy className="w-3 h-3 mr-1" />
              {hackathon.prizePool?.amount
                ? `$${hackathon.prizePool.amount.toLocaleString()}`
                : "TBA"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          {/* Title */}
          <h3 className="text-md font-semibold text-indigo-700 leading-tight line-clamp-2 h-10">
            {hackathon.title}
          </h3>
          {/* Location + Deadline */}
          <div className="text-xs text-gray-500 flex justify-between items-center">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {hackathon.location || "TBA"}
            </span>
            <span className="flex items-center gap-1 text-red-600 font-medium">
              <Clock className="w-3 h-3" />
              {deadlineLabel}
            </span>
          </div>

          {/* Tags */}
          <div className="flex gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
            {hackathon.tags?.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 border-gray-200 shrink-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </RCard>
    );
  };

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
          <TabsTrigger value="closed">
            Closed ({closedHackathons.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredHackathons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {upcomingHackathons.map((hackathon) =>
                renderHackathonCard(hackathon)
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Upcoming Hackathons
                </h3>
                <p className="text-gray-500 text-center">
                  All hackathons are currently closed for registration.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          {closedHackathons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {closedHackathons.map((hackathon) =>
                renderHackathonCard(hackathon)
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Closed Hackathons
                </h3>
                <p className="text-gray-500 text-center">
                  All hackathons are currently open for registration.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
