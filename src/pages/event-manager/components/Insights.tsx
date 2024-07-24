import { Line, Bar } from '@ant-design/plots';
import { TableColumnsType, Grid } from 'antd';
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import CustomTable from 'src/components/Table';
import SelectField from 'src/components/Select';
import { useParams } from 'react-router-dom';
import { RouteParams } from './Purchases';
import {
  useGetEventAttendanceQuery,
  useGetEventAttendanceStatisticQuery,
  useGetEventPurchaseStatisticQuery,
  useGetInsightsQuery,
  useGetRevenueBreakdownQuery,
} from 'src/store/slices/app/api';
import CustomSearch from 'src/components/Search';
import { debounce } from 'lodash';
import { formatDate } from 'src/helpers/formatValue';
import { ATTENDANCE, CHECKIN_STS, CHECKIN_STS_KEY, DATE_FORMAT_2 } from 'src/constants';
import { getCurrency } from 'src/helpers';

import { nFormatter } from 'src/helpers/formatNumber';
import dayjs from 'dayjs';
import OverflowTooltip from 'src/components/OverflowTooltip';
import { useTranslation } from 'react-i18next';
import {
  AttendanceIcon,
  DemographicIcon,
  InteractionIcon,
  PageViewIcon,
  RevenueIcon,
  ReviewIcon,
  UpniqueIcon,
} from 'src/assets/icons';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import eventBus from 'src/socket/event-bus';
import { ESocketEvent } from 'src/socket/SocketEvent';
const { useBreakpoint } = Grid;
interface DataType {
  key: React.Key;
  eventName: string;
  ticketType: string;
  purchaseDate: string;
  mobile: string;
  email: string;
}

interface RevenueDataType {
  key: React.Key;
  ticketDetails: any;
  revenue: number;
}

interface AttendeeDataType {
  nameTicket: {
    username: string;
    type: string;
  };
  email: string;
  attendance: boolean;
}

export default function Insights() {
  const [search, setSearch] = useState('');
  const [valueDebounce, setValueDebounce] = useState('');
  const breakpoint = useBreakpoint();
  const { rudderAnalytics } = useRudderStack();
  const userInfo = useAppSelector(getUserInfo);
  // const countChartDataRefresh = useAppSelector(getCountChartDataRefresh);
  const { id } = useParams<RouteParams>();
  const { data: insights } = useGetInsightsQuery({ id: +id }, { skip: !id });
  const { data: revenueBreakdown } = useGetRevenueBreakdownQuery({ id: +id }, { skip: !id });
  const { data: eventAttendance } = useGetEventAttendanceQuery(
    { id: +id, search: valueDebounce.trim() },
    { skip: !id },
  );
  const { data: attendanceStatistic, refetch: refreshAttendanceData } =
    useGetEventAttendanceStatisticQuery({ id: +id }, { skip: !id });
  const { data: purchaseStatistic, refetch: refreshPurchaseData } =
    useGetEventPurchaseStatisticQuery(
      { id: +id, endTime: dayjs(new Date()).unix() },
      { skip: !id },
    );

  const { t } = useTranslation();

  const handleSearch = async (value: string) => {
    setValueDebounce(value);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debounceHandler(e.target.value);
    debouncePushRudderStackHandler(e);
  };

  const handlePushToRudderStack = (e: ChangeEvent<HTMLInputElement>) => {
    rudderAnalytics?.track(ERudderStackEvents.OrganizerSearchedEventAttendance, {
      eventType: ERudderStackEvents.OrganizerSearchedEventAttendance,
      data: {
        searchValue: e.target.value,
      },
    });
  };
  const debounceHandler = useCallback(debounce(handleSearch, 500), []);
  const debouncePushRudderStackHandler = useCallback(debounce(handlePushToRudderStack, 2000), []);

  const revenueBreakdownData = useMemo(
    () =>
      revenueBreakdown?.data?.map((dt) => {
        const { revenue, ...ticketDetails } = dt;
        return {
          ticketDetails,
          revenue: {
            currency: dt.currency,
            revenue: revenue,
          },
        };
      }),
    [revenueBreakdown],
  );

  const eventAttendanceData = useMemo(
    () =>
      eventAttendance?.data?.map((dt) => {
        const { email, status, ...nameTicket } = dt;
        return { nameTicket, email, status };
      }),
    [eventAttendance],
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: t('eventManagement.nameTicket'),
      dataIndex: 'nameTicket',
      key: 'nameTicket',
      render: (record) => {
        return (
          <div className="flex items-center">
            <p
              className="text-[16px] text-black truncate max-w-[170px] xl:max-w-[300px]"
              title={record?.username}
            >
              {record?.username}
            </p>
            <OverflowTooltip title={record?.type}>
              <p className="text-primary text-[14px] ml-2 truncate max-w-[108px]">{record?.type}</p>
            </OverflowTooltip>
          </div>
        );
      },
      width: 200,
    },
    {
      title: t('eventManagement.email'),
      dataIndex: 'email',
      key: 'email',
      render: (record) => (
        <p className="text-base truncate max-w-[170px] xl:max-w-[300px]" title={record}>
          {record}
        </p>
      ),
      width: 200,
    },
    {
      title: t('eventManagement.attendance'),
      dataIndex: 'status',
      key: 'status',
      render: (record) => (
        <span
          className={`text-base ${
            record === CHECKIN_STS_KEY.CHECKED ? 'text-green1' : 'text-black'
          } `}
        >
          {t(CHECKIN_STS[record])}
        </span>
      ),
      width: 200,
    },
  ];

  const mobileColumns: TableColumnsType<AttendeeDataType> = [
    {
      title: t('eventManagement.fanDetails'),
      key: 'nameTicket',
      render: (_, record) => {
        return (
          <div className="my-1">
            <div className="flex items-center">
              <span className="text-[14px] text-black text-nowrap block max-w-[100px] truncate">
                {record?.nameTicket?.username}
              </span>
              <span className="text-gray text-xs ml-2 text-nowrap block max-w-[96px] truncate">
                {record?.nameTicket?.type}
              </span>
            </div>
            <span className="text-gray text-xs">{record?.email}</span>
          </div>
        );
      },
      width: 250,
    },
    {
      title: t('eventManagement.attendance'),
      dataIndex: 'status',
      key: 'status',
      render: (record) => {
        if (CHECKIN_STS[record] === CHECKIN_STS[CHECKIN_STS_KEY.CHECKED])
          return <span className="text-xs text-green1 text-nowrap">{t(CHECKIN_STS[record])}</span>;
        else return <span className="text-xs text-nowrap">{t(CHECKIN_STS[record])}</span>;
      },
      width: 80,
    },
  ];

  const revenueColumns: TableColumnsType<RevenueDataType> = [
    {
      title: t('eventManagement.ticketDetails'),
      dataIndex: 'ticketDetails',
      key: 'ticketDetails',
      width: 300,
      render: (data) => (
        <>
          <div className="flex items-center">
            <OverflowTooltip title={data.name}>
              <span className="text-[14px] text-black block max-w-[150px] truncate">
                {data.name}
              </span>
            </OverflowTooltip>
            <span className="text-gray text-[12px] ml-1">
              {nFormatter(data.purchased)}/{nFormatter(data.capacity)}
            </span>
          </div>
          <p className="text-gray text-[12px]">
            {data.currency} {getCurrency(data.currency)} {nFormatter(data.price)}
          </p>
        </>
      ),
    },
    {
      title: t('eventManagement.revenue'),
      dataIndex: 'revenue',
      key: 'revenue',
      render: (data) => (
        <span className="text-[14px] text-black">
          {getCurrency(data.currency)} {nFormatter(data.revenue)}
        </span>
      ),
      width: 200,
    },
  ];

  const purchaseData = useMemo(
    () =>
      purchaseStatistic?.data
        ? purchaseStatistic.data.map((dt) => ({
            time: formatDate(dt.time, DATE_FORMAT_2),
            value: dt.value,
          }))
        : [],
    [purchaseStatistic],
  );

  const isNoTicketData = useMemo(
    () => Object.values(purchaseData).every(({ value }) => !value),
    [purchaseStatistic],
  );

  const config = {
    data: purchaseData,
    xField: 'time',
    yField: 'value',
    colorField: 'black',
    axis: {
      x: {
        line: true,
        label: true,
        labelFill: 'black',
        labelFontSize: 12,
        labelFontWeight: '400',
        lineLineWidth: 5,
        lineStroke: 'black',
        lineStrokeOpacity: 1,
        labelFillOpacity: 1,
        labelAlign: 'horizontal',
        grid: false,
        labelAutoHide: true,
        labelAutoEllipsis: true,
        labelAutoWrap: true,
        tickStrokeOpacity: 0,
      },
      y: {
        line: true,
        label: true,
        labelFill: 'black',
        labelFontSize: 12,
        labelFontWeight: '500',
        lineLineWidth: 5,
        lineStroke: 'black',
        lineStrokeOpacity: 1,
        labelStrokeOpacity: 1,
        labelAlign: 'horizontal',
        grid: false,
        tickStrokeOpacity: 0,
      },
    },
    tooltip: (_: any, index: number, data: any) => ({
      value: data[index].value,
    }),
    interaction: {
      tooltip: {
        render: (_: any, { title, items }: any) => {
          return (
            <div>
              {items[0].value} tickets purchased {title}
            </div>
          );
        },
      },
    },
    style: {
      lineWidth: 1,
    },
    scale: {
      y: {
        domain: isNoTicketData ? [0, 4] : undefined,
      },
    },
  };

  const defaultAttendance = [
    {
      type: 'absent',
      value: 0,
    },
    { type: 'checked in', value: 0 },
  ];

  const attendanceData = useMemo(
    () =>
      attendanceStatistic && attendanceStatistic.data
        ? Object.entries(attendanceStatistic.data).map(([type, value]) => ({
            type: ATTENDANCE[type],
            value: +value,
          }))
        : defaultAttendance,
    [attendanceStatistic],
  );

  const isNoData = useMemo(
    () => Object.values(attendanceData).every(({ value }) => !+value),
    [attendanceStatistic],
  );

  const attendanceConfig = {
    data: attendanceData,
    xField: 'type',
    yField: 'value',
    colorField: 'black',
    legend: false,
    height: 300,
    axis: {
      x: {
        line: true,
        label: true,
        labelFill: 'black',
        labelFontSize: 12,
        labelFontWeight: '500',
        lineLineWidth: 5,
        lineStroke: 'black',
        lineStrokeOpacity: 1,
        labelFillOpacity: 1,
        labelAlign: 'horizontal',
        grid: false,
        labelAutoHide: true,
        labelAutoEllipsis: true,
        labelAutoWrap: true,
        tickStrokeOpacity: 0,
      },
      y: {
        line: true,
        label: true,
        labelFill: 'black',
        labelFontSize: 12,
        labelFontWeight: '500',
        lineLineWidth: 5,
        lineStroke: 'black',
        lineStrokeOpacity: 1,
        labelStrokeOpacity: 1,
        labelAlign: 'horizontal',
        grid: false,
        tickStrokeOpacity: 0,
      },
    },
    style: {
      radiusTopLeft: 10,
      radiusTopRight: 10,
    },
    scale: {
      x: {
        type: 'band',
        paddingOuter: 0.2,
        paddingInner: 0.2,
        flex: 1,
      },
      y: {
        domain: isNoData ? [0, 5] : undefined,
      },
    },
    autoFit: true,
    tooltip: (_: any, index: number, data: any) => ({
      value: data[index].value,
    }),
    interaction: {
      tooltip: {
        render: (_: any, { title, items }: any) => {
          return (
            <div>
              {items[0].value} users {title}
            </div>
          );
        },
      },
    },
  };

  const optionData = [
    { label: t('eventManagement.attendanceOfEvent'), value: 1 },
    { label: t('eventManagement.ticketsPurchasedOverTime'), value: 2 },
  ];

  const [chartType, setChartType] = useState(1);

  const handleChangeType = (val: any) => {
    setChartType(val);
  };

  const lisData = [
    {
      value: `
      ${getCurrency(insights?.data?.currency || 'USD')}
      ${insights && insights.data ? nFormatter(insights.data.totalRevenue) : '0.00'}  
      `,
      label: t('eventManagement.totalRevenue'),
      icon: RevenueIcon,
    },
    {
      value: insights?.data?.demographic || 'N/A',
      label: t('eventManagement.demographic'),
      icon: DemographicIcon,
    },
    {
      value: insights && insights.data ? nFormatter(String(insights.data.uniquePageView)) : 0,
      label: t('eventManagement.uniquePageViews'),
      icon: UpniqueIcon,
    },
    {
      value: insights && insights.data ? nFormatter(String(insights.data.pageView)) : 0,
      label: t('eventManagement.pageViews'),
      icon: PageViewIcon,
    },
    {
      value: insights && insights?.data ? nFormatter(String(insights.data.interactions)) : 0,
      label: t('eventManagement.interactions'),
      icon: InteractionIcon,
    },
    {
      value: insights?.data?.attendance ? `${insights?.data?.attendance}%` : 0,
      label: t('eventManagement.attendance'),
      icon: AttendanceIcon,
    },
    {
      value: insights && insights?.data ? nFormatter(String(insights.data.reviews)) : 0,
      label: t('eventManagement.reviews'),
      icon: ReviewIcon,
    },
  ];

  const handleRefreshChartData = () => {
    refreshAttendanceData();
    refreshPurchaseData();
  };

  useEffect(() => {
    rudderAnalytics?.track(ERudderStackEvents.OrganizerViewedInsight, {
      eventType: ERudderStackEvents.OrganizerViewedInsight,
      data: {
        eventId: id,
      },
    });
  }, []);

  useEffect(() => {
    handleRefreshChartData();
    eventBus.on(ESocketEvent.GraphAttendanceUpdated, handleRefreshChartData);

    return () => {
      eventBus.remove(ESocketEvent.GraphAttendanceUpdated, handleRefreshChartData);
    };
  }, [userInfo?.currentTeamId]);

  return (
    <div className="pb-[34px]">
      <div className="bg-gray2 rounded-[3px] insights-cpn p-[24px] border-l-[2px] border-red1 border-solid shadow-lg shadow-rgba(0, 0, 0, 0.25) flex gap-[8px]">
        {lisData?.map((i, index) => {
          const Icon = i.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-[10px] w-[147px] h-[88px] p-[8px]  border-t-[2px] border-primary border-solid shadow-lg shadow-rgba(0, 0, 0, 0.25) flex flex-col justify-between"
            >
              <div>
                <p className="text-[20px] text-black1 text-end">{i?.value}</p>
              </div>
              <div className="flex gap-2 items-center justify-start">
                <Icon />
                <p className="text-[12px] text-primary">{i?.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] gap-6 my-5">
        <div className=" bg-gray2 rounded-[3px] shadow-lg shadow-rgba(0, 0, 0, 0.25) border-l-[2px] border-red1 border-solid w-full p-[16px] gap-[24px] [&>.custom-table]:!p-0">
          <p className="text-[20px] font-loos font-[400] text-black1 mb-[20px] md:mb-[24px]">
            {t('eventManagement.revenueBreakdown')}
          </p>
          <CustomTable
            columns={revenueColumns}
            data={revenueBreakdownData}
            activeHeader={false}
            emptyText=" "
          />
        </div>
        <div className="w-full bg-gray2 rounded-[3px] shadow-lg shadow-rgba(0, 0, 0, 0.25) border-l-[2px] border-red1 border-solid  grow py-[16px] px-[24px] gap-[24px] [&>.custom-table]:!p-0">
          <SelectField
            widthFull
            className="w-[306px]"
            defaultValue={1}
            filterOption={(input: string, option: any) =>
              option?.label?.toLocaleLowerCase()?.includes(input?.toLocaleLowerCase())
            }
            options={optionData}
            onChange={handleChangeType}
          />
          <div className="!bg-white rounded-[10px] mt-[15px] py-[20px] pr-[19px] shadow-lg shadow-rgba(0, 0, 0, 0.25)">
            <div className="">
              {chartType === 2 && (
                <p className="text-[12] text-black1 pl-[19px]">
                  {t('eventManagement.numberOfTicketsPurchased')}
                </p>
              )}
            </div>
            <div className="flex">
              <div className="flex-1 w-full">
                {chartType === 2 ? <Line {...config} /> : <Bar {...attendanceConfig} />}
              </div>
              <div className="hidden md:flex min-w-[95px] items-end pb-[30px]">
                <p className="text-[12px] text-black1 font-[400]">
                  {chartType === 2
                    ? t('eventManagement.datePurchased')
                    : t('eventManagement.numberOfUsers')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray2 rounded-[3px] shadow-lg shadow-rgba(0, 0, 0, 0.25) border-l-[2px] border-red1 border-solid p-3  md:py-[16px] md:px-[24px]  gap-[24px] mt-[30px] [&>.custom-table]:!p-0">
        <p className="text-[20px] font-loos font-[400] text-black1 mb-[20px] md:mb-[24px]">
          {t('eventManagement.eventAttendance')}
        </p>
        <div className="flex justify-center md:justify-start">
          <CustomSearch
            onChange={handleSearchChange}
            value={search}
            placeholder={t('eventManagement.searchEventAttendance')}
            className="mb-[20px] md:mb-[30px]"
            type="type2"
          />
        </div>
        <CustomTable
          columns={breakpoint?.md ? columns : mobileColumns}
          data={eventAttendanceData}
          activeHeader={false}
          emptyText={search ? t('common.noResults') : ' '}
        />
      </div>
    </div>
  );
}
