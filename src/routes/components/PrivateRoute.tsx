import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { PATHS } from 'src/constants/paths';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';

export const PrivateRoute: React.FC<RouteProps> = (props) => {
  const isLogined = useAppSelector(getUserInfo);

  if (!isLogined) {
    return (
      <Redirect
        to={{
          pathname: PATHS.events,
        }}
      />
    );
  }

  return <Route {...props} />;
};
