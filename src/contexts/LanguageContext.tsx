import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Language = 'km' | 'en';

interface LanguageContextType {
  language: Language;
  lang: Language;
  setLanguage: (lang: Language) => void;
  toggleLang: () => void;
  t: (km: string, en: string) => string;
  fontClass: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('kw_admin_lang') as Language) || 'km';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kw_admin_lang', lang);
  };

  const toggleLang = useCallback(() => {
    setLanguageState((l) => {
      const next = l === 'km' ? 'en' : 'km';
      localStorage.setItem('kw_admin_lang', next);
      return next;
    });
  }, []);

  const t = useCallback((km: string, en: string) => (language === 'km' ? km : en), [language]);
  const fontClass = language === 'km' ? 'font-km' : 'font-sans';

  return (
    <LanguageContext.Provider value={{ language, lang: language, setLanguage, toggleLang, t, fontClass }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
