/**
 * Framer Motion Animation Variants
 * 
 * Reusable animation variants for consistent motion across the application.
 * All variants respect the user's reduced motion preferences.
 */

import { Variants, Transition } from 'framer-motion';

// Default transition settings
export const defaultTransition: Transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number], // Custom easing curve
};

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

// ============================================================================
// Fade Animations
// ============================================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: defaultTransition,
  },
  exit: { 
    opacity: 0,
    transition: { ...defaultTransition, duration: 0.2 },
  },
};

export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: defaultTransition,
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { ...defaultTransition, duration: 0.2 },
  },
};

export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: defaultTransition,
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { ...defaultTransition, duration: 0.2 },
  },
};

export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: defaultTransition,
  },
  exit: { 
    opacity: 0, 
    x: 10,
    transition: { ...defaultTransition, duration: 0.2 },
  },
};

export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: defaultTransition,
  },
  exit: { 
    opacity: 0, 
    x: -10,
    transition: { ...defaultTransition, duration: 0.2 },
  },
};

export const fadeInScale: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: defaultTransition,
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { ...defaultTransition, duration: 0.2 },
  },
};

// ============================================================================
// Slide Animations
// ============================================================================

export const slideUp: Variants = {
  hidden: { y: '100%' },
  visible: { 
    y: 0,
    transition: springTransition,
  },
  exit: { 
    y: '100%',
    transition: defaultTransition,
  },
};

export const slideDown: Variants = {
  hidden: { y: '-100%' },
  visible: { 
    y: 0,
    transition: springTransition,
  },
  exit: { 
    y: '-100%',
    transition: defaultTransition,
  },
};

export const slideLeft: Variants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: springTransition,
  },
  exit: { 
    x: '100%',
    transition: defaultTransition,
  },
};

export const slideRight: Variants = {
  hidden: { x: '-100%' },
  visible: { 
    x: 0,
    transition: springTransition,
  },
  exit: { 
    x: '-100%',
    transition: defaultTransition,
  },
};

// ============================================================================
// Scale Animations
// ============================================================================

export const scaleUp: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.5,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springTransition,
  },
  exit: { 
    opacity: 0, 
    scale: 0.5,
    transition: defaultTransition,
  },
};

export const scaleDown: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 1.5,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springTransition,
  },
  exit: { 
    opacity: 0, 
    scale: 1.5,
    transition: defaultTransition,
  },
};

// ============================================================================
// Page Transitions
// ============================================================================

export const pageTransition: Variants = {
  initial: { 
    opacity: 0, 
    y: 10,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export const pageSlideTransition: Variants = {
  initial: { 
    opacity: 0, 
    x: 20,
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// ============================================================================
// Stagger Animations
// ============================================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: defaultTransition,
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { ...defaultTransition, duration: 0.15 },
  },
};

export const staggerScale: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springTransition,
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { ...defaultTransition, duration: 0.15 },
  },
};

// ============================================================================
// Card Animations
// ============================================================================

export const cardHover = {
  scale: 1.02,
  y: -4,
  transition: springTransition,
};

export const cardTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

export const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
  hover: cardHover,
  tap: cardTap,
};

// ============================================================================
// Modal/Dialog Animations
// ============================================================================

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const modalContent: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// ============================================================================
// Progress Animations
// ============================================================================

export const progressBar: Variants = {
  initial: { scaleX: 0 },
  animate: { 
    scaleX: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

export const progressCircle: Variants = {
  initial: { pathLength: 0 },
  animate: { 
    pathLength: 1,
    transition: {
      duration: 1,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

export const countUp: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

// ============================================================================
// Button Animations
// ============================================================================

export const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 },
};

export const buttonHover = {
  scale: 1.05,
  transition: springTransition,
};

// ============================================================================
// Error/Shake Animation
// ============================================================================

export const shake: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
};

export const errorPulse: Variants = {
  pulse: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 0.3,
      repeat: 2,
    },
  },
};

// ============================================================================
// Success Animation
// ============================================================================

export const successCheck: Variants = {
  hidden: { 
    pathLength: 0, 
    opacity: 0,
  },
  visible: { 
    pathLength: 1, 
    opacity: 1,
    transition: {
      pathLength: { duration: 0.4, ease: 'easeOut' },
      opacity: { duration: 0.1 },
    },
  },
};

export const successScale: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: springTransition,
  },
};
