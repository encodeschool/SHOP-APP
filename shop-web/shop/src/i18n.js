import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./i18n/en.json";
import ru from "./i18n/ru.json";
import uz from "./i18n/uz.json";
import lv from "./i18n/lv.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { 
      en: { translation: en }, 
      ru: { translation: ru }, 
      uz: { translation: uz },
      lv: { translation: lv } 
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
