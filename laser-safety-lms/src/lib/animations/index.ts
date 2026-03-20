/**
 * Animation Utilities
 * 
 * Reusable Framer Motion variants and transition helpers for the LMS.
 * All animations respect user preferences for reduced motion.
 * 
 * @example
 * ```tsx
 * import { motion } from 'framer-motion';
 * import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
 * 
 * function MyComponent() {
 *   return (
 *     <motion.div variants={staggerContainer} initial="hidden" animate="visible">
 *       {items.map((item, i) => (
 *         <motion.div key={i} variants={staggerItem}>
 *           {item}
 *         </motion.div>
 *       ))}
 *     </motion.div>
 *   );
 * }
 * ```
 */

// Variants
export {
  // Fade animations
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  fadeInScale,
  
  // Slide animations
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  
  // Scale animations
  scaleUp,
  scaleDown,
  
  // Page transitions
  pageTransition,
  pageSlideTransition,
  
  // Stagger animations
  staggerContainer,
  staggerItem,
  staggerScale,
  
  // Component animations
  cardHover,
  cardTap,
  cardVariants,
  
  // Modal animations
  modalOverlay,
  modalContent,
  
  // Progress animations
  progressBar,
  progressCircle,
  countUp,
  
  // Button animations
  buttonTap,
  buttonHover,
  
  // Feedback animations
  shake,
  errorPulse,
  successCheck,
  successScale,
  
  // Transitions
  defaultTransition,
  springTransition,
} from './variants';

// Transition helpers
export {
  useShouldAnimate,
  getTransitionProps,
  getAnimatePresenceProps,
  getStaggerDelay,
  getListAnimationDuration,
  easing,
  duration,
  springs,
} from './transitions';

// Types
export type { PageTransitionProps } from './transitions';
