import BigNumber from 'bignumber.js';

type IBigNumberArg = string | number | BigNumber;

export const formatRoundFloorDisplay = (
  value: IBigNumberArg,
  decimalPlace = 4,
  shiftedBy = 0,
): string => {
  return new BigNumber(value || 0)
    .shiftedBy(-shiftedBy)
    .decimalPlaces(decimalPlace, BigNumber.ROUND_FLOOR)
    .toFormat();
};

export const formatRoundFloorDisplayOrderBook = (
  value: string | number | BigNumber,
  decimalPlace = 4,
  shiftedBy = 0,
): string => {
  return new BigNumber(value || 0)
    .shiftedBy(-shiftedBy)
    .decimalPlaces(decimalPlace, BigNumber.ROUND_FLOOR)
    .toFormat(decimalPlace);
};

export const formatRoundUpOrderBookAsks = (
  value: string | number | BigNumber,
  decimalPlace = 4,
  shiftedBy = 0,
): string => {
  return new BigNumber(value || 0)
    .shiftedBy(-shiftedBy)
    .decimalPlaces(decimalPlace, BigNumber.ROUND_UP)
    .toFormat(decimalPlace);
};

export const formatRoundDownOrderBookBids = (
  value: string | number | BigNumber,
  decimalPlace = 4,
  shiftedBy = 0,
): string => {
  return new BigNumber(value || 0)
    .shiftedBy(-shiftedBy)
    .decimalPlaces(decimalPlace, BigNumber.ROUND_DOWN)
    .toFormat(decimalPlace);
};

export const formatRoundFloorDisplayWithCompare = (
  value: IBigNumberArg,
  decimalPlace = 4,
): string => {
  const minimumNumber = BigNumber(1).div(`1e${decimalPlace}`).toNumber();
  const data = String(
    new BigNumber(value).toNumber().toLocaleString('en-US', {
      maximumFractionDigits: decimalPlace,
      minimumFractionDigits: 0,
    }),
  ).replace(/,/g, '');

  if (Number(value) !== 0 && new BigNumber(value).lt(minimumNumber)) {
    return '<' + minimumNumber;
  }
  return data;
};

export const formatRoundFloorDisplayWithCompareFixed = (
  value: IBigNumberArg,
  decimalPlace = 4,
  shiftedBy = 0,
): string => {
  const data = new BigNumber(value || 0).shiftedBy(-shiftedBy).toFixed(decimalPlace);
  if (Number(data) !== 0 && new BigNumber(data).lt(0.01)) {
    return '<0.01';
  }
  return data;
};

export const convertRoundFloor = (
  value: IBigNumberArg,
  decimalPlace = 4,
  shiftedBy = 0,
): string => {
  return new BigNumber(value || 0)
    .shiftedBy(-shiftedBy)
    .decimalPlaces(decimalPlace, BigNumber.ROUND_FLOOR)
    .toString();
};

export const nFormatter = (number: string, digits = 2, roundingMode?: BigNumber.RoundingMode) => {
  const SI = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const num = parseFloat(number);
  let i;
  for (i = SI.length - 1; i > 0; i--) {
    if (num >= SI[i].value) {
      break;
    }
  }

  const roundingModeCombined = roundingMode || BigNumber.ROUND_FLOOR;

  const minimumNumber = BigNumber(1).div(`1e${digits}`).toNumber();

  if (Number(number) > 0 && new BigNumber(number).lt(minimumNumber)) {
    return '<' + minimumNumber;
  }

  const result =
    new BigNumber(num)
      .div(SI[i].value)
      .toFixed(digits, roundingModeCombined)
      .toString()
      .replace(rx, '$1') + SI[i].symbol;

  return result !== 'NaN' ? result : '0';

  // return (num / SI[i].value).toFixed(digits).replace(rx, '$1') + SI[i].symbol;
};

export const displayNumber = (value: any, decimalPlace = 2) => {
  if (!value || isNaN(value) || value === Number.POSITIVE_INFINITY) return 0;
  else return nFormatter(String(value), decimalPlace);
};

export const formatFixedPoint = (number: IBigNumberArg, dp: number) => {
  return new BigNumber(number).toFixed(dp);
};

export const formatUnit = (number: IBigNumberArg, decimal: number, decimalPlace = 4) => {
  return nFormatter(new BigNumber(number).div(`1e${decimal}`).toString(), decimalPlace);
};

export const formatCurrency = (currency: string | number) => {
  return currency
    ? Number(currency).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.0';
};
