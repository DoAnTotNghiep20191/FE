/* eslint-disable */

export const PATTERN_FORMAT_WEB =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|[a-zA-Z0-9])?[a-zA-Z0-9`~!@#$%^&*?()[\]{}\/\-\=+_|.]+([\-\.]{1}[a-zA-Z0-9`~!@#$%^&*?()[\]{}\/\-\=+_|.]+)*\.[a-zA-Z0-9`~!@#$%^&*?()[\]{}\/\-\=+_|.]+?$/;

export const PATTERN_INPUT_AMOUNT = /^(?!$)\d{0,10}(?:\.\d{1,3})?$/;
export const PATTERN_INPUT_TOTAL = /^(?!$)\d{0,10}(?:\.\d{1,5})?$/;
export const PATTERN_INPUT_10_CHARACTERS = /^(?!$)\d{0,10}?$/;
export const PATTERN_INPUT_NO_SPECIAL_CHARACTER = /^[\w\d\s]*$/;
export const PATTERN_INPUT_SELECT_PAIR_MODAL = /^[a-zA-Z/-]*$/;
export const PATTERN_INPUT_MARKET_OVERVIEW = /^[a-zA-Z\s/]*$/;
export const EMOJI_REGEX = /<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu;

export const INPUT_NUMBER_REGEX = (decimal?: string) => {
  let regexString;
  if (decimal) {
    regexString = `^([0-9]+\\.{0,1}[0-9]{0,${decimal}})$|^([0-9])*$`;
  } else {
    regexString = `^([0-9]+\\.{0,1}[0-9]*)$|^([0-9])*$;`;
  }
  return new RegExp(regexString);
};

export const NUMBER_REGEX = /^[0-9]*$/;

export const AMOUNT_REGEX = /^([0-9]{1,8})(\.([0-9]{1,4}){0,1}){0,1}$/;
export const WITHDRAW_AMOUNT_REGEX = /^([0-9]{1,8})(\.([0-9]{1,10}){0,1}){0,1}$/;

export const URL_REGEX_OPENSEA =
  /^(https:\/\/(opensea\.io|testnets\.opensea\.io)\/assets\/(ethereum|goerli|sepolia)\/[a-zA-Z0-9]+\/[0-9]+)$/;

export const PATTERN_LEAST_ONE_SMALL_LETTER = /^(?=.*[a-z])/;
export const PATTERN_LEAST_ONE_UPPER_LETTER = /^(?=.*[A-Z])/;
export const PATTERN_LEAST_ONE_NUMBER = /^(?=.*\d)/;
export const PATTERN_NOT_SPACE = /^\S*$/;

export const REGEX_DOLLAR = /\$\s?|(,*)/g;
export const REGEX_WON = /\₩\s?|(,*)/g;
