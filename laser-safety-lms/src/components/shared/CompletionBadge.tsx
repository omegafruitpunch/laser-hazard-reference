"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Star, 
  Trophy, 
  Medal, 
  Crown, 
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  X
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type BadgeTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";
export type BadgeType = "completion" | "mastery" | "streak" | "achievement" | "certification";

export interface BadgeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  type: BadgeType;
  courseId?: string;
  moduleId?: string;
  earnedAt?: Date;
  criteria: {
    minScore?: number;
    perfectScore?: boolean;
    timeLimit?: number;
    streakDays?: number;
    completionRequired?: boolean;
  };
}

export interface CompletionBadgeProps {
  badge: BadgeConfig;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  onShare?: () => void;
  onDownload?: () => void;
  className?: string;
}

export interface BadgeCollectionProps {
  badges: BadgeConfig[];
  title?: string;
  showLocked?: boolean;
  className?: string;
}

// ============================================================================
// Tier Configuration
// ============================================================================

const TIER_CONFIG: Record<BadgeTier, {
  label: string;
  color: string;
  gradient: string;
  icon: React.ReactNode;
  glow: string;
}> = {
  bronze: {
    label: "Bronze",
    color: "text-amber-600",
    gradient: "from-amber-700 to-amber-500",
    icon: <Medal className="w-full h-full" />,
    glow: "shadow-amber-500/20",
  },
  silver: {
    label: "Silver",
    color: "text-slate-300",
    gradient: "from-slate-400 to-slate-200",
    icon: <Award className="w-full h-full" />,
    glow: "shadow-slate-400/20",
  },
  gold: {
    label: "Gold",
    color: "text-yellow-400",
    gradient: "from-yellow-500 to-yellow-300",
    icon: <Trophy className="w-full h-full" />,
    glow: "shadow-yellow-400/30",
  },
  platinum: {
    label: "Platinum",
    color: "text-cyan-300",
    gradient: "from-cyan-400 to-purple-400",
    icon: <Crown className="w-full h-full" />,
    glow: "shadow-cyan-400/30",
  },
  diamond: {
    label: "Diamond",
    color: "text-violet-300",
    gradient: "from-violet-400 via-fuchsia-400 to-cyan-400",
    icon: <Sparkles className="w-full h-full" />,
    glow: "shadow-violet-400/40",
  },
};

const SIZE_CONFIG = {
  sm: { badge: "w-12 h-12", icon: "w-6 h-6", text: "text-xs" },
  md: { badge: "w-16 h-16", icon: "w-8 h-8", text: "text-sm" },
  lg: { badge: "w-24 h-24", icon: "w-12 h-12", text: "text-base" },
  xl: { badge: "w-32 h-32", icon: "w-16 h-16", text: "text-lg" },
};

// ============================================================================
// Main Component
// ============================================================================

export function CompletionBadge({
  badge,
  showDetails = false,
  size = "md",
  animated = true,
  onShare,
  onDownload,
  className,
}: CompletionBadgeProps) {
  const [showModal, setShowModal] = useState(false);
  const tierConfig = TIER_CONFIG[badge.tier];
  const sizeConfig = SIZE_CONFIG[size];
  const isEarned = !!badge.earnedAt;

  const BadgeIcon = () => (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full",
        "bg-gradient-to-br",
        tierConfig.gradient,
        sizeConfig.badge,
        tierConfig.glow,
        animated && isEarned && "animate-pulse-slow",
        !isEarned && "opacity-40 grayscale",
        className
      )}
    >
      <div className={cn("text-white", sizeConfig.icon)}>
        {tierConfig.icon}
      </div>
      
      {/* Shine effect */}
      {isEarned && animated && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-shine" />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Badge Display */}
      <div
        className={cn(
          "flex flex-col items-center gap-2 cursor-pointer transition-transform hover:scale-105",
          !isEarned && "cursor-not-allowed"
        )}
        onClick={() => isEarned && (showDetails ? setShowModal(true) : null)}
      >
        <BadgeIcon />
        <div className="text-center">
          <div className={cn("font-semibold text-foreground", sizeConfig.text)}>
            {badge.name}
          </div>
          <Badge variant="outline" className={cn("text-xs mt-1", tierConfig.color)}>
            {tierConfig.label}
          </Badge>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <BadgeModal
          badge={badge}
          tierConfig={tierConfig}
          onClose={() => setShowModal(false)}
          onShare={onShare}
          onDownload={onDownload}
        />
      )}
    </>
  );
}

// ============================================================================
// Badge Modal
// ============================================================================

interface BadgeModalProps {
  badge: BadgeConfig;
  tierConfig: typeof TIER_CONFIG[BadgeTier];
  onClose: () => void;
  onShare?: () => void;
  onDownload?: () => void;
}

function BadgeModal({ badge, tierConfig, onClose, onShare, onDownload }: BadgeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-card rounded-2xl border border-border/50 shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge Display */}
        <div className="flex flex-col items-center text-center">
          <CompletionBadge badge={badge} size="xl" animated={false} />
          
          <h2 className="text-2xl font-bold mt-6 text-foreground">{badge.name}</h2>
          <p className="text-muted-foreground mt-2">{badge.description}</p>
          
          <Badge className={cn("mt-4", tierConfig.color)}>
            {tierConfig.label} Tier
          </Badge>

          {/* Earned Info */}
          {badge.earnedAt && (
            <div className="mt-6 p-4 bg-muted rounded-lg w-full">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Earned on {badge.earnedAt.toLocaleDateString()}</span>
              </div>
              <CriteriaDisplay criteria={badge.criteria} />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            {onShare && (
              <Button variant="outline" onClick={onShare} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            )}
            {onDownload && (
              <Button onClick={onDownload} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Criteria Display
// ============================================================================

function CriteriaDisplay({ criteria }: { criteria: BadgeConfig["criteria"] }) {
  const items = [];
  
  if (criteria.minScore) {
    items.push(`Score ${criteria.minScore}% or higher`);
  }
  if (criteria.perfectScore) {
    items.push("Perfect score (100%)");
  }
  if (criteria.timeLimit) {
    items.push(`Complete within ${criteria.timeLimit} minutes`);
  }
  if (criteria.streakDays) {
    items.push(`${criteria.streakDays} day study streak`);
  }
  if (criteria.completionRequired) {
    items.push("Complete all modules");
  }

  return (
    <div className="text-sm text-muted-foreground">
      <div className="font-medium mb-1">Requirements:</div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <Star className="w-3 h-3 text-amber-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// Badge Collection
// ============================================================================

export function BadgeCollection({
  badges,
  title = "Your Achievements",
  showLocked = true,
  className,
}: BadgeCollectionProps) {
  const earnedBadges = badges.filter((b) => b.earnedAt);
  const lockedBadges = badges.filter((b) => !b.earnedAt);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          {title}
        </h2>
        <Badge variant="secondary">
          {earnedBadges.length} / {badges.length}
        </Badge>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {earnedBadges.map((badge) => (
            <CompletionBadge key={badge.id} badge={badge} showDetails />
          ))}
        </div>
      )}

      {/* Locked Badges */}
      {showLocked && lockedBadges.length > 0 && (
        <div className="pt-6 border-t border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Locked</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 opacity-50">
            {lockedBadges.map((badge) => (
              <CompletionBadge key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Badge Earned Celebration
// ============================================================================

export interface BadgeEarnedCelebrationProps {
  badge: BadgeConfig;
  onComplete?: () => void;
  className?: string;
}

export function BadgeEarnedCelebration({
  badge,
  onComplete,
  className,
}: BadgeEarnedCelebrationProps) {
  const tierConfig = TIER_CONFIG[badge.tier];

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/80", className)}>
      <div className="text-center animate-in zoom-in-95">
        {/* Celebration Animation */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-20">
            <div className={cn("w-48 h-48 rounded-full bg-gradient-to-br", tierConfig.gradient)} />
          </div>
          <div className="relative">
            <CompletionBadge badge={badge} size="xl" />
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-8 animate-in slide-in-from-bottom-4">
          Badge Earned!
        </h2>
        <p className="text-xl text-muted-foreground mt-2">{badge.name}</p>
        <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>

        <Button onClick={onComplete} className="mt-8">
          Continue
        </Button>
      </div>
    </div>
  );
}

export default CompletionBadge;
