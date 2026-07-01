/**
 * Guter GeDANKE design system.
 *
 * Minimalistic, premium, soft, emotional — warm cream surfaces,
 * sage green as the primary voice, lavender and gold as gentle accents.
 */

export const palette = {
  sage: '#A8B8A1',
  sageDeep: '#8CA083',
  sageSoft: '#DCE4D7',
  lavender: '#CFC4E6',
  lavenderDeep: '#A99BC9',
  lavenderSoft: '#EBE6F5',
  cream: '#FAF8F3',
  gold: '#D8C38A',
  goldSoft: '#F0E6CC',
  charcoal: '#333333',
};

export interface Theme {
  dark: boolean;
  colors: {
    background: string;
    card: string;
    cardElevated: string;
    text: string;
    textSecondary: string;
    textFaint: string;
    primary: string;
    onPrimary: string;
    secondary: string;
    accent: string;
    border: string;
    chipBackground: string;
    chipSelected: string;
    chipTextSelected: string;
    tabBar: string;
    tabActive: string;
    tabInactive: string;
    danger: string;
    /** Watercolor blob tints */
    washSage: string;
    washLavender: string;
    washGold: string;
  };
}

export const lightTheme: Theme = {
  dark: false,
  colors: {
    background: palette.cream,
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    text: palette.charcoal,
    textSecondary: '#7C776C',
    textFaint: '#A8A396',
    primary: palette.sage,
    onPrimary: '#FFFFFF',
    secondary: palette.lavender,
    accent: palette.gold,
    border: 'rgba(51, 51, 51, 0.08)',
    chipBackground: '#FFFFFF',
    chipSelected: palette.sage,
    chipTextSelected: '#FFFFFF',
    tabBar: 'rgba(250, 248, 243, 0.94)',
    tabActive: palette.sageDeep,
    tabInactive: '#B4AFA2',
    danger: '#C08A7E',
    washSage: 'rgba(168, 184, 161, 0.35)',
    washLavender: 'rgba(207, 196, 230, 0.32)',
    washGold: 'rgba(216, 195, 138, 0.25)',
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    background: '#1F1E1A',
    card: '#2A2924',
    cardElevated: '#2F2E28',
    text: '#F1EEE6',
    textSecondary: '#B3AEA1',
    textFaint: '#807B6F',
    primary: palette.sage,
    onPrimary: '#23281F',
    secondary: palette.lavenderDeep,
    accent: palette.gold,
    border: 'rgba(241, 238, 230, 0.09)',
    chipBackground: '#2A2924',
    chipSelected: palette.sage,
    chipTextSelected: '#23281F',
    tabBar: 'rgba(31, 30, 26, 0.94)',
    tabActive: palette.sage,
    tabInactive: '#6E6A5F',
    danger: '#D8A196',
    washSage: 'rgba(168, 184, 161, 0.12)',
    washLavender: 'rgba(207, 196, 230, 0.10)',
    washGold: 'rgba(216, 195, 138, 0.08)',
  },
};

export const fonts = {
  /** Serif voice for thoughts and big headlines */
  serif: 'CormorantGaramond_600SemiBold',
  serifMedium: 'CormorantGaramond_500Medium',
  serifItalic: 'CormorantGaramond_500Medium_Italic',
  /** Sans voice for UI */
  sans: 'NunitoSans_400Regular',
  sansSemiBold: 'NunitoSans_600SemiBold',
  sansBold: 'NunitoSans_700Bold',
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  s: 12,
  m: 18,
  l: 26,
  pill: 999,
};

export const softShadow = {
  shadowColor: '#5B5546',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 20,
  elevation: 3,
} as const;

export const gentleShadow = {
  shadowColor: '#5B5546',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
} as const;
