import { DependencyList, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAppSelector } from 'src/store';
import { getAccessToken } from 'src/store/selectors/user';

const URL = import.meta.env.VITE_BASE_URL!;

export function useSocketIo(
  effect: (data?: any) => void,
  event: string,
  deps: DependencyList = [],
  skip?: boolean,
  roomName?: string,
  param?: string | number | null,
) {
  const token = useAppSelector(getAccessToken);
  useEffect(() => {
    if (skip) return;
    let socketIo: any = null;
    if (token) {
      socketIo = io(URL, {
        transports: ['websocket', 'polling'],
        query: {
          authorization: token,
        },
      });

      socketIo.connect();
      socketIo.on(event, (data?: any) => effect(data));
      if (roomName && param) {
        socketIo.emit(roomName, param);
      }
    }

    return () => {
      if (token && !skip) {
        socketIo.off(event);
        socketIo.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, token, skip]);
}
