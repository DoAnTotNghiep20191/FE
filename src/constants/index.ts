export const DEFAULT_MODAL_WIDTH = 684;

export const SECONDS_IN_MINUTE = 60;
export const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE;
export const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;
export const SECONDS_IN_MONTH = 30 * SECONDS_IN_DAY;
export const SECONDS_IN_YEAR = 365 * SECONDS_IN_DAY;
export const DAYS_IN_YEAR = 365;
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_FORMAT_2 = 'DD/MM/YY';
export const DATE_TIME_FORMAT_AM = 'DD/MM/YYYY hh:mm A';
export const DATE_TIME_FORMAT_AM_2 = 'hh:mm A DD/MM/YY';
export const FORMAT_TIME = 'hh:mm A';
export const debouncingTime = 500;
export const durationMaxInput = 371;
export const aprMaxInput = 300;
export const amountInputMaximum = 99999999;
export const floorRatioInputMaximum = 100;
export const maxSavedFilterNameLength = 40;
export const intervalTime = 10000;
export const invitation_key = 'in_key';
export const secondOfDay = 86400;
export const datePickerPlaceHolder = 'DD/MM/YYYY HH:mm AM';

export const passwordPlaceholder = '•••••••••';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 5;

export const ValueStatus = {
  UNKNOWN: '--',
};

export const TYPE_FILE = {
  IMAGE: 'IMAGE',
  GIF: 'GIF',
  VIDEO: 'VIDEO',
  MUSIC: 'MUSIC',
  MODEL: 'MODEL',
};

export const WIDTH_FORM_MODAL = '684px';
export const WIDTH_FORM_MODAL_2 = '684px';

export const PURCHASE_STEP = {
  SELECT_TICKET_TYPE: 1,
  REVIEW_TICKET: 2,
  VERIFY: 3,
  PAY_SECURELY: 4,
};

export const MYTICKET_STEP = {
  MYTICKET: 1,
  TICKET_HOLDER_DETAIL: 2,
};

export const ACTION_TYPE = {
  GOOD: 'good',
  BAD: 'bad',
  NONE: 'none',
};

export const STATUS_TXT = {
  UPCOMING: 'Upcoming',
  PAST: 'Past',
};

export const CURRENCY_KEY = {
  USD: 'USD',
  KRW: 'KRW',
};

export const CURRENCY = {
  USD: '$',
  KRW: '₩',
};

const ATTENDANCE_VAL = {
  ABSENT: 'absent',
  CHECKEDIN: 'checkIn',
};

export const ATTENDANCE = {
  [ATTENDANCE_VAL.ABSENT]: 'absent',
  [ATTENDANCE_VAL.CHECKEDIN]: 'checked in',
};

export const CHECKIN_STS_KEY = {
  CHECKED: 'checked',
  NOT_CHECKED: 'no_record',
};

export const CHECKIN_STS = {
  [CHECKIN_STS_KEY.CHECKED]: 'common.checkIn',
  [CHECKIN_STS_KEY.NOT_CHECKED]: 'common.noRecord',
};

export const regexNumber = /[0-9]/;
export const regexFloatNumber = /[\d.]/;

export const LOGIN_METHOD = {
  GOOGLE: 'google',
  KAKAO: 'kakao',
  INSTAGRAM: 'instagram',
  TWITTER: 'twitter',
  NORMAL: 'normal',
};

export const ReviewStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const RefundStatus = {
  PENDING: 'pending',
  ORGANIZER_APPROVED: 'organizer_approved',
  ORGANIZER_REJECTED: 'organizer_rejected',
  PROCESSING_REFUND: 'processing_refund_request',
  ADMIN_REJECTED: 'admin_rejected',
  ADMIN_APPROVED: 'admin_approved',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
};

export const RequestStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const RefundType = {
  REFUND_REQUEST: 'REFUND_REQUEST',
  REJECT_REFUND: 'REJECT_REFUND',
  REFUND_MULTI: 'REFUND_MULTI',
  VIEW_TICKET: 'VIEW_TICKET',
  REFUND_SENT: 'REFUND_SENT',
  REQUEST_SENT: 'REQUEST_SENT',
  REJECT_SENT: 'REJECT_SENT',
  REFUND_MULTI_SENT: 'REFUND_MULTI_SENT',
};

export const SHOW_PRIVATE_EVENT = {
  ENABLE: 'enable',
  DISABLE: 'disable',
};
