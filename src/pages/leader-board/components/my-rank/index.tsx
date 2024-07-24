import React from 'react';
import { useTranslation } from 'react-i18next';
import RankItem from '../rank-item';
import { PositionLeaderBoardRes } from 'src/store/slices/campaign/types';
import { getUserInfo } from 'src/store/selectors/user';
import { useAppSelector } from 'src/store';

interface IMyRank {
  data: PositionLeaderBoardRes;
}
const MyRank: React.FC<IMyRank> = (props) => {
  const userInfo = useAppSelector(getUserInfo);

  const { data } = props;
  const { t } = useTranslation('campaigns');

  return (
    <div className="my-rank-container flex flex-col pb-4 pt-3 pl-8 bg-[#0e5380] w-full">
      <span className="text-[14px] uppercase text-white">{t('myRank')}</span>
      <RankItem
        data={data.userRanking}
        rank={data.rankingPosition}
        username={userInfo?.username}
        isPositionRank={true}
      />
    </div>
  );
};

export default MyRank;
