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
import { useToast } from '../../hooks/use-toast';

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
  // Define IconComponent at the top so it's available everywhere
  const IconComponent = badgeIcons[badge.type] || Trophy;
  // Share dialog state
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Share handler
  const handleShare = async (platform) => {
    const shareText = `🎉 I just unlocked the "${badge.name}" badge on HackZen! ${badge.description} #HackZen #Achievements`;
    const shareUrl = window.location.origin;
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(shareLink, '_blank');
        toast({
          title: "Shared on X!",
          description: "Your badge has been shared on X (Twitter).",
        });
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(badge.name)}&summary=${encodeURIComponent(badge.description)}`;
        window.open(shareLink, '_blank');
        toast({
          title: "Shared on LinkedIn!",
          description: "Your badge has been shared on LinkedIn.",
        });
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          setCopied(true);
          toast({
            title: "Link copied!",
            description: "Badge link has been copied to clipboard.",
          });
          // Keep modal open for 1 second to show "Copied!" feedback
          setTimeout(() => {
            setCopied(false);
            setShowShareDialog(false);
          }, 1000);
          return; // Don't close modal immediately
        } catch (err) {
          toast({
            title: "Failed to copy",
            description: "Could not copy link to clipboard.",
            variant: "destructive",
          });
        }
        break;
      default:
        break;
    }
    
    // Close modal for other platforms
    setShowShareDialog(false);
    if (onShare) onShare(platform);
  };

  // Improved BadgeContent for more attractive badges
  const BadgeContent = () => (
    <div
      className={`relative group cursor-pointer transition-all duration-300 flex flex-col items-center justify-center
        ${isUnlocked
          ? 'bg-gradient-to-br from-purple-200 via-indigo-100 to-white border-2 border-purple-400 shadow-xl hover:shadow-2xl scale-105 ring-2 ring-purple-300/40'
          : 'bg-gradient-to-br from-gray-100 to-white border border-gray-300 shadow-sm opacity-70'}
        rounded-2xl p-3 w-24 h-24 sm:w-28 sm:h-28 m-auto
        hover:scale-110
      `}
      style={{ boxShadow: isUnlocked ? '0 4px 24px 0 rgba(128, 90, 213, 0.15)' : '0 2px 8px 0 rgba(0,0,0,0.04)' }}
      onClick={() => isUnlocked && setShowShareDialog(true)}
    >
      {/* Icon */}
      <div className={`flex items-center justify-center rounded-full transition-all duration-300
        ${isUnlocked ? 'bg-gradient-to-br from-purple-400 to-indigo-400 shadow-lg' : 'bg-gray-200'}
        w-14 h-14 sm:w-16 sm:h-16 mb-1
      `}>
        <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 ${isUnlocked ? 'text-white' : 'text-gray-400'}`} />
      </div>
      {/* Rarity indicator (optional, can be removed for uniform purple) */}
      {isUnlocked && (
        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border-2 border-purple-400 flex items-center justify-center shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400"></div>
        </div>
      )}
      {/* Badge name */}
      {showDetails && (
        <div className="mt-2 text-center">
          <p className={`text-xs font-semibold ${isUnlocked ? 'text-purple-700' : 'text-gray-500'}`}>{badge.name}</p>
          {isUnlocked && (
            <p className="text-xs text-gray-400 mt-1">
              {badge.unlockedAt && new Date(badge.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
      {/* Hover effect for unlocked badges */}
      {isUnlocked && (
        <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Share2 className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );

  // Improved tooltip: soft light purple, dark text, blur, drop shadow
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <BadgeContent />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-purple-100/90 text-gray-900 border-none shadow-2xl backdrop-blur-md">
            <div className="max-w-xs">
              <p className="font-semibold">{badge.name}</p>
              <p className="text-sm text-gray-700">{badge.description}</p>
              {!isUnlocked && (
                <p className="text-xs text-gray-500 mt-1">
                  Unlock: {badge.criteria}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* Share Dialog Modal */}
      {showShareDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs flex flex-col items-center">
            <div className="mb-4">
              <div className="flex items-center justify-center mb-2">
                <IconComponent className="w-10 h-10 text-purple-600" />
              </div>
              <div className="text-lg font-bold text-purple-700 text-center">Share your badge!</div>
              <div className="text-sm text-gray-600 text-center mt-1">{badge.name}</div>
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg mb-2 transition"
              onClick={() => handleShare('twitter')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 5.924c-.793.352-1.646.59-2.54.698a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.485 0-4.5 2.014-4.5 4.5 0 .353.04.697.116 1.027C7.728 9.37 4.1 7.575 1.67 4.905c-.387.664-.61 1.437-.61 2.26 0 1.56.795 2.936 2.005 3.744a4.48 4.48 0 0 1-2.037-.563v.057c0 2.18 1.55 4.002 3.604 4.417-.377.102-.775.157-1.186.157-.29 0-.57-.028-.844-.08.57 1.78 2.22 3.075 4.18 3.11A8.98 8.98 0 0 1 2 19.54a12.67 12.67 0 0 0 6.88 2.017c8.26 0 12.78-6.84 12.78-12.78 0-.195-.004-.39-.013-.583A9.22 9.22 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.697z"/></svg>
              Share on X
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg mb-2 transition"
              onClick={() => handleShare('linkedin')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.28h-3v-5.604c0-1.337-.025-3.063-1.867-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2 3.6 4.59v5.606z"/></svg>
              Share on LinkedIn
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
              onClick={() => handleShare('copy')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline"
              onClick={() => setShowShareDialog(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AchievementBadge; 