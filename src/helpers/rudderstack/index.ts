import { IEvent } from 'src/interfaces/Event';
import { ERudderStackEvents } from 'src/rudderstack/types';

export const convertEventDetailData = (data: IEvent) => {
  const eventTeam = data.team
    ? {
        ...data.team,
        bank: {
          id: data?.team?.bank?.id,
        },
      }
    : null;

  return {
    eventType: ERudderStackEvents.EventViewed,
    data: {
      ...data,
      team: eventTeam,
    },
    userWallet: {
      id: data?.userWallet?.id,
      user: {
        id: data?.userWallet?.user?.id,
      },
    },
  };
};
