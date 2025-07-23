import React, { useState } from "react";
import { Badge } from "../../../components/CommonUI/badge";
import { Button } from "../../../components/CommonUI/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import { Separator } from "../../../components/CommonUI/separator";
import { ACard, ACardContent } from "../../../components/DashboardUI/AnimatedCard";
import {
  ArrowLeft,
  Edit3,
  Download,
  FormInputIcon,
  Medal,
  Trophy,
  Megaphone,
  Upload,
  Users,
  Users2,
  Zap,
  MapPin,
  Trash2,
  Activity,
  Calendar,
  LucideJoystick,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import JudgeManagement from './JudgeManagement'; // adjust path

export default function CreatedHackathonOverview({
  hackathon,
  totalParticipants,
  totalTeams,
  totalSubmissions,
  onBack,
  onShowParticipantsView,
  onShowTeamsView,
  onShowSubmissionsView,
  onEditHackathon,
  onExportParticipants,
  onExportSubmissions,
  onSubmissionForm,
  onSendCertificates,
  onViewLeaderboard,
  onSendAnnouncements,
  onDeleteHackathon,
  onReviewSponsoredPS,
  // onFetchSponsorProposals,
}) {
  const navigate = useNavigate();
  const [showJudgeManagement, setShowJudgeManagement] = useState(false);

  const handleBack = () => {
    navigate('/dashboard/created-hackathons');
  };

  if (showJudgeManagement) {
    return (
      <JudgeManagement hackathonId={hackathon._id} hideHackathonSelector={true} onBack={() => setShowJudgeManagement(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Header */}
      <div className=" sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="flex items-center gap-2 hover:bg-white/50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-gray-900 truncate">
                  {hackathon.title}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Hackathon Dashboard & Analytics
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 text-xs flex items-center gap-1"
            >
              <Activity className="h-3 w-3" />
              {hackathon.status || "Completed"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* Stats Overview */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Hackathon Overview
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <ACard className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" onClick={onShowParticipantsView}>
                  <ACardContent className="pt-6 flex flex-col items-center justify-center py-8">
                    <div className="p-3 bg-indigo-50 rounded-full mb-4">
                      <Users className="w-8 h-8 text-indigo-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {totalParticipants}
                    </p>
                    <p className="text-sm text-gray-500 font-medium text-center mb-1">
                      Participants
                    </p>
                    <p className="text-xs text-gray-400">Click to view details</p>
                  </ACardContent>
                </ACard>

                <ACard className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" onClick={onShowTeamsView}>
                  <ACardContent className="pt-6 flex flex-col items-center justify-center py-8">
                    <div className="p-3 bg-blue-50 rounded-full mb-4">
                      <Users2 className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {totalTeams}
                    </p>
                    <p className="text-sm text-gray-500 font-medium text-center mb-1">
                      Teams
                    </p>
                    <p className="text-xs text-gray-400">Click to view all teams</p>
                  </ACardContent>
                </ACard>

                <ACard className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" onClick={onShowSubmissionsView}>
                  <ACardContent className="pt-6 flex flex-col items-center justify-center py-8">
                    <div className="p-3 bg-green-50 rounded-full mb-4">
                      <Upload className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {totalSubmissions}
                    </p>
                    <p className="text-sm text-gray-500 font-medium text-center mb-1">
                      Submissions
                    </p>
                    <p className="text-xs text-gray-400">Click to view submissions</p>
                  </ACardContent>
                </ACard>
                <ACard
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => setShowJudgeManagement(true)}
                >
                  <ACardContent className="pt-6 flex flex-col items-center justify-center py-8">
                    <div className="p-3 bg-green-50 rounded-full mb-4">
                      <LucideJoystick className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {totalSubmissions}
                    </p>
                    <p className="text-sm text-gray-500 font-medium text-center mb-1">
                      Judges
                    </p>
                    <p className="text-xs text-gray-400">Click to view judges</p>
                  </ACardContent>
                </ACard>
              </div>
            </section>

            {/* Top Tracks and Locations */}
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-4 w-4 text-indigo-600" />
                      Top Tracks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {Array.isArray(hackathon.topTracks) && hackathon.topTracks.length > 0 ? (
                      <div className="space-y-3">
                        {hackathon.topTracks.map((track, index) => (
                          <div
                            key={track}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-sm text-gray-700 font-medium">{track}</span>
                            <Badge variant="secondary" className="text-xs">
                              #{index + 1}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 font-medium">No track data available</p>
                        <p className="text-xs text-gray-400 mt-1">Track information will appear here once participants register</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-indigo-600" />
                      Top Locations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {Array.isArray(hackathon.topLocations) && hackathon.topLocations.length > 0 ? (
                      <div className="space-y-3">
                        {hackathon.topLocations.map((location, index) => (
                          <div
                            key={location}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700 font-medium">
                                {location}
                              </span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              #{index + 1}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 font-medium">No location data available</p>
                        <p className="text-xs text-gray-400 mt-1">Location information will appear here once participants register</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>

          {/* Quick Actions Panel */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-indigo-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left bg-transparent"
                    onClick={onEditHackathon}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Hackathon
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left bg-transparent"
                    onClick={onExportParticipants}
                  >
                    <Download className="h-4 w-4" />
                    Export Participants
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left bg-transparent"
                    onClick={onSubmissionForm}
                  >
                    <FormInputIcon className="h-4 w-4" />
                    Submission Form
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left bg-transparent"
                    onClick={onExportSubmissions}
                  >
                    <Download className="h-4 w-4" />
                    Export Submissions
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left bg-transparent"
                    onClick={onSendCertificates}
                  >
                    <Medal className="h-4 w-4" />
                    Send Certificates
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left bg-transparent"
                    onClick={onViewLeaderboard}
                  >
                    <Trophy className="h-4 w-4" />
                    View Leaderboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left bg-transparent"
                    onClick={onSendAnnouncements}
                  >
                    <Megaphone className="h-4 w-4" />
                    Send Announcements
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left bg-transparent border-yellow-500 text-yellow-700"
                    onClick={onReviewSponsoredPS}
                  >
                    Review Sponsored PS
                  </Button>
                  <Separator />
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                    onClick={onDeleteHackathon}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Hackathon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}