import { debounce } from 'lodash';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import ModalComponent from 'src/components/Modals';
import CustomSearch from 'src/components/Search';
import AppSegmented from 'src/components/Segmented';
import { ToastMessage } from 'src/components/Toast';
import { ReviewStatus, WIDTH_FORM_MODAL } from 'src/constants';
import { C1047, MSG } from 'src/constants/errorCode';
import { PATHS } from 'src/constants/paths';
import { RefundModalProvider } from 'src/contexts/modal';
import { onLogError } from 'src/helpers';
import useInfinitePageQuery from 'src/hooks/useInfiniteQuery';
import { useMobile } from 'src/hooks/useMobile';
import { useSocketIo } from 'src/hooks/useSocketIo';
import { SocketEvent } from 'src/socket/events';
import {
  useClientClaimTicketMutation,
  useClientGetListGiftMutation,
  useGetMyEventFanQuery,
  useLazyGetTicketDetailQuery,
} from 'src/store/slices/app/api';
import { EEventFilter, IClientGiftResponse } from 'src/store/slices/app/types';
import { setOldPath } from 'src/store/slices/auth';
import NotificationModal from '../event-detail/components/NotificationModal';
import ViewMyTicketModal from '../event-detail/components/ViewMyTicketModal';
import EventGifting from './components/EventGifting';
import EventSlide from './components/EventSlide';
import MobileSearchBtn from './components/MobileSearchBtn';
import ReviewEvent from './components/ReviewEvent';
import './styles.scss';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';

const MyEvents = () => {
  const { t } = useTranslation();
  const { rudderAnalytics } = useRudderStack();
  const isMobile = useMobile();
  const [valueFilter, setValueFilter] = useState<string | number>(EEventFilter.UPCOMING);
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  const [isOpenReview, setOpenReview] = useState(false);
  const [isOpenNoti, setOpenNoti] = useState(false);
  const [isOpenMyTicket, setOpenMyTicket] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [valueDebounce, setValueDebounce] = useState('');
  const [dataTicket, setDataTicket] = useState<any>([]);
  const [selectedId, setSelectedId] = useState(-1);
  const [isUpdate, setUpdate] = useState(false);
  const [gifts, setGifts] = useState<IClientGiftResponse[]>([]);
  const [getTicketDetail] = useLazyGetTicketDetailQuery();
  const [getListGiftMutation] = useClientGetListGiftMutation();
  const [claimTicketMutation] = useClientClaimTicketMutation();
  const [holdTicketId, setHoldTicketId] = useState<number | null>(null);
  const userInfo = useAppSelector(getUserInfo);
  const {
    combinedData: data,
    refresh,
    loadMore,
    resetPage,
  } = useInfinitePageQuery({
    useGetDataListQuery: useGetMyEventFanQuery,
    params: {
      limit: 20,
      search: valueDebounce.trim(),
      sortBy: valueFilter === EEventFilter.UPCOMING ? 'startTime' : 'endTime',
      direction: valueFilter === EEventFilter.UPCOMING ? 'ASC' : 'DESC',
      buyStatus: valueFilter,
    },
  });

  // const { data: dataTicket, refetch: refetchTicketDetail } = useGetTicketDetailQuery({ id: +id });

  useSocketIo(
    async () => {
      try {
        refresh();
        if (!holdTicketId) return;
        const { data } = await getTicketDetail({ id: holdTicketId }).unwrap();
        setDataTicket(data);
      } catch (err: any) {
        console.error(err);
      }
    },
    SocketEvent.MINT_TICKET_SUCCEEDED,
    [holdTicketId],
  );

  const getListGifting = async () => {
    const { data: listGifting } = await getListGiftMutation(undefined).unwrap();
    return setGifts(listGifting);
  };

  useEffect(() => {
    (() => getListGifting())();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status');
    if (status && status === 'past') {
      setValueFilter(EEventFilter.PAST);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [location]);

  const handleClaimTicket = async (id: number, holdTicketId: number) => {
    try {
      const { data } = await claimTicketMutation({ collectionId: +id }).unwrap();
      if (data) {
        getListGifting();
        const { data } = await getTicketDetail({ id: holdTicketId }).unwrap();
        setHoldTicketId(holdTicketId);
        setDataTicket(data);
        setOpenMyTicket(true);
        return ToastMessage.success('Ticket claimed');
      }
    } catch (err: any) {
      return ToastMessage.error(t(MSG[err?.data?.validator_errors || '']));
    }
  };

  const handleCloseNoti = () => {
    setOpenNoti(false);
  };

  const handleReviewSuccess = () => {
    setOpenReview(false);
    refresh();
    isUpdate ? ToastMessage.success(t(MSG[C1047])) : setOpenNoti(true);
  };

  const handleSearchChange = async (value: string) => {
    if (value.length > 2 || value.length === 0) {
      resetPage();
      setValueDebounce(value);
    }
  };

  const handleAddToRudderStack = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    rudderAnalytics?.track(ERudderStackEvents.EventSearched, {
      eventType: ERudderStackEvents.EventSearched,
      data: {
        searchString: value,
      },
    });
  };

  const debounceHandler = useCallback(debounce(handleSearchChange, 500), []);
  const debounceAddToRudderStackHandler = useCallback(debounce(handleAddToRudderStack, 3000), []);

  const handleSeach = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    debounceHandler(e.target.value);
    debounceAddToRudderStackHandler(e);
  };

  const clearSearch = () => {
    setSearchVal('');
    debounceHandler('');
  };

  const handleViewTicket = async (id: number) => {
    try {
      const { data } = await getTicketDetail({ id }).unwrap();
      setDataTicket(data);
      setOpenMyTicket(true);

      rudderAnalytics?.track(ERudderStackEvents.TicketViewed, {
        eventType: ERudderStackEvents.TicketViewed,
        data: {
          userId: userInfo?.id,
          ticketId: data[0]?.id,
        },
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleAddEvent = (event: any) => {
    setOpenReview(true);
    setSelectedId(event.id);
    setUpdate(event.isReview && event.reviewStatus !== ReviewStatus.REJECTED);
  };

  const handleClickEvent = (id: string) => {
    dispatch(setOldPath(PATHS.myEvents));
    history.push(`/events/${id}`);
  };

  return (
    <div className="my-events">
      <div className="flex justify-between mb-[30px]">
        {isMobile ? (
          <div className="search-btn-wrapper">
            <MobileSearchBtn
              onChange={handleSeach}
              onClear={clearSearch}
              value={searchVal}
              placeholder={t('myEvent.searchPlaceholder')}
            />
          </div>
        ) : (
          <CustomSearch
            onChange={handleSeach}
            value={searchVal}
            placeholder={t('myEvent.searchPlaceholder')}
            className="w-[275px] md:w-full h-[40px] md:h-[53px] max-w-[342px]"
          />
        )}

        <div className="w-[176px] flex flex-col  items-end gap-[10px]">
          <AppSegmented
            items={[
              {
                label: (
                  <p className="capitalize font-medium text-[12px]">{t('myEvent.upcoming')}</p>
                ),
                value: EEventFilter.UPCOMING,
              },
              {
                label: <p className="capitalize font-medium text-[12px]">{t('myEvent.past')}</p>,
                value: EEventFilter.PAST,
              },
            ]}
            value={valueFilter}
            onChange={(val: EEventFilter) => {
              resetPage();
              setValueFilter(val);
            }}
          />
          <div className="purchase-history-btn" onClick={() => history.push(PATHS.purchaseHistory)}>
            <span>{t('myEvent.buttonPurchaseHistory')}</span>
          </div>
        </div>
      </div>

      <InfiniteScroll
        dataLength={data?.length}
        hasMore={true}
        loader={null}
        next={loadMore}
        className="my-event-list"
      >
        {!!gifts.length &&
          gifts.map((gift) => (
            <EventGifting
              claimTicket={() => handleClaimTicket(+gift.id, gift.collection.id)}
              gift={gift}
              key={gift.id}
            />
          ))}

        {data?.length > 0 &&
          data?.map((event: any) => {
            return (
              <EventSlide
                mode={valueFilter as EEventFilter}
                key={event.id}
                event={event}
                handleViewTicket={() => handleViewTicket(event.id)}
                handleWriteReview={() => handleAddEvent(event)}
                onClickEvent={handleClickEvent}
              />
            );
          })}
        {data.length === 0 && gifts.length === 0 && (
          <p className="font-extralight  text-center text-base mt-[70px]">
            {valueDebounce ? (
              t('common.noResultsFoundFor', { search: valueDebounce })
            ) : (
              <span className="uppercase">
                {t('myEvent.youHaveNotPurchased')}
                <br />
                {t('myEvent.headToDiscover')}
              </span>
            )}
          </p>
        )}
      </InfiniteScroll>

      <ModalComponent
        className="reivew-event-modal"
        open={isOpenReview}
        onCancel={() => setOpenReview(false)}
        centered
        zIndex={70}
        width={WIDTH_FORM_MODAL}
      >
        {/* {isMobile && (
          <BackIcon className="absolute top-8 left-5" onClick={() => setOpenReview(false)} />
        )} */}
        <ReviewEvent
          handleReviewSuccess={handleReviewSuccess}
          eventId={selectedId}
          isUpdate={isUpdate}
        />
      </ModalComponent>
      <NotificationModal
        isOpen={isOpenNoti}
        onButton={handleCloseNoti}
        onClose={handleCloseNoti}
        title={t('reviewEvent.thankForSharing')}
        description={t('reviewEvent.yourReviewWillBeAdded')}
        textButton={t('reviewEvent.buttonClose')}
        // className="review-notification"
      />
      <RefundModalProvider>
        <ViewMyTicketModal
          isOpenMyTicket={isOpenMyTicket}
          onCloseMyTicket={() => setOpenMyTicket(false)}
          viewOnBlockchain={() => setOpenMyTicket(false)}
          data={dataTicket[0]!}
        />
      </RefundModalProvider>
    </div>
  );
};

export default MyEvents;
