import io from 'socket.io-client';
import { ETeamSocketEvent } from './events';
import eventBus from './event-bus';
import { ESocketEvent } from './SocketEvent';
import { EChallengeType, ESocialNetworkingLoginMethod } from 'src/store/slices/campaign/types';

export enum EUserChallengeStatus {
  INIT = 'Init',
  VERIFYING = 'Verifying',
  COMPLETE = 'Complete',
  FAILED = 'Failed',
}
export enum EVerifyUserChallengeStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  VERIFYING = 'verifying',
}
export interface IChallengeVerifyResult {
  userId: number;
  campaignId: number;
  challengeId: number;
  status: EVerifyUserChallengeStatus;
  campaignName?: string;
  challengeType?: EChallengeType;
  challengeSocialPlatform?: ESocialNetworkingLoginMethod;
}

export class BaseSocket {
  private static instance: BaseSocket;
  private socket: any;

  public token?: string;
  public currentTeamId?: number;

  public static getToken() {
    if (BaseSocket.instance) {
      return BaseSocket.instance?.token;
    }
    return null;
  }

  public static getInstance(): BaseSocket {
    if (!BaseSocket.instance) {
      BaseSocket.instance = new BaseSocket();
    }

    return BaseSocket.instance;
  }
  public static getTeamId() {
    if (BaseSocket.instance) {
      return BaseSocket.instance?.currentTeamId;
    }
    return null;
  }

  public connect(accessToken?: string): void {
    this.socket = io(import.meta.env.VITE_BASE_URL!, {
      path: '/socket.io',
      transports: ['websocket'],
      query: {
        authorization: accessToken,
      },
    });
    this.token = accessToken!;
    this.listenPublicEvent();
    this.listenTeamMemberRemove();
    this.listenGraphAttendance();
    this.listenVerifyChallenge();
    this.socket.on('reconnect', () => {});
  }

  public reconnect(accessToken?: string): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.connect(accessToken);
    this.socket.on('connect', () => {});
  }

  public listenTeamNotification(teamId: number) {
    this.currentTeamId = teamId;
    this.socket.emit('subscribe-team-notification', teamId);
  }

  listenPublicEvent() {
    this.socket.on(ETeamSocketEvent.ORGANIZER_REPUBLISH_EVENT, async (data: any) => {
      eventBus.dispatch(ESocketEvent.OrganizerPublicEvent, data);
    });
    this.socket.on(ETeamSocketEvent.ADMIN_APPROVE_REPUBLISH, async (data: any) => {
      eventBus.dispatch(ESocketEvent.OrganizerPublicEvent, data);
    });
    this.socket.on(ETeamSocketEvent.ADMIN_DEPLOY_POOL, async (data: any) => {
      eventBus.dispatch(ESocketEvent.OrganizerPublicEvent, data);
    });
  }

  listenTeamMemberRemove() {
    this.socket.on(ETeamSocketEvent.TEAM_MEMBER_REJECTED, async (data: any) => {
      eventBus.dispatch(ESocketEvent.TeamMemberRemoved, data);
    });
  }

  listenGraphAttendance() {
    this.socket.on(ETeamSocketEvent.GRAPH_ATTENDANCE_UPDATED, async (data: any) => {
      eventBus.dispatch(ESocketEvent.GraphAttendanceUpdated, data);
    });
  }

  listenVerifyChallenge() {
    this.socket.on(
      ETeamSocketEvent.VERIFY_CHALLENGE_RESULT,
      async (data: IChallengeVerifyResult) => {
        console.log('challenge verified', data);
        eventBus.dispatch(ESocketEvent.VerifyChallengeResult, data);
      },
    );
  }

  disconnectSocket(): void {
    this.socket.offAny();
    this.socket.disconnect();
  }
}
