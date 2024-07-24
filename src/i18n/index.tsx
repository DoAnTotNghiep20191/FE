import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import kr from './languages/kr.json';
import en from './languages/en.json';
import campaignEn from './languages/campaign-en.json';
import campaignKr from './languages/campaign-kr.json';

const options = {
  order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
  lookupQuerystring: 'lng',
};
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: options,
    load: 'languageOnly',
    resources: {
      en: { translations: en, campaigns: campaignEn },
      ko: { translations: kr, campaigns: campaignKr },
    },
    fallbackLng: 'en',
    defaultNS: 'translations',
    keySeparator: false, // we use content as keys
    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
