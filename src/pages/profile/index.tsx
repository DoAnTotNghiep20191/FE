import PersonalProfile from './components/personal-profile';
import { getUserInfo } from 'src/store/selectors/user';
import { useGetUserInfoQuery } from 'src/store/slices/user/api';
import { useMobile } from 'src/hooks/useMobile';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'src/store';
import HelpSupport from './components/help-support';

const Profile = () => {
  const { t } = useTranslation();
  const isMobile = useMobile();
  const userInfo = useAppSelector(getUserInfo);
  const { isFetching } = useGetUserInfoQuery(undefined, { refetchOnMountOrArgChange: true });

  return (
    <div className="w-full xl:w-[342px] m-auto pt-[36px]">
      {isMobile ? (
        <p className="text-black1 text-[24px] mb-4 text-center px-5">
          {t('profile.welcome')} <br />
          <span className="block max-w-full truncate">{userInfo?.username}</span>
        </p>
      ) : (
        <p className="text-black1 text-[24px] mb-4 text-center px-5">
          {t('profile.welcome')} {userInfo?.username}
        </p>
      )}
      <PersonalProfile loading={isFetching} />
      <HelpSupport />
    </div>
  );
};

export default Profile;
