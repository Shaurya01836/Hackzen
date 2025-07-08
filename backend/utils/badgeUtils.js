const Badge = require('../model/BadgeModel');
const User = require('../model/UserModel');
const Hackathon = require('../model/HackathonModel');

/**
 * Checks and awards organizer badges based on their hackathon activity.
 * Call this after hackathon creation or when updating participant count/rating.
 * @param {User} user - The organizer user document
 */
async function awardOrganizerBadges(user) {
  if (!user || user.role !== 'organizer') {
    console.log('[Badge] Not an organizer or user missing');
    return;
  }

  // Fetch all hackathons organized by this user
  const hackathons = await Hackathon.find({ organizer: user._id });
  const hackathonCount = hackathons.length;
  const totalParticipants = hackathons.reduce((sum, h) => sum + (h.participants?.length || 0), 0);
  const allRatings = hackathons.flatMap(h => h.ratings || []);
  const avgRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length) : 0;
  const has100Plus = hackathons.some(h => (h.participants?.length || 0) >= 100);

  console.log(`[Badge] Organizer: ${user.email}, Hackathons: ${hackathonCount}, TotalParticipants: ${totalParticipants}, AvgRating: ${avgRating}, Has100Plus: ${has100Plus}`);

  // Get all organizer badges
  const badges = await Badge.find({ role: 'organizer' });
  console.log('[Badge] Organizer badges in DB:', badges.map(b => ({ type: b.type, id: b._id })));
  const userBadgeTypes = user.badges.map(b => b.badge?.toString() || b.toString());

  // Helper to add badge if not already present
  async function addBadge(type) {
    const badge = badges.find(b => b.type === type);
    if (!badge) {
      console.log(`[Badge] Badge type not found: ${type}`);
      return;
    }
    if (!user.badges.some(b => b.badge?.toString() === badge._id.toString())) {
      user.badges.push({ badge: badge._id, unlockedAt: new Date() });
      await user.save();
      console.log(`[Badge] Awarded badge: ${type} to user: ${user.email}`);
    } else {
      console.log(`[Badge] User already has badge: ${type}`);
    }
  }

  // Event Creator: Create 1 hackathon
  if (hackathonCount >= 1) await addBadge('event-creator');
  // Community Builder: Any hackathon with 100+ participants
  if (has100Plus) await addBadge('community-builder');
  // Innovation Catalyst: Organize 5 hackathons
  if (hackathonCount >= 5) await addBadge('innovation-catalyst');
  // Excellence Curator: Average rating 4.5+
  if (avgRating >= 4.5) await addBadge('excellence-curator');
  // Hackathon Legend: 10+ hackathons, 1000+ total participants
  if (hackathonCount >= 10 && totalParticipants >= 1000) await addBadge('hackathon-legend');
}

module.exports = {
  awardOrganizerBadges,
}; 