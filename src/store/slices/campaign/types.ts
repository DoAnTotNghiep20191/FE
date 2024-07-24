import { EUserChallengeStatus } from 'src/socket/BaseSocket';
import { IParamsQuery } from 'src/types';

export interface ParamsListCampaign {
  limit?: number;
  page?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
  search?: string;
  isFan?: boolean;
  viewStatus?: ECampaignViewStatus[];
}

export interface ParamsListEventCampaign extends IParamsQuery {
  status?: string[];
  buyStatus: 'upcoming' | 'past';
  disablePrivate?: boolean;
}

export interface ParamsLeaderBoardById {
  campaignId?: number;
  limit?: number;
  page?: number;
  showRewarded: boolean;
}

export enum ECampaignViewStatus {
  PAST = 'past',
  ONGOING = 'ongoing',
  UPCOMING = 'upcoming',
}

export enum ESocialNetworkingLoginMethod {
  X = 'X',
  YOU_TUBE = 'YOUTUBE',
  SPOTIFY = 'SPOTIFY',
  TIKTOK = 'TIKTOK',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  SHOPIFY = 'SHOPIFY',
}

export enum ESocialNetworkPlatform {
  X = 'X',
  YOU_TUBE = 'YOUTUBE',
  SPOTIFY = 'SPOTIFY',
  TIKTOK = 'TIKTOK',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  MEREO_TICKET = 'MEREO_TICKET',
  SHOPIFY = 'SHOPIFY',
}

export enum EChallengeJobType {
  GET_DATA_FROM_SOCIAL_MEDIA_FOR_VERIFICATION = 'GET_DATA_FROM_SOCIAL_MEDIA_FOR_VERIFICATION',
  SYSTEM_PERFORM_CHALLENGE_ON_BEHALF_OF_USER = 'SYSTEM_PERFORM_CHALLENGE_ON_BEHALF_OF_USER',
}

export enum ESpotifyTimeRange {
  SHORT_TERM = 'short_term',
  MEDIUM_TERM = 'medium_term',
  LONG_TERM = 'long_term',
}

export enum ECampaignStatus {
  PUBLIC = 'Public',
  DRAFT = 'Draft',
}

export enum EChallengeDifficulty {
  SBT = 'SBT',
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export enum EChallengeType {
  PUBLIC_POST_WITH_HASHTAG = 'Create public post with hashtag',
  LIKE = 'Like',
  REPOST = 'Repost',
  SHARE = 'Share',
  FOLLOW_USER = 'Follower a user',
  COMMENT_POST = 'Comment on post',
  CHECK_IN_LOCATION = 'Check-in to location',
  ARTIST_TOP_10 = 'Artist is on your top 10',
  ARTIST_TOP_1 = 'Artist is your number 1',
  FOLLOW_ARTIST = 'Follow artist',
  LISTEN_SONG = 'Listen to a song',
  FAVORITE_SONG = 'Favorite a song',
  SUBSCRIBE = 'Subscribe',
  WATCH_VIDEO = 'Watch a video',
  PUBLIC_VIDEO_WITH_HASHTAG = 'Post a public video with a hashtag in description',
  PURCHASE_TICKET = 'Purchase a ticket to an event',
  PURCHASE_MERCHANDISE = 'Purchase merchandise',
}

export const EShortChallengeText: { [key in EChallengeType]: string } = {
  [EChallengeType.PUBLIC_POST_WITH_HASHTAG]: 'Post',
  [EChallengeType.LIKE]: 'Like',
  [EChallengeType.REPOST]: 'Repost',
  [EChallengeType.SHARE]: 'Share',
  [EChallengeType.FOLLOW_USER]: 'Follow',
  [EChallengeType.COMMENT_POST]: 'Comment',
  [EChallengeType.CHECK_IN_LOCATION]: 'Check in',
  [EChallengeType.ARTIST_TOP_10]: 'Listen',
  [EChallengeType.ARTIST_TOP_1]: 'Listen',
  [EChallengeType.FAVORITE_SONG]: 'Favorite',
  [EChallengeType.SUBSCRIBE]: 'Subscribe',
  [EChallengeType.WATCH_VIDEO]: 'Watch',
  [EChallengeType.PUBLIC_VIDEO_WITH_HASHTAG]: 'Post',
  [EChallengeType.FOLLOW_ARTIST]: 'Follow',
  [EChallengeType.LISTEN_SONG]: 'Listen',
  [EChallengeType.PURCHASE_TICKET]: 'Purchase',
  [EChallengeType.PURCHASE_MERCHANDISE]: 'Purchase_merchandise',
};

export enum ERewardType {
  DISCOUNTED_TICKET = 'Discounted ticket',
  REDEEMABLE_ITEM = 'Redeemable item at event',
}

export enum ERewardRarity {
  COMMON = 'Common',
  RARE = 'Rare',
  EPIC = 'Epic',
}

export interface IChallenges {
  difficulty: string;
  type: string;
  socialPlatform: string;
  socialUrl: string;
}

export interface IRewardChallenges {
  usersEligibleCount: number;
  rarity: string;
  type: string;
  items: string;
}

export interface CreateCampaignPayload {
  name: string;
  startDate: string;
  endDate: string;
  eventIds: string[];
  status: string;
  challenges: IChallenges[];
  reward: IRewardChallenges;
}

export interface UpdateCampaignPayload {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  eventIds: string[];
  status: string;
  challenges: IChallenges[];
  reward: IRewardChallenges;
}

export interface ChallengeItemRes {
  completedUsers: number;
  difficulty: EChallengeDifficulty;
  id: number;
  socialPlatform: ESocialNetworkingLoginMethod;
  type: EChallengeType;
  isCompleted?: boolean;
  status?: EUserChallengeStatus;
  hashTag?: string;
}

export interface RewardCampaignItemRes {
  item: string;
  type: ERewardType;
}

export interface EventCampaignRes {
  id: number;
  name: string;
  ticketOptions: {
    id: number;
    name: string;
  }[];
}

export interface CampaignItemRes {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  eventIds: number[];
  status: string;
  challenges: ChallengeItemRes[];
  reward: RewardCampaignItemRes;
  image: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  username: string;
}

export interface LeaderBoardRes {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  userId: number;
  campaignId: number;
  currentPoints: number;
  status: string;
  user: User;
}

export interface PositionLeaderBoardRes {
  rankingPosition: number;
  userRanking: LeaderBoardRes;
  isInCampaign: true;
}
export interface IExecuteChallengeRes {
  challengeUrl: string;
  isLoginNeed: boolean;
  isSystemPerformedType: boolean;
  isVerificationAuto: boolean;
  socialLoginUrl: string;
  eventId?: number;
}

export interface ICampaignInsightRes {
  id: number;
  participantDoingCount: string;
  participantDoneCount: string;
  participantMaxAge: number;
  participantMinAge: number;
}

export interface OrganizerRedeemRewardParams {
  redeemCode: string;
  campaignId: number;
}
interface CampaignResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  teamId: number;
  startDate: string;
  endDate: string;
  eventIds: string[];
  status: string;
  blockchainCollectionId: string;
  transactionHash: string;
  collectionAddress: string;
  isRewardsDistributed: boolean;
}

interface RewardInfoItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  campaignId: number;
  usersEligibleCount: number;
  rarity: string;
  type: ERewardType;
  item: string;
}
export interface FanRewardsItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  userId: number;
  campaignId: number;
  rewardInfoId: number;
  transactionHash: string;
  tokenId: string;
  redeemCode: string;
  status: string;
  campaign: CampaignResponse;
  rewardInfo: RewardInfoItem;
}

export interface ParamsFanRewards {
  campaignId?: string[];
  limit?: number;
  page?: number;
}

export interface ParamsFanAchievement {
  limit?: number;
  page?: number;
  sortBy?: string;
  direction?: string;
  campaignId?: string[];
  statuses?: string[];
  difficulty?: string[];
}

export interface RedeemRewardPayload {
  userRewardId: number;
}

export enum EUserRewardStatus {
  CREATED = 'created',
  PENDING_DISTRIBUTING = 'pending_distributing',
  DISTRIBUTED = 'distributed',
  REDEMED = 'redemed',
  DISPOSED = 'disposed', // when organizer verified the code,
}

interface ChallengeResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  campaignId: number;
  type: string;
  socialPlatform: string;
  socialUrl: string;
  hashTag: string;
  difficulty: EChallengeDifficulty;
  isVerificationAuto: boolean;
  systemPerform: boolean;
  socialNetworkId: number | null;
  ticketOptionId: number | null;
}

export interface AchievementsResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  campaignId: number;
  challengeId: number;
  userId: number;
  status: string;
  challengeSBTStatus: string;
  transactionHash: string;
  soulBoundTokenId: number | null;
  completedTime: string | null;
  campaign: CampaignResponse;
  challenge: ChallengeResponse;
}
