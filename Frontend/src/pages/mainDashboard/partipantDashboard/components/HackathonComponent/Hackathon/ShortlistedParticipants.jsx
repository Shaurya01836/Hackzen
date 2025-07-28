"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/CommonUI/card";
import { Badge } from "../../../../../../components/CommonUI/badge";
import { Trophy, Users, Award, Star, Eye, AlertCircle } from "lucide-react";
import { Button } from "../../../../../../components/CommonUI/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../../../components/DashboardUI/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../../components/DashboardUI/avatar";

export default function ShortlistedParticipants({ hackathonId, roundIndex = 0 }) {
  const [shortlistedParticipants, setShortlistedParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  useEffect(() => {
    if (hackathonId) {
      fetchShortlistedParticipants();
    }
  }, [hackathonId, roundIndex]);

  const fetchShortlistedParticipants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/judge-management/hackathons/${hackathonId}/rounds/${roundIndex}/shortlisted-public`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

                  if (response.ok) {
              const data = await response.json();
              setShortlistedParticipants(data.shortlistedSubmissions || []);
            } else {
              setError('Failed to fetch shortlisted participants');
            }
    } catch (error) {
      console.error('Error fetching shortlisted participants:', error);
      setError('Failed to fetch shortlisted participants');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (participant) => {
    setSelectedParticipant(participant);
    setShowDetailsModal(true);
  };

  const getPositionBadge = (index) => {
    if (index === 0) return { text: "🥇 1st", color: "bg-yellow-100 text-yellow-800" };
    if (index === 1) return { text: "🥈 2nd", color: "bg-gray-100 text-gray-800" };
    if (index === 2) return { text: "🥉 3rd", color: "bg-orange-100 text-orange-800" };
    return { text: `${index + 1}th`, color: "bg-blue-100 text-blue-800" };
  };

  const getScoreColor = (score) => {
    if (score >= 8.5) return "text-green-600";
    if (score >= 7.0) return "text-blue-600";
    if (score >= 5.0) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Shortlisted Participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading shortlisted participants...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Shortlisted Participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (shortlistedParticipants.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Shortlisted Participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Shortlisted Participants Yet</h3>
            <p className="text-sm">
              Shortlisted participants will appear here once the organizer completes the shortlisting process.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Shortlisted Participants ({shortlistedParticipants.length})
          </CardTitle>
          <p className="text-sm text-gray-600">
            These participants have been selected to advance to the next round based on their performance.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shortlistedParticipants.map((participant, index) => {
              const positionBadge = getPositionBadge(index);
              const scoreColor = getScoreColor(participant.averageScore);
              
              return (
                <div key={participant._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Badge className={positionBadge.color}>
                          {positionBadge.text}
                        </Badge>
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {participant.leaderName?.charAt(0)?.toUpperCase() || 'P'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {participant.leaderName}
                          </h3>
                          {participant.teamName && (
                            <Badge variant="outline" className="text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              {participant.teamName}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {participant.projectTitle}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className={`text-sm font-medium ${scoreColor}`}>
                              {participant.averageScore}/10
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {participant.scoreCount} judge{participant.scoreCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(participant)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Participant Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedParticipant && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Leader Information</h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                        {selectedParticipant.leaderName?.charAt(0)?.toUpperCase() || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedParticipant.leaderName}</p>
                      <p className="text-sm text-gray-600">Team Leader</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Team Information</h3>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{selectedParticipant.teamName || 'Individual Participant'}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Project Details</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">{selectedParticipant.projectTitle}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Submitted on {new Date(selectedParticipant.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">Average Score</span>
                    </div>
                    <p className={`text-2xl font-bold ${getScoreColor(selectedParticipant.averageScore)}`}>
                      {selectedParticipant.averageScore}/10
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Judges</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedParticipant.scoreCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 