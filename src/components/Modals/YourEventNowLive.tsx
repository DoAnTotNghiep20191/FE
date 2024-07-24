import { useTranslation } from 'react-i18next';
import { ShareGreenIcon } from 'src/assets/icons';
import { WIDTH_FORM_MODAL_2 } from 'src/constants';
import { C1088, MSG } from 'src/constants/errorCode';
import ModalComponent from '.';
import ButtonContained from '../Buttons/ButtonContained';
import { ToastMessage } from '../Toast';

interface IYourEventNowLive {
  open: boolean;
  id?: number | null;
  onClose: () => void;
  onView: (id: number) => void;
}

const YourEventNowLive = ({ open, id, onClose, onView }: IYourEventNowLive) => {
  const { t } = useTranslation();

  const copyLinkToClipBoard = () => {
    const currentLink = `${import.meta.env.VITE_SITE_URI}/events/${id}`;
    navigator.clipboard.writeText(currentLink);
    ToastMessage.success(t(MSG[C1088]));
  };

  return (
    <ModalComponent
      open={open}
      // open={true}
      width={WIDTH_FORM_MODAL_2}
      className="top-0 md:top-[100px] live-event-modal"
      onCancel={onClose}
    >
      {/* {isMobile && <BackIcon className="absolute top-14 left-5 z-10" onClick={onClose} />} */}
      <div className="flex flex-col items-center justify-start md:justify-center pt-[30px] pb-[20px] h-[calc(100vh-140px)] md:h-auto">
        <p className="text-[24px] font-loos">{t('publishingEvent.yourEventIsNowLive')}</p>
        <p className="text-[14px]">{t('publishingEvent.shareYourEventURL')}</p>
        <div className="pt-[50px] pb-[20px] md:pb-[100px] md:w-[375px]">
          <p className="text-[12px] font-[500]">{t('publishingEvent.yourEventURL')}</p>
          <div className="flex">
            <p className="flex-1 p-[14px] rounded-l-[10px] font-[500] border-[#C7C9D9] border-solid border border-r-0">
              {import.meta.env.VITE_SITE_URI}/events/{id}
            </p>
            <div
              onClick={copyLinkToClipBoard}
              className="flex justify-center items-center rounded-r-[10px] p-[13px] border-[#C7C9D9] border-solid border cursor-pointer"
            >
              <ShareGreenIcon />
            </div>
          </div>
        </div>
        <ButtonContained
          buttonType="type2"
          className="w-[212px] mt-auto md:mt-0"
          onClick={() => onView(id!)}
        >
          {t('publishingEvent.viewEvent')}
        </ButtonContained>
      </div>
    </ModalComponent>
  );
};

export default YourEventNowLive;
