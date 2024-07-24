import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PATHS } from 'src/constants/paths';
import './styles.scss';
import { useAppSelector } from 'src/store';
import { getSelectedView, getUserInfo } from 'src/store/selectors/user';
import { EUserView, TypeRole } from 'src/store/slices/user/types';
import { useTranslation } from 'react-i18next';

interface IMenu {
  icon?: string;
  label: string;
  className?: string;
  subLink: string | string[];
  children?: IChildMenu[];
  childrenSubLinks?: string[];
  hide?: boolean;
}

interface IChildMenu {
  label: string;
  subLink: string;
}

interface LocationState {
  from: string;
}

const SubMenu: React.FC = () => {
  const location = useLocation<LocationState>();

  const userInfo = useAppSelector(getUserInfo);
  const selectedView = useAppSelector(getSelectedView);

  const { t } = useTranslation();

  const ListFanMenuAndSub = useMemo<Array<IMenu>>(
    () => [
      {
        label: t('header.discover'),
        subLink: PATHS.events,
        hide: false,
      },
      {
        label: t('header.myEvent'),
        subLink: PATHS.myEvents,
        hide: !userInfo,
      },
      {
        label: t('header.campaigns'),
        subLink: PATHS.campaigns,
        hide: !userInfo,
      },
      {
        label: t('header.leaderboard'),
        subLink: PATHS.leaderBoard,
        hide: !userInfo,
      },
    ],
    [userInfo, t],
  );

  const ListOrganizerMenuAndSub = useMemo<Array<IMenu>>(
    () => [
      {
        label: t('header.discover'),
        subLink: PATHS.events,
        hide: false,
      },
      {
        label: t('header.dashboard'),
        subLink: [PATHS.dashboard, 'event-manager'],
        hide: !userInfo || userInfo?.role === TypeRole.FAN || !userInfo.role,
      },
      {
        label: t('header.campaigns'),
        subLink: PATHS.campaigns,
        hide: !userInfo,
      },
      {
        label: t('header.leaderboard'),
        subLink: PATHS.leaderBoard,
        hide: !userInfo,
      },
    ],
    [userInfo, t],
  );

  const options =
    selectedView?.view === EUserView.FAN ? ListFanMenuAndSub : ListOrganizerMenuAndSub;

  const renderMenus = useMemo(() => {
    return options.map((item: IMenu, index: number) => {
      if (item.hide) return;
      const isActive = Array.isArray(item.subLink)
        ? item.subLink.some((subLink) => location?.pathname.includes(subLink))
        : location?.pathname === item.subLink;

      return (
        <li
          key={index}
          className={`${
            isActive ? 'text-primary border-b-[3px] border-primary border-solid' : ''
          } text-black1 text-[16px] px-[20px] leading-[30px]`}
        >
          <Link to={Array.isArray(item.subLink) ? item.subLink[0] : item.subLink!}>
            {item.label}
          </Link>
        </li>
      );
    });
  }, [options, location]);

  return (
    <div className="menu-nft">
      <ul className="menu-nft-list">{renderMenus}</ul>
    </div>
  );
};

export default React.memo(SubMenu);
