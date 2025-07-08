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
  RefreshCw,
  Eye,
  Shield
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

  // Don't show badges for admin users
  if (user?.role === 'admin') {
    return null;
  }

  // Role-specific fallback badges
  const getFallbackBadges = (role) => {
    switch (role) {
      case 'participant':
        return [
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
            isUnlocked: false
          },
          {
            _id: '4',
            name: 'First Victory',
            description: 'Win your first hackathon',
            type: 'first-win',
            rarity: 'common',
            criteria: 'Win 1 hackathon',
            iconUrl: '/badges/first-win.svg',
            isUnlocked: false
          },
          {
            _id: '5',
            name: 'Streak Master',
            description: 'Maintain a 7-day activity streak',
            type: 'streak-master',
            rarity: 'uncommon',
            criteria: '7-day streak',
            iconUrl: '/badges/streak.svg',
            isUnlocked: false
          },
          {
            _id: '6',
            name: 'Team Player',
            description: 'Join 5 different teams',
            type: 'team-player',
            rarity: 'rare',
            criteria: 'Join 5 teams',
            iconUrl: '/badges/team.svg',
            isUnlocked: false
          },
          {
            _id: '7',
            name: 'Code Wizard',
            description: 'Submit 10 projects',
            type: 'code-wizard',
            rarity: 'epic',
            criteria: 'Submit 10 projects',
            iconUrl: '/badges/code.svg',
            isUnlocked: user?.projects?.length >= 10
          },
          {
            _id: '8',
            name: 'Hackathon Veteran',
            description: 'Participate in 10 hackathons',
            type: 'hackathon-veteran',
            rarity: 'rare',
            criteria: 'Join 10 hackathons',
            iconUrl: '/badges/veteran.svg',
            isUnlocked: user?.registeredHackathonIds?.length >= 10
          },
          {
            _id: '9',
            name: 'Innovation Leader',
            description: 'Win 3 hackathons',
            type: 'innovation-leader',
            rarity: 'legendary',
            criteria: 'Win 3 hackathons',
            iconUrl: '/badges/innovation.svg',
            isUnlocked: false
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

      case 'organizer':
        return [
          {
            _id: 'o1',
            name: 'Event Creator',
            description: 'Create your first hackathon',
            type: 'event-creator',
            rarity: 'common',
            criteria: 'Create 1 hackathon',
            iconUrl: '/badges/event-creator.svg',
            isUnlocked: false
          },
          {
            _id: 'o2',
            name: 'Community Builder',
            description: 'Organize a hackathon with 100+ participants',
            type: 'community-builder',
            rarity: 'uncommon',
            criteria: '100+ participants',
            iconUrl: '/badges/community-builder.svg',
            isUnlocked: false
          },
          {
            _id: 'o3',
            name: 'Innovation Catalyst',
            description: 'Organize 5 successful hackathons',
            type: 'innovation-catalyst',
            rarity: 'rare',
            criteria: 'Organize 5 hackathons',
            iconUrl: '/badges/innovation-catalyst.svg',
            isUnlocked: false
          },
          {
            _id: 'o4',
            name: 'Excellence Curator',
            description: 'Receive 4.5+ average rating on your hackathons',
            type: 'excellence-curator',
            rarity: 'epic',
            criteria: '4.5+ average rating',
            iconUrl: '/badges/excellence-curator.svg',
            isUnlocked: false
          },
          {
            _id: 'o5',
            name: 'Hackathon Legend',
            description: 'Organize 10+ hackathons with 1000+ total participants',
            type: 'hackathon-legend',
            rarity: 'legendary',
            criteria: '10+ hackathons, 1000+ participants',
            iconUrl: '/badges/hackathon-legend.svg',
            isUnlocked: false
          }
        ];

      case 'judge':
        return [
          {
            _id: 'j1',
            name: 'Fair Evaluator',
            description: 'Judge your first hackathon',
            type: 'fair-evaluator',
            rarity: 'common',
            criteria: 'Judge 1 hackathon',
            iconUrl: '/badges/fair-evaluator.svg',
            isUnlocked: false
          },
          {
            _id: 'j2',
            name: 'Insightful Reviewer',
            description: 'Review 50+ submissions',
            type: 'insightful-reviewer',
            rarity: 'uncommon',
            criteria: 'Review 50 submissions',
            iconUrl: '/badges/insightful-reviewer.svg',
            isUnlocked: false
          },
          {
            _id: 'j3',
            name: 'Quality Guardian',
            description: 'Judge 5 different hackathons',
            type: 'quality-guardian',
            rarity: 'rare',
            criteria: 'Judge 5 hackathons',
            iconUrl: '/badges/quality-guardian.svg',
            isUnlocked: false
          },
          {
            _id: 'j4',
            name: 'Expert Arbiter',
            description: 'Provide 100+ detailed evaluations',
            type: 'expert-arbiter',
            rarity: 'epic',
            criteria: '100+ evaluations',
            iconUrl: '/badges/expert-arbiter.svg',
            isUnlocked: false
          },
          {
            _id: 'j5',
            name: 'Judgment Master',
            description: 'Judge 10+ hackathons with 95%+ participant satisfaction',
            type: 'judgment-master',
            rarity: 'legendary',
            criteria: '10+ hackathons, 95%+ satisfaction',
            iconUrl: '/badges/judgment-master.svg',
            isUnlocked: false
          }
        ];

      case 'mentor':
        return [
          {
            _id: 'm1',
            name: 'Knowledge Sharer',
            description: 'Become a mentor for the first time',
            type: 'knowledge-sharer',
            rarity: 'common',
            criteria: 'Become a mentor',
            iconUrl: '/badges/knowledge-sharer.svg',
            isUnlocked: false
          },
          {
            _id: 'm2',
            name: 'Team Guide',
            description: 'Mentor 10+ teams',
            type: 'team-guide',
            rarity: 'uncommon',
            criteria: 'Mentor 10 teams',
            iconUrl: '/badges/team-guide.svg',
            isUnlocked: false
          },
          {
            _id: 'm3',
            name: 'Skill Developer',
            description: 'Help 5 teams win hackathons',
            type: 'skill-developer',
            rarity: 'rare',
            criteria: 'Help 5 winning teams',
            iconUrl: '/badges/skill-developer.svg',
            isUnlocked: false
          },
          {
            _id: 'm4',
            name: 'Innovation Coach',
            description: 'Mentor 25+ teams across different hackathons',
            type: 'innovation-coach',
            rarity: 'epic',
            criteria: 'Mentor 25+ teams',
            iconUrl: '/badges/innovation-coach.svg',
            isUnlocked: false
          },
          {
            _id: 'm5',
            name: 'Mentorship Legend',
            description: 'Mentor 50+ teams with 90%+ success rate',
            type: 'mentorship-legend',
            rarity: 'legendary',
            criteria: '50+ teams, 90%+ success',
            iconUrl: '/badges/mentorship-legend.svg',
            isUnlocked: false
          }
        ];

      default:
        return [];
    }
  };

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

  // Get role-specific fallback badges
  const fallbackBadges = getFallbackBadges(user?.role);

  // Filter API badges by user role
  const roleSpecificApiBadges = apiBadges?.filter(badge => badge.role === user?.role) || [];

  // Merge backend badges with fallbackBadges for the specific role
  let mergedBadges = fallbackBadges;
  if (roleSpecificApiBadges.length > 0) {
    // Create a map of backend badges by type
    const backendBadgeMap = Object.fromEntries(roleSpecificApiBadges.map(b => [b.type, b]));
    // Merge: for each fallback badge, use backend if present, else fallback
    mergedBadges = fallbackBadges.map(fb => {
      if (backendBadgeMap[fb.type]) {
        return { ...fb, ...backendBadgeMap[fb.type] };
      }
      return fb;
    });
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