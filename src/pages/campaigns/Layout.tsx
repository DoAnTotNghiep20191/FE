import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getSelectedView, getUserInfo } from 'src/store/selectors/user';
import { setSelectedView } from 'src/store/slices/user';
import { EUserView, TypeRole } from 'src/store/slices/user/types';
import FanCampaignView from './fan-view';
import OrganizerCampaignView from './organizer-view';

const CampaignsLayout = () => {
  const selectedView = useAppSelector(getSelectedView);
  const userInfo = useAppSelector(getUserInfo);
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  useEffect(() => {
    const view = new URLSearchParams(search).get('view');
    if (view && view === 'fan') {
      dispatch(
        setSelectedView({
          view: EUserView.FAN,
          account: userInfo?.userWallet?.[0]?.address || '',
        }),
      );
    } else if (view && view === 'organizer') {
      dispatch(
        setSelectedView({
          view: EUserView.ORGANIZER,
          account: userInfo?.userWallet?.[0]?.address || '',
        }),
      );
    }
  }, []);

  return (
    <div className="campaign-layout flex flex-col justify-center items-center">
      {selectedView.view === EUserView.ORGANIZER && userInfo?.role === TypeRole.ORGANIZER ? (
        <OrganizerCampaignView />
      ) : (
        <FanCampaignView />
      )}
    </div>
  );
};

export default CampaignsLayout;
