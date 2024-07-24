import { Divider, Form, Grid } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BackMobileIcon from 'src/assets/icons/common/arrow-left.svg?react';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import DateField from 'src/components/DateField';
import InputField from 'src/components/Inputs';
import ModalComponent from 'src/components/Modals';
import PhoneNumberInput from 'src/components/PhoneNumber';
import SelectField from 'src/components/Select';
import { ToastMessage } from 'src/components/Toast';
import { countryCode } from 'src/constants/countryCode';
import {
  C1001,
  C1003,
  C1004,
  C1011,
  C1015,
  C1016,
  C1017,
  C1018,
  C1019,
  C1020,
  C1080,
  C1102,
  C1103,
  C1113,
  C1114,
  C1116,
  MSG,
} from 'src/constants/errorCode';
import { DAY_FORMAT } from 'src/constants/formatters';
import { acceptInputNumber, disableSpace } from 'src/helpers';
import { useCountry } from 'src/hooks/useCounty';
import {
  useSendCodeUpdateEmailMutation,
  useUpdateUserInfoMutation,
} from 'src/store/slices/profile/api';
import { useLazyCheckEmailExistedQuery } from 'src/store/slices/user/api';
import { UserInfo } from 'src/store/slices/user/types';
import './styles.scss';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import emojiRegex from 'emoji-regex';

const { useBreakpoint } = Grid;

interface IUpdatePersonalDetail {
  isOpen: boolean;
  onUpdateSuccess: (email?: string) => void;
  onClose?: () => void;
  userInfo: UserInfo | null;
}

const UpdatePersonalDetails = ({
  isOpen,
  onUpdateSuccess,
  onClose,
  userInfo,
}: IUpdatePersonalDetail) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [updateEmailForm] = Form.useForm();
  const breakpoint = useBreakpoint();
  const code = Form?.useWatch('phoneCode', form);
  const { rudderAnalytics } = useRudderStack();

  const emailChange = Form?.useWatch('email', updateEmailForm);

  const { getDialCode } = useCountry();

  const [upDateProfile, { isLoading }] = useUpdateUserInfoMutation();
  const [checkEmailExist] = useLazyCheckEmailExistedQuery();
  const [sendCodeUpdateEmail] = useSendCodeUpdateEmailMutation();

  const isChangeEmail = useMemo(() => {
    return emailChange?.trim() === userInfo?.email?.trim();
  }, [emailChange, userInfo?.email]);

  const phoneNumber = useMemo(() => {
    return userInfo?.phone?.split(' ');
  }, [userInfo?.phone]);

  useEffect(() => {
    // Update form initial values when userInfo changes
    form.setFieldsValue({
      firstName: userInfo?.firstName || '',
      lastName: userInfo?.lastName || '',
      city: userInfo?.city || undefined,
      phoneNumber: phoneNumber?.[1] || '',
      phoneCode: userInfo?.countryCode || '',
      dob: userInfo?.dateOfBirth ? dayjs(userInfo?.dateOfBirth) : undefined,
    });

    // Update updateEmailForm initial values when userInfo changes
    updateEmailForm.setFieldsValue({
      email: userInfo?.email || '',
    });
  }, [userInfo, phoneNumber, isOpen]);

  const handleClose = () => {
    form.resetFields();
    updateEmailForm.resetFields();
    onClose?.();
  };

  const handleUpdatePersonalDetails = async (values: any) => {
    try {
      const params = {
        firstName: values?.firstName!,
        lastName: values?.lastName!,
        phone: `${getDialCode(values?.phoneCode!)} ${values?.phoneNumber!}`,
        city: values?.city!,
        dateOfBirth: values?.dob || null,
        countryCode: values?.phoneCode!,
      };
      await upDateProfile(params).unwrap();
      handleClose();
      onUpdateSuccess();
      rudderAnalytics?.track(ERudderStackEvents.ProfileUpdated, {
        eventType: ERudderStackEvents.ProfileUpdated,
        data: params,
      });
      rudderAnalytics?.identify(userInfo?.id, {
        email: userInfo?.email,
        country: values?.phoneCode!,
        kycStatus: userInfo?.kycStatus,
        loginMethod: userInfo?.loginMethod,
        firstName: values?.firstName,
        lastName: values?.lastName,
      });
    } catch (error: any) {
      const validator_errors = error?.data?.validator_errors;
      ToastMessage.error(t(MSG[validator_errors || C1001]));
    }
  };

  const handleUpdateEmail = async (values: { email: string }) => {
    try {
      const res = await checkEmailExist({ email: values?.email }).unwrap();
      if (res?.data?.isExisted) {
        updateEmailForm.setFields([
          {
            name: 'email',
            errors: [t(MSG[C1011])],
          },
        ]);
        return;
      }
      await sendCodeUpdateEmail({ email: values?.email }).unwrap();
      onUpdateSuccess(values?.email);
      rudderAnalytics?.track(ERudderStackEvents.UserEmailUpdated, {
        eventType: ERudderStackEvents.UserEmailUpdated,
        data: {
          email: values?.email,
        },
      });
      rudderAnalytics?.identify(userInfo?.id, {
        email: values?.email,
        country: userInfo?.countryCode,
        kycStatus: userInfo?.kycStatus,
        loginMethod: userInfo?.loginMethod,
        firstName: userInfo?.firstName,
        lastName: userInfo?.lastName,
      });
      updateEmailForm.resetFields();
    } catch (err: any) {
      const validator_errors = err?.data?.validator_errors;
      if (validator_errors) {
        updateEmailForm.setFields([
          {
            name: 'email',
            errors: [t(MSG[validator_errors || C1001])],
          },
        ]);
        return;
      }
    }
  };

  const handleChangeCountry = (val: any) => {
    form.setFields([
      {
        name: 'phoneCode',
        value: val,
      },
    ]);
  };

  //validate first name
  const validateFirstName = (_: any, value: any) => {
    const regex = emojiRegex();

    if (!value.trim()) {
      return Promise.reject(new Error(t(MSG[C1015])));
    }
    if (value.length < 2 || value.length > 50) {
      return Promise.reject(new Error(t(MSG[C1016])));
    }
    for (const match of value.matchAll(regex)) {
      const emoji = match[0];
      if (emoji) {
        return Promise.reject(new Error(t(MSG[C1113])));
      }
    }
    return Promise.resolve();
  };

  const validateLastName = (_: any, value: any) => {
    const regex = emojiRegex();

    if (!value.trim()) {
      return Promise.reject(new Error(t(MSG[C1102])));
    }
    if (value.length < 2 || value.length > 50) {
      return Promise.reject(new Error(t(MSG[C1103])));
    }

    for (const match of value.matchAll(regex)) {
      const emoji = match[0];
      if (emoji) {
        return Promise.reject(new Error(t(MSG[C1114])));
      }
    }
    return Promise.resolve();
  };

  const validateEmail = (_: any, value: any) => {
    const regex = emojiRegex();
    for (const match of value.matchAll(regex)) {
      const emoji = match[0];
      if (emoji) {
        return Promise.reject(new Error(t(MSG[C1116])));
      }
    }
    return Promise.resolve();
  };

  return (
    <ModalComponent open={isOpen} centered onCancel={handleClose}>
      {!breakpoint?.md && (
        <BackMobileIcon className="absolute top-6 left-5 z-10" onClick={handleClose} />
      )}
      <div className="flex">
        {/* <BackIcon className='mt-10'/> */}
        <div className="update-container w-full">
          <p className="update-container-title text-[#121313]">
            {t('profile.updateMyPersonalDetails')}
          </p>
          <p className="update-container-des mb-14 text-[#121313]">
            {t('profile.reviewAndMakeSure')}
          </p>

          <Form
            form={form}
            autoComplete="off"
            name="update-infor"
            onFinish={handleUpdatePersonalDetails}
            initialValues={{
              firstName: userInfo?.firstName || '',
              lastName: userInfo?.lastName || '',
              city: userInfo?.city || undefined,
              // phoneNumber: phoneNumber?.[1] || '',
              // phoneCode: phoneNumber?.[0] || '+82',
              dob: userInfo?.dateOfBirth ? dayjs(userInfo?.dateOfBirth) : undefined,
            }}
          >
            <Form.Item
              key="firstName"
              name="firstName"
              rules={[{ validator: validateFirstName }]}
              className="form-input"
            >
              <InputField
                inputType="type2"
                widthFull
                placeholder={t('signUp.firstNamePlaceholder')}
                label={t('signUp.firstName')}
                maxLength={70}
              />
            </Form.Item>
            <Form.Item
              key="lastName"
              name="lastName"
              rules={[{ validator: validateLastName }]}
              className="form-input"
            >
              <InputField
                inputType="type2"
                widthFull
                placeholder={t('signUp.lastNamePlaceHolder')}
                label={t('signUp.lastName')}
                maxLength={70}
              />
            </Form.Item>
            <Form.Item
              key="dob"
              name="dob"
              rules={[
                {
                  type: 'object' as const,
                  required: true,
                  message: t(MSG[C1017]),
                },
              ]}
              className="form-input"
            >
              <DateField
                widthFull
                label={t('profile.dateOfBirth')}
                format={DAY_FORMAT}
                placeholder="dd/mm/yyyy"
                disabledDate={(current: any) => current > dayjs().subtract(1, 'day')}
              />
            </Form.Item>
            <Form.Item
              key="city"
              name="city"
              rules={[{ required: true, message: t(MSG[C1018]) }]}
              className="form-input"
            >
              <SelectField
                showSearch
                widthFull
                label={t('profile.country')}
                placeholder={t('profile.countryPlaceholder')}
                filterOption={(input: string, option: any) =>
                  option?.label?.toLocaleLowerCase()?.includes(input?.toLocaleLowerCase())
                }
                options={countryCode?.map((item) => ({
                  value: item?.code,
                  label: item?.name,
                }))}
                onChange={handleChangeCountry}
              />
            </Form.Item>
            <Form.Item
              key="phoneNumber"
              name="phoneNumber"
              rules={[
                { required: true, message: t(MSG[C1019]) },
                { min: 4, message: t(MSG[C1020]) },
                { max: 15, message: t(MSG[C1020]) },
              ]}
              className="form-input"
            >
              <PhoneNumberInput
                label={t('profile.phoneNumber')}
                placeholder="041 234 567"
                codeValue={code}
                maxLength={15}
                onKeyDown={acceptInputNumber}
              />
            </Form.Item>
          </Form>
          <ButtonContained
            buttonType="type2"
            className="w-[272px] md:w-[212px] mt-6"
            loading={isLoading}
            onClick={() => {
              form.submit();
            }}
          >
            {t('profile.savePersonalDetails')}
          </ButtonContained>
          <Divider className="divider w-[16.5rem]" />
          <Form
            form={updateEmailForm}
            autoComplete="off"
            name="update-email"
            onFinish={handleUpdateEmail}
            initialValues={{ email: userInfo?.email }}
            className="max-w-[275px] w-full"
          >
            <Form.Item
              key="email"
              name="email"
              rules={[
                { required: true, message: t(MSG[C1004]) },
                {
                  type: 'email',
                  message: t(MSG[C1003]),
                },
                () => ({
                  validator(_, value) {
                    if (userInfo?.email?.trim() === value.trim()) {
                      return Promise.reject(new Error(t(MSG[C1080])));
                    }
                    return Promise.resolve();
                  },
                }),
                {
                  validator: validateEmail,
                },
                disableSpace(form, 'email'),
              ]}
              className="email-input-container"
            >
              <InputField
                placeholder={t('profile.emailPlaceholder')}
                label={t('profile.email')}
                inputType="type2"
                name="email"
              />
            </Form.Item>
          </Form>
          <ButtonContained
            buttonType="type1"
            className="w-[272px] md:w-[212px] mt-6"
            onClick={() => updateEmailForm.submit()}
            disabled={isChangeEmail}
          >
            {t('profile.updateEmailAddress')}
          </ButtonContained>
        </div>
      </div>
    </ModalComponent>
  );
};

export default UpdatePersonalDetails;
