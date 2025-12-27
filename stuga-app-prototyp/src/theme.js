// Stuga Design System
// Based on UI_SPECIFICATION.md

export const colors = {
  // Primary
  forestGreen: '#2D5016',
  warmOrange: '#FF6B35',
  
  // Feedback
  successGreen: '#6BCF7F',
  warningAmber: '#FFA500',
  dangerRed: '#C1121F',
  
  // Neutrals
  background: '#F5F3F0',
  textDark: '#1A1A1A',
  textMedium: '#666666',
  textLight: '#999999',
  border: '#E0E0E0',
  
  // Status
  onlineGreen: '#4CAF50',
  meshYellow: '#FFB300',
  offlineRed: '#F44336',
  
  // Mesh dots
  directBlue: '#2196F3',
  viaGray: '#BDBDBD',
  
  // White
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textDark,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
    color: colors.textDark,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal',
    color: colors.textMedium,
  },
  button: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
};
