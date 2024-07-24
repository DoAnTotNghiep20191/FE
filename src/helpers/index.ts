import * as Sentry from '@sentry/react';
import { FormInstance } from 'antd';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import get from 'lodash/get';
import { ToastMessage } from 'src/components/Toast';
import { SECONDS_IN_DAY, SECONDS_IN_MONTH, TYPE_FILE, ValueStatus } from 'src/constants';
import { countryCode } from 'src/constants/countryCode';
import { PATTERN_NOT_SPACE } from 'src/constants/regex';
import { EventStatus } from 'src/store/slices/app/types';
import { CURRENCY, CURRENCY_KEY, STATUS_TXT, regexNumber } from './../constants/index';
import { convertRoundFloor } from './formatNumber';

export function onLogError(
  error: any,
  level: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' = 'error',
) {
  return Sentry.withScope(function (scope: any) {
    console.error(error);
    scope.setLevel(level);
    Sentry.captureException(error);
  });
}

export const KEY_CODE = {
  E: 69, //e
  PLUS: 189, // +
  PLUS_NUMBER: 107, // +
  SUB_TRACTION: 187, // -
  SUB_TRACTION_NUMBER: 109, // -
  ZERO: 98, // 0
  BACK_SPACE: 8, // Backspace
  ARROW_DOWN: 40, // arrow down
  ARROW_UP: 38, // arrow up
  POINT: 190, // .
  NUMBER_POINT: 110, // .
  COMMA: 188, // ,
};

export const ellipseAddress = (
  address = '',
  maxCharacters = 5,
  maxLastCharacters?: number | undefined,
): string => {
  if (!address || address === 'null') return ValueStatus.UNKNOWN;

  return `${address.slice(0, maxCharacters)}...${address.slice(
    -(maxLastCharacters ? maxLastCharacters : maxCharacters),
  )}`;
};

export const sliceString = (value = '', end = 1, start = 0): string => {
  if (!value) return '';

  return `${value?.slice(start, end)}`;
};

export const convertDaysCurrency = (days: number) => {
  if (days > 1) return 'days';
  return 'day';
};

export const parseImageData = (value: string) => {
  try {
    const parsedData = JSON.parse(value);

    if (Array.isArray(parsedData)) {
      return { isArray: true, value: parsedData };
    } else {
      return { isArray: false, value };
    }
  } catch (error) {
    console.error('Parse failed:', error);
    return { isArray: false, value };
  }
};

export const convertDivDuration = (duration: string, hasCurrency = false) => {
  if (!duration) {
    return '0';
  }

  const durationConverted = convertRoundFloor(
    BigNumber(duration).div(SECONDS_IN_DAY).toString(),
    0,
  );
  const currency = convertDaysCurrency(Number(durationConverted));

  if (hasCurrency) {
    return `${durationConverted} ${currency}`;
  }
  return durationConverted;
};

export const convertDivDurationBigger = (duration: string, hasCurrency = false) => {
  if (!duration) {
    return '0';
  }

  const durationDivMonth = Number(BigNumber(duration).div(SECONDS_IN_MONTH).toNumber().toFixed());

  const durationConverted = () => {
    if (durationDivMonth < 12) {
      return durationDivMonth;
    }
    return Math.ceil(durationDivMonth / 12);
  };

  const currency = () => {
    if (durationDivMonth <= 1) {
      return 'month';
    }

    if (durationDivMonth < 12) {
      return 'months';
    }

    if (durationDivMonth >= 12 && durationDivMonth <= 12 * 2) {
      return 'year';
    }

    return 'years';
  };

  if (hasCurrency) {
    return `${durationConverted()} ${currency()}`;
  }
  return durationConverted();
};

export const convertMulByDuration = (duration: string) => {
  if (!duration) {
    return '0';
  }
  const durationConverted = BigNumber(duration).multipliedBy(SECONDS_IN_DAY).toString();

  return durationConverted;
};

export const decimalCount = (number: any) => {
  const numberAsString = number?.toString();
  if (numberAsString?.includes('.')) {
    return numberAsString?.split('.')[1].length;
  }
  return 0;
};

export const handleOnKeyDownInputNumber = async (
  event: any,
  regex: any = new RegExp(/^(?!$)\d{0,10}(?:\.\d{1,5})?$/),
) => {
  const value = event.target.value?.toString()?.replaceAll(',', '.');
  const pattern = regex;
  if (
    event.keyCode === KEY_CODE.E ||
    event.keyCode === KEY_CODE.PLUS ||
    event.keyCode === KEY_CODE.PLUS_NUMBER ||
    event.keyCode === KEY_CODE.SUB_TRACTION ||
    event.keyCode === KEY_CODE.SUB_TRACTION_NUMBER ||
    event.keyCode === KEY_CODE.ARROW_DOWN ||
    event.keyCode === KEY_CODE.ARROW_UP ||
    (!pattern?.test(Number(value)) && value && event.keyCode !== KEY_CODE.BACK_SPACE) ||
    (!value &&
      (event.keyCode === KEY_CODE.POINT ||
        event.keyCode === KEY_CODE.NUMBER_POINT ||
        event.keyCode === KEY_CODE.COMMA))
  ) {
    event.preventDefault();
  }
};

export const handleOnKeyDownInputPercent = (event: any) => {
  const value = event.target.value?.toString()?.replaceAll(',', '.');
  const pattern = /^(?!$)\d{0,10}(?:\.\d{1,2})?$/;
  // keyCode = 69: e ,189: + ,187: -,8: Backspace,96: 0
  if (
    event.keyCode === KEY_CODE.E ||
    event.keyCode === KEY_CODE.PLUS ||
    event.keyCode === KEY_CODE.PLUS_NUMBER ||
    event.keyCode === KEY_CODE.SUB_TRACTION ||
    event.keyCode === KEY_CODE.SUB_TRACTION_NUMBER ||
    event.keyCode === KEY_CODE.ARROW_DOWN ||
    event.keyCode === KEY_CODE.ARROW_UP ||
    (!pattern.test(value) && value && event.keyCode !== KEY_CODE.BACK_SPACE) ||
    (!value &&
      (event.keyCode === KEY_CODE.POINT ||
        event.keyCode === KEY_CODE.NUMBER_POINT ||
        event.keyCode === KEY_CODE.COMMA))
  ) {
    event.preventDefault();
  }
};

export const handleOnKeyDownInputSlippage = (event: any) => {
  const value = event.target.value?.toString()?.replaceAll(',', '.');
  const pattern = /^(?!$)\d{0,2}(?:\.\d{1,1})?$/;
  // keyCode = 69: e ,189: + ,187: -,8: Backspace,96: 0
  if (
    event.keyCode === KEY_CODE.E ||
    event.keyCode === KEY_CODE.PLUS ||
    event.keyCode === KEY_CODE.PLUS_NUMBER ||
    event.keyCode === KEY_CODE.SUB_TRACTION ||
    event.keyCode === KEY_CODE.SUB_TRACTION_NUMBER ||
    event.keyCode === KEY_CODE.ARROW_DOWN ||
    event.keyCode === KEY_CODE.ARROW_UP ||
    (!pattern.test(value) && value && event.keyCode !== KEY_CODE.BACK_SPACE) ||
    (!value &&
      (event.keyCode === KEY_CODE.POINT ||
        event.keyCode === KEY_CODE.NUMBER_POINT ||
        event.keyCode === KEY_CODE.COMMA))
  ) {
    event.preventDefault();
  }
};

export const generatePrecision = (value: string) => {
  if (value?.includes('.')) {
    return value?.split('.')[1].length;
  } else {
    return 0;
  }
};

export const renderLang = (language: string) => {
  if (language && language?.includes('en')) {
    return 'en';
  }
  if (language && language?.includes('vi')) {
    return 'vi';
  } else {
    return language;
  }
};

export function iOS() {
  return (
    ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
      navigator.platform,
    ) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
}

export const getBaseURLFromIPFS = (url: any) => {
  if (!url) return '';
  if (url.includes('ipfs://ipfs/')) {
    const ipfsIndex = url.indexOf('//ipfs/');
    const urlHash = url.substring(ipfsIndex + 7);
    return `https://ipfs.io/ipfs/${urlHash}`;
  } else if (url.includes('ipfs://')) {
    const ipfsIndex = url.indexOf('//');
    const urlHash = url.substring(ipfsIndex + 2);
    return `https://ipfs.io/ipfs/${urlHash}`;
  } else if (!url.includes('http')) {
    return url;
  }
  return url;
};

const getTypeFileFromIPFS = async (url: string) => {
  const baseURL = getBaseURLFromIPFS(url);
  const req = await fetch(baseURL, { method: 'HEAD' });
  const fileType = req?.headers?.get('content-type') || '';
  return fileType;
};

export const getTypeFile = async (url: string): Promise<string> => {
  try {
    const tagFile = url?.toLocaleLowerCase().split('.').pop() || '';
    if (['jpg', 'png', 'jpeg', 'svg'].includes(tagFile)) return TYPE_FILE.IMAGE;
    if (tagFile === 'gif') return TYPE_FILE.GIF;
    if (tagFile === 'mp4' || tagFile === 'webm' || tagFile === 'ogg') return TYPE_FILE.VIDEO;
    if (tagFile === 'glb' || tagFile === 'gltf') return TYPE_FILE.MODEL;
    if (['mp3', 'wav', 'mpeg', 'mpga'].includes(tagFile)) return TYPE_FILE.MUSIC;

    if (url?.includes('ipfs')) {
      const contentType = await getTypeFileFromIPFS(url);
      if (contentType.includes('video')) {
        return TYPE_FILE.VIDEO;
      } else if (contentType.includes('audio')) {
        return TYPE_FILE.MUSIC;
      } else if (contentType.includes('model')) {
        return TYPE_FILE.MODEL;
      } else {
        return TYPE_FILE.IMAGE;
      }
    }

    return '';
  } catch (err: any) {
    console.error(err);
    return '';
  }
};

export const handleExecutedTx = (
  event: any,
  errorMsg: string,
  msgDefault: string,
  code = -32603,
) => {
  const errorCode = get(event, 'error.code', '');
  const errorMessage = get(event, 'error.message', '') as string;

  if (errorCode === code && errorMessage?.includes(errorMsg)) {
    ToastMessage.error(
      'Transaction already executed',
      'The system is waiting for response from Metamask, please wait',
    );
  } else {
    ToastMessage.error(msgDefault);
  }
};

export const renderEventStatus = (eventType: string) => {
  switch (eventType) {
    case STATUS_TXT.UPCOMING:
      return EventStatus.UPCOMING;
    case STATUS_TXT.PAST:
      return EventStatus.PAST;
    default:
      return EventStatus.UPCOMING;
  }
};

export const getCurrency = (currency: string) => {
  const currencyMapping = {
    [CURRENCY_KEY.USD]: CURRENCY.USD,
    [CURRENCY_KEY.KRW]: CURRENCY.KRW,
  };

  return currencyMapping[currency] || currency;
};

export const getCityByCode = (code: string = '') => {
  const city = countryCode?.find((i) => i?.code === code);
  return city?.name || ValueStatus.UNKNOWN;
};

export const openTransactionHash = (tx: string) => {
  const link = import.meta.env.VITE_APTOS_NETWORK;
  if (link === 'testnet') {
    return window.open(`${import.meta.env.VITE_APTOSCAN_BASE_URL}/${tx}?network=testnet`);
  } else {
    return window.open(`${import.meta.env.VITE_APTOSCAN_BASE_URL}/${tx}`);
  }
};

export const disableSpace = (form: FormInstance, name: string) => ({
  validator: (_: any, value: string) => {
    if (!PATTERN_NOT_SPACE.test(value)) {
      form.setFieldValue(name, value.replace(/\s/g, ''));
    }
    return Promise.resolve();
  },
});

export const preventSpace = (e: any) => {
  if (e.keyCode === 32 || e.key === ' ') {
    e.preventDefault();
    return;
  }
};

export const acceptInputNumber = (e: any) => {
  if (
    !regexNumber.test(e.key) &&
    e.key !== 'Backspace' &&
    e.key !== 'Delete' &&
    e.key !== 'ArrowLeft' &&
    e.key !== 'ArrowRight' &&
    e.key !== 'Tab'
  ) {
    e.preventDefault();
  }
};

export const transformPhoneNumber = (phone: string) => {
  const splitNumber = phone.split(' ');
  const number = `(${splitNumber[0]}) ${splitNumber[1]}`;
  return number;
};

export const getCountyUser = async () => {
  try {
    const res = await axios.get(import.meta.env.VITE_GET_IP_INFO!);
    return res?.data?.country;
  } catch (err: any) {
    console.error(err);
  }
};

export const getOS = () => {
  const userAgent = window.navigator.userAgent,
    platform =
      ('userAgentData' in window.navigator && (window.navigator.userAgentData as any)?.platform) ||
      window.navigator.platform,
    macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = null;
  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (/Linux/.test(platform)) {
    os = 'Linux';
  }
  return os;
};
