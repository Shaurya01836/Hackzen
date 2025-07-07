import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../CommonUI/card';
import { Button } from '../CommonUI/button';
import { Badge } from '../CommonUI/badge';
import { Progress } from '../DashboardUI/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../CommonUI/tabs';
import AchievementBadge from './AchievementBadge';
import BadgeNotification from './BadgeNotification';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Filter,
  Search,
  Grid,
  List,
  Award,
  Star,
  Zap,
  Users,
  Code,
  Heart,
  RefreshCw
} from 'lucide-react';
import { Input } from '../CommonUI/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../CommonUI/select';
import useAchievements from '../../hooks/useAchievements';

const AchievementsSection = ({ user, onBadgeUnlocked }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showNotification, setShowNotification] = useState(false);
  const [currentBadge, setCurrentBadge] = useState(null);

  // Fallback badge data if API fails (10 badges)
  const fallbackBadges = [
    {
      _id: '1',
      name: 'First Victory',
      description: 'Win your first hackathon',
      type: 'first-win',
      rarity: 'common',
      criteria: 'Win 1 hackathon',
      iconUrl: '/badges/first-win.svg',
      isUnlocked: false
    },
    {
      _id: '2',
      name: 'Streak Master',
      description: 'Maintain a 7-day activity streak',
      type: 'streak-master',
      rarity: 'uncommon',
      criteria: '7-day streak',
      iconUrl: '/badges/streak.svg',
      isUnlocked: false
    },
    {
      _id: '3',
      name: 'Team Player',
      description: 'Join 5 different teams',
      type: 'team-player',
      rarity: 'rare',
      criteria: 'Join 5 teams',
      iconUrl: '/badges/team.svg',
      isUnlocked: false
    },
    {
      _id: '4',
      name: 'Code Wizard',
      description: 'Submit 10 projects',
      type: 'code-wizard',
      rarity: 'epic',
      criteria: 'Submit 10 projects',
      iconUrl: '/badges/code.svg',
      isUnlocked: false
    },
    {
      _id: '5',
      name: 'Mentor',
      description: 'Help other participants as a mentor',
      type: 'mentor',
      rarity: 'legendary',
      criteria: 'Become a mentor',
      iconUrl: '/badges/mentor.svg',
      isUnlocked: user?.role === 'mentor'
    },
    {
      _id: '6',
      name: 'Organizer',
      description: 'Organize a successful hackathon',
      type: 'organizer',
      rarity: 'epic',
      criteria: 'Organize 1 hackathon',
      iconUrl: '/badges/organizer.svg',
      isUnlocked: user?.role === 'organizer'
    },
    {
      _id: '7',
      name: 'Hackathon Veteran',
      description: 'Participate in 10 hackathons',
      type: 'hackathon-veteran',
      rarity: 'rare',
      criteria: 'Join 10 hackathons',
      iconUrl: '/badges/veteran.svg',
      isUnlocked: false
    },
    {
      _id: '8',
      name: 'Innovation Leader',
      description: 'Win 3 hackathons',
      type: 'innovation-leader',
      rarity: 'legendary',
      criteria: 'Win 3 hackathons',
      iconUrl: '/badges/innovation.svg',
      isUnlocked: false
    },
    {
      _id: '9',
      name: 'Early Adopter',
      description: 'Join the platform in its early days',
      type: 'early-adopter',
      rarity: 'rare',
      criteria: 'Join within first month',
      iconUrl: '/badges/early.svg',
      isUnlocked: true // Most users will have this
    },
    {
      _id: '10',
      name: 'Problem Solver',
      description: 'Submit projects in 5 different categories',
      type: 'problem-solver',
      rarity: 'rare',
      criteria: '5 different categories',
      iconUrl: '/badges/solver.svg',
      isUnlocked: false
    }
  ];

  // Use achievements hook
  const {
    badges: apiBadges,
    userBadges,
    progress: apiProgress,
    loading,
    error,
    newlyUnlockedBadges,
    fetchUserBadges,
    checkForNewBadges,
    shareBadge,
    clearNewlyUnlockedBadges,
    getBadgeByType,
    hasBadge,
    getBadgesByRarity,
    getUnlockedBadgesByRarity,
    getNextBadgeToUnlock,
    getAchievementStreak
  } = useAchievements(user?._id);

  // Use fallback data if API fails or returns empty
  const badges = apiBadges && apiBadges.length > 0 ? apiBadges : fallbackBadges;
  const progress = apiProgress && apiProgress.totalCount > 0 ? apiProgress : {
    unlockedCount: badges.filter(b => b.isUnlocked).length,
    totalCount: badges.length,
    progressPercentage: (badges.filter(b => b.isUnlocked).length / badges.length) * 100,
    rarityStats: badges.filter(b => b.isUnlocked).reduce((acc, badge) => {
      acc[badge.rarity] = (acc[badge.rarity] || 0) + 1;
      return acc;
    }, {})
  };

  // Handle new badge notifications
  useEffect(() => {
    if (newlyUnlockedBadges.length > 0) {
      const latestBadge = newlyUnlockedBadges[newlyUnlockedBadges.length - 1];
      setCurrentBadge(latestBadge);
      setShowNotification(true);
      
      if (onBadgeUnlocked) {
        onBadgeUnlocked(latestBadge);
      }
    }
  }, [newlyUnlockedBadges, onBadgeUnlocked]);

  const handleBadgeShare = (platform) => {
    if (currentBadge) {
      shareBadge(currentBadge, platform);
    }
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    setCurrentBadge(null);
    clearNewlyUnlockedBadges();
  };

  const unlockedCount = progress.unlockedCount;
  const totalCount = progress.totalCount;
  const progressPercentage = progress.progressPercentage;

  const filteredBadges = badges.filter(badge => {
    const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         badge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = filterRarity === 'all' || badge.rarity === filterRarity;
    const matchesCategory = filterCategory === 'all' || badge.type === filterCategory;
    
    return matchesSearch && matchesRarity && matchesCategory;
  });

  const sortedBadges = [...filteredBadges].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return (b.unlockedAt || 0) - (a.unlockedAt || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rarity':
        const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      default:
        return 0;
    }
  });

  const rarityStats = badges.reduce((acc, badge) => {
    if (badge.unlockedAt) {
      acc[badge.rarity] = (acc[badge.rarity] || 0) + 1;
    }
    return acc;
  }, {});

  const handleBadgeShareFromBadge = (platform) => {
    console.log(`Sharing badge on ${platform}`);
    if (onBadgeUnlocked) {
      onBadgeUnlocked();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            Achievements & Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{unlockedCount}</div>
              <div className="text-sm text-gray-600">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{totalCount}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {Object.keys(progress.rarityStats).length}
              </div>
              <div className="text-sm text-gray-600">Rarities</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{unlockedCount}/{totalCount}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Rarity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rarity Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['common', 'uncommon', 'rare', 'epic', 'legendary'].map(rarity => (
              <div key={rarity} className="text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  rarity === 'common' ? 'bg-gray-100' :
                  rarity === 'uncommon' ? 'bg-green-100' :
                  rarity === 'rare' ? 'bg-blue-100' :
                  rarity === 'epic' ? 'bg-purple-100' :
                  'bg-yellow-100'
                }`}>
                  <Star className={`w-6 h-6 ${
                    rarity === 'common' ? 'text-gray-600' :
                    rarity === 'uncommon' ? 'text-green-600' :
                    rarity === 'rare' ? 'text-blue-600' :
                    rarity === 'epic' ? 'text-purple-600' :
                    'text-yellow-600'
                  }`} />
                </div>
                <div className="text-sm font-medium capitalize">{rarity}</div>
                <div className="text-xs text-gray-600">{progress.rarityStats[rarity] || 0}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="pt-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search badges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={checkForNewBadges}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Check
              </Button>
              
              <Select value={filterRarity} onValueChange={setFilterRarity}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="uncommon">Uncommon</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="first-win">First Win</SelectItem>
                  <SelectItem value="streak-master">Streak</SelectItem>
                  <SelectItem value="team-player">Team</SelectItem>
                  <SelectItem value="code-wizard">Code</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="organizer">Organizer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="rarity">Rarity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
       

      {/* Badges Display */}
      <Tabs defaultValue="all" className="w-full pt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Badges ({filteredBadges.length})</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked ({unlockedCount})</TabsTrigger>
          <TabsTrigger value="locked">Locked ({filteredBadges.length - unlockedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-4'
          }>
            {sortedBadges.map(badge => (
              <AchievementBadge
                key={badge._id}
                badge={badge}
                isUnlocked={badge.isUnlocked}
                showDetails={viewMode === 'list'}
                onShare={handleBadgeShareFromBadge}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unlocked" className="mt-6">
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-4'
          }>
            {sortedBadges.filter(badge => badge.isUnlocked).map(badge => (
              <AchievementBadge
                key={badge._id}
                badge={badge}
                isUnlocked={true}
                showDetails={viewMode === 'list'}
                onShare={handleBadgeShareFromBadge}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locked" className="mt-6">
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-4'
          }>
            {sortedBadges.filter(badge => !badge.isUnlocked).map(badge => (
              <AchievementBadge
                key={badge._id}
                badge={badge}
                isUnlocked={false}
                showDetails={viewMode === 'list'}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
       </CardContent>
      </Card>

      {/* Empty State */}
      {filteredBadges.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No badges found</h3>
            <p className="text-gray-500 text-center">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Badge Notification */}
      {currentBadge && (
        <BadgeNotification
          badge={currentBadge}
          isVisible={showNotification}
          onClose={handleNotificationClose}
          onShare={handleBadgeShare}
        />
      )}
    </div>
  );
};

export default AchievementsSection; 