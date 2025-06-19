"use client";
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

const hackathons = [
  {
    id: 1,
    name: "Global AI Summit Hackathon",
    organizer: "TechCorp Inc.",
    organizerLogo: "/placeholder.svg?height=40&width=40",
    description:
      "Build the next generation of AI applications that solve real-world problems and improve lives globally.",
    category: "Artificial Intelligence",
    difficulty: "Advanced",
    prize: "$50,000",
    participants: 1247,
    maxParticipants: 2000,
    startDate: "Jan 15, 2025",
    endDate: "Jan 22, 2025",
    registrationDeadline: "Jan 14, 2025",
    location: "Virtual",
    status: "Registration Open",
    tags: ["Machine Learning", "Deep Learning", "Computer Vision", "NLP"],
    rating: 4.8,
    reviews: 156,
    featured: true,
    sponsored: true,
    requirements: [
      "Python/R experience",
      "ML fundamentals",
      "Portfolio required",
    ],
    perks: ["Mentorship", "Cloud Credits", "Networking"],
  },
  {
    id: 2,
    name: "Sustainable Tech Challenge",
    organizer: "GreenTech Foundation",
    organizerLogo: "/placeholder.svg?height=40&width=40",
    description:
      "Create innovative solutions for environmental sustainability using cutting-edge technology.",
    category: "Sustainability",
    difficulty: "Intermediate",
    prize: "$25,000",
    participants: 567,
    maxParticipants: 800,
    startDate: "Feb 1, 2025",
    endDate: "Feb 8, 2025",
    registrationDeadline: "Jan 31, 2025",
    location: "San Francisco, CA",
    status: "Registration Open",
    tags: ["IoT", "Clean Energy", "Smart Cities", "Climate Tech"],
    rating: 4.6,
    reviews: 89,
    featured: false,
    sponsored: false,
    requirements: ["Any programming language", "Environmental passion"],
    perks: ["Eco-friendly swag", "Industry connections"],
  },
  {
    id: 3,
    name: "FinTech Innovation Lab",
    organizer: "Banking Consortium",
    organizerLogo: "/placeholder.svg?height=40&width=40",
    description:
      "Revolutionize financial services with blockchain, AI, and modern web technologies.",
    category: "FinTech",
    difficulty: "Advanced",
    prize: "$75,000",
    participants: 892,
    maxParticipants: 1200,
    startDate: "Jan 20, 2025",
    endDate: "Jan 27, 2025",
    registrationDeadline: "Jan 19, 2025",
    location: "New York, NY",
    status: "Registration Open",
    tags: ["Blockchain", "DeFi", "Payment Systems", "Security"],
    rating: 4.9,
    reviews: 234,
    featured: true,
    sponsored: true,
    requirements: [
      "Financial domain knowledge",
      "Blockchain experience",
      "KYC compliance",
    ],
    perks: ["Industry mentors", "Job opportunities", "Regulatory guidance"],
  },
  {
    id: 4,
    name: "Healthcare Innovation Sprint",
    organizer: "MedTech Alliance",
    organizerLogo: "/placeholder.svg?height=40&width=40",
    description:
      "Develop digital health solutions that improve patient outcomes and healthcare accessibility.",
    category: "Healthcare",
    difficulty: "Intermediate",
    prize: "$30,000",
    participants: 445,
    maxParticipants: 600,
    startDate: "Feb 10, 2025",
    endDate: "Feb 17, 2025",
    registrationDeadline: "Feb 9, 2025",
    location: "Virtual",
    status: "Registration Open",
    tags: ["Digital Health", "Telemedicine", "Medical AI", "Patient Care"],
    rating: 4.7,
    reviews: 112,
    featured: false,
    sponsored: true,
    requirements: ["Healthcare interest", "HIPAA awareness"],
    perks: ["Medical expert mentors", "Clinical validation"],
  },
  {
    id: 5,
    name: "Gaming & VR Showcase",
    organizer: "GameDev Studios",
    organizerLogo: "/placeholder.svg?height=40&width=40",
    description:
      "Create immersive gaming experiences using VR, AR, and cutting-edge game development tools.",
    category: "Gaming",
    difficulty: "Beginner",
    prize: "$15,000",
    participants: 723,
    maxParticipants: 1000,
    startDate: "Mar 1, 2025",
    endDate: "Mar 8, 2025",
    registrationDeadline: "Feb 28, 2025",
    location: "Los Angeles, CA",
    status: "Registration Open",
    tags: ["Unity", "Unreal Engine", "VR/AR", "Game Design"],
    rating: 4.5,
    reviews: 178,
    featured: false,
    sponsored: false,
    requirements: ["Basic programming", "Creative mindset"],
    perks: ["Gaming hardware", "Industry showcase"],
  },
  {
    id: 6,
    name: "Cybersecurity Defense Challenge",
    organizer: "SecureNet Corp",
    organizerLogo: "/placeholder.svg?height=40&width=40",
    description:
      "Build robust security solutions to protect against modern cyber threats and vulnerabilities.",
    category: "Cybersecurity",
    difficulty: "Advanced",
    prize: "$40,000",
    participants: 334,
    maxParticipants: 500,
    startDate: "Jan 25, 2025",
    endDate: "Feb 1, 2025",
    registrationDeadline: "Jan 24, 2025",
    location: "Virtual",
    status: "Registration Open",
    tags: [
      "Penetration Testing",
      "Threat Detection",
      "Encryption",
      "Network Security",
    ],
    rating: 4.8,
    reviews: 67,
    featured: true,
    sponsored: true,
    requirements: ["Security fundamentals", "Ethical hacking knowledge"],
    perks: ["Security certifications", "Job placement assistance"],
  },
];

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
  "San Francisco, CA",
  "New York, NY",
  "Los Angeles, CA",
  "Austin, TX",
];

export function ExploreHackathons({ onBack }) {
  const featuredHackathons = hackathons.filter((h) => h.featured);
  const sponsoredHackathons = hackathons.filter((h) => h.sponsored);
  const upcomingHackathons = hackathons.filter(
    (h) => h.status === "Registration Open"
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500";
      case "Intermediate":
        return "bg-yellow-500";
      case "Advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderHackathonCard = (hackathon, featured = false) => (
    <Card key={hackathon._id} className={`hover:shadow-lg transition-shadow ${featured ? "ring-2 ring-purple-200" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="w-12 h-12">

              <AvatarImage src={hackathon.image || "/placeholder.svg"} />
              <AvatarFallback>{hackathon.title[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{hackathon.title}</CardTitle>
                  <CardDescription className="mt-1">
                    by {hackathon.organizer?.name || "Organizer"}
                  </CardDescription>
                </div>

              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <p className="text-sm text-gray-600">{hackathon.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{hackathon.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-gray-500" />
            <span>{hackathon.prizePool?.amount || "N/A"} {hackathon.prizePool?.currency}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>Register before: {new Date(hackathon.registrationDeadline).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Participation Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Participants</span>
            <span>{hackathon.participantCount || 0}/{hackathon.maxParticipants}</span>
          </div>
          <Progress value={(hackathon.participants.length / hackathon.maxParticipants) * 100} className="h-2" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">4.5</span>
          <span className="text-sm text-gray-500">(12 reviews)</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {hackathon.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}

        </div>

        {/* Difficulty and Category */}
        <div className="flex gap-2">
          <Badge variant="outline">{hackathon.category}</Badge>
          <Badge className={`${getDifficultyColor(hackathon.difficultyLevel)} text-white`} variant="outline">
            {hackathon.difficultyLevel}
          </Badge>
        </div>

        {/* Requirements */}
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Requirements:</p>
          <div className="flex flex-wrap gap-1">
            {hackathon.requirements.map((req) => (
              <Badge
                key={req}
                variant="outline"
                className="text-xs bg-blue-50 text-blue-700"
              >
                {req}
              </Badge>
            ))}
          </div>
        </div>

        {/* Perks */}
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Perks:</p>
          <div className="flex flex-wrap gap-1">
            {hackathon.perks.map((perk) => (
              <Badge
                key={perk}
                variant="outline"
                className="text-xs bg-green-50 text-green-700"
              >
                {perk}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            View Details
          </Button>
          <Button size="sm" variant="blue">
            Register Now
          </Button>{" "}
          <Button
            size="sm"
            variant="destructive"
            className="flex items-center gap-1"
          >
            <Heart className="w-3 h-3" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 space-y-6 p-6">
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-indigo-500" />
              <div>
                <p className="text-2xl font-bold">{hackathons.length}</p>
                <p className="text-sm text-gray-500">Available Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {hackathons.reduce((sum, h) => sum + (h.participantCount || 0), 0)}
                </p>
                <p className="text-sm text-gray-500">Total Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {featuredHackathons.length}
                </p>
                <p className="text-sm text-gray-500">Featured Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {upcomingHackathons.length}
                </p>
                <p className="text-sm text-gray-500">Open for Registration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hackathons.map((hackathon) => renderHackathonCard(hackathon))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          {featuredHackathons.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
