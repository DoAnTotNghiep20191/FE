import { Form } from 'antd';
import emojiRegex from 'emoji-regex';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BackIcon } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputTextArea from 'src/components/InputTextArea';
import InputField from 'src/components/Inputs';
import ModalComponent from 'src/components/Modals';
import { ToastMessage } from 'src/components/Toast';
import {
  C1001,
  C1003,
  C1004,
  C1015,
  C1016,
  C1102,
  C1103,
  C1106,
  C1109,
  C1113,
  C1114,
  C1115,
  C1116,
  MSG,
} from 'src/constants/errorCode';
import { disableSpace } from 'src/helpers';
import { useRegisterOrganizerMutation } from 'src/store/slices/profile/api';
import { RegisterOrganizerPayload, UserInfo } from 'src/store/slices/user/types';
import './styles.scss';

interface IOrganizerRegister {
  isOpen: boolean;
  onUpdateSuccess: (email?: string) => void;
  onClose?: () => void;
  userInfo: UserInfo | null;
}

const OrganizerRegister: React.FC<IOrganizerRegister> = (props) => {
  const { isOpen, onUpdateSuccess, onClose, userInfo } = props;
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [registerOrganizer, { isLoading }] = useRegisterOrganizerMutation();

  const handleClose = () => {
    form.resetFields();
    onClose?.();
  };

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

  useEffect(() => {
    form.setFieldsValue({
      firstName: userInfo?.firstName || '',
      lastName: userInfo?.lastName || '',
      email: userInfo?.email || undefined,
    });
  }, [userInfo, isOpen]);

  const handleSubmitOrganizerForm = async (values: any) => {
    try {
      const params: RegisterOrganizerPayload = {
        userId: userInfo?.id,
        firstName: values?.firstName!,
        lastName: values?.lastName!,
        email: values.email,
        message: values.message,
        subject: values.subject,
      };
      await registerOrganizer(params).unwrap();
      handleClose();
      onUpdateSuccess();
    } catch (error: any) {
      const validator_errors = error?.data?.validator_errors;
      ToastMessage.error(t(MSG[validator_errors || C1001]));
    }
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
    <ModalComponent open={isOpen} centered onCancel={handleClose} className="organizer-container">
      <button onClick={handleClose} className="btn-back">
        <BackIcon />
      </button>
      <div className="flex">
        <div className="update-container w-full">
          <p className="update-container-title text-[#121313]">{t('profile.becomeAnOrganizer')}</p>
          <p className="update-container-des mb-[24px] text-[#121313]">
            {t('profile.becomeAnOrganizerDes')}
          </p>

          <Form
            form={form}
            autoComplete="off"
            name="update-infor"
            onFinish={handleSubmitOrganizerForm}
            initialValues={{
              firstName: '',
              lastName: '',
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
                disabled={!!userInfo?.firstName}
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
                disabled={!!userInfo?.lastName}
              />
            </Form.Item>
            <Form.Item
              key="email"
              name="email"
              rules={[
                { required: true, message: t(MSG[C1004]) },
                {
                  type: 'email',
                  message: t(MSG[C1003]),
                },
                {
                  validator: validateEmail,
                },
                disableSpace(form, 'email'),
              ]}
              className="input-container"
            >
              <InputField
                placeholder={t('profile.emailPlaceholder')}
                label={t('profile.email')}
                inputType="type2"
                name="email"
                disabled={!!userInfo?.email}
              />
            </Form.Item>
            <Form.Item
              key="subject"
              name="subject"
              className="form-input"
              rules={[
                { required: true, message: t(MSG[C1106]) },
                { min: 2, message: t(MSG[C1115]) },
                { max: 255, message: t(MSG[C1115]) },
              ]}
            >
              <InputField
                inputType="type2"
                widthFull
                placeholder="Eg. Event creation"
                label={t('signUp.subject')}
                // maxLength={70}
              />
            </Form.Item>
            <Form.Item
              key="message"
              name="message"
              className="w-full description-input"
              rules={[{ max: 1200, message: t(MSG[C1109]) }]}
            >
              <InputTextArea
                label={t('signUp.message')}
                placeholder={t('signUp.messagePlaceholder')}
                showCount
                widthFull
                rows={5}
                maxLength={1200}
              />
            </Form.Item>
          </Form>

          <ButtonContained
            buttonType="type1"
            className="w-[272px] md:w-[212px] mt-6"
            onClick={() => form.submit()}
            // disabled={isChangeEmail}
          >
            {t('signUp.submit')}
          </ButtonContained>
        </div>
      </div>
    </ModalComponent>
  );
};

export default OrganizerRegister;
