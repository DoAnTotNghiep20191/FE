import React from 'react';
import GiftIcon from 'src/assets/icons/campaigns/gift-icon.png';
import MereoLogo from 'src/assets/icons/campaigns/mereo-logo-white.png';
import { FanRewardsItem } from 'src/store/slices/campaign/types';

interface Props {
  data: FanRewardsItem;
  onSelected: (data: FanRewardsItem) => void;
  isSelected?: boolean;
}
const CardItem = ({ data, onSelected, isSelected }: Props) => {
  return (
    <div
      className={`bg-[url('/images/background4.png')] h-[200px] flex flex-col items-center justify-center gap-[10px] border-[4px] border-solid ${isSelected ? 'border-red' : 'border-primary'}  rounded-sm cursor-pointer`}
      onClick={() => onSelected(data)}
    >
      <img className="w-[100px] h-[70px]" src={GiftIcon} />
      <img className="w-[80px]" src={MereoLogo} />
    </div>
  );
};

export default CardItem;
