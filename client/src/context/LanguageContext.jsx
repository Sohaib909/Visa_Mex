import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('ES');

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && (savedLanguage === 'EN' || savedLanguage === 'ES')) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedLanguage', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (languageCode) => {
    if (languageCode === 'EN' || languageCode === 'ES') {
      setCurrentLanguage(languageCode);
    }
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let translation = translations[currentLanguage];
    
    for (const k of keys) {
      translation = translation?.[k];
    }
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${currentLanguage}`);
      return key;
    }

    // Replace parameters in translation
    let result = translation;
    Object.keys(params).forEach(param => {
      result = result.replace(`{{${param}}}`, params[param]);
    });

    return result;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    isSpanish: currentLanguage === 'ES',
    isEnglish: currentLanguage === 'EN'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 