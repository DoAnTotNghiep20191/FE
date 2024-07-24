import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import './styles.scss';

import { EffectCards, Pagination } from 'swiper/modules';
import { useCallback, useMemo, useState } from 'react';
import { Grid, Image } from 'antd/lib';
import { EEventFilter } from 'src/store/slices/app/types';

import { CardEventImgDetail, ReviewEclip, ViewTicketEclip } from 'src/assets/icons';
import OverflowTooltip from 'src/components/OverflowTooltip';
import { useTranslation } from 'react-i18next';
import { getMonthDateTime } from 'src/helpers/formatValue';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import { QRCode } from 'antd';

interface IProps {
  mode?: EEventFilter;
  event?: any;
  handleViewTicket: (id: number) => void;
  handleWriteReview: (event: any) => void;
  onClickEvent?: (number: string) => void;
}

const EventSlide = ({ mode, event, handleViewTicket, handleWriteReview, onClickEvent }: IProps) => {
  const [slideActive, setSlideActive] = useState(0);

  const { useBreakpoint } = Grid;
  const breakpoint = useBreakpoint();
  const { t } = useTranslation();

  const startDateFormatted = useMemo(() => getMonthDateTime(event?.startTime), [event?.startTime]);

  const swiperSlides = useCallback(() => {
    const EventOverview = (
      <div className="h-full w-full">
        <section
          className={`overlay-no-active ${slideActive === 0 ? 'hidden' : 'block'}`}
        ></section>
        <div className="w-full h-full" onClick={() => onClickEvent?.(event.id)}>
          <Image
            src={event?.image}
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
              <OverflowTooltip className="truncate w-[250px] md:w-[300px]" title={event?.name}>
                <p className="text-[20px] text-white font-bold truncate w-[250px] md:w-[300px]">
                  {event?.name}
                </p>
              </OverflowTooltip>

              <OverflowTooltip
                className="truncate w-[250px] md:w-[300px]"
                title={t('common.by', { name: event?.team?.name })}
              >
                <p className="text-[12px] text-white font-normal truncate w-[250px] md:w-[300px]">
                  {t('common.by', { name: event?.team?.name })}
                </p>
              </OverflowTooltip>
            </div>
          </div>
        </div>
      </div>
    );

    const ViewTicket = (
      <div className="h-full w-full relative">
        <section
          className={`overlay-no-active ${slideActive === 1 ? 'hidden' : 'block'}`}
        ></section>
        <Image
          src={event?.image}
          fallback={CardEventImgDetail}
          preview={false}
          alt="CardEventImgDetail"
          width={'100%'}
          className="!w-full !h-full object-cover rounded-[3px]"
          rootClassName="!w-full !h-full"
        />
        <div className="view-ticket-overlay">
          <div className="flex items-center justify-center relative">
            <img src={ViewTicketEclip} alt="view-ticket" className="event-eclip" />
            <QRCode
              value={'slkslkd'}
              size={breakpoint.md ? 56 : 40}
              className="absolute top-[50%] translate-y-[-50%] left-[26px] md:left-[18px] !bg-white p-1 rounded"
            />
          </div>

          <ButtonContained
            buttonType="type1"
            className="w-[163px] !bg-[#FF005A] !border-[#FF005A]"
            mode="medium"
            onClick={() => handleViewTicket(event.id)}
          >
            {t('myEvent.buttonViewTicket')}
          </ButtonContained>
        </div>
      </div>
    );

    const LeaveReview = (
      <div className="h-full w-full relative">
        <section
          className={`overlay-no-active ${slideActive === 2 ? 'hidden' : 'block'}`}
        ></section>
        <Image
          src={event?.image}
          fallback={CardEventImgDetail}
          preview={false}
          alt="CardEventImgDetail"
          width={'100%'}
          className="!w-full !h-full object-cover rounded-[3px]"
          rootClassName="!w-full !h-full"
        />
        <div className="review-overlay">
          <div className="flex items-center justify-center relative">
            <img src={ReviewEclip} alt="review-eclip" className="event-eclip" />
          </div>

          <ButtonContained
            buttonType="type1"
            className="w-[163px]"
            mode="medium"
            onClick={() => handleWriteReview(event)}
          >
            {t('reviewEvent.buttonLeave')}
          </ButtonContained>
        </div>
      </div>
    );

    if (mode === EEventFilter.UPCOMING) {
      return (
        <>
          <SwiperSlide className={`active-${slideActive} swiper-0`}>{EventOverview}</SwiperSlide>
          <SwiperSlide className={`active-${slideActive} swiper-1`}>{ViewTicket}</SwiperSlide>
        </>
      );
    } else {
      return (
        <>
          <SwiperSlide className={`active-${slideActive} swiper-0`}>{EventOverview}</SwiperSlide>
          <SwiperSlide className={`active-${slideActive} swiper-1`}>{ViewTicket}</SwiperSlide>
          <SwiperSlide className={`active-${slideActive} swiper-2`}>{LeaveReview}</SwiperSlide>
        </>
      );
    }
  }, [mode, slideActive, breakpoint]);

  return (
    <div className="mb-10 w-full">
      <Swiper
        effect={'cards'}
        grabCursor={true}
        pagination={true}
        slideToClickedSlide={true}
        modules={[Pagination, EffectCards]}
        className={`my-event-swiper ${breakpoint.md ? 'swiper-desktop' : 'swiper-mobile'}  ${
          mode === 'upcoming' ? 'upcoming' : 'past'
        }`}
        onSlideChange={(swiper: SwiperClass) => {
          if (swiper.activeIndex !== slideActive) setSlideActive(swiper.activeIndex);
        }}
      >
        {swiperSlides()}
      </Swiper>
    </div>
  );
};

export default EventSlide;
