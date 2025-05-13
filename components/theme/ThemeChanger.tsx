"use client";

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

/**
 * ThemeChanger component dynamically updates CSS variables when the theme changes
 * This ensures that all terminal green colors are replaced with saffron colors in light mode
 */
export function ThemeChanger() {
  const { theme } = useTheme();
  
  useEffect(() => {
    const updateThemeColors = () => {
      const isLightTheme = theme === 'light';
      
      // CSS properties to update based on theme
      const cssProperties = {
        // Terminal colors
        '--terminal-green': isLightTheme ? '243, 156, 18' : '104, 255, 104',
        '--terminal-green-dark': isLightTheme ? '230, 126, 34' : '0, 153, 0',
      };
      
      // Update CSS variables
      Object.entries(cssProperties).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });
    };
    
    // Run when component mounts and when theme changes
    updateThemeColors();
  }, [theme]);
  
  // This is a utility component that doesn't render anything visible
  return null;
}
