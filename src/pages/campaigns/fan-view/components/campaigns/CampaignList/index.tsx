import InfiniteScroll from 'react-infinite-scroll-component';
import { CampaignItemRes } from 'src/store/slices/campaign/types';
import CardItem from './CardItem';
import { EUserChallengeStatus } from 'src/socket/BaseSocket';

interface Props {
  data: CampaignItemRes[];
  loadMore: () => void;
  onUpdateChallengeStatus: (
    campaignId: number,
    challengeId: number,
    status: EUserChallengeStatus,
  ) => void;
}

const CampaignList = ({ data, loadMore, onUpdateChallengeStatus }: Props) => {
  return (
    <InfiniteScroll
      dataLength={data?.length}
      hasMore={true}
      loader={null}
      next={loadMore}
      className="overflow-hidden"
    >
      {data.map((item) => {
        return (
          <CardItem onUpdateChallengeStatus={onUpdateChallengeStatus} key={item.id} data={item} />
        );
      })}
    </InfiniteScroll>
  );
};

export default CampaignList;
