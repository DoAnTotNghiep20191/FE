import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import koKr from 'antd/locale/ko_KR';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import 'dayjs/locale/en';

interface Props {
  children: any;
}

export const LANGUAGE_CODE = {
  ENGLISH: 'en', // English
  KOREAN: 'ko', // Korean
};

const switchLanguage = (language: string) => {
  switch (language) {
    case LANGUAGE_CODE.ENGLISH:
      return enUS;
    case LANGUAGE_CODE.KOREAN:
      return koKr;
    default:
      return enUS;
  }
};

const LocaleProviderComponent: React.FC<Props> = ({ children }) => {
  const { i18n } = useTranslation();

  const [locale, setLocale] = useState(switchLanguage(i18n.resolvedLanguage as any));

  useEffect(() => {
    setLocale(switchLanguage(i18n.resolvedLanguage as any));
  }, [i18n.resolvedLanguage]);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          fontFamily: 'Roboto',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default LocaleProviderComponent;
