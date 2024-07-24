import CardEvent from './components/CardEvent';

import { debounce } from 'lodash';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory, useLocation } from 'react-router-dom';
import CustomSearch from 'src/components/Search';
import AppSegmented from 'src/components/Segmented';
import { invitation_key } from 'src/constants';
import { PATHS } from 'src/constants/paths';
import useInfinitePageQuery from 'src/hooks/useInfiniteQuery';
import { useAppDispatch } from 'src/store';
import { useGetEventDataQuery } from 'src/store/slices/app/api';
import { EEventFilter, EEventStatus } from 'src/store/slices/app/types';
import { setOldPath } from 'src/store/slices/auth';
import NotificationModal from '../event-detail/components/NotificationModal';
import OrganizerRegister from '../profile/components/organizer-register';
import SkeletonCardEvent from './components/SkeletonCardEvent';
import './styles.scss';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';

const Events = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const [openOrganizerModal, setOpenOrganizerModal] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const { rudderAnalytics } = useRudderStack();

  const [searchVal, setSearchVal] = useState('');
  const [valueDebounce, setValueDebounce] = useState('');
  const [valueFilter, setValueFilter] = useState(EEventFilter.UPCOMING);

  const { t } = useTranslation();

  const { combinedData, loadMore, resetPage, isLoading } = useInfinitePageQuery({
    useGetDataListQuery: useGetEventDataQuery,
    params: {
      limit: 20,
      search: valueDebounce.trim(),
      sortBy: valueFilter === EEventFilter.UPCOMING ? 'startTime' : 'endTime',
      direction: valueFilter === EEventFilter.UPCOMING ? 'ASC' : 'DESC',
      buyStatus: valueFilter,
      status: [EEventStatus.DEPLOYED, EEventStatus.UPDATED],
    },
  });

  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 2 || value.length === 0) {
      resetPage();
      setValueDebounce(value);
    }
  };

  const handleAddToRudderStack = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    rudderAnalytics?.track(ERudderStackEvents.EventSearched, {
      eventType: ERudderStackEvents.EventSearched,
      data: {
        searchString: value,
      },
    });
  };

  const debounceHandler = useCallback(debounce(handleSearchChange, 500), []);

  const debounceAddToRudderStackHandler = useCallback(debounce(handleAddToRudderStack, 3000), []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    debounceHandler(e);
    debounceAddToRudderStackHandler(e);
  };

  const handleClickEvent = (id: string) => {
    dispatch(setOldPath(PATHS.events));
    history.push(`/events/${id}`);
  };

  useEffect(() => {
    const tokenInvite = new URLSearchParams(search).get('token');
    if (tokenInvite) {
      localStorage.setItem(invitation_key, tokenInvite);
    }
  }, []);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const isModalOpen = queryParams.get('openModal') === 'true';
    if (isModalOpen) {
      setOpenOrganizerModal(true);
      // onOpen();
    }
  }, [location]);

  const handleRegisterSuccess = () => {
    setIsRegisterSuccess(true);
  };

  return (
    <div className="w-[100%] md:w-[675px] flex flex-col items-center justify-center m-auto px-[10px] md:px-0">
      {/* <Affix className="w-full md:w-[342px] fixed top-[60px] md:top-[85px] z-[2] px-[19px] md:px-[0]"> */}
      <div className="w-full md:w-[342px] white my-[36px] flex justify-center">
        <CustomSearch
          onChange={handleSearch}
          value={searchVal}
          placeholder={t('discover.searchDiscover')}
          className="md:w-full md:h-[53px]"
        />
      </div>
      {/* </Affix> */}

      <div className="events-content">
        <div className="w-[148px]">
          <AppSegmented
            items={[
              {
                label: <p className="capitalize font-medium text-[12px]">{t('common.upcoming')}</p>,
                value: EEventFilter.UPCOMING,
              },
              {
                label: <p className="capitalize font-medium text-[12px]">{t('common.past')}</p>,
                value: EEventFilter.PAST,
              },
            ]}
            value={valueFilter}
            onChange={(val: EEventFilter) => {
              resetPage();
              setValueFilter(val);
            }}
          />
        </div>
        <div className="w-full md:w-[468px] my-[30px] md:my-[40px]">
          {isLoading ? (
            <>
              <SkeletonCardEvent />
              <SkeletonCardEvent />
            </>
          ) : Array.isArray(combinedData) && combinedData?.length > 0 ? (
            <InfiniteScroll
              dataLength={combinedData?.length}
              hasMore={true}
              loader={null}
              next={loadMore}
            >
              {combinedData?.map((item: any) => {
                return <CardEvent event={item} key={item?.id} onClickEvent={handleClickEvent} />;
              })}
            </InfiniteScroll>
          ) : (
            <p className="text-[16px] italic font-extralight text-center">
              {valueDebounce
                ? t('common.noResultsFoundFor', { search: valueDebounce })
                : t('common.noData')}
            </p>
          )}
        </div>
      </div>
      <OrganizerRegister
        isOpen={openOrganizerModal}
        onClose={() => setOpenOrganizerModal(false)}
        onUpdateSuccess={handleRegisterSuccess}
        userInfo={null}
      />

      <NotificationModal
        isOpen={isRegisterSuccess}
        title={t('profile.formSubmitted')}
        description={t('profile.thanksFor')}
        description2={t('profile.completeVerificationOrganizer')}
        textButton={t('profile.buttonClose')}
        onButton={() => setIsRegisterSuccess(false)}
        onClose={() => setIsRegisterSuccess(false)}
      />
    </div>
  );
};

export default Events;
