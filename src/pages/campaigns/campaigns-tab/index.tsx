import { Button } from 'antd';
import CampaignCard from '../components/campaign-card';
import './styles.scss';
import CustomSearch from 'src/components/Search';
import { ChangeEvent, useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import ButtonOutLined from 'src/components/Buttons/ButtonOutLined';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import CreateCampaignModal from '../modal-create-campaign';
import { useGetListCampaignQuery } from 'src/store/slices/campaign/api';
import {
  CampaignItemRes,
  ECampaignViewStatus,
  ParamsListCampaign,
} from 'src/store/slices/campaign/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import useInfinitePageQuery from 'src/hooks/useInfiniteQuery';

const CampaignsTab = () => {
  const { t } = useTranslation('campaigns');
  const { t: commonTranslate } = useTranslation('translations');

  const [searchVal, setSearchVal] = useState('');
  const [isCreate, setIsCreate] = useState(false);
  const [valueDebounce, setValueDebounce] = useState('');
  const [viewPast, setViewPast] = useState(false);
  const {
    combinedData: listCampaign,
    refresh: refetchListCampaign,
    loadMore,
    resetPage,
  } = useInfinitePageQuery<CampaignItemRes>({
    useGetDataListQuery: useGetListCampaignQuery,
    params: {
      limit: 10,
      viewStatus: viewPast
        ? [ECampaignViewStatus.PAST]
        : [ECampaignViewStatus.ONGOING, ECampaignViewStatus.UPCOMING],
      search: valueDebounce,
      sortBy: 'id',
      direction: 'DESC',
    } as ParamsListCampaign,
  });

  const handleSearchChange = async (value: string) => {
    resetPage();
    setValueDebounce(value);
  };

  const debounceHandler = useCallback(debounce(handleSearchChange, 500), []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    debounceHandler(e.target.value);
    // debounceAddToRudderStackHandler(e);
  };

  const handleCancel = () => {
    setIsCreate(false);
  };
  return (
    <div className="campaigns-tab-container w-full md:w-[448px] flex flex-col px-5">
      <div className=" mb-4">
        <Button className="btn-create-campaign" type="primary" onClick={() => setIsCreate(true)}>
          Create +
        </Button>
      </div>
      <CustomSearch
        onChange={handleSearch}
        value={searchVal}
        placeholder={t('searchPlaceholder')}
        className="w-[275px] md:w-full h-[40px] md:h-[53px] max-w-[342px]"
      />
      {viewPast ? (
        <ButtonContained
          className="my-4"
          buttonType="type6"
          onClick={() => {
            setViewPast(!viewPast);
          }}
        >
          {t('viewPastCampaigns')}
        </ButtonContained>
      ) : (
        <ButtonOutLined
          className="my-4"
          buttonType="type2"
          onClick={() => {
            setViewPast(!viewPast);
          }}
        >
          {t('viewPastCampaigns')}
        </ButtonOutLined>
      )}
      <div className="w-full">
        {listCampaign.length > 0 ? (
          <InfiniteScroll
            dataLength={listCampaign?.length}
            hasMore={true}
            loader={null}
            next={loadMore}
            className="overflow-hidden space-y-1"
          >
            {listCampaign.map((campaign: CampaignItemRes) => (
              <CampaignCard
                key={campaign.id}
                campaigns={campaign}
                refetchListCampaign={refetchListCampaign}
                defaultActive={!viewPast}
              />
            ))}
          </InfiniteScroll>
        ) : valueDebounce ? (
          <p className="text-[16px] italic font-extralight text-center">
            {valueDebounce
              ? commonTranslate('common.noResultsFoundFor', { search: valueDebounce })
              : commonTranslate('common.noData')}
          </p>
        ) : (
          <></>
        )}
      </div>

      <CreateCampaignModal
        refetchListCampaign={refetchListCampaign}
        open={isCreate}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CampaignsTab;
