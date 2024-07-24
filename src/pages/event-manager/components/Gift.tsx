import { Checkbox, Grid, TableColumnsType, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ExportIcon, SortIcon, SortUnUse } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import CustomSearch from 'src/components/Search';
import CustomTable from 'src/components/Table';
import { ToastMessage } from 'src/components/Toast';
import { DATE_FORMAT } from 'src/constants';
import { C1001, MSG } from 'src/constants/errorCode';
import { useModalContext } from 'src/contexts/modal';
import { formatDate } from 'src/helpers/formatValue';
import { useAppSelector } from 'src/store';
import { getAccessToken, getUserInfo } from 'src/store/selectors/user';
import {
  useGetListTicketOptionQuery,
  useGetTotalGiftedTicketAmountQuery,
  useOrganizerGetGiftsQuery,
} from 'src/store/slices/app/api';
import { ETeamRole } from 'src/store/slices/user/types';
import '../style.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import useInfinitePageQuery from 'src/hooks/useInfiniteQuery';
import { GiftingModal } from 'src/modules/gifting/gifting.modal';
import { ETicketStatus } from 'src/pages/event-detail/types';
import { IGiftDataTable, IGiftResponse } from 'src/store/slices/app/types';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';

const { useBreakpoint } = Grid;

interface IGiftProps {
  isEventStart?: boolean;
}

export interface RouteParams {
  id: string;
}

export default function Gift({ isEventStart }: IGiftProps) {
  const { id } = useParams<RouteParams>();

  const breakpoint = useBreakpoint();
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [valueDebounce, setValueDebounce] = useState('');
  const accessToken = useAppSelector(getAccessToken);
  const userInfo = useAppSelector(getUserInfo);
  const isOperationRole = userInfo?.roleOfTeam === ETeamRole.OPERATIONS;
  const [ticketSelected, setTicketSelected] = useState<any>([]);
  const { setModalSelected, setContentParams, setPayload } = useModalContext();
  const [sortDirectionParam, setSortDirectionParam] = useState<'ASC' | 'DESC' | null>(null);
  const { rudderAnalytics } = useRudderStack();

  const { data: response } = useGetListTicketOptionQuery(
    {
      id: +id,
      sortBy: 'createdAt',
      direction: 'DESC',
    },
    {
      skip: !id,
    },
  );

  const { data: totalGiftedTicketRes } = useGetTotalGiftedTicketAmountQuery({
    collectionId: +id,
  });

  const {
    combinedData: giftResponse,
    loadMore,
    refresh: refetch,
    resetPage,
  } = useInfinitePageQuery<IGiftResponse>({
    useGetDataListQuery: useOrganizerGetGiftsQuery,
    params: {
      limit: 20,
      search: valueDebounce.trim(),
      sortBy: sortDirectionParam ? 'status' : 'createdAt',
      direction: sortDirectionParam ? sortDirectionParam : 'DESC',
      collectionId: +id,
    },
  });

  useEffect(() => {
    if (valueDebounce) {
      refetch();
    }
  }, [valueDebounce]);

  const refreshScreen = () => {
    refetch();
    setTicketSelected([]);
  };

  const { t } = useTranslation();

  const handleSelectUserId = (id: number) => {
    if (ticketSelected.includes(id)) {
      return setTicketSelected(ticketSelected.filter((item: number) => item !== id));
    }
    return setTicketSelected([...ticketSelected, id]);
  };

  const transformData = useMemo(
    () =>
      giftResponse &&
      giftResponse?.map(
        (item): IGiftDataTable => ({
          id: item.hold_ticket_id,
          createdAt: item.created_at || '',
          ticketName: item?.ticket_option_name || '',
          user: item.username ? `${item.username}` : 'N/A',
          phoneNumber: item.phone || 'N/A',
          giftingEmail: item.gifting_email || '',
          giftedDate: item.created_at || '',
          status: item.status || '',
        }),
      ),
    [giftResponse],
  );

  const columns: TableColumnsType<any> = [
    {
      key: 'data',
      render: (_, { id, status }) => {
        return (
          !isOperationRole && (
            <Checkbox
              className="pr-[6px] checkbox-customize relative"
              onChange={() => handleSelectUserId(id)}
              checked={ticketSelected.includes(id)}
              disabled={status === ETicketStatus.REFUNDED || isEventStart}
            ></Checkbox>
          )
        );
      },
      width: 24,
    },
    {
      title: () => (
        <span className="leading-[14px] text-[12px]">{t('eventManagement.nameTicketType')}</span>
      ),
      dataIndex: 'data',
      key: 'id',
      width: 300,
      render: (_, { user, ticketName }) => {
        return (
          <div className="flex items-center">
            <p
              className="text-base text-black truncate max-w-[170px] xl:max-w-[280px]"
              title={user}
            >
              {user}
            </p>
            <p
              className="text-[#8F90A6] text-[14px] leading-6 ml-2 truncate max-w-[100px] xl:max-w-[150px]"
              title={ticketName}
            >
              {ticketName}
            </p>
          </div>
        );
      },
    },
    {
      title: () => (
        <>
          <span className="leading-[14px] text-[12px]">{t('eventManagement.mobile')}</span>
        </>
      ),
      dataIndex: 'data',
      key: 'id',
      render: (_, { phoneNumber }) => <span className="text-base">{phoneNumber}</span>,
      width: 200,
    },
    {
      title: () => <span className="leading-[14px] text-[12px]">{t('eventManagement.email')}</span>,
      dataIndex: 'giftingEmail',
      key: 'giftingEmail',
      render: (_, { giftingEmail }) => {
        return (
          <Tooltip trigger={'hover'} title={giftingEmail}>
            <p className="text-base truncate max-w-[170px] xl:max-w-[280px]">{giftingEmail}</p>
          </Tooltip>
        );
      },
    },
    {
      title: () => (
        <span className="leading-[14px] text-[12px]">
          {t('eventManagement.gifting.labelTable.giftedDate')}
        </span>
      ),
      dataIndex: 'giftedDate',
      key: 'giftedDate',
      render: (giftedDate) => (
        <span className="text-base">{formatDate(giftedDate, DATE_FORMAT)}</span>
      ),
      width: 200,
    },
    {
      title: () => (
        <span className="leading-[14px] text-[12px]">
          {t('eventManagement.gifting.labelTable.status')}
        </span>
      ),
      key: 'giftedDate',
      sorter: true,
      showSorterTooltip: false,
      onHeaderCell: () => {
        return {
          onClick: () => {
            resetPage();
          },
        };
      },
      sortIcon: ({ sortOrder }) => {
        if (sortOrder) {
          setSortDirectionParam(sortOrder === 'ascend' ? 'ASC' : 'DESC');
        } else {
          setSortDirectionParam(null);
        }

        if (!sortOrder) {
          return <SortUnUse />;
        }

        return sortOrder === 'ascend' ? (
          <SortIcon className="transition-transform rotate-180" />
        ) : (
          <SortIcon className="transition-transform rotate-0" />
        );
      },
      render: ({ status }) => {
        switch (status) {
          case ETicketStatus.PAID:
            return (
              <>
                <ButtonContained
                  className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[77px] cursor-auto"
                  buttonType="type2"
                >
                  {t('eventManagement.gifting.status.pending')}
                </ButtonContained>
              </>
            );
          case ETicketStatus.SUCCESS:
            return (
              <>
                <ButtonContained
                  className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[77px] cursor-auto"
                  buttonType="type2"
                >
                  {t('eventManagement.gifting.status.claimed')}
                </ButtonContained>
              </>
            );
          case ETicketStatus.REFUNDED:
            return (
              <>
                <ButtonContained
                  className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[77px] cursor-auto"
                  buttonType="type2"
                >
                  {t('eventManagement.gifting.status.refunded')}
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

  const mobileColumns: TableColumnsType<any> = [
    {
      title: () => t('eventManagement.fanDetails'),
      key: 'nameTicketType',
      sorter: true,
      showSorterTooltip: false,
      onHeaderCell: () => {
        return {
          onClick: () => {
            resetPage();
          },
        };
      },
      sortIcon: ({ sortOrder }) => {
        if (sortOrder) {
          setSortDirectionParam(sortOrder === 'ascend' ? 'ASC' : 'DESC');
        } else {
          setSortDirectionParam(null);
        }

        if (!sortOrder) {
          return <SortUnUse />;
        }

        return (
          <SortIcon
            className={` transition-transform ${sortOrder === 'ascend' ? 'rotate-180 ' : 'rotate-0'}`}
          />
        );
      },
      render: (_, record) => {
        return (
          <div className="my-1 flex flex-col">
            <div className="flex items-center">
              {!isOperationRole && (
                <Checkbox
                  className="pr-[6px] pb-1 checkbox-customize relative"
                  onChange={() => handleSelectUserId(Number(record?.id))}
                  checked={ticketSelected.includes(record?.id)}
                  disabled={record?.status === ETicketStatus.REFUNDED || isEventStart}
                ></Checkbox>
              )}
              <span className="text-[14px] text-black block max-w-[140px] md:max-w-none truncate mr-1">
                {record?.user}
              </span>
              <span className="text-[12px] leading-[14px] text-gray">{record?.ticketName}</span>
            </div>
            <span className="text-xs block text-gray">{record?.phoneNumber}</span>
            <span className="text-xs text-gray">{record?.giftingEmail}</span>
          </div>
        );
      },
      width: 250,
    },
    {
      title: t('eventManagement.gifting.labelTable.giftedDate'),
      key: 'refundStatus',
      render: ({ status, ...restProps }) => {
        return (
          <>
            <span className="text-[14px] block leading-[24px]">
              {formatDate(restProps.giftedDate, DATE_FORMAT)}
            </span>
            {(() => {
              switch (status) {
                case ETicketStatus.PAID:
                  return (
                    <ButtonContained
                      className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[77px] cursor-auto"
                      buttonType="type2"
                    >
                      {t('eventManagement.gifting.status.pending')}
                    </ButtonContained>
                  );
                case ETicketStatus.SUCCESS:
                  return (
                    <ButtonContained
                      className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[77px] cursor-auto"
                      buttonType="type2"
                    >
                      {t('eventManagement.gifting.status.claimed')}
                    </ButtonContained>
                  );
                case ETicketStatus.REFUNDED:
                  return (
                    <>
                      {breakpoint.md ? (
                        <ButtonContained
                          className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[105px] cursor-auto"
                          buttonType="type2"
                        >
                          {t('eventManagement.gifting.status.refunded')}
                        </ButtonContained>
                      ) : (
                        <ButtonContained
                          className="!text-[12px] !border-[#121313] !text-[#121313] md:w-[116px] h-[22px] w-[77px] cursor-auto"
                          buttonType="type2"
                        >
                          {t('eventManagement.gifting.mobile.status.refunded')}
                        </ButtonContained>
                      )}
                    </>
                  );
                default:
                  return null;
              }
            })()}
          </>
        );
      },
      width: 200,
    },
  ];

  const handleSearch = async (value: string) => {
    setValueDebounce(value);
  };

  const debounceHandler = useCallback(debounce(handleSearch, 500), []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value || '');
    debounceHandler(e.target.value);
  };

  const handleExportCSV = async () => {
    let url = '';
    if (import.meta.env.VITE_BASE_URL![import.meta.env.VITE_BASE_URL!.length - 1] === '/') {
      url = `${import.meta.env.VITE_BASE_URL}gift/export/${id}`;
    } else {
      url = `${import.meta.env.VITE_BASE_URL}/gift/export/${id}`;
    }
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const payload = {
      ...(valueDebounce && { search: valueDebounce }),
      sortBy: sortDirectionParam ? 'status' : 'createdAt',
      direction: sortDirectionParam ? sortDirectionParam : 'DESC',
    };
    const options = {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(payload),
    };
    try {
      const res = await fetch(url, options);

      if (res) {
        const blob = await res.blob();
        const link = document.createElement('a');
        const fileURL = window.URL.createObjectURL(blob);
        const currentDate = formatDate(dayjs(), DATE_FORMAT);
        link.href = fileURL;
        link.download = `Gifted_list_${currentDate}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(fileURL);
        rudderAnalytics?.track(ERudderStackEvents.GiftHistoryExported, {
          eventType: ERudderStackEvents.GiftHistoryExported,
          data: {
            ...(valueDebounce && { search: valueDebounce }),
            sortBy: sortDirectionParam ? 'status' : 'createdAt',
            direction: sortDirectionParam ? sortDirectionParam : 'DESC',
            eventId: id,
          },
        });
      }
    } catch (err: any) {
      console.error(err);
      ToastMessage.error(t(MSG[err?.data?.validator_errors || C1001]));
    }
  };

  const handleRefundMultiTickets = () => {
    setContentParams && setContentParams({ numberOfFans: ticketSelected.length });
    setPayload && setPayload({ collectionId: id, holdTicketIds: ticketSelected });
    setModalSelected('GIFT_REVOKE');
  };

  return (
    <div className="min-h-[calc(100vh-400px)] bg-gray2 md:h-auto flex flex-col md:min-h-[727px] rounded-[3px] min-h-10 py-[12px] md:py-[26px] px-[12px] md:px-[51px] md:mb-[47px] [&>.custom-table]:!p-0 shadow-lg shadow-rgba(0, 0, 0, 0.25) border-l-[2px] border-red1 border-solid">
      {giftResponse.length === 0 && search === undefined ? (
        <div className="h-[100%] pt-[100px] md:pt-[0] md:h-auto flex items-start text-center justify-center uppercase text-[14px] leading-[16px] text-[#121313]  md:mt-[80px] tracking-[2px]">
          {t('eventManagement.gifting.noRecord')}
        </div>
      ) : (
        <>
          <div className="flex justify-between max-md:items-end mb-5 md:mb-0">
            <span className="text-xs text-gray3">
              {totalGiftedTicketRes?.data?.totalGifted || 0}{' '}
              {t('eventManagement.gifting.countTicket')}
            </span>
            {!isOperationRole && (
              <div>
                <div
                  className={`flex justify-center items-center gap-2 ${
                    giftResponse?.length === 0 || isOperationRole
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                  onClick={handleExportCSV}
                >
                  <span className="leading-6 text-[12px] text-primary ">
                    {t('eventManagement.exportToCSV')}
                  </span>
                  <ExportIcon />
                </div>
              </div>
            )}
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
                className="w-[163px] md:h-[37px] md:w-[163px] button-override h-[37px]"
                disabled={!ticketSelected.length}
                onClick={handleRefundMultiTickets}
              >
                <span className="!text-[14px]">{t('eventManagement.refundTickets')}</span>
              </ButtonContained>
            )}
          </div>
          <InfiniteScroll
            dataLength={giftResponse?.length}
            hasMore={true}
            loader={null}
            next={loadMore}
          >
            <CustomTable
              columns={breakpoint.md ? columns : mobileColumns}
              data={transformData}
              activeHeader={false}
              className="mt-4 w-full md:w-full"
              emptyText={!search ? ' ' : t('eventManagement.gifting.record.noResult')}
            />
          </InfiniteScroll>
        </>
      )}

      {!isOperationRole && !!response?.data.length && !isEventStart && (
        <div className="flex justify-center mt-auto">
          <ButtonContained
            className="w-[163px] mb-auto"
            buttonType="type1"
            onClick={() => setModalSelected('GIFTING_TICKET')}
            mode="medium"
          >
            {t('eventManagement.gifting.button.sendGift')}
          </ButtonContained>
        </div>
      )}

      <GiftingModal refreshCallback={refreshScreen} data={response?.data} collectionId={+id} />
    </div>
  );
}
