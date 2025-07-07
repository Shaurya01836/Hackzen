import React, { useState } from 'react';
import { Badge } from '../CommonUI/badge';
import { Button } from '../CommonUI/button';
import { Card, CardContent, CardHeader, CardTitle } from '../CommonUI/card';
import { 
  Share2, 
  Twitter, 
  Linkedin, 
  Copy, 
  CheckCircle, 
  Lock,
  Trophy,
  Star,
  Zap,
  Target,
  Users,
  Code,
  Heart,
  Award
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

const badgeIcons = {
  'first-win': Trophy,
  'streak-master': Zap,
  'team-player': Users,
  'code-wizard': Code,
  'mentor': Heart,
  'organizer': Target,
  'hackathon-veteran': Award,
  'innovation-leader': Star,
  'early-adopter': Star,
  'problem-solver': Target
};

const badgeColors = {
  'first-win': 'bg-yellow-500 text-white',
  'streak-master': 'bg-purple-500 text-white',
  'team-player': 'bg-blue-500 text-white',
  'code-wizard': 'bg-green-500 text-white',
  'mentor': 'bg-pink-500 text-white',
  'organizer': 'bg-indigo-500 text-white',
  'hackathon-veteran': 'bg-red-500 text-white',
  'innovation-leader': 'bg-orange-500 text-white',
  'early-adopter': 'bg-cyan-500 text-white',
  'problem-solver': 'bg-emerald-500 text-white'
};

const badgeRarities = {
  common: { color: 'border-gray-300', bg: 'bg-gray-100', text: 'text-gray-700' },
  uncommon: { color: 'border-green-300', bg: 'bg-green-100', text: 'text-green-700' },
  rare: { color: 'border-blue-300', bg: 'bg-blue-100', text: 'text-blue-700' },
  epic: { color: 'border-purple-300', bg: 'bg-purple-100', text: 'text-purple-700' },
  legendary: { color: 'border-yellow-300', bg: 'bg-yellow-100', text: 'text-yellow-700' }
};

export const AchievementBadge = ({ 
  badge, 
  isUnlocked = false, 
  showDetails = true,
  onShare,
  className = "" 
}) => {
  const [copied, setCopied] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  const IconComponent = badgeIcons[badge.type] || Trophy;
  const rarity = badge.rarity || 'common';
  const rarityStyle = badgeRarities[rarity];

  const handleShare = (platform) => {
    const shareText = `🎉 I just unlocked the "${badge.name}" badge on HackZen! ${badge.description} #HackZen #Achievements`;
    const shareUrl = window.location.origin;
    
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(badge.name)}&summary=${encodeURIComponent(badge.description)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      default:
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank');
    }
    
    setShowShareDialog(false);
    if (onShare) onShare(platform);
  };

  const BadgeContent = () => (
    <div className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}>
      {/* Badge Container */}
      <div className={`
        relative w-20 h-20 rounded-full border-4 flex items-center justify-center
        ${isUnlocked 
          ? `${rarityStyle.color} ${rarityStyle.bg} shadow-lg hover:shadow-xl` 
          : 'border-gray-300 bg-gray-100 opacity-50'
        }
        transition-all duration-300
      `}>
        {/* Icon */}
        <IconComponent 
          className={`w-8 h-8 ${isUnlocked ? rarityStyle.text : 'text-gray-400'}`} 
        />
        
        {/* Lock overlay for locked badges */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-4 h-4 text-gray-500" />
          </div>
        )}
        
        {/* Rarity indicator */}
        {isUnlocked && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border-2 border-current flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full ${rarityStyle.text.replace('text-', 'bg-')}`}></div>
          </div>
        )}
      </div>
      
      {/* Badge name */}
      {showDetails && (
        <div className="mt-2 text-center">
          <p className={`text-xs font-medium ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
            {badge.name}
          </p>
          {isUnlocked && (
            <p className="text-xs text-gray-500 mt-1">
              {badge.unlockedAt && new Date(badge.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
      
      {/* Hover effect for unlocked badges */}
      {isUnlocked && (
        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Share2 className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div onClick={() => isUnlocked && setShowShareDialog(true)}>
              <BadgeContent />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-xs">
              <p className="font-semibold">{badge.name}</p>
              <p className="text-sm text-gray-600">{badge.description}</p>
              {!isUnlocked && (
                <p className="text-xs text-gray-500 mt-1">
                  Unlock: {badge.criteria}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      <Card className={`transition-all duration-300 hover:shadow-lg ${!isUnlocked ? 'opacity-60' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <BadgeContent />
              <div>
                <h3 className="font-semibold">{badge.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{rarity} • {badge.type}</p>
              </div>
            </CardTitle>
            {isUnlocked && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareDialog(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Criteria: {badge.criteria}</span>
            {isUnlocked && (
              <span className="text-green-600 font-medium">
                ✓ Unlocked {badge.unlockedAt && new Date(badge.unlockedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Achievement!</DialogTitle>
            <DialogDescription>
              Celebrate your "{badge.name}" badge with the community
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <BadgeContent />
              <div>
                <h4 className="font-semibold">{badge.name}</h4>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => handleShare('twitter')}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Share on X
              </Button>
              <Button
                onClick={() => handleShare('linkedin')}
                className="flex-1 bg-blue-700 hover:bg-blue-800"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={() => handleShare('copy')}
              className="w-full"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AchievementBadge; 