/**
 * Context Providers for Laser Safety LMS
 * 
 * This module exports all React context providers for global state management:
 * - ProgressContext - Course and module progress tracking
 * - KnowledgeGraphContext - Knowledge graph access and management
 * - UserContext - User profile, auth, and preferences
 * - ModuleContext - Current module navigation and state
 * - AssessmentContext - Quiz and assessment state
 */

// Progress Context
export { 
  ProgressProvider, 
  useProgress 
} from './ProgressContext';

// Knowledge Graph Context
export { 
  KnowledgeGraphProvider, 
  useKnowledgeGraphContext 
} from './KnowledgeGraphContext';

// User Context
export { 
  UserProvider, 
  useUser 
} from './UserContext';

// Module Context
export { 
  ModuleProvider, 
  useModule 
} from './ModuleContext';

// Assessment Context
export { 
  AssessmentProvider, 
  useAssessment 
} from './AssessmentContext';

// Combined Provider for easy setup
'use client';

import { ReactNode } from 'react';
import { ProgressProvider } from './ProgressContext';
import { KnowledgeGraphProvider } from './KnowledgeGraphContext';
import { UserProvider } from './UserContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Combined provider that wraps the application with all global contexts
 * 
 * @example
 * ```tsx
 * function RootLayout({ children }: { children: ReactNode }) {
 *   return (
 *     <html>
 *       <body>
 *         <AppProviders>
 *           {children}
 *         </AppProviders>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <UserProvider>
      <ProgressProvider>
        <KnowledgeGraphProvider>
          {children}
        </KnowledgeGraphProvider>
      </ProgressProvider>
    </UserProvider>
  );
}
