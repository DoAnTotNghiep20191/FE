import { useTranslation } from 'react-i18next';
import './style.scss';
const ComingSoon = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex coming-soon flex-col items-center justify-center pt-[60px] text-black">
        <p className="text-[64px] uppercase text-center">{t('comingSoon.title')}</p>
        <p className="text-center">{t('comingSoon.description')}</p>
      </div>
    </>
  );
};

export default ComingSoon;
