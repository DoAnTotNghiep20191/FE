import { Image } from 'antd';
import React from 'react';
import RankItemImg from 'src/assets/icons/common/campaign-item-bg.svg';
import { LeaderBoardRes } from 'src/store/slices/campaign/types';
import './styles.scss';
import OverflowTooltip from 'src/components/OverflowTooltip';
interface IRankItem {
  rank: number;
  username?: string | null;
  data?: LeaderBoardRes;
  isPositionRank?: boolean;
}

const RankItem: React.FC<IRankItem> = (props) => {
  const { data, rank, username, isPositionRank = false } = props;
  return (
    <div className="rank-item-container">
      <div className="rank-item-container__rank flex justify-center items-center">
        <div className="border1 flex justify-center items-center">
          <div className="border2 flex justify-center items-center">
            <p>{rank}</p>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-between items-center px-[10px] rank-item-bg">
        <div className="flex justify-between items-center gap-[6px]">
          <Image
            style={{
              background: 'black',
            }}
            width={29}
            height={29}
            src={data?.user.avatar || RankItemImg}
            preview={false}
          />
          <div className="flex flex-col">
            <OverflowTooltip
              className=" truncate max-w-[150px]"
              title={data?.user.username || username}
            >
              <p className={`text-[10px] truncate max-w-[150px] ${isPositionRank && 'text-white'}`}>
                {data?.user.username || username}
              </p>
            </OverflowTooltip>

            <OverflowTooltip className=" truncate max-w-[150px]" title={data?.user.email}>
              <p className={`text-[10px] truncate max-w-[150px] ${isPositionRank && 'text-white'}`}>
                {data?.user.email}
              </p>
            </OverflowTooltip>
          </div>
        </div>

        <div className="rank-item-container__point">{data?.currentPoints}</div>
      </div>
    </div>
  );
};

export default RankItem;
