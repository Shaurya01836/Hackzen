// Social sharing utilities for achievements and badges

export const shareToTwitter = (badge, user) => {
  const text = `🎉 I just unlocked the "${badge.name}" badge on HackZen! ${badge.description} #HackZen #Achievements #${badge.type.replace('-', '')}`;
  const url = window.location.origin;
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
  
  return {
    platform: 'twitter',
    success: true,
    url: twitterUrl
  };
};

export const shareToLinkedIn = (badge, user) => {
  const title = `Unlocked ${badge.name} Badge on HackZen`;
  const summary = `I just unlocked the "${badge.name}" badge! ${badge.description}`;
  const url = window.location.origin;
  
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
  window.open(linkedinUrl, '_blank', 'width=600,height=400');
  
  return {
    platform: 'linkedin',
    success: true,
    url: linkedinUrl
  };
};

export const shareToFacebook = (badge, user) => {
  const text = `🎉 I just unlocked the "${badge.name}" badge on HackZen! ${badge.description}`;
  const url = window.location.origin;
  
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400');
  
  return {
    platform: 'facebook',
    success: true,
    url: facebookUrl
  };
};

export const copyToClipboard = async (badge, user) => {
  const text = `🎉 I just unlocked the "${badge.name}" badge on HackZen! ${badge.description} #HackZen #Achievements`;
  const url = window.location.origin;
  const fullText = `${text} ${url}`;
  
  try {
    await navigator.clipboard.writeText(fullText);
    return {
      platform: 'clipboard',
      success: true,
      text: fullText
    };
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return {
      platform: 'clipboard',
      success: false,
      error: error.message
    };
  }
};

export const shareToDiscord = (badge, user) => {
  const text = `🎉 I just unlocked the "${badge.name}" badge on HackZen! ${badge.description}`;
  const url = window.location.origin;
  
  // Discord doesn't have a direct share URL, but we can copy the text
  const fullText = `${text} ${url}`;
  
  return {
    platform: 'discord',
    success: true,
    text: fullText,
    message: 'Text copied! You can now paste it in Discord.'
  };
};

export const shareToWhatsApp = (badge, user) => {
  const text = `🎉 I just unlocked the "${badge.name}" badge on HackZen! ${badge.description}`;
  const url = window.location.origin;
  const fullText = `${text} ${url}`;
  
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
  window.open(whatsappUrl, '_blank');
  
  return {
    platform: 'whatsapp',
    success: true,
    url: whatsappUrl
  };
};

export const shareToTelegram = (badge, user) => {
  const text = `🎉 I just unlocked the "${badge.name}" badge on HackZen! ${badge.description}`;
  const url = window.location.origin;
  const fullText = `${text} ${url}`;
  
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  window.open(telegramUrl, '_blank');
  
  return {
    platform: 'telegram',
    success: true,
    url: telegramUrl
  };
};

// Generate achievement image for sharing
export const generateAchievementImage = async (badge, user) => {
  // This would typically use a canvas or image generation service
  // For now, we'll return a placeholder
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, 1200, 630);
  
  // Gradient overlay
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);
  
  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Achievement Unlocked!', 600, 150);
  
  // Badge name
  ctx.font = 'bold 36px Arial';
  ctx.fillText(badge.name, 600, 250);
  
  // Description
  ctx.font = '24px Arial';
  ctx.fillStyle = '#cccccc';
  ctx.fillText(badge.description, 600, 320);
  
  // User name
  ctx.font = '20px Arial';
  ctx.fillStyle = '#888888';
  ctx.fillText(`Achieved by ${user.name}`, 600, 400);
  
  // Platform name
  ctx.font = '18px Arial';
  ctx.fillStyle = '#666666';
  ctx.fillText('HackZen Platform', 600, 580);
  
  return canvas.toDataURL('image/png');
};

// Track social sharing analytics
export const trackSocialShare = async (platform, badge, user) => {
  try {
    // This would typically send analytics to your backend
    const shareData = {
      platform,
      badgeId: badge._id,
      badgeName: badge.name,
      userId: user._id,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    // Send to analytics endpoint
    await fetch('/api/analytics/social-share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shareData)
    });
    
    return true;
  } catch (error) {
    console.error('Failed to track social share:', error);
    return false;
  }
};

// Get sharing statistics for a badge
export const getBadgeShareStats = async (badgeId) => {
  try {
    const response = await fetch(`/api/badges/${badgeId}/share-stats`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get badge share stats:', error);
    return null;
  }
};

// Export all sharing functions
export const socialSharing = {
  twitter: shareToTwitter,
  linkedin: shareToLinkedIn,
  facebook: shareToFacebook,
  clipboard: copyToClipboard,
  discord: shareToDiscord,
  whatsapp: shareToWhatsApp,
  telegram: shareToTelegram,
  generateImage: generateAchievementImage,
  trackShare: trackSocialShare,
  getStats: getBadgeShareStats
};

export default socialSharing; 