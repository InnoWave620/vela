/**
 * Vela Luxury Design System - Colors
 * STRICT RULE: Only HEX codes are allowed.
 */
export const Colors = {
  // Primary Palette
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceElevated: '#FFFFFF',
  accent: '#89CFF0', // Luxurious Light Blue
  accentLight: '#E8F5FD',
  accentDark: '#5BA9D6',

  // Typography
  textPrimary: '#000000',
  textSecondary: '#4A4A4A',
  textMuted: '#8E8E93',
  textOnAccent: '#FFFFFF',

  // Borders & Dividers
  border: '#E5E7EB',
  borderLight: '#F0F2F5',
  borderFocus: '#89CFF0',

  // Status & Badges
  goldAccent: '#C5A059', // Exclusive club subtle gold
  goldLight: '#F9F5EB',
  success: '#10B981',
  successLight: '#ECFDF5',
  error: '#EF4444',
  errorLight: '#FEF2F2',

  // Shadows
  shadow: '#000000',
  cardShadow: '#1A1A1A',

  // Interactive
  buttonDisabled: '#E5E7EB',
  inputBackground: '#F8F9FA',
  badgeBackground: '#F1F5F9',
  white: '#FFFFFF',
  black: '#000000',
  overlay: '#00000099',
  videoBadge: '#000000CC',
} as const;

export const COLORS = Colors;

export type ColorKey = keyof typeof Colors;
