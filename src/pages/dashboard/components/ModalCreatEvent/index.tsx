import Icon from '@ant-design/icons';
import { Form } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { BackIcon, CheckedStep } from 'src/assets/icons';
import { VerificationIcon } from 'src/assets/icons/IconComponent';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import { SHOW_PRIVATE_EVENT, WIDTH_FORM_MODAL, WIDTH_FORM_MODAL_2 } from 'src/constants';
import { useCreateEventMutation, useUpdateEventMutation } from 'src/store/slices/app/api';
import { getGeocode, getLatLng } from 'use-places-autocomplete';
import ModalComponent from '../../../../components/Modals';
import CreateEventStep1 from './CreateEventStep1';
import CreateEventStep2 from './CreateEventStep2';
import CreateEventStep3 from './CreateEventStep3';
import './styles/index.scss';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';

const HEAD_DES = [
  'createEvent.letGetStartedWithSome',
  'createEvent.letUsersKnowMore',
  'createEvent.addTheFinalTouches',
];

const HEAD_DES_UPDATE = [
  'createEvent.reviewAndUpdateCore',
  'createEvent.letUsersKnowMore',
  'createEvent.addTheFinalTouches',
];
const HeaderModal = ({
  step,
  isEdit,
  onBack,
}: {
  step: number;
  isEdit: boolean;
  onBack?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="modal-header relative">
      <p className="modal-header-title">
        {isEdit ? t('createEvent.updateEvent') : t('createEvent.eventCreation')}
      </p>
      <p className="modal-header-des text-center">
        {t((isEdit ? HEAD_DES_UPDATE : HEAD_DES)[step - 1])}
      </p>
      <button onClick={onBack} className="absolute top-0 left-0">
        <BackIcon />
      </button>
      <div className="modal-header-box">
        {Array(3)
          .fill({})
          .map((_, index) => {
            const isLast = index === 3 - 1;
            const active = step > index + 1;
            const current = step === index + 1;
            return (
              <div
                key={`e-${index + 1}`}
                className={`modal-header-box-step  ${active && 'active'} ${current && 'current'}`}
              >
                {!active ? (
                  <div className="step">
                    <p className="count">{index + 1}</p>
                  </div>
                ) : (
                  <CheckedStep />
                )}
                {isLast || <div className={`line`} />}
              </div>
            );
          })}
      </div>
    </div>
  );
};

const ModalSuccessfully = ({
  onClose,
  onRepublish,
  isEdit,
}: {
  onClose: () => void;
  isEdit: boolean;
  onRepublish?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="modal-success justify-start">
      <p className="modal-header-title">
        {isEdit ? t('createEvent.eventUpdated') : t('createEvent.eventCreated')}
      </p>
      <p className="modal-header-des text-center">
        {isEdit
          ? t('createEvent.republishYourEventSoThat')
          : t('createEvent.reviewYourEventAndStart')}
      </p>
      <Icon component={VerificationIcon} className="modal-verification-icon" />
      {isEdit ? (
        <>
          <ButtonContained className="modal-btn-close  " buttonType="type1" onClick={onRepublish}>
            {t('createEvent.republishNow')}
          </ButtonContained>
          <ButtonContained
            className="!mt-[10px] modal-btn-close"
            buttonType="type2"
            onClick={onClose}
          >
            {t('createEvent.maybeLater')}
          </ButtonContained>
        </>
      ) : (
        <ButtonContained className="modal-btn-close" buttonType="type2" onClick={onClose}>
          {t('createEvent.buttonClose')}
        </ButtonContained>
      )}
    </div>
  );
};

interface IModalCreateEvent {
  open: boolean;
  onCancel: () => void;
  dataEdit?: any;
  onRepublish?: () => void;
}

const ModalCreateEvent = ({ open, dataEdit, onCancel, onRepublish }: IModalCreateEvent) => {
  const [step, setStep] = useState(1);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShowPrivate, setIsShowPrivate] = useState(false);

  const [dataForm, setDataForm] = useState<any>(null);
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const { rudderAnalytics } = useRudderStack();

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  // const isMobile = useMobile();
  useEffect(() => {
    setIsPrivate(!!dataEdit?.isPrivate);
    setIsShowPrivate(!!dataEdit && dataEdit.isShow === SHOW_PRIVATE_EVENT.ENABLE);
  }, [dataEdit, open]);

  const handleBackButton = () => {
    if (step === 1) {
      handleCancel();
    } else {
      setStep(step - 1);
    }
  };

  const handelNextForm1 = (values: any) => {
    try {
      setStep(2);
      setDataForm({ ...dataForm, ...values });
    } catch (err: any) {
      console.error(err);
    }
  };

  const handelNextForm2 = (values: any) => {
    try {
      setStep(3);
      setDataForm({ ...dataForm, ...values });
    } catch (err: any) {
      console.error(err);
    }
  };
  const handelCreateEvent = async (values: any) => {
    setLoading(true);
    try {
      let latitude = dataForm.latitude;
      let longitude = dataForm.longitude;

      if (!latitude && !longitude) {
        const results: any = await getGeocode({ address: dataForm?.location });
        const { lat, lng } = getLatLng(results[0]);
        latitude = lat;
        longitude = lng;
      }

      const param = {
        ...dataForm,
        ...values,
        location: dataForm?.location,
        longitude: Number(longitude),
        latitude: Number(latitude),
        isPrivate: isPrivate,
        endTime: dayjs(dataForm?.endTime).unix(),
        startTime: dayjs(dataForm?.startTime).unix(),
        id: dataEdit?.id || '',
        socialTags: values?.socialTags?.replace('#', ''),
        isShow: !isPrivate
          ? SHOW_PRIVATE_EVENT.ENABLE
          : isShowPrivate
            ? SHOW_PRIVATE_EVENT.ENABLE
            : SHOW_PRIVATE_EVENT.DISABLE,
      };
      if (dataEdit) {
        await updateEvent(param).unwrap();
        rudderAnalytics?.track(ERudderStackEvents.EventUpdated, {
          eventType: ERudderStackEvents.EventUpdated,
          data: param,
        });
      } else {
        await createEvent(param).unwrap();
        rudderAnalytics?.track(ERudderStackEvents.EventCreated, {
          eventType: ERudderStackEvents.EventCreated,
          data: param,
        });
      }
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSwitchPrivate = (e: boolean) => {
    setIsPrivate(e);
  };

  const handleSwitchShowEvent = (e: boolean) => {
    setIsShowPrivate(e);
  };

  const handleCancel = () => {
    form.resetFields();
    setDataForm(null);
    setIsPrivate(false);
    setIsShowPrivate(false);
    setIsSuccess(false);
    setStep(1);
    onCancel && onCancel();
  };

  const handleRepublish = () => {
    setDataForm(null);
    setIsPrivate(false);
    setIsShowPrivate(false);
    setIsSuccess(false);
    setStep(1);
    onRepublish && onRepublish();
  };

  const switchForm = (type: number) => {
    switch (type) {
      case 1:
        return (
          <CreateEventStep1
            form={form}
            dataEdit={dataEdit}
            isPrivate={isPrivate}
            isShowPrivate={isShowPrivate}
            onSwitchPrivate={handleSwitchPrivate}
            onSwitchShowEvent={handleSwitchShowEvent}
            onSubmit={handelNextForm1}
          />
        );
      case 2:
        return <CreateEventStep2 form={form} onSubmit={handelNextForm2} dataEdit={dataEdit} />;
      case 3:
        return (
          <CreateEventStep3
            loading={loading}
            form={form}
            onSubmit={handelCreateEvent}
            dataEdit={dataEdit}
          />
        );
      default:
    }
  };

  const renderForm = useMemo(() => {
    return switchForm(step);
  }, [step, isPrivate, isShowPrivate, dataEdit]);

  const renderWidth = useMemo(() => {
    if (isSuccess) {
      return WIDTH_FORM_MODAL_2;
    } else {
      return WIDTH_FORM_MODAL;
    }
  }, [isSuccess, isPrivate, isShowPrivate, dataEdit]);

  return (
    <ModalComponent
      open={open}
      width={renderWidth}
      centered
      className={`modal-create-event ${isSuccess ? '!h-[658px]' : ''}`}
      onCancel={handleCancel}
      destroyOnClose
      isCloseMobile={isSuccess ? false : true}
    >
      {isSuccess ? (
        <ModalSuccessfully onClose={handleCancel} isEdit={dataEdit} onRepublish={handleRepublish} />
      ) : (
        <>
          {/* {isMobile && step === 1 && (
            <button className="btn-back" onClick={handleCancel}>
              <BackIcon />
            </button>
          )} */}

          <HeaderModal onBack={handleBackButton} step={step} isEdit={dataEdit} />
          {renderForm}
        </>
      )}
    </ModalComponent>
  );
};

export default ModalCreateEvent;
