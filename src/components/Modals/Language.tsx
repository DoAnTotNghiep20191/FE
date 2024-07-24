import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonContained from '../Buttons/ButtonContained';
import { LANGUAGE_CODE } from '../Locale-provider';
interface ILanguageModal {
  onSwitchLanguage: (lang: string) => void;
}
const LanguageModal = ({ onSwitchLanguage }: ILanguageModal) => {
  const { i18n, t } = useTranslation();
  const [lang, setLang] = useState(i18n?.resolvedLanguage);
  const listLang = [
    {
      label: t('header.language.english'),
      value: LANGUAGE_CODE.ENGLISH,
    },
    {
      label: t('header.language.korean'),
      value: LANGUAGE_CODE.KOREAN,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-[24px] pb-[10px]">{t('header.language.title')}</p>
      <p className="text-[14px]">{t('header.language.selectLanguage')}</p>
      <div className="w-[261px] pt-[40px] pb-[100px]">
        {listLang?.map((item) => {
          const active = item?.value === lang;
          return (
            <div
              key={item?.value}
              className={`flex p-[14px] rounded-[10px] border border-solid items-center justify-between mb-[10px] ${
                active ? 'border-blueDarker bg-blueLighter' : 'border-primary'
              } relative`}
              onClick={() => setLang(item?.value)}
            >
              <p className={`text-16px ${active ? 'text-blueDarker' : 'text-primary'}`}>
                {item?.label}
              </p>
            </div>
          );
        })}
      </div>
      <ButtonContained
        buttonType="type1"
        className="w-[212px]"
        onClick={() => onSwitchLanguage(lang)}
      >
        {t('header.language.switchLanguage')}
      </ButtonContained>
    </div>
  );
};

export default LanguageModal;
