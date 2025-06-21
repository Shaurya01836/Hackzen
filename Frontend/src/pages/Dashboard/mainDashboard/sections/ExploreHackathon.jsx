"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  CardHeader,
  CardTitle,
} from "../../AdimPage/components/ui/card";
import { Button } from "../../AdimPage/components/ui/button";
import { Badge } from "../../AdimPage/components/ui/badge";
import { Input } from "../../AdimPage/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../AdimPage/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../AdimPage/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../AdimPage/components/ui/avatar";
import { Progress } from "../../AdimPage/components/ui/progress";
import { cn } from "../../AdimPage/components/lib/utils";

export function ExploreHackathons({ onBack }) {
   const navigate = useNavigate();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/hackathons");
        console.log("Raw hackathons response:", res.data);

        // 🔍 Debug participant field
        console.log("💡 Participants debug:");
        res.data.forEach((h) => {
          console.log(h.title, "participants:", h.participants);
        });

        setHackathons(res.data);
      } catch (err) {
        console.error("Hackathon fetch error:", err.message);
        console.error("Full error:", err);
        setError("Failed to fetch hackathons");
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

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

  const featuredHackathons = hackathons.filter((h) =>
    h.tags?.includes("featured")
  );
  const sponsoredHackathons = hackathons.filter((h) =>
    h.tags?.includes("sponsored")
  );
  const upcomingHackathons = hackathons.filter((h) => h.status === "upcoming");

const renderHackathonCard = (hackathon, featured = false) => (
  <Card
    key={hackathon._id}
    className={cn(
      "w-full flex flex-col md:flex-row gap-4 p-4",
      featured ? "ring-2 ring-purple-300" : "shadow-sm"
    )}
  >
    {/* Left Side: Full Image */}
    <div className="md:w-1/3 w-full">
      <img
        src={hackathon.image || "https://www.hackquest.io/images/layout/hackathon_cover.png"}
        alt={hackathon.title}
        className="rounded-md object-cover w-full h-48 md:h-full"
      />
    </div>

    {/* Right Side: Content */}
    <div className="md:w-2/3 flex flex-col justify-between gap-3">
      
      {/* Title + Organizer */}
      <div>
        <CardTitle className="text-xl font-semibold text-indigo-700">
          {hackathon.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          by <span className="font-medium">{hackathon.organizer?.name || "Organizer"}</span>
        </CardDescription>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-3">
        {hackathon.description}
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
          <span>{hackathon.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-gray-500" />
          <span>
            {hackathon.prizePool?.amount || "N/A"} {hackathon.prizePool?.currency}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>
            Register by {new Date(hackathon.registrationDeadline).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 text-sm">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium text-gray-800">4.5</span>
        <span className="text-gray-500">(12 reviews)</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {(hackathon.tags || []).slice(0, 4).map((tag) => (
          <Badge
            key={tag}
            className="bg-indigo-100 text-indigo-700"
            variant="outline"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          className="gap-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <ExternalLink className="w-4 h-4" />
          View details
        </Button>
        <Button size="sm" className="gap-1 rounded-md">
          <Heart className="w-4 h-4" />
          Save
        </Button>
      </div>
    </div>
  </Card>
);


  if (loading)
    return <div className="p-6 text-gray-500">Loading hackathons...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="flex items-center gap-4">
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            if (onBack) onBack();
            navigate("/dashboard");
          }}
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
              <Input placeholder="Search hackathons..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-lg rounded-md border">
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category.toLowerCase().replace(/\s+/g, "-")}
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-lg rounded-md border">
                {difficulties.map((difficulty) => (
                  <SelectItem
                    key={difficulty}
                    value={difficulty.toLowerCase().replace(/\s+/g, "-")}
                  >
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-lg rounded-md border">
                {locations.map((location) => (
                  <SelectItem
                    key={location}
                    value={location.toLowerCase().replace(/\s+/g, "-")}
                  >
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All Hackathons ({hackathons.length})
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
       <div className="space-y-6">
            {hackathons.map((hackathon) => renderHackathonCard(hackathon))}
          </div>
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
