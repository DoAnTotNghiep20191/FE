import { Space } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { CampaignIcon, DashboardIcon, ProfileIcon, SearchIcon, Ticket } from 'src/assets/icons';
import { PATHS } from 'src/constants/paths';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getSelectedView, getUserInfo } from 'src/store/selectors/user';
import { setOpenSignIn } from 'src/store/slices/auth';
import LeaderBoardIcon from 'src/assets/icons/navbar/leaderboard.svg?react';
import { EUserView, TypeRole } from 'src/store/slices/user/types';

const ROLE_NONE = 'none';

const fanOptionList = [
  {
    title: 'Discover',
    icon: <SearchIcon />,
    path: PATHS.events,
    roles: [ROLE_NONE, TypeRole.FAN, TypeRole.ORGANIZER],
  },
  {
    title: 'Campaign',
    icon: <CampaignIcon />,
    path: PATHS.campaigns,
    roles: [TypeRole.ORGANIZER, TypeRole.FAN],
  },
  {
    title: 'Leader board',
    icon: <LeaderBoardIcon />,
    path: PATHS.leaderBoard,
    roles: [TypeRole.ORGANIZER, TypeRole.FAN],
  },
  {
    title: 'My events',
    icon: <Ticket />,
    path: PATHS.myEvents,
    roles: [TypeRole.FAN, TypeRole.ORGANIZER],
  },
  {
    title: 'Profile',
    icon: <ProfileIcon />,
    path: PATHS.profile,
    roles: [ROLE_NONE, TypeRole.FAN, TypeRole.ORGANIZER],
  },
];

const organizerOptionList = [
  {
    title: 'Discover',
    icon: <SearchIcon />,
    path: PATHS.events,
    roles: [ROLE_NONE, TypeRole.FAN, TypeRole.ORGANIZER],
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: PATHS.dashboard,
    roles: [TypeRole.ORGANIZER],
  },
  {
    title: 'Campaign',
    icon: <CampaignIcon />,
    path: PATHS.campaigns,
    roles: [TypeRole.ORGANIZER, TypeRole.FAN],
  },
  {
    title: 'Leader board',
    icon: <LeaderBoardIcon />,
    path: PATHS.leaderBoard,
    roles: [TypeRole.ORGANIZER, TypeRole.FAN],
  },
  {
    title: 'Profile',
    icon: <ProfileIcon />,
    path: PATHS.profile,
    roles: [ROLE_NONE, TypeRole.FAN, TypeRole.ORGANIZER],
  },
];

const publicPaths = [
  PATHS.AboutUs,
  PATHS.ComingSoon,
  PATHS.Privacy,
  PATHS.QuickGuide,
  PATHS.RefundPolicy,
  PATHS.Term,
  PATHS.contactUs,
  PATHS.profile,
  PATHS.passwordEvent,
  PATHS.notFound,
  PATHS.faqs,
  PATHS.eventDetail,
  PATHS.events,
  PATHS.leaderBoard,
  PATHS.campaigns,
];

const fanPaths = [...publicPaths, PATHS.myEvents, PATHS.purchaseHistory];
const organizerPaths = [
  ...publicPaths,
  PATHS.dashboard,
  PATHS.eventManager,
  PATHS.teamManagement,
  PATHS.CheckIn,
];

const AppNavbar = () => {
  const history = useHistory();
  const location = useLocation();
  const currentPath = location.pathname;

  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(getUserInfo);
  const userRole = !userInfo ? ROLE_NONE : userInfo?.role;
  const selectedView = useAppSelector(getSelectedView);

  const currentOptions =
    (!selectedView?.account && userInfo?.role === TypeRole.ORGANIZER) ||
    selectedView?.view === EUserView.ORGANIZER
      ? organizerOptionList
      : fanOptionList;

  const [currentOption, setCurrentOption] = useState(currentOptions[0].title);

  useEffect(() => {
    if (currentPath === PATHS.events || currentPath.length === 0) {
      setCurrentOption(currentOptions[0].title);
      return;
    }
    currentOptions.forEach((option) => {
      if (currentPath.includes(option.path)) {
        setCurrentOption(option.title);
      }
    });
  }, [currentPath]);

  const handleSelectOption = (option: any) => {
    if (option.title === 'Favorite') return;
    if (userRole === ROLE_NONE) {
      dispatch(setOpenSignIn(true));
      return;
    }
    setCurrentOption(option.title);
    history.push(option.path);
  };

  const validateCurrentPath = (path: string) => {
    const isEventRoute = path.includes('/events/');

    if (isEventRoute) {
      return;
    }

    if (selectedView?.view === EUserView.FAN) {
      if (!fanPaths.includes(location.pathname) && organizerPaths.includes(location.pathname)) {
        setCurrentOption(currentOptions[0].title);
        history.push(currentOptions[0].path);
      }
    } else if (
      (!selectedView?.account && userInfo?.role === TypeRole.ORGANIZER) ||
      selectedView?.view === EUserView.ORGANIZER
    ) {
      const isTeamManagerRoute = path.includes('/event-manager/');
      if (isTeamManagerRoute) {
        return;
      }
      if (!organizerPaths.includes(location.pathname) && fanPaths.includes(location.pathname)) {
        setCurrentOption(currentOptions[0].title);
        history.push(currentOptions[0].path);
      }
    }
  };

  useEffect(() => {
    validateCurrentPath(location.pathname);
  }, [selectedView, location.pathname]);

  return (
    <div className="md:hidden h-[80px] w-full fixed bottom-0 bg-white flex z-[20]">
      {currentOptions.map((option, index) => {
        if (!option.roles.includes(userRole)) return null;
        return (
          <div
            className="flex-1 flex items-center justify-center"
            key={index}
            onClick={() => handleSelectOption(option)}
          >
            {currentOption === option.title ? (
              <Space size={2} direction="vertical" className="items-center">
                <div className="w-[64px] h-[32px] bg-primary rounded-[16px] flex justify-center items-center">
                  {option.icon}
                </div>
                <span className="text-[12px] text-primary whitespace-nowrap">{option.title}</span>
              </Space>
            ) : (
              <div>{option.icon}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AppNavbar;
