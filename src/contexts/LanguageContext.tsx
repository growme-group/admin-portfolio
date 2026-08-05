import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'km' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (km: string, en: string) => string;
  fontClass: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('kw_admin_lang') as Language) || 'km';
  });

  useEffect(() => {
    localStorage.setItem('kw_admin_lang', language);
  }, [language]);

  const t = (km: string, en: string) => (language === 'km' ? km : en);
  const fontClass = language === 'km' ? 'font-km' : 'font-sans';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, fontClass }}>
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
