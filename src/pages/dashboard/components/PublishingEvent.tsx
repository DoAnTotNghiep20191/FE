import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarRoundIcon, PublishEventIcon } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';

interface IPublishingEvent {
  step: number | null;
  onBankDetail?: () => void;
  onAddTicket?: () => void;
  onContinueReview?: () => void;
  onClose?: () => void;
}

const PublishingEvent = ({
  step,
  onBankDetail,
  onAddTicket,
  onContinueReview,
}: IPublishingEvent) => {
  // const isMobile = useMobile();
  const { t } = useTranslation();

  const switchModal = (type: number | null) => {
    switch (type) {
      case 1:
        return (
          <div className="relative flex flex-col items-center justify-between md:justify-center mt-0 md:pt-[20px] px-[10px] h-[calc(100vh-40px)] md:h-[658px]">
            <div className="flex flex-col items-center h-[100%]">
              <p className="text-[24px] text-[#121313] font-extrabold w-[262px] md:w-full text-center">
                {t('publishingEvent.youHaveAddedYourBank')}
              </p>
              <p className="text-[16px] text-[#121313] font-normal text-center w-full md:w-[374px]">
                {t('publishingEvent.lookLikeYouAddedPricing')}
              </p>
              <p className="text-[16px] text-[#121313] font-normal text-center w-full md:w-[374px] mt-[10px]">
                {t('publishingEvent.yourBankDetailsAreImportant')}
              </p>
              <div className="py-[40px]">
                <DollarRoundIcon />
              </div>
            </div>
            <ButtonContained
              className="w-[272px] md:w-[375px] mb-[10px] mt-auto md:mt-0"
              buttonType="type2"
              onClick={onBankDetail}
            >
              {t('publishingEvent.addBankDetails')}
            </ButtonContained>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col relative items-center justify-start md:justify-center pt-0 md:pt-[20px] px-[10px] h-[calc(100vh-140px)] md:h-[658px]">
            {/* {isMobile && <BackIcon className="absolute top-2 left-0 z-10" onClick={onClose} />} */}
            <p className="text-[24px] text-[#121313] font-extrabold w-[262px] md:w-auto text-center">
              {t('publishingEvent.youHaveAddedAny')}
            </p>
            <p className="text-[16px] text-[#121313] font-normal text-center w-[374px]">
              {t('publishingEvent.weHighlyRecommendYouAddTicket')}
            </p>
            <div className="py-[40px]">
              <PublishEventIcon />
            </div>
            <ButtonContained
              className="!w-[212px] md:w-[375px] mt-auto md:mt-[256px]"
              buttonType="type1"
              onClick={onAddTicket}
            >
              {t('publishingEvent.addTicketOptions')}
            </ButtonContained>
            <ButtonContained
              className="!w-[212px] md:w-[375px] mt-[10px]"
              buttonType="type2"
              onClick={onContinueReview}
            >
              {t('publishingEvent.skip')}
            </ButtonContained>
          </div>
        );

      default:
        return;
    }
  };

  const renderModalPublishing = useMemo(() => {
    return switchModal(step);
  }, [step]);

  return <>{renderModalPublishing}</>;
};

export default PublishingEvent;
