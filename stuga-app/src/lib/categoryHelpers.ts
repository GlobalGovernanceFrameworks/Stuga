export const CATEGORY_LABELS: Record<string, string> = {
  'mat': 'Mat 🥪',
  'värme': 'Värme 🔥',
  'verktyg': 'Verktyg 🔨',
  'transport': 'Transport 🚗',
  'kunskap': 'Kunskap 📚',
  'boende': 'Boende 🏠',
  'första_hjälpen': 'Första hjälpen ⚕️',
  'annat': 'Annat'
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}
