import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import './style.scss';

import { Grid, Image } from 'antd/lib';
import { useCallback, useMemo, useState } from 'react';
import { IClientGiftResponse } from 'src/store/slices/app/types';
import { EffectCards, Pagination } from 'swiper/modules';

import { QRCode } from 'antd';
import { useTranslation } from 'react-i18next';
import { CardEventImgDetail, ViewTicketEclip } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import OverflowTooltip from 'src/components/OverflowTooltip';
import { getMonthDateTime } from 'src/helpers/formatValue';

interface IProps {
  gift: IClientGiftResponse;
  claimTicket: (id: number) => void;
  viewDetails?: (id: number) => void;
}

const EventGifting = ({ claimTicket, gift, viewDetails }: IProps) => {
  const [slideActive, setSlideActive] = useState(0);
  const startDateFormatted = useMemo(
    () => getMonthDateTime(gift.collection.startTime),
    [gift.collection.startTime],
  );

  const { useBreakpoint } = Grid;
  const breakpoint = useBreakpoint();
  const { t } = useTranslation();

  const swiperSlides = useCallback(() => {
    const EventOverview = (
      <div className="h-full w-full">
        <section
          className={`overlay-no-active ${slideActive === 0 ? 'hidden' : 'block'}`}
        ></section>
        <div className="w-full h-full" onClick={() => viewDetails && viewDetails(gift.id)}>
          <Image
            src={gift.collection.image}
            fallback={CardEventImgDetail}
            preview={false}
            alt="CardEventImgDetail"
            width={'100%'}
            className="!w-full !h-full object-cover rounded-[3px]"
            rootClassName="!w-full !h-full"
          />
          <div className="grid grid-cols-[49px_auto] gap-[10px] items-center p-[16px] absolute bottom-0 left-0 right-0 bg-black1/80">
            <div className="w-[49px] h-[49px] flex items-center justify-center bg-white/30 rounded-full flex-col">
              <p className="text-[12px] text-white font-normal">{startDateFormatted?.month}</p>
              <p className="text-[16px] text-white font-normal uppercase">
                {startDateFormatted?.date}
              </p>
            </div>
            <div>
              <OverflowTooltip
                className="truncate w-[250px] md:w-[300px]"
                title={gift.collection.name}
              >
                <p className="text-[20px] text-white font-bold truncate w-[250px] md:w-[300px]">
                  {gift.collection.name}
                </p>
              </OverflowTooltip>
              <OverflowTooltip
                className="truncate w-[250px] md:w-[300px]"
                title={t('common.by', { name: gift?.collection?.team.name })}
              >
                <p className="text-[12px] text-white font-normal truncate w-[250px] md:w-[300px]">
                  {t('common.by', { name: gift?.collection?.team.name })}
                </p>
              </OverflowTooltip>
            </div>
          </div>
        </div>
      </div>
    );

    const ClaimTicket = (
      <div className="h-full w-full relative">
        <section
          className={`overlay-no-active ${slideActive === 1 ? 'hidden' : 'block'}`}
        ></section>
        <Image
          src={gift.collection.image}
          fallback={CardEventImgDetail}
          preview={false}
          alt="CardEventImgDetail"
          width={'100%'}
          className="!w-full !h-full object-cover rounded-[3px]"
          rootClassName="!w-full !h-full"
        />
        <div className="claim-ticket-overlay">
          <div className="flex items-center justify-center relative">
            <img src={ViewTicketEclip} alt="view-ticket" className="event-eclip" />
            <QRCode
              value={gift.giftingEmail}
              size={breakpoint.md ? 56 : 40}
              className="absolute top-[50%] translate-y-[-50%] left-[26px] md:left-[18px] !bg-white p-1 rounded"
            />
          </div>

          <ButtonContained
            buttonType="type1"
            className="w-[163px] !bg-[#FF005A] !border-[#FF005A]"
            mode="medium"
            onClick={() => claimTicket(gift.id)}
          >
            {t('myEvent.claimTicket')}
          </ButtonContained>
        </div>
      </div>
    );

    return (
      <>
        <SwiperSlide className={`active-${slideActive} swiper-0`}>{EventOverview}</SwiperSlide>
        <SwiperSlide className={`active-${slideActive} swiper-1`}>{ClaimTicket}</SwiperSlide>
      </>
    );
  }, [slideActive, breakpoint]);

  return (
    <div className="mb-10 w-full">
      <Swiper
        effect={'cards'}
        grabCursor={true}
        pagination={true}
        slideToClickedSlide={true}
        modules={[Pagination, EffectCards]}
        className={`my-event-swiper upcoming ${breakpoint.md ? 'swiper-desktop' : 'swiper-mobile'}`}
        onSlideChange={(swiper: SwiperClass) => {
          if (swiper.activeIndex !== slideActive) setSlideActive(swiper.activeIndex);
        }}
      >
        {swiperSlides()}
      </Swiper>
    </div>
  );
};

export default EventGifting;
