import type { Language } from '@/contexts/LanguageContext';
import { en } from './en';
import { ja } from './ja';
import { ko } from './ko';
import { vi } from './vi';

const translations = {
  en,
  vi,
  ja,
  ko,
};

export function getTranslation(lang: Language, key: string): string {
  const translation = translations[lang];
  // @ts-expect-error - Dynamic key access
  return translation[key] || key;
}

export { en, ja, ko, vi };
