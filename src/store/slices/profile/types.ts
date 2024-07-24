import { UserInfo } from '../user/types';

export interface BankPayload {
  id?: number;
  teamId: number;
  accountName: string;
  accountBSB: string;
  accountNumber: string;
}

export interface BankResponse {
  id: number;
  teamId: number;
  accountName: string;
  swiftCode: string;
  accountNumber: string;
  businessName: string;
  country: string;
  address: string;
  city?: string;
  state?: string;
  postCode: string;
  isBankDetail?: boolean;
}

export interface RequestOrganizeResponse {
  isExisted: boolean;
}

export enum ETeamRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  OPERATIONS = 'operations',
}

export interface InvitationPayload {
  idTeam: number | string;
  data: {
    email: string;
    role: string;
  }[];
}

export interface EventQueryParams {
  limit?: number;
  page?: number;
  search?: string;
  sortBy?: string;
  direction?: string;
  teamId: number | string;
}

export interface MemberTeam {
  id: number;
  role: ETeamRole;
  teamId: number;
  user: UserInfo;
}
