import { Divider, Form } from 'antd';
import { BackIcon } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import ModalComponent from 'src/components/Modals';
import InputField from 'src/components/Inputs';
import Icon from '@ant-design/icons/lib/components/Icon';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VerificationIcon } from 'src/assets/icons/IconComponent';
import InputPickLocation from 'src/components/InputPickLocation';
import SelectField from 'src/components/Select';
import { ToastMessage } from 'src/components/Toast';
import { WIDTH_FORM_MODAL, WIDTH_FORM_MODAL_2 } from 'src/constants';
import { countryCode } from 'src/constants/countryCode';
import {
  C1069,
  C1070,
  C1071,
  C1072,
  C1073,
  C1085,
  C1094,
  C1095,
  C1096,
  C1099,
  C1101,
  MSG,
} from 'src/constants/errorCode';
import { acceptInputNumber } from 'src/helpers';
import { useCountry } from 'src/hooks/useCounty';
import { useSaveBankMutation, useUpdateBankMutation } from 'src/store/slices/profile/api';
import { BankResponse } from 'src/store/slices/profile/types';
import './styles.scss';

interface IUpdateBankDetails {
  bankDetail: BankResponse;
  onSaveDetails: (data: any) => void;
  isAddNew?: boolean;
}

const BankDetailsInformation = ({
  bankDetail,
  onUpdateBankDetails,
}: {
  bankDetail: BankResponse;
  onUpdateBankDetails: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <p className="text-center text-[24px] font-loos">{t('team.bankDetails')}</p>
      <p className="text-[14px] text-center mb-10 max-w-[538px] px-5">
        {t('team.yourBankDetailsAre')}{' '}
      </p>
      <div className="shadow-box max-w-[342px] bg-gray2 rounded-[6px] p-[16px] m-auto md:mb-[40px]">
        <div className="w-full m-auto">
          <div className="mb-5">
            <p className="text-[12px] text-blueDarker font-[500] mb-[3px]">
              {t('team.bankAccountBSB')}
            </p>
            <p className="w-full text-blueDarker font-[500] text-[16px]">{bankDetail?.swiftCode}</p>
          </div>
          <Divider className="!my-[16px] bg-[#8F90A6]" />

          <div className="mb-5">
            <p className="text-[12px] text-blueDarker font-[500] mb-[3px]">
              {t('team.bankAccountNumber')}
            </p>
            <p className="w-full text-blueDarker font-[500] text-[16px]">
              {bankDetail?.accountNumber}
            </p>
          </div>
          <Divider className="!my-[16px] bg-[#8F90A6]" />

          <div className="text-white mb-[30px]">
            <p className="text-[12px] text-blueDarker font-[500] mb-[3px]">
              {t('team.bankAccountName')}
            </p>
            <p className="w-full text-blueDarker font-[500] text-[16px]">
              {bankDetail?.accountName}
            </p>
          </div>

          <Divider className="!my-[16px] bg-[#8F90A6]" />

          <div className="text-white mb-[30px]">
            <p className="text-[12px] text-blueDarker font-[500] mb-[3px]">
              {t('team.businessName')}
            </p>
            <p className="w-full text-blueDarker font-[500] text-[16px]">
              {bankDetail?.businessName}
            </p>
          </div>

          <Divider className="!my-[16px] bg-[#8F90A6]" />

          <div className="text-white mb-[30px]">
            <p className="text-[12px] text-blueDarker font-[500] mb-[3px]">
              {t('team.countryOrRegion')}
            </p>
            <p className="w-full text-blueDarker font-[500] text-[16px]">{bankDetail?.country}</p>
          </div>

          <Divider className="!my-[16px] bg-[#8F90A6]" />

          <div className="text-white mb-[30px]">
            <p className="text-[12px] text-blueDarker font-[500] mb-[3px]">{t('team.address')}</p>
            <p className="w-full text-blueDarker font-[500] text-[16px]">{bankDetail?.address}</p>
          </div>

          <Divider className="!my-[16px] bg-[#8F90A6]" />

          <div className="text-white mb-[30px]">
            <p className="text-[12px] text-blueDarker font-[500] mb-[3px]">{t('team.postCode')}</p>
            <p className="w-full text-blueDarker font-[500] text-[16px]">{bankDetail?.postCode}</p>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <ButtonContained
            buttonType="type2"
            className="mt-5 !w-[100%] md:!w-[212px] md:mt-5 max-w-[212px]"
            fullWidth
            onClick={onUpdateBankDetails}
          >
            {t('team.updateBankDetails')}
          </ButtonContained>
        </div>
      </div>
    </>
  );
};

const UpdateBankDetails = (props: IUpdateBankDetails) => {
  const { onSaveDetails, bankDetail, isAddNew } = props;
  const [form] = useForm();
  const { t } = useTranslation();

  const { country } = useCountry();

  const address = Form?.useWatch('address', form);

  useEffect(() => {
    form.setFieldValue('country', country);
  }, [country]);

  const handleFinish = (val: any) => {
    if (!form.getFieldValue('address')) {
      form.setFields([{ name: 'address', errors: [t(MSG[C1099])] }]);
      return;
    }
    onSaveDetails(val);
  };

  return (
    <>
      <p className="text-center text-[24px] font-loos">
        {t(isAddNew ? 'team.addMyBankDetails' : 'team.updateMyBankDetails')}
      </p>
      <p className="text-[14px] text-center mb-10 max-w-[538px] px-5">
        {t(isAddNew ? 'team.ensureYourEnterCorrectBank' : 'team.reviewAndMakeSureYourBank')}
      </p>
      <Form
        form={form}
        name="control-hooks"
        autoComplete="off"
        onFinish={handleFinish}
        initialValues={{
          accountName: bankDetail?.accountName || '',
          accountNumber: bankDetail?.accountNumber || '',
          swiftCode: bankDetail?.swiftCode || '',
          businessName: bankDetail?.businessName || '',
          country: bankDetail?.country || '',
          address: bankDetail?.address || '',
          postCode: bankDetail?.postCode || '',
        }}
      >
        <Form.Item
          key="swiftCode"
          name="swiftCode"
          className="form-input  m-auto my-5"
          rules={[
            { required: true, message: t(MSG[C1071]) },
            { min: 8, message: t(MSG[C1072]) },
          ]}
        >
          <InputField
            inputType="type2"
            widthFull
            placeholder={t('team.bankAccountBSBPlaceholder')}
            label={t('team.bankAccountBSB')}
            maxLength={11}
            // type="number"
            // onKeyDown={acceptInputNumber}
            info={t('team.infoBSB')}
          />
        </Form.Item>

        <Form.Item
          key="accountNumber"
          name="accountNumber"
          className="form-input  m-auto my-5"
          rules={[{ required: true, message: t(MSG[C1073]) }]}
        >
          <InputField
            inputType="type2"
            widthFull
            placeholder={t('team.bankAccountNumberPlaceholder')}
            label={t('team.bankAccountNumber')}
            maxLength={34}
            // type="number"
            // onKeyDown={acceptInputNumber}
          />
        </Form.Item>

        <Form.Item
          key="accountName"
          name="accountName"
          className="form-input  m-auto my-5"
          rules={[
            { required: true, message: t(MSG[C1069]) },
            { min: 2, message: t(MSG[C1070]) },
          ]}
        >
          <InputField
            inputType="type2"
            widthFull
            placeholder={t('team.bankAccountPlaceholder')}
            label={t('team.bankAccountName')}
            maxLength={50}
          />
        </Form.Item>

        <div className="w-full h-[1px] bg-gray4/50 my-[40px]" />

        <Form.Item
          key="businessName"
          name="businessName"
          rules={[
            { required: true, message: t(MSG[C1095]) },
            { min: 2, message: t(MSG[C1094]) },
          ]}
          className="form-input"
        >
          <InputField
            inputType="type2"
            widthFull
            placeholder={t('team.businessNamePlaceholder')}
            label={t('team.businessName')}
            maxLength={50}
          />
        </Form.Item>

        <Form.Item key="country" name="country" className="form-input">
          <SelectField
            showSearch
            widthFull
            label={t('team.countryOrRegion')}
            filterOption={(input: string, option: any) =>
              option?.label?.toLocaleLowerCase()?.includes(input?.toLocaleLowerCase())
            }
            options={countryCode?.map((item) => ({
              value: item?.code,
              label: item?.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          key="address"
          name="address"
          rules={[
            () => ({
              validator(_, value) {
                if (!value) {
                  return Promise.reject(new Error(t(MSG[C1096])));
                }
                return Promise.resolve();
              },
            }),
          ]}
          className="form-input"
        >
          <InputPickLocation
            defaultValue={
              form.getFieldValue('address')
                ? form.getFieldValue('address')
                : bankDetail?.address || ''
            }
            onSelectLocation={(e: string) => {
              form.setFieldValue('address', e);
              form.validateFields(['address']);
            }}
            locationSelected={address}
            inputType="type2"
            widthFull
            placeholder={t('team.addressPlaceholder')}
            label={t('team.address')}
            latitude=""
            longitude=""
            allowToManualInput={true}
          />
        </Form.Item>

        <Form.Item
          key="postCode"
          name="postCode"
          className="form-input  m-auto my-5"
          rules={[{ required: true, message: t(MSG[C1101]) }]}
        >
          <InputField
            inputType="type2"
            widthFull
            placeholder={t('team.postCodePlaceholder')}
            label={t('team.postCode')}
            type="number"
            onKeyDown={acceptInputNumber}
          />
        </Form.Item>

        <div className="w-full flex justify-center">
          <ButtonContained
            buttonType="type1"
            className="mt-10 !w-[100%] md:!w-full md:mt-10 md:mb-[40px]  max-w-[212px]"
            fullWidth
            onClick={() => form.submit()}
          >
            {t('team.saveDetails')}
          </ButtonContained>
        </div>
      </Form>
    </>
  );
};

const UpdateSuccess = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();

  return (
    <>
      <p className="text-center text-[24px] font-loos">{t('team.bankDetailsUpdated')}</p>
      <p className="text-[14px] text-center mb-10 w-full px-5 max-w-[538px]">
        {t('team.yourNewBankDetail')}
      </p>
      <div className="pb-20 text-center">
        <Icon component={VerificationIcon} className="icon-verification" />
      </div>
      <div className="w-full flex justify-center mt-auto md:mt-0 md:mb-[40px]">
        <ButtonContained buttonType="type2" className="!w-[272px] md:!w-full" onClick={onClose}>
          {t('team.buttonClose')}
        </ButtonContained>
      </div>
    </>
  );
};

const BankDetails = ({
  isOpen,
  bankDetail,
  teamId,
  defaultStep,
  onclose,
}: {
  isOpen: boolean;
  bankDetail: any;
  teamId?: number;
  defaultStep: number;
  onclose: () => void;
}) => {
  const { t } = useTranslation();
  const [step, setSteps] = useState(defaultStep || 0);
  useEffect(() => {
    setSteps(defaultStep);
  }, [defaultStep]);

  const [saveBank] = useSaveBankMutation();
  const [updateBank] = useUpdateBankMutation();

  const handleSaveDetails = async (data: any) => {
    try {
      if (!teamId) {
        return ToastMessage.error(t(MSG[C1085]));
      }
      if (bankDetail) {
        await updateBank({ teamId: teamId, id: bankDetail?.id, ...data }).unwrap();
      } else {
        await saveBank({ teamId: teamId, ...data }).unwrap();
      }
      setSteps(2);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBack = () => {
    setSteps(0);
  };

  const handleCloseModal = () => {
    onclose();
    setSteps(bankDetail ? 0 : 1);
  };

  const renderContent = useMemo(() => {
    switch (step) {
      case 0:
        return (
          <BankDetailsInformation onUpdateBankDetails={() => setSteps(1)} bankDetail={bankDetail} />
        );
      case 1:
        return (
          <UpdateBankDetails
            isAddNew={defaultStep === 1}
            onSaveDetails={handleSaveDetails}
            bankDetail={bankDetail}
          />
        );
      case 2:
        return <UpdateSuccess onClose={handleCloseModal} />;
      default:
        return;
    }
  }, [step, bankDetail, teamId]);

  return (
    <ModalComponent
      className="top-0 md:top-auto pb-0"
      width={step === 2 ? WIDTH_FORM_MODAL_2 : WIDTH_FORM_MODAL}
      open={isOpen}
      onCancel={handleCloseModal}
      destroyOnClose
    >
      <div className="forgot-container">
        {step === 1 && bankDetail && (
          <button
            className="btn-back"
            onClick={() => (!bankDetail ? handleCloseModal() : handleBack())}
          >
            <BackIcon />
          </button>
        )}
        <div
          className={
            step === 2
              ? 'flex flex-col items-center justify-start md:justify-center h-[calc(100vh-140px)] md:h-auto'
              : ''
          }
        >
          {renderContent}
        </div>
      </div>
    </ModalComponent>
  );
};

export default BankDetails;
