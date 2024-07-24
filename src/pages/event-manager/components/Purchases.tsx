import { Checkbox, Grid, TableColumnsType, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { debounce, get } from 'lodash';
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import { ExportIcon, SortIcon, SortUnUse } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import OverflowTooltip from 'src/components/OverflowTooltip';
import CustomSearch from 'src/components/Search';
import CustomTable from 'src/components/Table';
import { ToastMessage } from 'src/components/Toast';
import { DATE_FORMAT, RefundStatus, RefundType } from 'src/constants';
import { C1001, MSG } from 'src/constants/errorCode';
import { useModalContext } from 'src/contexts/modal';
import { nFormatter } from 'src/helpers/formatNumber';
import { formatDate } from 'src/helpers/formatValue';
import useInfinitePageQuery from 'src/hooks/useInfiniteQuery';
import { useSocketIo } from 'src/hooks/useSocketIo';
import RefundModal from 'src/modules/refund/refund-modal';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import { SocketEvent } from 'src/socket/events';
import { useAppSelector } from 'src/store';
import { getAccessToken, getUserInfo } from 'src/store/selectors/user';
import { useGetEventPurchasesQuery, useGetPurchaseStatisticQuery } from 'src/store/slices/app/api';
import { ETeamRole } from 'src/store/slices/user/types';
import '../style.scss';
const { useBreakpoint } = Grid;

interface DataType {
  key: React.Key;
  eventName: string;
  name: string;
  ticketType: string;
  nameTicketType: {
    name: string;
    ticketType: string;
  };
  purchaseDate: string;
  mobile: string;
  email: string;
  phone: string;
  createdAt: string;
  refundStatus?: string;
  refundDate?: Date;
  id?: number;
}

export interface RouteParams {
  id: string;
}

interface IPurchaseProps {
  isEventStart?: boolean;
  cb?: CallableFunction;
}

export default function Purchases({ isEventStart, cb }: IPurchaseProps) {
  const { id } = useParams<RouteParams>();
  const breakpoint = useBreakpoint();
  const [search, setSearch] = useState('');
  const [valueDebounce, setValueDebounce] = useState('');
  const accessToken = useAppSelector(getAccessToken);
  const userInfo = useAppSelector(getUserInfo);
  const isOperationRole = userInfo?.roleOfTeam === ETeamRole.OPERATIONS;
  const [ticketSelected, setTicketSelected] = useState<any>([]);
  const [sortDirectionParam, setSortDirectionParam] = useState<'ASC' | 'DESC' | null>(null);
  const { setModalSelected, setUseBackButton, setContentParams, setPayload } = useModalContext();
  const { rudderAnalytics } = useRudderStack();
  const { combinedData, loadMore, refresh, resetPage } = useInfinitePageQuery({
    useGetDataListQuery: useGetEventPurchasesQuery,
    params: {
      limit: 20,
      search: valueDebounce.trim(),
      sortBy: sortDirectionParam ? 'refund' : 'createdAt',
      direction: sortDirectionParam ? sortDirectionParam : 'DESC',
      id: +id,
    },
  });

  useSocketIo(
    (_data) => {
      refresh();
    },
    SocketEvent.REFUND_TICKET_PROCESS,
    [],
  );

  useEffect(() => {
    if (valueDebounce) {
      refresh();
    }
  }, [valueDebounce]);

  const { t } = useTranslation();

  const handleSelectUserId = (id: number) => {
    if (ticketSelected.includes(id)) {
      return setTicketSelected(ticketSelected.filter((item: number) => item !== id));
    }
    return setTicketSelected([...ticketSelected, id]);
  };

  const refreshData = () => {
    refresh();
    setTicketSelected([]);
    cb && cb();
  };

  const handleOpenRefundModal = ({ username, refundDate, ...rest }: any) => {
    setModalSelected(RefundType.REFUND_REQUEST);
    setContentParams &&
      setContentParams({ fanName: username, refundDate: formatDate(refundDate, 'DD/MM/YYYY') });
    setPayload &&
      setPayload({
        collectionId: rest.collectionId,
        refundReason: rest.reasonOfFan,
        ticketId: rest.id,
      });
    setUseBackButton && setUseBackButton(true);
  };

  const { data: statisticData } = useGetPurchaseStatisticQuery({ id: +id }, { skip: !id });
  const data = useMemo(
    () =>
      combinedData.map((dt: any) => {
        return {
          nameTicketType: {
            name: dt?.userWallet?.user?.username,
            ticketType: dt?.ticketOption?.name,
          },
          phone: dt?.userWallet?.user?.phone,
          email: dt?.userWallet?.user?.email,
          username: dt?.userWallet?.user?.username,
          ...dt,
          refundStatus: dt?.refundRequest?.refundStatus || undefined,
          refundDate: dt?.refundRequest?.createdAt,
          reasonOfFan: dt?.refundRequest?.reasonOfFan,
          fullName: `${dt?.userWallet?.user?.firstName} ${dt?.userWallet?.user?.lastName}`,
        };
      }),
    [combinedData],
  );

  const columns: TableColumnsType<DataType> = [
    {
      key: 'data',
      render: ({ id, refundStatus }) => {
        return (
          !isOperationRole && (
            <Checkbox
              className="pr-[6px] checkbox-customize relative"
              onChange={() => handleSelectUserId(id)}
              checked={ticketSelected.includes(id)}
              disabled={
                (refundStatus !== undefined &&
                  refundStatus !== RefundStatus.ADMIN_REJECTED &&
                  refundStatus !== RefundStatus.ORGANIZER_REJECTED) ||
                isEventStart
              }
            ></Checkbox>
          )
        );
      },
      width: 24,
    },
    {
      title: () => <span className="leading-[14px]">{t('eventManagement.nameTicketType')}</span>,
      dataIndex: 'nameTicketType',
      key: 'nameTicketType',
      width: 300,
      render: (record) => {
        return (
          <div className="flex items-center">
            <p
              className="text-base text-black truncate max-w-[170px] xl:max-w-[280px]"
              title={record?.name}
            >
              {record?.name}
            </p>
            <p
              className="text-[#8F90A6] text-[14px] leading-6 ml-2 truncate max-w-[100px] xl:max-w-[150px]"
              title={record?.ticketType}
            >
              {record?.ticketType}
            </p>
          </div>
        );
      },
    },
    {
      title: () => <span className="leading-[14px]">{t('eventManagement.mobile')}</span>,
      dataIndex: 'user',
      key: 'mobile',
      render: (_, record) => <span className="text-base">{record?.phone}</span>,
      width: 200,
    },
    {
      title: () => <span className="leading-[14px]">{t('eventManagement.email')}</span>,
      dataIndex: 'user',
      key: 'email',
      render: (_, record) => (
        <Tooltip trigger={'hover'} title={record?.email}>
          <p className="text-base truncate max-w-[170px] xl:max-w-[280px]">{record?.email}</p>
        </Tooltip>
      ),
    },
    {
      title: () => <span className="leading-[14px]">{t('eventManagement.purchaseDate')}</span>,
      dataIndex: 'paymentTransaction',
      key: 'purchaseDate',
      render: (_, record) => (
        <span className="text-base">{formatDate(record?.createdAt, DATE_FORMAT)}</span>
      ),
      width: 200,
    },
    {
      title: () => <span className="leading-[14px]">{t('eventManagement.refundStatus')}</span>,
      key: 'refundStatus',
      showSorterTooltip: false,
      sorter: true,
      onHeaderCell: () => {
        return {
          onClick: () => {
            resetPage();
          },
        };
      },
      sortIcon: ({ sortOrder }) => {
        if (!sortOrder) {
          setSortDirectionParam(null);
          return <SortUnUse />;
        } else {
          setSortDirectionParam(sortOrder === 'ascend' ? 'ASC' : 'DESC');
        }
        return sortOrder === 'ascend' ? (
          <SortIcon className="transition-transform rotate-180 " />
        ) : (
          <SortIcon className="transition-transform rotate-0 " />
        );
      },
      render: ({ refundStatus, ...restProps }) => {
        switch (refundStatus) {
          case RefundStatus.PENDING:
            return (
              <>
                <ButtonContained
                  className=" !border-[#008AD8] !text-[#008AD8] md:w-[116px] h-[22px] w-[77px] !text-[12px]"
                  buttonType="type2"
                  disabled={isOperationRole}
                  onClick={() => handleOpenRefundModal(restProps)}
                >
                  {t('eventManagement.refundStatus.requested')}
                </ButtonContained>
              </>
            );
          case RefundStatus.SUCCESS:
            return (
              <>
                <ButtonContained
                  className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[77px] cursor-auto"
                  buttonType="type2"
                >
                  {t('eventManagement.refundStatus.refunded')}
                </ButtonContained>
              </>
            );
          case RefundStatus.ORGANIZER_APPROVED: {
            if (/free/.test(restProps.nameTicketType.ticketType)) {
              return (
                <>
                  <ButtonContained
                    className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[77px] cursor-auto"
                    buttonType="type2"
                  >
                    {t('eventManagement.refundStatus.refunded')}
                  </ButtonContained>
                </>
              );
            }
            return (
              <>
                <ButtonContained
                  className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[77px] cursor-auto"
                  buttonType="type2"
                >
                  {t('eventManagement.refundStatus.pending')}
                </ButtonContained>
              </>
            );
          }
          case RefundStatus.ADMIN_APPROVED:
          case RefundStatus.PROCESSING:
          case RefundStatus.FAILED:
            return (
              <>
                <ButtonContained
                  className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[77px] cursor-auto"
                  buttonType="type2"
                >
                  {t('eventManagement.refundStatus.pending')}
                </ButtonContained>
              </>
            );

          case RefundStatus.ORGANIZER_REJECTED:
          case RefundStatus.ADMIN_REJECTED:
            return (
              <>
                <ButtonContained
                  className="!text-[12px] md:w-[116px] !border-[#E53535]
                  !text-[#E53535] h-[22px] w-[77px]  cursor-auto"
                  buttonType="type2"
                >
                  {t('eventManagement.refundStatus.rejected')}
                </ButtonContained>
              </>
            );

          default:
            return <></>;
        }
      },
      width: 200,
    },
  ];

  const mobileColumns: TableColumnsType<DataType> = [
    {
      title: () => t('eventManagement.fanDetails'),
      dataIndex: 'nameTicketType',
      key: 'nameTicketType',
      sorter: true,
      onHeaderCell: () => {
        return {
          onClick: () => {
            resetPage();
          },
        };
      },
      sortIcon: ({ sortOrder }) => {
        if (!sortOrder) {
          setSortDirectionParam(null);
          return <SortUnUse />;
        } else {
          setSortDirectionParam(sortOrder === 'ascend' ? 'ASC' : 'DESC');
        }

        return (
          <SortIcon
            className={` transition-transform ${sortOrder === 'ascend' ? 'rotate-0 ' : 'rotate-180'}`}
          />
        );
      },
      render: (_, record) => {
        return (
          <div className="my-1 flex flex-col">
            <div className="flex items-center">
              <div className="text-[14px] text-black block max-w-[140px] md:max-w-none truncate mr-1 flex items-center">
                {!isOperationRole && (
                  <Checkbox
                    className="pr-[6px] pb-1 checkbox-customize relative"
                    onChange={() => handleSelectUserId(Number(record?.id))}
                    checked={ticketSelected.includes(record?.id)}
                    disabled={
                      (record?.refundStatus !== undefined &&
                        record?.refundStatus !== RefundStatus.ADMIN_REJECTED &&
                        record?.refundStatus !== RefundStatus.ORGANIZER_REJECTED) ||
                      isEventStart
                    }
                  ></Checkbox>
                )}
                <span className="truncate max-md:w-[140px]">{record?.nameTicketType?.name}</span>
              </div>
              <OverflowTooltip title={record?.nameTicketType?.ticketType}>
                <span className="block text-xs text-gray truncate max-md:w-[96px]">
                  {record?.nameTicketType?.ticketType}
                </span>
              </OverflowTooltip>
            </div>
            <span className="text-xs text-gray">{record?.phone}</span>
            <span className="text-xs text-gray">{record?.email}</span>
          </div>
        );
      },
      width: 250,
    },
    {
      title: () => t('eventManagement.purchaseDate'),
      dataIndex: 'paymentTransaction',
      key: 'nameTicketType',
      render: (_, record) => {
        return (
          <>
            <span className="text-[14px] block">{formatDate(record?.createdAt, DATE_FORMAT)}</span>
            {(() => {
              switch (record.refundStatus) {
                case RefundStatus.PENDING:
                  return (
                    <>
                      <ButtonContained
                        className=" !border-[#008AD8] !text-[#008AD8] md:w-[116px] h-[22px] w-[77px] !text-[12px]"
                        buttonType="type2"
                        disabled={isOperationRole}
                        onClick={() => handleOpenRefundModal({ ...record })}
                      >
                        {breakpoint.md
                          ? t('eventManagement.refundStatus.requested')
                          : t('eventManagement.mobile.refundStatus.request')}
                      </ButtonContained>
                    </>
                  );
                case RefundStatus.SUCCESS:
                  return (
                    <>
                      <ButtonContained
                        className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[77px] cursor-auto"
                        buttonType="type2"
                      >
                        {t('eventManagement.mobile.refundStatus.refunded')}
                      </ButtonContained>
                    </>
                  );
                case RefundStatus.ORGANIZER_APPROVED: {
                  if (/free/.test(record.nameTicketType.ticketType)) {
                    return (
                      <>
                        <ButtonContained
                          className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[77px] cursor-auto"
                          buttonType="type2"
                        >
                          {t('eventManagement.mobile.refundStatus.refunded')}
                        </ButtonContained>
                      </>
                    );
                  }
                  return (
                    <>
                      <ButtonContained
                        className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[77px] cursor-auto"
                        buttonType="type2"
                      >
                        {t('eventManagement.mobile.refundStatus.pending')}
                      </ButtonContained>
                    </>
                  );
                }
                case RefundStatus.ADMIN_APPROVED:
                case RefundStatus.PROCESSING:
                case RefundStatus.FAILED:
                  return (
                    <>
                      <ButtonContained
                        className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[77px] cursor-auto"
                        buttonType="type2"
                      >
                        {t('eventManagement.mobile.refundStatus.pending')}
                      </ButtonContained>
                    </>
                  );

                case RefundStatus.ORGANIZER_REJECTED:
                case RefundStatus.ADMIN_REJECTED:
                  return (
                    <>
                      <ButtonContained
                        className="!text-[12px] md:w-[116px] !border-[#E53535]
                        !text-[#E53535] h-[22px] w-[77px]  cursor-auto"
                        buttonType="type2"
                      >
                        {t('eventManagement.mobile.refundStatus.rejected')}
                      </ButtonContained>
                    </>
                  );

                default:
                  return <></>;
              }
            })()}
          </>
        );
      },
    },
  ];

  const handleSearch = async (value: string) => {
    setValueDebounce(value);
  };

  const debounceHandler = useCallback(debounce(handleSearch, 500), []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debounceHandler(e.target.value);
  };

  const handleExportCSV = async () => {
    if (data.length === 0 || isOperationRole) return;
    try {
      let url = '';
      if (import.meta.env.VITE_BASE_URL![import.meta.env.VITE_BASE_URL!.length - 1] === '/') {
        url = `${import.meta.env.VITE_BASE_URL}events/purchases/export-excel/${id}`;
      } else {
        url = `${import.meta.env.VITE_BASE_URL}/events/purchases/export-excel/${id}`;
      }
      const headers = new Headers({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      });

      const options = {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ search: valueDebounce }),
      };

      const response = await fetch(url, options);
      const blob = await response.blob();
      const link = document.createElement('a');
      const fileURL = window.URL.createObjectURL(blob);
      const currentDate = formatDate(dayjs(), DATE_FORMAT);
      link.href = fileURL;
      link.download = `Purchaser_list_${currentDate}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      rudderAnalytics?.track(ERudderStackEvents.OrganizerPurchaseHistoryExported, {
        eventType: ERudderStackEvents.OrganizerPurchaseHistoryExported,
        data: {
          ...(valueDebounce && { searchString: valueDebounce }),
          eventId: id,
        },
      });
    } catch (error: any) {
      console.error(error);
      ToastMessage.error(t(MSG[error?.data?.validator_errors || C1001]));
    }
  };

  const handleRefundMultiTickets = () => {
    setContentParams && setContentParams({ countId: ticketSelected.length });
    setPayload && setPayload({ collectionId: id, ticketIds: ticketSelected });
    setModalSelected(RefundType.REFUND_MULTI);
  };

  const handleResetPage = () => {
    resetPage();
  };

  const handleResetPageHandler = useCallback(debounce(handleResetPage, 500), []);

  return (
    <div className="min-h-[calc(100vh-400px)] bg-gray2 rounded-[3px] min-h-10 py-[12px] md:py-[26px] px-[12px] md:px-[51px] mb-[74px] [&>.custom-table]:!p-0 shadow-lg shadow-rgba(0, 0, 0, 0.25) border-l-[2px] border-red1 border-solid">
      <div className="flex justify-between max-md:items-end mb-5 md:mb-0">
        <span className="text-xs text-gray3">
          {nFormatter(statisticData?.data?.totalSold || '0')}/
          {nFormatter(statisticData?.data?.total || '0')} {t('eventManagement.ticketsSold')}
        </span>
        <div>
          <div
            className={`flex justify-center items-center gap-2 ${
              data?.length === 0 || isOperationRole ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={handleExportCSV}
          >
            <span className="leading-6 text-[12px] text-primary ">
              {t('eventManagement.exportToCSV')}
            </span>
            <ExportIcon />
          </div>
        </div>
      </div>

      <div className="md:w-full flex flex-wrap justify-center md:justify-between pt-7">
        <CustomSearch
          onChange={handleSearchChange}
          value={search}
          placeholder={t('eventManagement.searchPurchases')}
          type="type2"
          className="w-full md:w-[310px] mb-6"
        />
        {!isOperationRole && (
          <ButtonContained
            buttonType="type2"
            className="md:w-[163px] md:h-[37px] w-[163px] button-override h-[37px]"
            disabled={!ticketSelected.length || isEventStart}
            onClick={handleRefundMultiTickets}
          >
            <span className="!text-[14px]">{t('eventManagement.refundTickets')}</span>
          </ButtonContained>
        )}
      </div>
      <InfiniteScroll dataLength={data?.length} hasMore={true} loader={null} next={loadMore}>
        <CustomTable
          columns={breakpoint.md ? columns : mobileColumns}
          data={data}
          activeHeader={false}
          className="mt-4 w-full md:w-full"
          emptyText={!search ? ' ' : t('eventManagement.noResults')}
        />
      </InfiniteScroll>
      <RefundModal refreshCallback={refreshData} isOrganizerCreateTicket={true} />
    </div>
  );
}
