import AchievementItem from '../AchievementItem';
import { AchievementsResponse } from 'src/store/slices/campaign/types';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  onClick: (data: AchievementsResponse) => void;
  data: AchievementsResponse[];
  loadMore: () => void;
}

const AllAchievementTab = ({ onClick, data, loadMore }: Props) => {
  return (
    <div>
      <InfiniteScroll
        dataLength={data?.length}
        hasMore={true}
        loader={null}
        next={loadMore}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-3 gap-[10px]">
          {data?.map((item) => {
            return <AchievementItem key={item.id} data={item} onClick={onClick} />;
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default AllAchievementTab;
