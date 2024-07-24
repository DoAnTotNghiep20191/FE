import React from 'react';
import './styles.scss';
import { Image } from 'antd';
import { LeaderBoardRes } from 'src/store/slices/campaign/types';
import { ProfileImage } from 'src/assets/icons';

interface ITopLeader {
  data: LeaderBoardRes[];
}

const TopLeader: React.FC<ITopLeader> = (props) => {
  const { data } = props;
  const renderLeader = (
    leader: LeaderBoardRes,
    rank: number,
    layoutClass: string,
    imageSize: number,
  ) => (
    <div className={`top-leader-layout ${layoutClass}`} key={leader.id}>
      <div className="rank-avatar relative">
        <div className={`rank rank${rank}`}>
          <p>{rank}</p>
        </div>
        <Image
          src={leader.user.avatar || ProfileImage}
          className={`!w-full !h-full border mt-[-3px] border-white bg-white border-solid rounded-full relative shadow-lg shadow-rgba(0, 0, 0, 0.25)`}
          rootClassName={`w-[${imageSize}px] h-[${imageSize}px]`}
        />
      </div>
      <p className="user-name">{`${leader.user.firstName} ${leader.user.lastName}`}</p>
      <div className="point" style={{ marginTop: rank === 1 ? '' : '25px' }}>
        {leader.currentPoints}
      </div>
    </div>
  );

  return (
    <div className="top-leader-container">
      {data.length > 1 && renderLeader(data[1], 2, 'layout-no2', 66)}{' '}
      {data.length > 0 && renderLeader(data[0], 1, 'layout-no1', 84)}{' '}
      {data.length > 2 && renderLeader(data[2], 3, 'layout-no2', 66)}{' '}
    </div>
  );
};

export default TopLeader;
