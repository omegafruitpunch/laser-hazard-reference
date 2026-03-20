/**
 * Page and Component Transition Helpers
 * 
 * Utilities for implementing smooth transitions between pages and components.
 */

import { useReducedMotion } from 'framer-motion';

/**
 * Hook to check if animations should be disabled
 */
export function useShouldAnimate(): boolean {
  // In a real implementation, this would check user preferences
  // For now, just check for reduced motion preference
  if (typeof window === 'undefined') return false;
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return !prefersReducedMotion;
}

/**
 * Get transition props based on user preferences
 */
export function getTransitionProps(animate: boolean = true) {
  const shouldAnimate = typeof window !== 'undefined' 
    ? !window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  if (!shouldAnimate || !animate) {
    return {
      initial: false,
      animate: false,
      exit: false,
    };
  }
  
  return {};
}

/**
 * Page transition wrapper component props
 */
export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Get AnimatePresence props with reduced motion support
 */
export function getAnimatePresenceProps() {
  const shouldAnimate = typeof window !== 'undefined' 
    ? !window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  return {
    mode: 'wait' as const,
    initial: shouldAnimate,
    onExitComplete: () => {
      // Scroll to top on page exit
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    },
  };
}

/**
 * Stagger delay calculator
 */
export function getStaggerDelay(index: number, baseDelay: number = 0.05): number {
  return index * baseDelay;
}

/**
 * Duration calculator for list animations
 */
export function getListAnimationDuration(itemCount: number, maxDuration: number = 1): number {
  return Math.min(itemCount * 0.05 + 0.3, maxDuration);
}

/**
 * Easing functions
 */
export const easing = {
  // Standard easing
  standard: [0.4, 0, 0.2, 1],
  // Decelerate (entry animations)
  decelerate: [0, 0, 0.2, 1],
  // Accelerate (exit animations)
  accelerate: [0.4, 0, 1, 1],
  // Sharp (quick movements)
  sharp: [0.4, 0, 0.6, 1],
  // Bounce
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const;

/**
 * Duration presets (in seconds)
 */
export const duration = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

/**
 * Spring presets
 */
export const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  default: { type: 'spring' as const, stiffness: 300, damping: 30 },
  stiff: { type: 'spring' as const, stiffness: 500, damping: 30 },
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 10 },
} as const;
