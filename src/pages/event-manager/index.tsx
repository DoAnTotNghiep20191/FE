import { Badge, Dropdown, Grid, TabsProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, DeleteIcon, Edit, InfoIcon } from 'src/assets/icons';
import ModalComponent from 'src/components/Modals';
import AppTabs from 'src/components/Tabs';
import { RefundStatus, WIDTH_FORM_MODAL, WIDTH_FORM_MODAL_2 } from 'src/constants';
import { S40048 } from 'src/constants/errorCode';
import {
  useDeleteEventMutation,
  useGetEventDetailQuery,
  useGetEventPurchasesQuery,
  usePublishEventMutation,
} from 'src/store/slices/app/api';
import { EEventStatus } from 'src/store/slices/app/types';
import ModalCreateEvent from '../dashboard/components/ModalCreatEvent';
import PublishingEvent from '../dashboard/components/PublishingEvent';
import ReviewEventPublish from '../dashboard/components/ReviewEventPublish';
import Insights from './components/Insights';
import ModalDeleteEvent from './components/ModalDeleteEvent';
import Promos from './components/Promos';
import Purchases from './components/Purchases';
import Tickets from './components/Tickets';
import './style.scss';

import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import OptionIcon from 'src/assets/icons/events/menu_option.svg?react';
import { PATHS } from 'src/constants/paths';
import { RefundModalProvider } from 'src/contexts/modal';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { ETeamRole } from 'src/store/slices/user/types';
import Gift from './components/Gift';
import eventBus from 'src/socket/event-bus';
import { ESocketEvent } from 'src/socket/SocketEvent';
const { useBreakpoint } = Grid;

interface RouteParams {
  id: string;
}

enum ETabIds {
  Ticket = '1',
  Promo = '2',
  Purchases = '3',
  Insights = '4',
  Gift = '5',
}

const tabIds = [ETabIds.Ticket, ETabIds.Gift, ETabIds.Insights, ETabIds.Promo, ETabIds.Purchases];

export default function EventManager() {
  const breakpoint = useBreakpoint();
  const { id } = useParams<RouteParams>();

  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [stepDelete, setStepDelete] = useState(1);
  const [isRepublish, setIsRepublish] = useState(false);
  const [isRepublishSuccess, setIsRepublishSuccess] = useState(false);

  const [refundStatus, setRefundStatus] = useState<number>(0);
  const location = useLocation();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data, error, isLoading, refetch: refreshEventData } = useGetEventDetailQuery({ id: +id });
  const [deleteEvent] = useDeleteEventMutation();
  const [publishEvent] = usePublishEventMutation();
  const userInfo = useAppSelector(getUserInfo);
  const {
    data: purchaseData,
    refetch,
    error: listPurchaseErrors,
  } = useGetEventPurchasesQuery({ id: +id });

  const [tabSelected, setTabSelected] = useState('1');
  const { rudderAnalytics } = useRudderStack();

  const { t } = useTranslation();
  const isEventStart = useMemo(() => {
    return dayjs() > dayjs.unix(data?.data.startTime);
  }, [data]);
  const isPastEvent = useMemo(() => {
    return dayjs() > dayjs.unix(data?.data.endTime);
  }, [data]);

  const history = useHistory();

  const handleChangeTab = (key: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', key);
    history.replace({ pathname: location.pathname, search: searchParams.toString() });
    return setTabSelected(key);
  };

  useEffect(() => {
    if (tabSelected === '3') {
      refetch();
    }
  }, [tabSelected, refetch]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabId = searchParams.get('tab') as ETabIds;
    if (tabId && tabIds.includes(tabId)) {
      setTabSelected(tabId);
    }
  }, []);

  const loadRefundStatus = () => {
    const statuses = purchaseData?.data.filter(
      (purchase: any) => purchase?.refundRequest?.refundStatus === RefundStatus.PENDING,
    );
    return setRefundStatus(statuses.length);
  };

  useEffect(() => {
    if (purchaseData) {
      loadRefundStatus();
    }
  }, [purchaseData]);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('eventManagement.tickets'),
      children: <Tickets statusEvent={data?.data?.status} isPastEvent={isPastEvent} />,
    },
    {
      key: '2',
      label: t('eventManagement.promos'),
      children: <Promos isPastEvent={isPastEvent} />,
    },
    {
      key: '3',
      label: (
        <>
          {t('eventManagement.purchases')}
          {tabSelected !== '3' && refundStatus ? (
            <Badge rootClassName="w-4 h-4" className="absolute top-[5px] z-50" dot={true} />
          ) : (
            <Badge
              rootClassName="w-4 h-4"
              className="absolute top-0 z-50"
              count={tabSelected === '3' ? refundStatus : 0}
            />
          )}
        </>
      ),
      children: (
        <RefundModalProvider>
          <Purchases cb={refetch} isEventStart={isEventStart} />
        </RefundModalProvider>
      ),
      destroyInactiveTabPane: true,
    },
    {
      key: '4',
      label: t('eventManagement.insights'),
      children: <Insights />,
      destroyInactiveTabPane: true,
    },
    {
      key: '5',
      label: t('eventManagement.gift'),
      children: (
        <RefundModalProvider>
          <Gift isEventStart={isEventStart} />
        </RefundModalProvider>
      ),
      destroyInactiveTabPane: true,
    },
  ];

  const handleDelete = () => {
    setIsDelete(true);
  };

  const handleEditEvent = () => {
    if (!isLoading) {
      setIsEdit(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteEvent({ id: +id }).unwrap();
      setStepDelete(2);
      rudderAnalytics?.track(ERudderStackEvents.EventDeleted, {
        eventType: ERudderStackEvents.EventDeleted,
        data: {
          eventId: id,
        },
      });
      setDeleteLoading(false);
    } catch (error: any) {
      console.error(error);
      const { validator_errors } = error?.data || undefined;
      setDeleteLoading(false);
      if (validator_errors === S40048) {
        setStepDelete(3);
        return;
      }
    }
  };

  const handleRepublishAfterUpdate = () => {
    setIsRepublish(true);
    setIsEdit(false);
  };

  const handlePublishingEvent = async (id: number) => {
    try {
      await publishEvent({ id }).unwrap();
      setIsRepublish(false);
      setIsRepublishSuccess(false);
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleClosePublishing = () => {
    setIsRepublishSuccess(false);
  };

  const handleCloseDelete = () => {
    if (stepDelete === 2) {
      history.replace(PATHS.dashboard);
    }
    setStepDelete(1);
    setIsDelete(false);
  };

  useEffect(() => {
    if (error) {
      history.push(PATHS.notFound);
    }
  }, [error]);

  useEffect(() => {
    if ((listPurchaseErrors as any)?.data?.status_code === 403) {
      history.push(PATHS.notFound);
    }
  }, [listPurchaseErrors]);

  const handleReloadEvent = () => {
    refreshEventData();
  };

  useEffect(() => {
    eventBus.on(ESocketEvent.OrganizerPublicEvent, handleReloadEvent);

    return () => {
      eventBus.remove(ESocketEvent.OrganizerPublicEvent, handleReloadEvent);
    };
  }, []);

  return (
    <div className="">
      <div className="mt-[36px] px-[5px] md:px-0">
        <div className="header justify-between flex items-center ">
          <div className="title flex gap-[10px] items-start ">
            <button onClick={() => history.push(PATHS.dashboard)} className="pt-[12px]">
              <ArrowLeft />
            </button>
            <div>
              <h1
                className="text-black font-loos text-[32px] truncate max-w-[250px] md:max-w-[400px]"
                title={data?.data?.name}
              >
                {data?.data?.name}
              </h1>
              <div
                onClick={() => {
                  if (data?.data?.status === EEventStatus.UPDATED) {
                    history.push(PATHS.dashboard);
                  }
                }}
                className={`flex items-center justify-center gap-2 py-[2px] w-fit ${data?.data?.status === EEventStatus.UPDATED ? 'cursor-pointer' : ''}`}
              >
                <InfoIcon />
                <p className="text-[12px] font-[400] text-primary">
                  {data?.data?.status === EEventStatus.UPDATED
                    ? t('eventManagement.republishRequired')
                    : t('eventManagement.noNewUpdates')}
                </p>
              </div>
            </div>
          </div>
          {userInfo?.roleOfTeam !== ETeamRole.OPERATIONS && (
            <>
              {breakpoint.md ? (
                <div className="action gap-[16px] flex items-center">
                  <button
                    onClick={handleDelete}
                    className="w-[37px] h-[37px] bg-white rounded-full flex items-center justify-center shadow-lg shadow-rgba(0, 0, 0, 0.25)"
                  >
                    <DeleteIcon />
                  </button>
                  {!isPastEvent && (
                    <button
                      onClick={handleEditEvent}
                      className="w-[37px] h-[37px] bg-white rounded-full  flex items-center justify-center shadow-lg shadow-rgba(0, 0, 0, 0.25)"
                    >
                      <Edit />
                    </button>
                  )}
                </div>
              ) : (
                <Dropdown
                  placement="bottomLeft"
                  className="mr-2"
                  overlayClassName="event-manager-dropdown-mobile"
                  dropdownRender={() => (
                    <div className="flex flex-col bg-gray4 rounded-lg gap-[1px] overflow-hidden">
                      <span
                        className="text-white px-10 py-3 bg-black43B cursor-pointer"
                        onClick={handleDelete}
                      >
                        {t('eventManagement.deleteEvent')}
                      </span>
                      {!isPastEvent && (
                        <span
                          className="text-white px-10 py-3 bg-black43B cursor-pointer"
                          onClick={handleEditEvent}
                        >
                          {t('eventManagement.editEvent')}
                        </span>
                      )}
                    </div>
                  )}
                >
                  <section className="option-icon">
                    <OptionIcon />
                  </section>
                </Dropdown>
              )}
            </>
          )}
        </div>
        <div className="customize-tab">
          <AppTabs activeKey={tabSelected} onChange={handleChangeTab} items={items} />
        </div>
      </div>
      <ModalCreateEvent
        open={isEdit}
        onCancel={() => setIsEdit(false)}
        dataEdit={data?.data}
        onRepublish={handleRepublishAfterUpdate}
      />
      <ModalDeleteEvent
        loading={deleteLoading}
        step={stepDelete}
        isOpen={isDelete}
        onClose={handleCloseDelete}
        onDeleteEvent={handleConfirmDelete}
      />
      <ModalComponent
        open={isRepublish}
        width={WIDTH_FORM_MODAL}
        centered
        onCancel={() => setIsRepublish(false)}
      >
        <ReviewEventPublish
          event={data?.data}
          onClose={() => setIsRepublish(false)}
          onPublishEvent={handlePublishingEvent}
        />
      </ModalComponent>
      <ModalComponent
        open={isRepublishSuccess}
        width={WIDTH_FORM_MODAL_2}
        onCancel={handleClosePublishing}
        className="max-md:absolute max-md:top-0"
      >
        <PublishingEvent step={3} onClose={handleClosePublishing} />
      </ModalComponent>
    </div>
  );
}
