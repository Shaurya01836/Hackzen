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

  // Fallback badge data for participants (10 badges, exact order and names)
  const fallbackBadges = [
    {
      _id: '1',
      name: 'Member of HackZen',
      description: 'Welcome to HackZen! You joined the platform.',
      type: 'member',
      rarity: 'common',
      criteria: 'Join HackZen',
      iconUrl: '/badges/member.svg',
      isUnlocked: !!user?._id
    },
    {
      _id: '2',
      name: 'First Submission',
      description: 'Submit your first project.',
      type: 'first-submission',
      rarity: 'common',
      criteria: 'Submit 1 project',
      iconUrl: '/badges/first-submission.svg',
      isUnlocked: user?.projects?.length >= 1
    },
    {
      _id: '3',
      name: 'Early Bird',
      description: 'Register for a hackathon within 24 hours of its announcement.',
      type: 'early-bird',
      rarity: 'uncommon',
      criteria: 'Register within 24h',
      iconUrl: '/badges/early-bird.svg',
      isUnlocked: false // TODO: implement logic if available
    },
    {
      _id: '4',
      name: 'Win 1 Hackathon',
      description: 'Win your first hackathon',
      type: 'first-win',
      rarity: 'common',
      criteria: 'Win 1 hackathon',
      iconUrl: '/badges/first-win.svg',
      isUnlocked: false // TODO: implement logic if available
    },
    {
      _id: '5',
      name: '7 Day Streak',
      description: 'Maintain a 7-day activity streak',
      type: 'streak-master',
      rarity: 'uncommon',
      criteria: '7-day streak',
      iconUrl: '/badges/streak.svg',
      isUnlocked: false // TODO: implement logic if available
    },
    {
      _id: '6',
      name: 'Join 5 Different Teams',
      description: 'Join 5 different teams',
      type: 'team-player',
      rarity: 'rare',
      criteria: 'Join 5 teams',
      iconUrl: '/badges/team.svg',
      isUnlocked: false // TODO: implement logic if available
    },
    {
      _id: '7',
      name: 'Submit 10 Projects',
      description: 'Submit 10 projects',
      type: 'code-wizard',
      rarity: 'epic',
      criteria: 'Submit 10 projects',
      iconUrl: '/badges/code.svg',
      isUnlocked: user?.projects?.length >= 10
    },
    {
      _id: '8',
      name: 'Join 10 Hackathons',
      description: 'Participate in 10 hackathons',
      type: 'hackathon-veteran',
      rarity: 'rare',
      criteria: 'Join 10 hackathons',
      iconUrl: '/badges/veteran.svg',
      isUnlocked: user?.registeredHackathonIds?.length >= 10
    },
    {
      _id: '9',
      name: 'Win 3 Hackathons',
      description: 'Win 3 hackathons',
      type: 'innovation-leader',
      rarity: 'legendary',
      criteria: 'Win 3 hackathons',
      iconUrl: '/badges/innovation.svg',
      isUnlocked: false // TODO: implement logic if available
    },
    {
      _id: '10',
      name: 'Active Participant',
      description: 'Participate in 3 hackathons',
      type: 'active-participant',
      rarity: 'common',
      criteria: 'Join 3 hackathons',
      iconUrl: '/badges/active.svg',
      isUnlocked: user?.registeredHackathonIds?.length >= 3
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

  // Merge backend badges with fallbackBadges for participants
  let mergedBadges = fallbackBadges;
  if (user?.role === 'participant' && apiBadges && apiBadges.length > 0) {
    // Create a map of backend badges by type
    const backendBadgeMap = Object.fromEntries(apiBadges.map(b => [b.type, b]));
    // Merge: for each fallback badge, use backend if present, else fallback
    mergedBadges = fallbackBadges.map(fb => {
      if (backendBadgeMap[fb.type]) {
        return { ...fb, ...backendBadgeMap[fb.type] };
      }
      return fb;
    });
  } else if (apiBadges && apiBadges.length > 0) {
    mergedBadges = apiBadges;
  }
  const badges = mergedBadges;

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

  const filteredBadgesForDisplay = badges.filter(badge => {
    const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         badge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = filterRarity === 'all' || badge.rarity === filterRarity;
    const matchesCategory = filterCategory === 'all' || badge.type === filterCategory;
    
    return matchesSearch && matchesRarity && matchesCategory;
  });

  const sortedBadges = [...filteredBadgesForDisplay].sort((a, b) => {
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

  // Remove progress summary card and search/check controls
  return (
    <div className="space-y-6">
      {/* Badges Display */}
      <Tabs defaultValue="all" className="w-full pt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Badges ({badges.length})</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked ({badges.filter(b => b.isUnlocked).length})</TabsTrigger>
          <TabsTrigger value="locked">Locked ({badges.filter(b => !b.isUnlocked).length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {badges.map(badge => (
              <AchievementBadge
                key={badge._id}
                badge={badge}
                isUnlocked={badge.isUnlocked}
                showDetails={false}
                onShare={handleBadgeShareFromBadge}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="unlocked" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {badges.filter(badge => badge.isUnlocked).map(badge => (
              <AchievementBadge
                key={badge._id}
                badge={badge}
                isUnlocked={true}
                showDetails={false}
                onShare={handleBadgeShareFromBadge}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="locked" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {badges.filter(badge => !badge.isUnlocked).map(badge => (
              <AchievementBadge
                key={badge._id}
                badge={badge}
                isUnlocked={false}
                showDetails={false}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      {/* Empty State */}
      {filteredBadgesForDisplay.length === 0 && (
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