import { debounce } from 'lodash';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CreateIcon } from 'src/assets/icons';
import { useHistory, useLocation } from 'react-router-dom';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import ModalComponent from 'src/components/Modals';
import CustomSearch from 'src/components/Search';
import AppSegmented from 'src/components/Segmented';
import { ToastMessage } from 'src/components/Toast';
import { WIDTH_FORM_MODAL, WIDTH_FORM_MODAL_2 } from 'src/constants';
import { C1001, C1044, MSG } from 'src/constants/errorCode';
import { PATHS } from 'src/constants/paths';
import useInfinitePageQuery from 'src/hooks/useInfiniteQuery';
import ModalCreateEvent from 'src/pages/dashboard/components/ModalCreatEvent';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { useGetMyEventOrganizerQuery, usePublishEventMutation } from 'src/store/slices/app/api';
import { EEventFilter, EEventStatus } from 'src/store/slices/app/types';
import { setIsCreateTeam, setOldPath } from 'src/store/slices/auth';
import { useLazyCheckAllowanceQuery } from 'src/store/slices/profile/api';
import { ETeamRole } from 'src/store/slices/user/types';
import CreateTicket from '../event-manager/components/CreateTicket';
import BankDetails from '../profile/components/bank-details';
import CardMyEvent from './components/CardMyEvent';
import PublishingEvent from './components/PublishingEvent';
import ReviewEventPublish from './components/ReviewEventPublish';
import SkeletonCard from './components/SkeletonCard';
import './index.scss';
import CheckInModal from './components/CheckInModal';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import eventBus from 'src/socket/event-bus';
import { ESocketEvent } from 'src/socket/SocketEvent';

interface INoTeam {
  onCreateTeam: () => void;
}
export const NoTeam = ({ onCreateTeam }: INoTeam) => {
  const { t } = useTranslation();

  return (
    <div className="py-[40px] flex flex-col items-center justify-center gap-[32px]">
      <div>
        <p className="text-center text-base">{t('dashboard.itLookLikeYou')}</p>
      </div>
      <ButtonContained
        className="w-[163px]"
        buttonType="type3"
        mode="medium"
        onClick={onCreateTeam}
      >
        {t('dashboard.createNewTeam')}
      </ButtonContained>
    </div>
  );
};

const NoEvent = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full py-[49px] px-[22px]">
      <p className="text-black1 text-[16px] text-center">{t('dashboard.youCurrentlyHaveNo')}</p>
    </div>
  );
};

enum TypeModal {
  BANK_MODAL = 'BANK_MODAL',
  TICKET_MODAL = 'TICKET_MODAL',
  REVIEW_MODAL = 'REVIEW_MODAL',
}

function Dashboard() {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { rudderAnalytics } = useRudderStack();

  const [isCreate, setIsCreate] = useState(false);
  const [isPublishingEvent, setIsPublishingEvent] = useState(false);
  const [valueFilter, setValueFilter] = useState(EEventFilter.UPCOMING);
  const [searchVal, setSearchVal] = useState('');
  const [valueDebounce, setValueDebounce] = useState('');
  const [currentData, setCurrentData] = useState<any>(null);
  const [typeModal, setTypeModal] = useState<TypeModal | null>(null);
  const [currentStep, setCurrentStep] = useState<number | null>(2);
  const [idActive, setIdActive] = useState<null | number>(null);
  const [isOpenCheckInModal, setIsOpenCheckInModal] = useState<boolean>(false);
  const user = useAppSelector(getUserInfo);

  const [publishEvent, { isLoading: loadingPublish }] = usePublishEventMutation();
  const [getAllowance, { isLoading: loadingAllowance }] = useLazyCheckAllowanceQuery();

  const location = useLocation();

  const useInfo = useAppSelector(getUserInfo);

  const filterStatus = useMemo(() => {
    if (valueFilter === EEventFilter.UPCOMING) {
      return [
        EEventStatus.CREATED,
        EEventStatus.REQUEST_DEPLOY,
        EEventStatus.DEPLOYING,
        EEventStatus.DEPLOYED,
        EEventStatus.UPDATED,
        EEventStatus.REQUEST_UPDATE,
      ];
    } else {
      return [];
    }
  }, [valueFilter]);

  const {
    combinedData: data,
    metaData,
    refresh,
    loadMore,
    isLoading,
    resetPage,
  } = useInfinitePageQuery({
    useGetDataListQuery: useGetMyEventOrganizerQuery,
    params: {
      limit: 20,
      search: valueDebounce.trim(),
      sortBy: 'createdAt',
      direction: 'DESC',
      status: filterStatus,
      buyStatus: valueFilter,
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const rescanParam = searchParams.get('rescan');

    if (rescanParam === 'true') {
      setIsOpenCheckInModal(true);
    }
  }, []);

  const isNotEventByTeam = useMemo(() => {
    if (Number(metaData?.totalMyEvent) === 0) {
      return false;
    }
    return true;
  }, [metaData]);

  const handleCreateTeam = () => {
    dispatch(setIsCreateTeam(true));
  };

  const handleCancel = () => {
    setIsCreate(false);
  };

  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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
    debounceHandler(e);
    debounceAddToRudderStackHandler(e);
  };

  const handlePublishEvent = async (item: any) => {
    try {
      setIdActive(item?.id);
      setCurrentData(item);
      const { data } = await getAllowance({ id: item?.id }).unwrap();
      if (+item?.maxCapacity === 0) {
        setCurrentStep(2);
        setIsPublishingEvent(true);
        return;
      }
      if (!data?.isFreeEvent && !data?.isBankDetail) {
        if (useInfo?.roleOfTeam !== ETeamRole.ADMIN) {
          ToastMessage.error(t(MSG[C1044]));
          return;
        }
        setCurrentStep(1);
        setIsPublishingEvent(true);
        return;
      }

      setTypeModal(TypeModal.REVIEW_MODAL);
    } catch (err: any) {
      ToastMessage.error(t(MSG[err?.data?.validator_errors || C1001]));
    } finally {
      setIdActive(null);
    }
  };

  const handleCancelModal = () => {
    setTypeModal(null);
    setCurrentData(null);
    setCurrentStep(2);
  };

  const handleCancelCheckIn = () => {
    setIsOpenCheckInModal(!isOpenCheckInModal);
  };

  const handleRePublishEvent = async (id: number) => {
    try {
      setIdActive(id);
      const { data } = await getAllowance({ id: id }).unwrap();
      if (!data?.isFreeEvent && !data?.isBankDetail) {
        if (useInfo?.roleOfTeam !== ETeamRole.ADMIN) {
          ToastMessage.error(t(MSG[C1044]));
          return;
        }
        setCurrentStep(1);
        setIsPublishingEvent(false);
        return;
      }
      await publishEvent({ id }).unwrap();

      setTypeModal(null);
      setIsPublishingEvent(false);
      rudderAnalytics?.track(ERudderStackEvents.EventRepublished, {
        eventType: ERudderStackEvents.EventRepublished,
        data: {
          eventId: id,
        },
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setIdActive(null);
    }
  };

  const handlePublishingEvent = async (id: number) => {
    try {
      const { data } = await getAllowance({ id }).unwrap();
      if (!data?.isFreeEvent && !data?.isBankDetail) {
        if (useInfo?.roleOfTeam !== ETeamRole.ADMIN) {
          ToastMessage.error(t(MSG[C1044]));
          return;
        }
        setCurrentStep(1);
        setIsPublishingEvent(false);
        return;
      }

      await publishEvent({ id }).unwrap();
      setTypeModal(null);
      setIsPublishingEvent(false);

      rudderAnalytics?.track(ERudderStackEvents.EventPublished, {
        eventType: ERudderStackEvents.EventRepublished,
        data: {
          eventId: id,
        },
      });
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleClosePublishing = () => {
    setIsPublishingEvent(false);
    setTypeModal(null);
  };

  const handleClickEvent = (id: string) => {
    dispatch(setOldPath(PATHS.dashboard));
    history.push(`/events/${id}`);
  };

  const handleCheckNewDeviceCamera = async () => {
    const status: any = await navigator.permissions.query({
      name: 'camera' as PermissionName,
    });

    if (status?.state === 'denied') {
      ToastMessage.warning(t('checkInYour.v3rifiedRequiresAccessToYour'));
    } else {
      // open modal, add qr check-in in modal
      setIsOpenCheckInModal(true);
      // history.push(PATHS.CheckIn);
    }
  };

  const handleReloadEvent = () => {
    refresh();
  };

  useEffect(() => {
    eventBus.on(ESocketEvent.OrganizerPublicEvent, handleReloadEvent);

    return () => {
      eventBus.remove(ESocketEvent.OrganizerPublicEvent, handleReloadEvent);
    };
  }, []);

  const handleCheckOldDeviceCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setIsOpenCheckInModal(true);
    } catch (error) {
      ToastMessage.warning(t('checkInYour.v3rifiedRequiresAccessToYour'));
    }
  };

  const handleCheckInUser = async () => {
    if (navigator.permissions) {
      handleCheckNewDeviceCamera();
    } else if (navigator?.mediaDevices) {
      handleCheckOldDeviceCamera();
    } else {
      ToastMessage.warning(t('checkInYour.v3rifiedRequiresAccessToYour'));
    }
  };

  return (
    <div className="w-full md:w-[440px] px-5 md:px-0 py-[30px] md:py-[40px] dashboard-container">
      {/* <Affix offsetTop={breakpoint.md ? 85 : 60} className="w-full"> */}
      <div className="w-full flex  items-center justify-between gap-[16px]">
        <div className="w-[37px]" />
        <CustomSearch
          onChange={handleSeach}
          value={searchVal}
          placeholder={t('dashboard.searchEventsManagedByYou')}
          className="w-[275px] md:w-[342px] h-[40px] md:h-[53px]"
        />
        <div className="w-[37px]">
          {useInfo?.currentTeamId && user?.roleOfTeam !== ETeamRole.OPERATIONS && (
            <button
              className="bg-white w-full h-[37px] rounded-full flex items-center justify-center shadow-lg shadow-rgba(0, 0, 0, 0.25)"
              onClick={() => setIsCreate(true)}
            >
              <CreateIcon />
            </button>
          )}
        </div>
      </div>
      {/* </Affix> */}
      <div className="w-full flex items-center justify-between">
        <div>
          {useInfo?.currentTeamId && isNotEventByTeam && (
            <ButtonContained
              onClick={handleCheckInUser}
              className="button md:w-[163px]"
              buttonType="type4"
              mode="medium"
            >
              {t('dashboard.checkInUsers')}
            </ButtonContained>
          )}
        </div>
        <div className="w-[176px] py-[30px]">
          <AppSegmented
            items={[
              {
                label: <p className="capitalize font-medium text-[12px]">{t('common.upcoming')}</p>,
                value: EEventFilter.UPCOMING,
              },
              {
                label: <p className="capitalize font-medium text-[12px]">{t('common.past')}</p>,
                value: EEventFilter.PAST,
              },
            ]}
            value={valueFilter}
            onChange={(val: EEventFilter) => {
              resetPage();
              setValueFilter(val);
            }}
          />
        </div>
      </div>

      {!useInfo?.currentTeamId ? (
        <NoTeam onCreateTeam={handleCreateTeam} />
      ) : isLoading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : Array.isArray(data) && data?.length > 0 ? (
        <InfiniteScroll dataLength={data?.length} hasMore={true} loader={null} next={loadMore}>
          {data?.map((item: any) => {
            return (
              <CardMyEvent
                key={item?.id}
                event={item}
                loadingPublish={idActive === item?.id && loadingAllowance}
                loadingRepublish={idActive === item?.id && (loadingPublish || loadingAllowance)}
                onPublishEvent={() => handlePublishEvent(item)}
                onRePublishEvent={() => handleRePublishEvent(item?.id)}
                onClickEvent={handleClickEvent}
              />
            );
          })}
        </InfiniteScroll>
      ) : isNotEventByTeam ? (
        <p className="text-[16px] italic font-extralight text-center">
          {valueDebounce
            ? t('common.noResultsFoundFor', { search: valueDebounce })
            : t('common.noData')}
        </p>
      ) : (
        <NoEvent />
      )}

      <ModalCreateEvent open={isCreate} onCancel={handleCancel} />
      <ModalComponent
        className="publish-event-modal max-md:absolute max-md:top-0"
        open={isPublishingEvent}
        width={WIDTH_FORM_MODAL_2}
        onCancel={handleClosePublishing}
        isCloseMobile={currentStep === 3 ? false : true}
      >
        <PublishingEvent
          step={currentStep}
          onAddTicket={() => {
            setIsPublishingEvent(false);
            setTypeModal(TypeModal.TICKET_MODAL);
          }}
          onBankDetail={() => {
            setIsPublishingEvent(false);
            setTypeModal(TypeModal.BANK_MODAL);
          }}
          onContinueReview={() => {
            setIsPublishingEvent(false);
            setTypeModal(TypeModal.REVIEW_MODAL);
          }}
          onClose={handleClosePublishing}
        />
      </ModalComponent>
      <ModalComponent
        open={typeModal === TypeModal.REVIEW_MODAL}
        width={WIDTH_FORM_MODAL}
        centered
        onCancel={handleCancelModal}
      >
        <ReviewEventPublish
          event={currentData}
          onClose={handleCancelModal}
          onPublishEvent={handlePublishingEvent}
        />
      </ModalComponent>
      <ModalComponent
        open={typeModal === TypeModal.TICKET_MODAL}
        width={WIDTH_FORM_MODAL}
        destroyOnClose={true}
        centered
        onCancel={handleCancelModal}
      >
        <CreateTicket id={currentData?.id!} onClose={handleCancelModal} />
      </ModalComponent>
      <BankDetails
        isOpen={typeModal === TypeModal.BANK_MODAL}
        defaultStep={1}
        onclose={handleCancelModal}
        bankDetail={null}
        teamId={user?.currentTeamId!}
      />

      <CheckInModal isOpenCheckInModal={isOpenCheckInModal} onCancel={handleCancelCheckIn} />
    </div>
  );
}

export default Dashboard;
