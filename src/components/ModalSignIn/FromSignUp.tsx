import ButtonContained from 'src/components/Buttons/ButtonContained';
import InputField from 'src/components/Inputs';
import SelectField from '../Select';

import { TypeRole } from 'src/store/slices/user/types';
import './styles/form-signUp.scss';

import { Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackIcon } from 'src/assets/icons';
import { countryCode } from 'src/constants/countryCode';
import {
  C1001,
  C1003,
  C1004,
  C1013,
  C1014,
  C1015,
  C1016,
  C1017,
  C1018,
  C1019,
  C1020,
  C1021,
  C1022,
  C1023,
  C1024,
  C1025,
  C1026,
  C1027,
  C1102,
  C1103,
  C1113,
  C1114,
  C1116,
  MSG,
} from 'src/constants/errorCode';
import { DAY_FORMAT } from 'src/constants/formatters';
import { PATHS } from 'src/constants/paths';
import {
  PATTERN_LEAST_ONE_NUMBER,
  PATTERN_LEAST_ONE_SMALL_LETTER,
  PATTERN_LEAST_ONE_UPPER_LETTER,
} from 'src/constants/regex';
import { acceptInputNumber, disableSpace } from 'src/helpers';
import { useCountry } from 'src/hooks/useCounty';
import {
  useLazyCheckEmailExistedQuery,
  useRegisterNormalFanMutation,
  useRegisterNormalOrganizerMutation,
  useSendVerifyCodeMutation,
} from 'src/store/slices/user/api';
import DateField from '../DateField';
import PhoneNumberInput from '../PhoneNumber';
import ReCaptcha from '../ReCaptcha';
import SwitchField from '../Switch';
import { ToastMessage } from '../Toast';
import { LoginSocialOther } from './FormLogin';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import emojiRegex from 'emoji-regex';
import { passwordPlaceholder } from 'src/constants';
import { langMap } from '../Layout';
import Omit from 'lodash/omit';

interface IFromSignUp {
  selectRole: TypeRole;
  onBack: () => void;
  onToLogin: () => void;
  onLoginOtherSocial: () => void;
  onWalletConnect: () => void;
  onNextVerify: (email: string) => void;
}

interface IDataForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
  city: string;
  phoneCode: string;
  phoneNumber: string;
  dob: string;
}

const FromSignUp = ({
  selectRole,
  onBack,
  onToLogin,
  onLoginOtherSocial,
  onWalletConnect,
  onNextVerify,
}: IFromSignUp) => {
  const { rudderAnalytics } = useRudderStack();
  const { i18n } = useTranslation();

  const [form] = Form.useForm();
  const [registerNormalFan, { isLoading: isLoadingFan }] = useRegisterNormalFanMutation();
  const [registerNormalOrganizer, { isLoading: isLoadingOrganizer }] =
    useRegisterNormalOrganizerMutation();
  const [checkEmailExist, { isLoading: isLoadingEmailExist }] = useLazyCheckEmailExistedQuery();
  const [sendEmailFan, { isLoading: isLoadingSendEmailFan }] = useSendVerifyCodeMutation();

  const [formPassword, setFormPassword] = useState(false);
  const [agreeTerm, setAgreeTerm] = useState(false);
  const [policy, setAgreePolicy] = useState(false);

  const [dataForm, setDataForm] = useState<IDataForm | null>(null);
  const [codeCaptcha, setCodeCaptcha] = useState<string | null>(null);

  const { country, getDialCode } = useCountry();
  const { t } = useTranslation();

  const code = Form?.useWatch('phoneCode', form);
  const countryForm = Form?.useWatch('city', form);

  useEffect(() => {
    form.setFieldValue('phoneCode', countryForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryForm]);

  useEffect(() => {
    form.setFieldValue('city', country);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  const handleNextForm = async () => {
    try {
      const values = await form.validateFields([
        'email',
        'firstName',
        'lastName',
        'city',
        'phoneNumber',
        'phoneCode',
        'dob',
      ]);
      const res = await checkEmailExist({ email: values?.email }).unwrap();
      if (res?.data?.isExisted) {
        form.setFields([
          {
            name: 'email',
            errors: [t(MSG[C1013])],
          },
        ]);
        return;
      }
      setDataForm(values);
      setFormPassword(true);
    } catch (error: any) {
      if (error?.errorFields) {
        return;
      }
      console.error(error);
      const validator_errors = error?.data?.validator_errors;
      if (validator_errors) {
        form.setFields([
          {
            name: 'email',
            errors: [t(MSG[validator_errors || C1001])],
          },
        ]);
        return;
      }
      ToastMessage.error(t(MSG[validator_errors || C1001]));
    }
  };

  const handleBackSignUp = () => {
    if (formPassword) {
      form.resetFields(['password', 'confirmPassword']);
      setAgreeTerm(false);
      setCodeCaptcha(null);
      setFormPassword(false);
    } else {
      onBack && onBack();
    }
  };

  const handleSignUp = async (values: any) => {
    try {
      const params = {
        email: dataForm?.email!,
        password: values?.password!,
        firstName: dataForm?.firstName!,
        lastName: dataForm?.lastName!,
        phone: `${getDialCode(dataForm?.phoneCode!)} ${dataForm?.phoneNumber!}`,
        city: dataForm?.city!,
        dateOfBirth: dataForm?.dob!,
        countryCode: dataForm?.phoneCode!,
        token: codeCaptcha,
        language:
          i18n.resolvedLanguage && langMap[i18n.resolvedLanguage]
            ? langMap[i18n.resolvedLanguage]
            : langMap.en,
      };
      if (selectRole === TypeRole.FAN) {
        await registerNormalFan(params).unwrap();
      } else {
        await registerNormalOrganizer(params).unwrap();
      }
      await sendEmailFan({ email: dataForm?.email! }).unwrap();
      ToastMessage.success(t(MSG[C1014]));

      rudderAnalytics?.track(ERudderStackEvents.Signup, {
        eventType: ERudderStackEvents.Signup,
        data: {
          ...Omit(params, ['password', 'token']),
        },
      });

      onNextVerify && onNextVerify(dataForm?.email!);
    } catch (error: any) {
      console.error(error);
    }
  };

  const handCheckTerm = (e: boolean) => {
    setAgreeTerm(e);
  };
  const handleCheckPolicy = (e: boolean) => {
    setAgreePolicy(e);
  };

  const handlePressEnter = (e: any) => {
    const keyCode = e.keyCode;
    if (keyCode === 13) {
      if (formPassword) {
        form.submit();
      } else {
        handleNextForm();
      }
    }
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
    <div className={`sign-up-container ${formPassword ? 'h-[844px]' : ''}`}>
      <button className="btn-back" onClick={handleBackSignUp}>
        <BackIcon />
      </button>
      <div className="form-sign-up">
        <div className="form-sign-up-top">
          <p className="modal-title">{t('signUp.title')}</p>
          <p className="modal-des">
            {!formPassword ? t('signUp.description') : t('signUp.rememberYourPassword')}
          </p>
          <Form
            form={form}
            className="!w-[272px] mx-auto"
            name="control-hooks"
            autoComplete="off"
            onFinish={handleSignUp}
            onKeyDown={handlePressEnter}
            initialValues={{
              email: '',
              password: '',
              firstName: '',
              lastName: '',
              confirmPassword: '',
              // city: country,
              // phoneCode: codePhone || '+82',
              phoneNumber: '',
            }}
          >
            <>
              {!formPassword ? (
                <>
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
                      label={t('signUp.dateOfBirth')}
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
                      label={t('signUp.county')}
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
                      label={t('signUp.phoneNumber')}
                      placeholder="041 234 567"
                      codeValue={code}
                      maxLength={15}
                      onKeyDown={acceptInputNumber}
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
                      { validator: validateEmail },
                      disableSpace(form, 'email'),
                    ]}
                    className="form-input"
                  >
                    <InputField
                      widthFull
                      placeholder={t('signUp.emailPlaceholder')}
                      label={t('signUp.email')}
                      inputType="type2"
                      name="email"
                    />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    key="password"
                    name="password"
                    className="form-input"
                    rules={[
                      { required: true, message: t(MSG[C1021]) },
                      {
                        pattern: PATTERN_LEAST_ONE_SMALL_LETTER,
                        message: t(MSG[C1022]),
                      },
                      {
                        pattern: PATTERN_LEAST_ONE_UPPER_LETTER,
                        message: t(MSG[C1023]),
                      },
                      {
                        pattern: PATTERN_LEAST_ONE_NUMBER,
                        message: t(MSG[C1024]),
                      },
                      {
                        min: 8,
                        message: t(MSG[C1025]),
                      },
                      disableSpace(form, 'password'),
                    ]}
                  >
                    <InputField
                      widthFull
                      placeholder={passwordPlaceholder}
                      label={t('signUp.password')}
                      type="password"
                      inputType="type2"
                    />
                  </Form.Item>

                  <Form.Item
                    key="confirmPassword"
                    name="confirmPassword"
                    dependencies={['password']}
                    className="form-input"
                    rules={[
                      { required: true, message: t(MSG[C1026]) },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error(t(MSG[C1027])));
                        },
                      }),
                      disableSpace(form, 'confirmPassword'),
                    ]}
                  >
                    <InputField
                      widthFull
                      placeholder={passwordPlaceholder}
                      label={t('signUp.confirmPassword')}
                      type="password"
                      inputType="type2"
                    />
                  </Form.Item>

                  <div className="line" />
                  <div className="term mb-4">
                    <SwitchField onChange={handCheckTerm} checked={agreeTerm}>
                      <p className="term-note">
                        {t('signUp.iAccept')}{' '}
                        <a
                          href={`${import.meta.env.VITE_SITE_URI}${PATHS.Term}`}
                          className="text-[#008AD8] underline underline-offset-4 hover:text-primary/80 hover:underline hover:underline-offset-4"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t('signUp.termsAndConditions')}
                        </a>
                      </p>
                    </SwitchField>
                  </div>
                  <div className="term">
                    <SwitchField onChange={handleCheckPolicy} checked={policy}>
                      <p className="term-note">
                        {t('signUp.iAccept')}{' '}
                        <a
                          href={`${import.meta.env.VITE_SITE_URI}${PATHS.Privacy}`}
                          className="text-[#008AD8] underline underline-offset-4 hover:text-primary/80 hover:underline hover:underline-offset-4"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t('signUp.privacyPolicy')}
                        </a>
                      </p>
                    </SwitchField>
                  </div>
                  <div className="line" />
                  <div className="m-w-[100%] flex justify-center">
                    <ReCaptcha
                      onChange={(token: string | null) => {
                        setCodeCaptcha(token);
                      }}
                    />
                  </div>
                </>
              )}
            </>
          </Form>
        </div>
        <div className="form-sign-up-bottom flex flex-col items-center justify-center">
          {formPassword ? (
            <ButtonContained
              fullWidth
              className="btn-sign-up !w-[212px]"
              buttonType="type1"
              disabled={!agreeTerm || !codeCaptcha}
              onClick={() => {
                form.submit();
              }}
              loading={isLoadingFan || isLoadingOrganizer || isLoadingSendEmailFan}
            >
              {t('signUp.signUp')}
            </ButtonContained>
          ) : (
            <>
              <ButtonContained
                fullWidth
                className={`!w-[212px] ${selectRole === TypeRole.FAN ? 'mt-[40px]' : 'mt-[90px]'}`}
                buttonType="type1"
                onClick={handleNextForm}
                loading={isLoadingEmailExist}
              >
                {t('signUp.continue')}
              </ButtonContained>
              {selectRole === TypeRole.FAN && (
                <LoginSocialOther
                  onLoginOtherSocial={onLoginOtherSocial}
                  onWalletConnect={onWalletConnect}
                />
              )}
              <p className="has-account">
                {t('signUp.alreadyHaveAcc')}
                <p className="now ml-2" onClick={onToLogin}>
                  {t('signUp.loginNow')}
                </p>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FromSignUp;
