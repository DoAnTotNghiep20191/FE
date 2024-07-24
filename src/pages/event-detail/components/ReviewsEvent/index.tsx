import { Divider, Image } from 'antd';
import { CardEventImgDetail, DisLikeIcon, LikeIcon } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import { useGetReviewAllQuery, useGetReviewEnjoyQuery } from 'src/store/slices/app/api';
import useInfinitePageQuery from 'src/hooks/useInfiniteQuery';
import { useState } from 'react';

import './styles.scss';
import ModalComponent from 'src/components/Modals';
import { DATE_FORMAT_2, ReviewStatus, WIDTH_FORM_MODAL } from 'src/constants';
import ReviewEvent from 'src/pages/my-events/components/ReviewEvent';
import { ToastMessage } from 'src/components/Toast';
import NotificationModal from '../NotificationModal';
import BackMobileIcon from 'src/assets/icons/common/arrow-left.svg?react';
import { useMobile } from 'src/hooks/useMobile';
import { formatDate } from 'src/helpers/formatValue';
import { useTranslation } from 'react-i18next';
import { C1047, MSG } from 'src/constants/errorCode';

interface IReviewsEvent {
  id: number;
  buyTicked: boolean;
  isReview: boolean;
  reviewStatus: string;
  onShowAll?: () => void;
}

const ReviewsEvent = ({ id, buyTicked, isReview, reviewStatus, onShowAll }: IReviewsEvent) => {
  const [countLimit, setCountLimit] = useState(3);
  const [isOpenReview, setOpenReview] = useState(false);
  const [isOpenNotify, setOpenNotify] = useState(false);
  const [isShowAll, setIsShowAll] = useState(false);
  const isMobile = useMobile();
  const { t } = useTranslation();

  const { combinedData: dataReview, metaData } = useInfinitePageQuery({
    useGetDataListQuery: useGetReviewAllQuery,
    params: {
      id: +id,
      limit: countLimit,
      sortBy: 'createdAt',
      direction: 'DESC',
    },
  });
  const { data: data } = useGetReviewEnjoyQuery({ id: +id });

  const handleDisplayAll = () => {
    setIsShowAll(true);
    setCountLimit(20);
    onShowAll && onShowAll();
  };

  const handleReviewSuccess = () => {
    setOpenReview(false);
    isReview ? ToastMessage.success(t(MSG[C1047])) : setOpenNotify(true);
  };

  const handleCloseNotify = () => {
    setOpenNotify(false);
  };

  const disabledReview = isReview && reviewStatus === ReviewStatus.PENDING;

  if (!dataReview || dataReview?.length === 0) {
    return null;
  }

  return (
    <div className="review-container">
      <p className="review-container-title">{t('feedbackEvent.reviews')}</p>
      <p className="review-container-count">
        {t('feedbackEvent.experiencesShared', { number: data?.data?.totalReview })}
      </p>
      <div className="review-rate">
        <div className="review-rate-box">
          <LikeIcon color="#3C4A60" />
          <p className="review-rate-status">{t('feedbackEvent.good')}</p>
        </div>
        <p className="review-rate-percent">{data?.data?.totalGoodReview}</p>
        <p className="review-rate-des">{t('feedbackEvent.ofFansEnjoyedTheEvent')}</p>
        <Divider className="review-rate-line" />
        {buyTicked && (
          <ButtonContained
            mode="medium"
            className="review-rate-write"
            buttonType="type2"
            onClick={() => setOpenReview(true)}
            disabled={disabledReview}
          >
            {isReview && reviewStatus !== ReviewStatus.REJECTED
              ? t('myEvent.buttonUpdateReview')
              : t('feedbackEvent.buttonWriteReview')}
          </ButtonContained>
        )}
        {metaData && metaData?.total > 3 && !isShowAll && (
          <ButtonContained className="review-rate-display" mode="medium" onClick={handleDisplayAll}>
            {t('feedbackEvent.buttonDisplayAll')}
          </ButtonContained>
        )}
      </div>
      {Array.isArray(dataReview) &&
        dataReview?.length > 0 &&
        dataReview?.map((item: any) => {
          return (
            <div className="review-box" key={item?.id}>
              <div className="flex justify-between">
                <div className="review-box-header">
                  <p className="review-box-name">({item?.user?.username})</p>
                  {item?.reviewReaction === 'good' ? (
                    <LikeIcon className="review-box-icon" />
                  ) : (
                    <DisLikeIcon className="review-box-icon" />
                  )}
                </div>
                <p className="text-white">{formatDate(item?.createdAt, DATE_FORMAT_2)}</p>
              </div>
              <p className="review-box-content">{item?.review}</p>
              {item?.reviewImage && (
                <div className="w-[157px] mt-[10px]">
                  <Image
                    src={item?.reviewImage}
                    alt="reviewImage"
                    className="rounded-[10px] w-full h-[157px] md:h-[232px] border border-white border-solid object-cover"
                    rootClassName="w-[100%]"
                    fallback={CardEventImgDetail}
                    preview={false}
                  />
                </div>
              )}
              <Divider className="review-box-line" />
            </div>
          );
        })}
      <ModalComponent
        open={isOpenReview}
        onCancel={() => setOpenReview(false)}
        centered
        zIndex={70}
        width={WIDTH_FORM_MODAL}
      >
        {isMobile && (
          <BackMobileIcon className="absolute top-11 left-5" onClick={() => setOpenReview(false)} />
        )}
        <ReviewEvent handleReviewSuccess={handleReviewSuccess} eventId={+id} isUpdate={isReview} />
      </ModalComponent>
      <NotificationModal
        isOpen={isOpenNotify}
        onButton={handleCloseNotify}
        onClose={handleCloseNotify}
        title={t('reviewEvent.thankForSharing')}
        description={t('reviewEvent.yourReviewWillBeAdded')}
        textButton={t('reviewEvent.buttonClose')}
      />
    </div>
  );
};

export default ReviewsEvent;
