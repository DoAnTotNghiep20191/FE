import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FanRewardsItem } from 'src/store/slices/campaign/types';
import CardItem from './CardItem';

interface Props {
  data: FanRewardsItem[];
  loadMore: () => void;
  onSelected: (data: FanRewardsItem) => void;
  selectedReward?: FanRewardsItem;
}
const RewardsList = ({ data, loadMore, onSelected, selectedReward }: Props) => {
  return (
    <InfiniteScroll
      dataLength={data?.length}
      hasMore={true}
      loader={null}
      next={loadMore}
      className="overflow-hidden"
    >
      <div className="grid grid-cols-3 w-[100%] gap-[10px] px-[10px]">
        {data?.map((item) => {
          return (
            <CardItem
              key={item.id}
              data={item}
              onSelected={onSelected}
              isSelected={selectedReward?.id === item?.id}
            />
          );
        })}
      </div>
    </InfiniteScroll>
  );
};

export default RewardsList;
