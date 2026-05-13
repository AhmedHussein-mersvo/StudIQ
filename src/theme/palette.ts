export type ColorScheme = 'light' | 'dark';

export type AppPalette = {
  gradient: [string, string];
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textSubtle: string;
  cardBg: string;
  cardBorder: string;
  rowBg: string;
  rowBorder: string;
  tabBarBg: string;
  tabBarBorder: string;
  tabActive: string;
  tabInactive: string;
  headerChipBg: string;
  headerChipBorder: string;
  onHeaderChip: string;
  seeAll: string;
  uploadCardGradient: [string, string];
  uploadCardBorder: string;
  uploadTitle: string;
  uploadSubtitle: string;
  buttonGradient: [string, string];
  eyebrow: string;
  pointNumber: string;
  optionDefaultBorder: string;
  optionDefaultBg: string;
  optionDefaultIcon: string;
  optionDefaultText: string;
  chevron: string;
  carouselFileName: string;
};

export function getPalette(scheme: ColorScheme): AppPalette {
  if (scheme === 'dark') {
    return {
      gradient: ['#030419', '#030518'],
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255,255,255,0.88)',
      textMuted: 'rgba(255,255,255,0.65)',
      textSubtle: 'rgba(255,255,255,0.5)',
      cardBg: 'rgba(255,255,255,0.1)',
      cardBorder: 'rgba(255,255,255,0.1)',
      rowBg: 'rgba(0,0,0,0.2)',
      rowBorder: 'rgba(255,255,255,0.1)',
      tabBarBg: '#1A1F3A',
      tabBarBorder: 'rgba(255,255,255,0.14)',
      tabActive: '#A78BFA',
      tabInactive: 'rgba(255,255,255,0.45)',
      headerChipBg: '#FFFFFF',
      headerChipBorder: 'rgba(255,255,255,0.12)',
      onHeaderChip: '#0F172A',
      seeAll: '#C4B5FD',
      uploadCardGradient: [
        'rgba(124, 58, 237, 0.26)',
        'rgba(59, 130, 246, 0.16)',
      ],
      uploadCardBorder: 'rgba(255,255,255,0.1)',
      uploadTitle: '#FFFFFF',
      uploadSubtitle: 'rgba(255,255,255,0.7)',
      buttonGradient: ['#7C3AED', '#3B82F6'],
      eyebrow: '#DDD6FE',
      pointNumber: '#93C5FD',
      optionDefaultBorder: 'rgba(255,255,255,0.1)',
      optionDefaultBg: 'rgba(255,255,255,0.05)',
      optionDefaultIcon: 'rgba(255,255,255,0.55)',
      optionDefaultText: 'rgba(255,255,255,0.7)',
      chevron: 'rgba(255,255,255,0.45)',
      carouselFileName: 'rgba(255,255,255,0.9)',
    };
  }

  return {
    gradient: ['#F8FAFC', '#E2E8F0'],
    textPrimary: '#0F172A',
    textSecondary: 'rgba(15,23,42,0.82)',
    textMuted: 'rgba(15,23,42,0.58)',
    textSubtle: 'rgba(15,23,42,0.45)',
    cardBg: 'rgba(255,255,255,0.85)',
    cardBorder: 'rgba(15,23,42,0.1)',
    rowBg: 'rgba(241,245,249,0.95)',
    rowBorder: 'rgba(15,23,42,0.08)',
    tabBarBg: '#FFFFFF',
    tabBarBorder: 'rgba(15,23,42,0.1)',
    tabActive: '#6D28D9',
    tabInactive: 'rgba(15,23,42,0.45)',
    headerChipBg: '#FFFFFF',
    headerChipBorder: 'rgba(15,23,42,0.12)',
    onHeaderChip: '#0F172A',
    seeAll: '#5B21B6',
    uploadCardGradient: [
      'rgba(124, 58, 237, 0.14)',
      'rgba(59, 130, 246, 0.1)',
    ],
    uploadCardBorder: 'rgba(15,23,42,0.1)',
    uploadTitle: '#0F172A',
    uploadSubtitle: 'rgba(15,23,42,0.62)',
    buttonGradient: ['#7C3AED', '#3B82F6'],
    eyebrow: '#5B21B6',
    pointNumber: '#2563EB',
    optionDefaultBorder: 'rgba(15,23,42,0.12)',
    optionDefaultBg: 'rgba(255,255,255,0.7)',
    optionDefaultIcon: 'rgba(15,23,42,0.45)',
    optionDefaultText: 'rgba(15,23,42,0.72)',
    chevron: 'rgba(15,23,42,0.35)',
    carouselFileName: 'rgba(15,23,42,0.88)',
  };
}
