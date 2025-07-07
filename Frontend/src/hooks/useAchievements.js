import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { socialSharing } from '../utils/socialSharing';

export const useAchievements = (userId) => {
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [progress, setProgress] = useState({
    unlockedCount: 0,
    totalCount: 0,
    progressPercentage: 0,
    rarityStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState([]);

  // Fetch user's badges
  const fetchUserBadges = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `http://localhost:3000/api/badges/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const badgesData = response.data;
      setBadges(badgesData);
      
      const unlocked = badgesData.filter(badge => badge.isUnlocked);
      setUserBadges(unlocked);
      
      // Calculate progress
      const unlockedCount = unlocked.length;
      const totalCount = badgesData.length;
      const progressPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;
      
      // Calculate rarity stats
      const rarityStats = {};
      unlocked.forEach(badge => {
        rarityStats[badge.rarity] = (rarityStats[badge.rarity] || 0) + 1;
      });

      setProgress({
        unlockedCount,
        totalCount,
        progressPercentage,
        rarityStats
      });

    } catch (err) {
      console.error('Failed to fetch user badges:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Check for new badges
  const checkForNewBadges = useCallback(async () => {
    if (!userId) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:3000/api/badges/check',
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const { unlockedBadges: newBadges } = response.data;
      
      if (newBadges && newBadges.length > 0) {
        setNewlyUnlockedBadges(prev => [...prev, ...newBadges]);
        
        // Refresh badges list
        await fetchUserBadges();
        
        return newBadges;
      }
      
      return [];
    } catch (err) {
      console.error('Failed to check for new badges:', err);
      return [];
    }
  }, [userId, fetchUserBadges]);

  // Get user progress
  const fetchUserProgress = useCallback(async () => {
    if (!userId) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `http://localhost:3000/api/badges/progress/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProgress(response.data);
    } catch (err) {
      console.error('Failed to fetch user progress:', err);
    }
  }, [userId]);

  // Share badge
  const shareBadge = useCallback(async (badge, platform) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const result = await socialSharing[platform](badge, user);
      
      if (result.success) {
        // Track the share
        await socialSharing.trackShare(platform, badge, user);
        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Share failed:', error);
      return null;
    }
  }, []);

  // Get badge by type
  const getBadgeByType = useCallback((type) => {
    return badges.find(badge => badge.type === type);
  }, [badges]);

  // Check if user has specific badge
  const hasBadge = useCallback((type) => {
    return userBadges.some(badge => badge.type === type);
  }, [userBadges]);

  // Get badges by rarity
  const getBadgesByRarity = useCallback((rarity) => {
    return badges.filter(badge => badge.rarity === rarity);
  }, [badges]);

  // Get unlocked badges by rarity
  const getUnlockedBadgesByRarity = useCallback((rarity) => {
    return userBadges.filter(badge => badge.rarity === rarity);
  }, [userBadges]);

  // Clear newly unlocked badges
  const clearNewlyUnlockedBadges = useCallback(() => {
    setNewlyUnlockedBadges([]);
  }, []);

  // Get next badge to unlock
  const getNextBadgeToUnlock = useCallback(() => {
    const lockedBadges = badges.filter(badge => !badge.isUnlocked);
    return lockedBadges.sort((a, b) => {
      const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    })[0];
  }, [badges]);

  // Get achievement streak
  const getAchievementStreak = useCallback(() => {
    const sortedBadges = userBadges
      .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt));
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const badge of sortedBadges) {
      const badgeDate = new Date(badge.unlockedAt);
      const daysDiff = Math.floor((currentDate - badgeDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }, [userBadges]);

  // Initialize
  useEffect(() => {
    fetchUserBadges();
  }, [fetchUserBadges]);

  // Auto-check for new badges every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      checkForNewBadges();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkForNewBadges]);

  return {
    // State
    badges,
    userBadges,
    progress,
    loading,
    error,
    newlyUnlockedBadges,
    
    // Actions
    fetchUserBadges,
    checkForNewBadges,
    fetchUserProgress,
    shareBadge,
    clearNewlyUnlockedBadges,
    
    // Utilities
    getBadgeByType,
    hasBadge,
    getBadgesByRarity,
    getUnlockedBadgesByRarity,
    getNextBadgeToUnlock,
    getAchievementStreak
  };
};

export default useAchievements; 