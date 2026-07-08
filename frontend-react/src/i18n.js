import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationIT from './locales/it.json';
import translationEN from './locales/en.json';
import translationRU from './locales/ru.json';
import translationRO from './locales/ro.json';

const resources = {
  it: { translation: translationIT },
  en: { translation: translationEN },
  ru: { translation: translationRU },
  ro: { translation: translationRO }
};
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'it',
    /* 👇 AGGIUNGIAMO QUESTE RIGHE PER EVITARE I CONFLITTI DI RILEVAMENTO */
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'] // Salva la scelta dell'utente così al refresh non si perde
    },
    supportedLngs: ['it', 'en', 'ru', 'ro'], // Specifichiamo i codici esatti
    nonExplicitSupportedLngs: true, // Converte "it-IT" o "ru-RU" nei tuoi codici "it" e "ru"
    interpolation: {
      escapeValue: false

    }
  });

export default i18n;