export type LoginSuccessResponse = {
  accessToken: string;
  refreshToken: string;
};
export type ApiResponseMetadata = {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  perPage: number;
  timestamp: string;
  total: number;
  totalOfPages: number;
};

export interface ApiResponse<T> {
  data: T;
  status_code: number;
  message: string;
  success: boolean;
  validator_errors?: string;
  metadata?: ApiResponseMetadata;
}

export interface IUserWallet {
  address: null | string;
  id: number;
  network: string;
  userId: number;
}

interface ITeam {
  teamId: number;
  userId: number;
  team: {
    id: number;
    name: string;
  };
  id: number;
}

export enum EUserKycStatus {
  NOT_VERIFIED = 'NOT_VERIFIED',
  PENDING_VERIFIED = 'PENDING_VERIFIED',
  VERIFIED = 'VERIFIED',
  VERIFIED_FAIL = 'VERIFIED_FAIL',
}

export type UserInfo = {
  id: number;
  address?: null | string;
  avatar?: string;
  city?: string;
  dateOfBirth?: null | string;
  email?: null | string;
  googleId?: null | string;
  instagramId: null | string;
  kakaoId: null | string;
  loginMethod: string;
  phone: null | string;
  role: TypeRole;
  status: string;
  kycStatus: EUserKycStatus;
  twitterId: null | string;
  username: null | string;
  countryCode: string;
  otpUser: {
    id: number;
    otpSecret: string;
  };
  userWallet: IUserWallet[];
  teams: ITeam[];
  currentTeamId: number | null;
  roleOfTeam: ETeamRole | null;
  firstName: string;
  lastName: string;
  language: string;
  organizerType: EOrganizerType;
};

export enum ETeamRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  OPERATIONS = 'operations',
}

export const TeamNamRole = {
  [ETeamRole.ADMIN]: 'Admin',
  [ETeamRole.ORGANIZER]: 'Organizer',
  [ETeamRole.OPERATIONS]: 'Operations',
};

export type RegisterPayLoad = {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  phone: string;
  city: string;
};

export interface UpdateInfoPayload {
  email?: string;
  username?: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
  city?: string;
}

export interface RegisterOrganizerPayload {
  userId?: number;
  email: string;
  firstName: string;
  lastName: string;
  subject: string;
  message: string;
}
export interface ResetPasswordPayload {
  email: string;
  code: string;
  password: string;
  role: TypeRole;
}

export enum TypeLogin {
  NORMAL = 'normal',
  GOOGLE = 'google',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  KAKAO = 'kakao',
  WALLET_CONNECT = 'walletConnect',
}

export enum TypeRole {
  FAN = 'fan',
  ORGANIZER = 'organizer',
}

export enum EUserView {
  FAN = 'fan',
  ORGANIZER = 'organizer',
}

export enum EOrganizerType {
  REQUESTED = 'requested',
  INVITED = 'invited',
}

export enum TypeForm {
  SELECT = 'select',
  LOGIN = 'login',
  SIGN_UP = 'sign_up',
  FORGOT = 'forgot',
  SOCIALS = 'socials',
  VERIFICATION = 'verification',
  FAN_SIGNUP = 'fan_signup',
  FAN_LOGIN = 'fan_login',
}

export interface ContactUsPayload {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export enum ELoginMethod {
  NORMAL = 'normal',
  GOOGLE = 'google',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  KAKAO = 'kakao',
  WALLET_CONNECT = 'wallet',
  JWT = 'jwt',
}
