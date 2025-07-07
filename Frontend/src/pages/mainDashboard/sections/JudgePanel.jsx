import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/CommonUI/card';
import { Button } from '../../../components/CommonUI/button';
import { Gavel, Trophy, Users, FileText, Star } from 'lucide-react';

export default function JudgePanel({ onBack }) {
  const [judgeData, setJudgeData] = useState({
    totalHackathons: 0,
    totalSubmissions: 0,
    averageRating: 0,
    completedJudgments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch judge-specific data
    const fetchJudgeData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users/judge-stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setJudgeData(data);
        }
      } catch (error) {
        console.error('Error fetching judge data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJudgeData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <h1 className="text-2xl font-bold">Judge Panel</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Judge Panel</h1>
          <p className="text-gray-600">Manage your hackathon judgments and reviews</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Hackathons</span>
            </div>
            <p className="text-2xl font-bold">{judgeData.totalHackathons}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Submissions</span>
            </div>
            <p className="text-2xl font-bold">{judgeData.totalSubmissions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Avg Rating</span>
            </div>
            <p className="text-2xl font-bold">{judgeData.averageRating.toFixed(1)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Completed</span>
            </div>
            <p className="text-2xl font-bold">{judgeData.completedJudgments}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Active Judgments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Review and score submissions for active hackathons you're judging.
            </p>
            <Button className="w-full">
              View Active Judgments
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              My Judgments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              View your completed judgments and review history.
            </p>
            <Button variant="outline" className="w-full">
              View History
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Rated submission for "AI Hackathon"</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
              <span className="text-sm font-medium text-green-600">4.5/5</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Joined "Web3 Challenge" as judge</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Completed final review for "Mobile App Contest"</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
              <span className="text-sm font-medium text-purple-600">Complete</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 