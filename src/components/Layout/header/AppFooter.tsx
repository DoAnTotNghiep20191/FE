import { useTranslation } from 'react-i18next';
import {
  InstagramWhite,
  LinkedInWhite,
  LogoDesktop,
  LogoTwitter,
  LogoFooter,
} from 'src/assets/icons';
import { PATHS } from 'src/constants/paths';

const AppFooter = () => {
  const { t } = useTranslation();

  const listMenu = [
    {
      text: 'footer.contactUs',
      link: PATHS.contactUs,
    },
    {
      text: 'footer.termsOfUse',
      link: PATHS.Term,
    },
    {
      text: 'footer.FAQs',
      link: PATHS.faqs,
    },
    {
      text: 'footer.privacyPolicy',
      link: PATHS.Privacy,
    },
    {
      text: 'footer.quickStartGuide',
      link: PATHS.QuickGuide,
    },
    {
      text: 'footer.refundPolicy',
      link: PATHS.RefundPolicy,
      disabled: true,
    },
  ];

  return (
    <div className="bg-white shadow-custom max-md:hidden">
      <div className="container-ticket p-[24px] flex items-center justify-between">
        <div>
          <div className="flex gap-4">
            <img src={LogoDesktop} alt="frac logo" width={60} height={60} />
            <img src={LogoFooter} />
          </div>
          <p className="text-black1 pt-[16px]">{t('footer.followUs')}</p>
          <div className="flex gap-6 pt-[4px]">
            <a target="__blank" href="https://www.linkedin.com/company/mereo-xyz">
              <LinkedInWhite />
            </a>
            <a target="__blank" href="https://twitter.com/mereo_xyz">
              <img src={LogoTwitter} alt="X" />
            </a>
            <a target="__blank" href="https://www.instagram.com/mereo_xyz">
              <InstagramWhite />
            </a>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 grid-flow-row gap-x-24 gap-y-3">
            {listMenu.map((item, index) =>
              !item.disabled ? (
                <a key={index} className="text-black1" href={item.link}>
                  {t(item.text)}
                </a>
              ) : (
                <span key={index}>{t(item.text)}</span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppFooter;
