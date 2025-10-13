import { useEffect } from 'react';

/**
 * Apply brand colors from environment variables to CSS variables
 */
export function applyBrandColors(): void {
  const root = document.documentElement;
  
  // Apply environment variable overrides if available
  const brandPrimary = import.meta.env.VITE_BRAND_PRIMARY;
  const brandAccent = import.meta.env.VITE_BRAND_ACCENT;
  const brandBg = import.meta.env.VITE_BRAND_BG;
  const brandText = import.meta.env.VITE_BRAND_TEXT;
  
  if (brandPrimary) root.style.setProperty('--brand-primary', brandPrimary);
  if (brandAccent) root.style.setProperty('--brand-accent', brandAccent);
  if (brandBg) root.style.setProperty('--brand-bg', brandBg);
  if (brandText) root.style.setProperty('--brand-text', brandText);
}

/**
 * Hook to initialize theme on app load
 */
export function useTheme(): void {
  useEffect(() => {
    // Apply environment overrides
    applyBrandColors();
  }, []);
}
