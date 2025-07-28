import React, { useState, useEffect } from 'react';
import { useToast } from '../../../../../../hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/CommonUI/card';
import { Badge } from '../../../../../../components/CommonUI/badge';
import { Button } from '../../../../../../components/CommonUI/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../../../../components/DashboardUI/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../../components/DashboardUI/avatar';
import { Trophy, Users, Star, Calendar, Award, Medal, Eye, Crown, Target, TrendingUp, Sparkles, Zap } from 'lucide-react';

const WinnersDisplay = ({ hackathonId }) => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchWinners();
  }, [hackathonId]);

  const fetchWinners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/judge-management/hackathons/${hackathonId}/winners`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWinners(data.winners || []);
      } else {
        setError('Failed to fetch winners');
      }
    } catch (error) {
      setError('Failed to fetch winners');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (winner) => {
    setSelectedWinner(winner);
    setShowDetailsModal(true);
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏆';
    }
  };

  const getPositionGradient = (position) => {
    switch (position) {
      case 1: return 'from-yellow-400 via-yellow-500 to-orange-500';
      case 2: return 'from-gray-300 via-gray-400 to-gray-500';
      case 3: return 'from-orange-400 via-orange-500 to-red-500';
      default: return 'from-blue-400 via-blue-500 to-purple-500';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 font-semibold';
    if (score >= 6) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  const getScoreBadge = (score) => {
    if (score >= 8) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Trophy className="w-6 h-6 text-yellow-600" />
            Hackathon Winners
            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-700">
              {winners.length} Winners
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            <span className="ml-3 text-gray-600">Loading winners...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Trophy className="w-6 h-6 text-red-600" />
            Hackathon Winners
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (winners.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Trophy className="w-6 h-6 text-yellow-600" />
            Hackathon Winners
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">🏆</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Winners Not Announced Yet</h3>
            <p className="text-gray-500">Winners will be displayed here once the organizer announces the final results.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">🏆 Hackathon Winners</h2>
              <p className="text-yellow-100">Congratulations to our outstanding champions!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{winners.length}</div>
            <div className="text-yellow-100 text-sm">Winners</div>
          </div>
        </div>
      </div>

      {/* Winners Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {winners.map((winner, index) => {
          const positionIcon = getPositionIcon(winner.position);
          const positionGradient = getPositionGradient(winner.position);
          const scoreColor = getScoreColor(winner.averageScore);
          const scoreBadge = getScoreBadge(winner.averageScore);
          
          return (
            <Card key={winner._id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-yellow-200 bg-gradient-to-br from-white to-yellow-50 relative overflow-hidden">
              {/* Position Badge */}
              <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-r ${positionGradient} rounded-full flex items-center justify-center shadow-lg`}>
                <span className="text-xl">{positionIcon}</span>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12 ring-2 ring-yellow-200">
                        <AvatarFallback className="bg-gradient-to-br from-yellow-100 to-orange-100 text-yellow-700 font-semibold">
                          {winner.leaderName?.charAt(0)?.toUpperCase() || 'W'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{winner.position}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{winner.leaderName}</h3>
                      {winner.teamName && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {winner.teamName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-yellow-600" />
                    Winning Project
                  </h4>
                  <p className="text-gray-700 bg-white rounded-lg p-3 border border-gray-200 truncate">
  {winner.projectTitle}
</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-600">Average Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={scoreBadge}>
                        {winner.averageScore}/10
                      </Badge>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-600">Judges</span>
                    </div>
                    <div className="text-lg font-bold text-blue-700">
                      {winner.scoreCount}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(winner)}
                  className="w-full bg-white hover:bg-yellow-50 border-yellow-200 text-yellow-700 hover:text-yellow-800 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Crown className="w-6 h-6 text-yellow-600" />
              Winner Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedWinner && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16 ring-4 ring-yellow-200">
                      <AvatarFallback className="bg-gradient-to-br from-yellow-100 to-orange-100 text-yellow-700 text-xl font-bold">
                        {selectedWinner.leaderName?.charAt(0)?.toUpperCase() || 'W'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{selectedWinner.position}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedWinner.leaderName}</h3>
                    <p className="text-gray-600">Winner</p>
                    {selectedWinner.teamName && (
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-700">{selectedWinner.teamName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Project Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-yellow-600" />
                    Winning Project
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Project Title</h5>
                    <p className="text-gray-700">{selectedWinner.projectTitle}</p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                    Performance Metrics
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-700">Average Score</span>
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {selectedWinner.averageScore}/10
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-700">Judges</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-700">
                        {selectedWinner.scoreCount}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-gray-700">Total Score</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-700">
                        {selectedWinner.totalScore}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Position Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Medal className="w-4 h-4 text-yellow-600" />
                    Achievement
                  </h4>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getPositionIcon(selectedWinner.position)}</span>
                      <div>
                        <h5 className="font-bold text-gray-800">{selectedWinner.positionText}</h5>
                        <p className="text-gray-600">Outstanding performance!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submission Info */}
                {selectedWinner.submittedAt && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      Submission Details
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">
                        <span className="font-medium">Submitted:</span>{' '}
                        {new Date(selectedWinner.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WinnersDisplay; 