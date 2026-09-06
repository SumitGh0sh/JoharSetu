'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, Translations, getTranslation, translations } from '../lib/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  supportedLanguages: Array<{ code: LanguageCode; label: string; nativeName: string; region: string }>;
}

const SUPPORTED_LANGUAGES: Array<{ code: LanguageCode; label: string; nativeName: string; region: string }> = [
  { code: 'en', label: 'English', nativeName: 'English', region: 'Global' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', region: 'Jharkhand State Official' },
  { code: 'sat', label: 'Santhali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', region: 'Santhal Pargana' },
  { code: 'mun', label: 'Mundari', nativeName: 'मुंडारी', region: 'Chotanagpur Plateau' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('joharsetu_lang') as LanguageCode;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'sat' || saved === 'mun')) {
        setLanguageState(saved);
      }
    } catch {}
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('joharsetu_lang', lang);
    } catch {}
  };

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: 'en',
      setLanguage: () => {},
      t: translations.en,
      supportedLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
}
