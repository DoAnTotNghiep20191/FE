import { Divider, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { BadIcon, GoodIcon } from 'src/assets/icons/IconComponent';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import './styles.scss';
import { useEffect, useMemo, useState } from 'react';
import { ACTION_TYPE, ReviewStatus } from 'src/constants';
import UploadImage from 'src/components/UploadImage';
import InputTextArea from 'src/components/InputTextArea';
import {
  useGetEventDetailQuery,
  useLazyGetReviewsQuery,
  useReviewsMutation,
  useUpdateReviewsMutation,
} from 'src/store/slices/app/api';
import { ToastMessage } from 'src/components/Toast';
import { C1001, C1006, C1092, MSG } from 'src/constants/errorCode';
import { onLogError } from 'src/helpers';
import { useTranslation } from 'react-i18next';

interface ReviewEventProps {
  handleReviewSuccess: () => void;
  eventId: number;
  isUpdate: boolean;
}

const ReviewEvent = (props: ReviewEventProps) => {
  const { eventId, handleReviewSuccess } = props;
  const { t } = useTranslation();
  const [form] = useForm();
  const [currentActive, setCurrentActive] = useState(ACTION_TYPE.NONE);
  const [reviews] = useReviewsMutation();
  const [updateReviews] = useUpdateReviewsMutation();
  const [getReviews] = useLazyGetReviewsQuery();
  const [reviewsData, setReviewsData] = useState<any>();

  const { data } = useGetEventDetailQuery({
    id: eventId,
  });

  const isUpdate = data?.data?.isReview && data?.data?.reviewStatus !== ReviewStatus.REJECTED;
  const isReview = data?.data?.isReview && data?.data?.reviewStatus !== ReviewStatus.ACCEPTED;
  const handleClick = (key: string) => {
    setCurrentActive(key);
  };

  const handleLeaveReview = async (values: any) => {
    const payload = {
      reviewReaction: currentActive,
      ...values,
      collectionId: eventId,
    };
    try {
      if (currentActive === ACTION_TYPE.NONE) {
        ToastMessage.error(t(MSG[C1006]));
        return;
      }
      !isUpdate ? await reviews(payload).unwrap() : await updateReviews(payload).unwrap();
      handleReviewSuccess();
    } catch (error: any) {
      console.error(error);
      const validator_errors = error?.data?.validator_errors;
      ToastMessage.error(t(MSG[validator_errors || C1001]));
    }
  };

  const handleGetReviews = async () => {
    try {
      const res = await getReviews({ id: eventId });
      const data = res?.data?.data;
      setReviewsData(data);
      setCurrentActive(res?.data?.data.reviewReaction);
      form.setFields([
        {
          name: 'review',
          value: data.review,
        },
      ]);
    } catch (error: any) {
      console.error(error);
    }
  };

  const reviewChange = Form?.useWatch('review', form);
  const reviewImageChange = Form?.useWatch('reviewImage', form);

  const isChangeReview = useMemo(() => {
    return (
      reviewsData?.review?.trim() !== reviewChange?.trim() ||
      reviewImageChange ||
      currentActive !== reviewsData?.reviewReaction
    );
  }, [reviewChange, reviewsData, reviewImageChange, reviewsData, currentActive]);

  const renderButtonText = useMemo(() => {
    const event = data?.data;
    if (event?.isReview && event?.reviewStatus !== ReviewStatus.ACCEPTED) {
      return t('reviewEvent.approving');
    }

    if (event?.isReview && event?.reviewStatus !== ReviewStatus.REJECTED) {
      return t('reviewEvent.buttonEdit');
    } else {
      return t('reviewEvent.buttonLeave');
    }
  }, [isUpdate, data]);

  useEffect(() => {
    if (isUpdate) {
      handleGetReviews();
    }
  }, [isUpdate]);

  return (
    <div className="review-event event-modal">
      <div className="modal-header">
        <p className="font-loos text-[24px] mx-auto">{t('reviewEvent.shareYourExperience')}</p>
        <p className="text-[14px] mx-auto">
          {t('reviewEvent.shareYourFeedback')} {/* {!isMobile ? <br /> : ' '} */}
        </p>
      </div>
      <div className="modal-content">
        <div className="action-review">
          <div
            onClick={() => handleClick(ACTION_TYPE.GOOD)}
            className={currentActive === ACTION_TYPE.GOOD ? 'action-active' : ''}
          >
            {/* {currentActive === ACTION_TYPE.GOOD && <TickIcon />} */}
            <GoodIcon />
            <p>{t('reviewEvent.good')}</p>
          </div>
          <div
            onClick={() => handleClick(ACTION_TYPE.BAD)}
            className={currentActive === ACTION_TYPE.BAD ? 'action-active' : ''}
          >
            {/* {currentActive === ACTION_TYPE.BAD && <TickIcon />} */}
            <BadIcon />
            <p>{t('reviewEvent.bad')}</p>
          </div>
        </div>
        <Divider className="divider w-[272px] min-w-[0] mx-auto my-[40px]" />

        <Form form={form} autoComplete="off" name="update-email" onFinish={handleLeaveReview}>
          <Form.Item
            key="reviewImage"
            name="reviewImage"
            style={{ marginBottom: '20px' }}
            className="upload-review"
          >
            <UploadImage
              withOutDefaultImage={true}
              defaultValue={isUpdate ? reviewsData?.reviewImage : form.getFieldValue('image') || ''}
              onImageSelect={(src: string) => {
                form.setFieldValue('reviewImage', src);
              }}
              width={312}
              height={170}
              className="upload-review-img"
            />
          </Form.Item>
          <Form.Item
            key="review"
            name="review"
            className="md:max-w-[312px] mx-auto"
            rules={[{ max: 1200, message: t(MSG[C1092]) }]}
          >
            <InputTextArea
              label="Event review"
              placeholder={t('reviewEvent.eventReviewPlaceholder')}
              showCount
              rows={5}
              maxLength={1200}
              // widthFull
            />
          </Form.Item>
        </Form>

        <div className="!w-[212px] mx-auto">
          <ButtonContained
            buttonType="type1"
            fullWidth
            onClick={() => {
              form.submit();
            }}
            disabled={currentActive === ACTION_TYPE.NONE || !isChangeReview || isReview}
          >
            {renderButtonText}
          </ButtonContained>
        </div>
      </div>
    </div>
  );
};

export default ReviewEvent;
