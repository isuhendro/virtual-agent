'use client';

import { createContext, useContext } from 'react';

interface ThemeContextType {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: Partial<ThemeContextType>;
}

/**
 * Theme Provider Component
 * Provides theme configuration via React Context
 */
export default function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const defaultTheme: ThemeContextType = {
    primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#007bff',
    secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || '#6c757d',
    backgroundColor: process.env.NEXT_PUBLIC_BACKGROUND_COLOR || '#ffffff',
    textPrimary: process.env.NEXT_PUBLIC_TEXT_PRIMARY || '#1e293b',
    textSecondary: process.env.NEXT_PUBLIC_TEXT_SECONDARY || '#64748b',
    textMuted: process.env.NEXT_PUBLIC_TEXT_MUTED || '#94a3b8',
    textInverse: process.env.NEXT_PUBLIC_TEXT_INVERSE || '#ffffff',
    ...theme,
  };

  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
}
