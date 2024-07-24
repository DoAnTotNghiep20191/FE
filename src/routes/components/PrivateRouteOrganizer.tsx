import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { PATHS } from 'src/constants/paths';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { TypeRole } from 'src/store/slices/user/types';

export const PrivateRouteOrganizer: React.FC<RouteProps> = (props) => {
  const userInfo = useAppSelector(getUserInfo);

  if (userInfo && userInfo?.role === TypeRole.ORGANIZER) {
    return <Route {...props} />;
  }
  return (
    <Redirect
      to={{
        pathname: PATHS.events,
      }}
    />
  );
};
