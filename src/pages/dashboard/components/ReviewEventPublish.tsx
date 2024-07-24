import { useTranslation } from 'react-i18next';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import CardEventDetail from 'src/pages/event-detail/components/CardEventDetail';

const ReviewEventPublish = ({
  event,
  onPublishEvent,
}: {
  event: any;
  onClose: () => void;
  onPublishEvent: (id: number) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center pt-0 md:pt-[20px] px-0 md:px-[50px] relative">
      <p className="text-[24px] text-[#121313] font-extrabold">
        {t('publishingEvent.reviewYourEvent')}
      </p>
      <p className="text-[16px] text-[#121313] font-normal text-center w-full md:w-[575px]">
        {t('publishingEvent.thisIsYourLastChance')}
      </p>
      <div className="my-[15px] md:my-[30px] mx-[-20px] md:mx-0 border shadow-lg customize-card-event">
        <CardEventDetail event={event} className="py-4" />
      </div>
      <ButtonContained
        className="w-[212px] md:w-[212px] mb-[20px]"
        buttonType="type1"
        onClick={() => onPublishEvent(event?.id)}
      >
        {t('publishingEvent.publishEvent')}
      </ButtonContained>
    </div>
  );
};

export default ReviewEventPublish;
