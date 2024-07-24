import { Form } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import ModalComponent from 'src/components/Modals';
import { ToastMessage } from 'src/components/Toast';
import { WIDTH_FORM_MODAL } from 'src/constants';
import {
  useCreateCampaignMutation,
  useGetEventCampaignQuery,
  useUpdateCampaignMutation,
} from 'src/store/slices/campaign/api';
import { ECampaignStatus } from 'src/store/slices/campaign/types';
import CreateCampaignStep1 from './CreateCampaignStep1';
import CreateCampaignStep2 from './CreateCampaignStep2';
import CreateCampaignStep3 from './CreateCampaignStep3';
import CreateSuccess from './CreateSuccess';
import HeaderModal from './HeaderModal';
import { useTranslation } from 'react-i18next';
import { MSG } from 'src/constants/errorCode';
import './styles/styles.scss';
interface IModalCreateCampaign {
  open: boolean;
  onCancel: () => void;
  dataEdit?: any;
  refetchListCampaign: () => void;
  currentStep?: number;
  onStepChange?: (step: number) => void;
}
const CreateCampaignModal: React.FC<IModalCreateCampaign> = (props) => {
  const { open, onCancel, dataEdit, refetchListCampaign, currentStep, onStepChange } = props;
  const { t } = useTranslation('campaigns');
  const [step, setStep] = useState(currentStep || 1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createCampaign] = useCreateCampaignMutation();
  const [updateCampaign] = useUpdateCampaignMutation();
  const { data: dataEventCampaign } = useGetEventCampaignQuery({ buyStatus: 'upcoming' });
  const [dataForm, setDataForm] = useState<any>(dataEdit);
  const [form] = Form.useForm();

  const handleStepChange = (value: number) => {
    onStepChange?.(value);
    setStep(value);
  };

  const handleCancel = () => {
    form.resetFields();
    setDataForm(null);
    setIsSuccess(false);
    handleStepChange(1);
    onCancel && onCancel();
  };

  const handelNextForm1 = (values: any) => {
    try {
      handleStepChange(2);
      setDataForm({ ...dataForm, ...values });
    } catch (err: any) {
      console.error(err);
    }
  };

  const handelNextForm2 = (values: any) => {
    try {
      handleStepChange(3);
      setDataForm({ ...dataForm, ...values });
    } catch (err: any) {
      console.error(err);
    }
  };

  const buildParam = (values: any, dataForm: any) => {
    const param = {
      ...dataForm,
      ...values,
    };

    if (values.usersEligibleCount) {
      param.reward = {
        usersEligibleCount: values?.usersEligibleCount,
        rarity: values?.rarity,
        type: values.type,
        item: values.discountAmount ? String(values?.discountAmount) : String(values?.redeemable),
      };
    }
    param.eventIds = (param.eventIds || [])?.map((x: any) => Number(x?.value) || Number(x));
    return param;
  };

  const handleSuccess = (
    values: any,
    handleCancel: () => void,
    setIsSuccess: (isSuccess: boolean) => void,
  ) => {
    refetchListCampaign();
    if (values.status === ECampaignStatus.DRAFT) {
      ToastMessage.success('Save draft success');
      handleCancel();
    } else {
      setIsSuccess(true);
    }
  };

  const handelCreateCampaign = async (values: any) => {
    try {
      const param = buildParam(values, dataForm);

      if (dataEdit) {
        await updateCampaign(param).unwrap();
      } else {
        await createCampaign(param).unwrap();
      }

      handleSuccess(values, handleCancel, setIsSuccess);
    } catch (error: any) {
      const validator_errors = error?.data?.validator_errors;
      if (validator_errors) {
        ToastMessage.error(t(MSG[validator_errors]));
      } else ToastMessage.error(t('Create campaign fail'));
    }
  };

  const switchForm = (type: number) => {
    switch (type) {
      case 1:
        return (
          <CreateCampaignStep1
            form={form}
            dataEdit={dataForm}
            onSubmit={handelCreateCampaign}
            nextStep={handelNextForm1}
            listEvent={dataEventCampaign?.data}
          />
        );
      case 2:
        return (
          <CreateCampaignStep2
            form={form}
            onSubmit={handelCreateCampaign}
            addReward={handelNextForm2}
            dataEdit={dataForm}
            listEvent={dataEventCampaign?.data}
          />
        );
      case 3:
        return (
          <CreateCampaignStep3 form={form} onSubmit={handelCreateCampaign} dataEdit={dataForm} />
        );
      default:
    }
  };

  const handleBackButton = () => {
    if (step === 1) {
      handleCancel();
    } else {
      handleStepChange(step - 1);
    }
  };

  const renderForm = useMemo(() => {
    return switchForm(step);
  }, [step, dataForm, dataEventCampaign]);

  useEffect(() => {
    setStep(currentStep || 1);
  }, [open]);

  useEffect(() => {
    if (open) {
      setDataForm(dataEdit);
    }
  }, [dataEdit, open]);

  return (
    <div>
      <ModalComponent
        open={open}
        width={WIDTH_FORM_MODAL}
        centered
        className={`modal-create-event ${isSuccess ? '!h-[658px]' : ''}`}
        onCancel={handleCancel}
        destroyOnClose
        isCloseMobile={isSuccess ? false : true}
      >
        {isSuccess ? (
          <CreateSuccess onCancel={handleCancel} />
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
    </div>
  );
};

export default CreateCampaignModal;
