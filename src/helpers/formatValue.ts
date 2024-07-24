import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/ko';
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  DATE_TIME_FORMAT_AM,
  SECONDS_IN_DAY,
  ValueStatus,
} from 'src/constants';
import { nFormatter } from './formatNumber';

const verifyValue = (data?: string | number) => {
  if (!data || data === 'NaN' || data === 'null') return ValueStatus.UNKNOWN;
  return data;
};

const formatValue = (data?: string | number, prefix?: string, noSpace = false) => {
  const checkData = verifyValue(data);
  if (checkData === ValueStatus.UNKNOWN) return checkData;

  if (prefix) {
    if (noSpace) return `${data}${prefix}`;
    return `${data} ${prefix}`;
  }
  return checkData;
};

const formatDuration = (duration: string | number) => {
  const checkData = verifyValue(duration);
  if (checkData === ValueStatus.UNKNOWN) return checkData;

  const convertDuration = BigNumber(duration).div(SECONDS_IN_DAY).toNumber();
  return `${nFormatter(String(convertDuration), 0)} ${convertDuration < 2 ? 'day' : 'days'}`;
};

const formatDate = (date: any, formatTime = DATE_TIME_FORMAT) => {
  const checkData = verifyValue(date);
  if (checkData === ValueStatus.UNKNOWN) return checkData;

  return dayjs(date).format(formatTime);
};

const formatUnixTimeDate = (date: any, formatTime = DATE_TIME_FORMAT) => {
  const checkData = verifyValue(date);
  if (checkData === ValueStatus.UNKNOWN) return checkData;

  return dayjs.unix(date).format(formatTime);
};

const getMonthDateTime = (date: number) => {
  const formattedDate = dayjs.unix(date);

  const result = {
    month: formattedDate.format('MMM'),
    date: formattedDate.format('Do'),
    hour: formattedDate.format('hh:mm A'),
  };
  return result;
};

const checkIsSameDay = (startTime: number, endTime: number) => {
  const start = formatUnixTimeDate(startTime, DATE_FORMAT);
  const end = formatUnixTimeDate(endTime, DATE_FORMAT);

  return start === end;
};

const renderStartEndDateTime = (startTime: number, endTime: number) => {
  if (checkIsSameDay(startTime, endTime)) {
    return `${getMonthDateTime(startTime).hour} - ${getMonthDateTime(endTime).hour} (UTC+${
      dayjs().utcOffset() / 60
    })`;
  }
  return `${formatUnixTimeDate(startTime, DATE_TIME_FORMAT_AM)} - ${formatUnixTimeDate(
    endTime,
    DATE_TIME_FORMAT_AM,
  )} (UTC+${dayjs().utcOffset() / 60})`;
};

export {
  formatDate,
  formatDuration,
  formatUnixTimeDate,
  formatValue,
  getMonthDateTime,
  renderStartEndDateTime,
  verifyValue,
};
