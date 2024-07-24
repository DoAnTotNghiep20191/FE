export interface IEvent {
  id: number;
  createdAt: string;
  name: string;
  description: string;
  image: string;
  startTime: number;
  endTime: number;
  location: string;
  latitude: string;
  longitude: string;
  policy: string;
  status: string;
  transactionHash: string;
  teamId: number;
  subcribeContractId: number;
  isPrivate: boolean;
  currency: string;
  isShow: string;
  userWallet: UserWallet;
  team: Team;
  maxCapacity: number;
  totalTicketPaid: number;
  isSubcribedForNotification: boolean;
  isReview: boolean;
  category: string;
  path: string;
  referrer: string;
  referring_domain: string;
  search: string;
  title: string;
  url: string;
  tab_url: string;
  initial_referrer: string;
  initial_referring_domain: string;
}

export interface UserWallet {
  id: number;
  address: string;
  user: User;
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  currentTeamId: number;
  countryCode: string;
}

export interface Team {
  id: number;
  name: string;
  bank: Bank;
}

export interface Bank {
  id: number;
  accountName: string;
  accountNumber: string;
  swiftCode: string;
  businessName: string;
  country: string;
  address: string;
  postCode: string;
}
