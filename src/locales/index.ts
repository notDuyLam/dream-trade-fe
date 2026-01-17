import type { Language } from '@/contexts/LanguageContext';
import { en } from './en';
import { vi } from './vi';
import { ja } from './ja';
import { ko } from './ko';

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

export { en, vi, ja, ko };
