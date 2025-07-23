import React from "react";
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
} from "lucide-react";

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
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="flex items-center gap-2 hover:bg-white/50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 truncate">
                  {hackathon.title}
                </h1>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 text-xs"
            >
              {hackathon.status || "Completed"}
            </Badge>
          </div>
        </div>
      </div>
      {/* Stats Overview */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Hackathon Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full mb-8">
          <ACard className="cursor-pointer hover:shadow-lg transition" onClick={onShowParticipantsView}>
            <ACardContent className="pt-4 flex flex-col items-center justify-center py-6">
              <Users className="w-8 h-8 text-indigo-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {totalParticipants}
              </p>
              <p className="text-sm text-gray-500 font-medium text-center">
                Participants
              </p>
            </ACardContent>
          </ACard>
          <ACard
            className="cursor-pointer hover:shadow-lg transition"
            onClick={onShowTeamsView}
          >
            <ACardContent className="pt-4 flex flex-col items-center justify-center py-6">
              <Users2 className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {totalTeams}
              </p>
              <p className="text-sm text-gray-500 font-medium text-center">
                Teams
              </p>
              <p className="text-xs text-gray-400 mt-1">Click to view all teams</p>
            </ACardContent>
          </ACard>
          <ACard
            className="cursor-pointer hover:shadow-lg transition"
            onClick={onShowSubmissionsView}
          >
            <ACardContent className="pt-4 flex flex-col items-center justify-center py-6">
              <Upload className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {totalSubmissions}
              </p>
              <p className="text-sm text-gray-500 font-medium text-center">
                Submissions
              </p>
              <p className="text-xs text-gray-400 mt-1">Click to view all submissions</p>
            </ACardContent>
          </ACard>
        </div>
        {/* Top Tracks and Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className=" border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Top Tracks</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {Array.isArray(hackathon.topTracks) && hackathon.topTracks.map((track, index) => (
                  <div
                    key={track}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">{track}</span>
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className=" border-gray-200 ">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Top Locations</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {Array.isArray(hackathon.topLocations) && hackathon.topLocations.map((location, index) => (
                  <div
                    key={location}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {location}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Quick Actions Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
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
    </>
  );
} 