import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DropDownIcon, QuestionIcon } from 'src/assets/icons';
import bookReadingIcon from 'src/assets/icons/common/book-reading-icon.svg';
import chatBubbleIcon from 'src/assets/icons/common/chat-bubble-icon.svg';
import definitionSearchBookIcon from 'src/assets/icons/common/definition-search-book-icon.svg';
import manualBookIcon from 'src/assets/icons/common/manual-book-icon.svg';
import taskListIcon from 'src/assets/icons/common/task-list-icon.svg';
import userMultipleIcon from 'src/assets/icons/common/user-multiple-icon.svg';
import NotificationModal from 'src/pages/event-detail/components/NotificationModal';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { EOrganizerType, TypeRole } from 'src/store/slices/user/types';
import OrganizerRegister from '../organizer-register';
import './styles.scss';
import { useHistory } from 'react-router-dom';
import { PATHS } from 'src/constants/paths';

const HelpSupport = () => {
  const [showDropDownHelp, setShowDropDownHelp] = useState(false);
  const [openOrganizerModal, setOpenOrganizerModal] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const userInfo = useAppSelector(getUserInfo);
  const history = useHistory();
  const { t } = useTranslation();
  const childItemsHelp = [
    ...(userInfo?.role !== TypeRole.ORGANIZER
      ? [
          {
            label: t('profile.becomeAnOrganizer'),
            icon: userMultipleIcon,
            action: () => setOpenOrganizerModal(true),
            disabled: userInfo?.organizerType === EOrganizerType.REQUESTED,
          },
        ]
      : []),
    {
      label: t('footer.contactUs'),
      icon: chatBubbleIcon,
      action: () => history.push(PATHS.contactUs),
    },
    {
      label: t('footer.FAQs'),
      icon: manualBookIcon,
      action: () => history.push(PATHS.faqs),
    },
    {
      label: t('footer.quickStartGuide'),
      icon: manualBookIcon,
      action: () => history.push(PATHS.QuickGuide),
    },
    {
      label: t('footer.termsOfUse'),
      icon: taskListIcon,
      action: () => history.push(PATHS.Term),
    },
    {
      label: t('footer.privacyPolicy'),
      icon: bookReadingIcon,
      action: () => history.push(PATHS.Privacy),
    },
    {
      label: t('footer.refundPolicy'),
      icon: definitionSearchBookIcon,
    },
  ];

  const handleRegisterSuccess = () => {
    setIsRegisterSuccess(true);
  };

  return (
    <div
      className={`help-support-container bg-gray2 rounded-[10px] max-md:mx-[20px] mb-[44px] shadow-xl`}
      style={{ boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.25)' }}
    >
      <div className="flex flex-col items-center justify-center p-[16px]">
        <div className="flex justify-between items-center w-full cursor-pointer">
          <div className="flex">
            <QuestionIcon />
            <span className="ml-[16px]">{t('profile.help&support')}</span>
          </div>

          <DropDownIcon
            onClick={() => setShowDropDownHelp(!showDropDownHelp)}
            style={{
              cursor: 'pointer',
              transform: showDropDownHelp ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </div>
        {showDropDownHelp && <div className="divider" />}
        {showDropDownHelp &&
          childItemsHelp.map((item: any, index: number) => {
            return (
              <React.Fragment key={index}>
                <div
                  className={`flex justify-start items-center w-full ${
                    item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={!item.disabled ? item.action : undefined}
                >
                  <div className="flex">
                    <img src={item.icon} />
                    <span className="ml-[16px]">{item.label}</span>
                  </div>
                </div>
                {index < childItemsHelp.length - 1 && <div className="divider" />}
              </React.Fragment>
            );
          })}

        <OrganizerRegister
          isOpen={openOrganizerModal}
          onClose={() => setOpenOrganizerModal(false)}
          onUpdateSuccess={handleRegisterSuccess}
          userInfo={userInfo}
        />

        <NotificationModal
          isOpen={isRegisterSuccess}
          title={t('profile.formSubmitted')}
          description={t('profile.thanksFor')}
          description2={t('profile.completeVerificationOrganizer')}
          textButton={t('profile.buttonClose')}
          onButton={() => setIsRegisterSuccess(false)}
          onClose={() => setIsRegisterSuccess(false)}
        />
      </div>
    </div>
  );
};

export default HelpSupport;
