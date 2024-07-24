import Icon from '@ant-design/icons';
import { Form } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackIcon } from 'src/assets/icons';
import { VerificationIcon } from 'src/assets/icons/IconComponent';
import {
  C1001,
  C1003,
  C1004,
  C1021,
  C1022,
  C1023,
  C1024,
  C1025,
  C1027,
  C1079,
  C1086,
  MSG,
} from 'src/constants/errorCode';
import {
  PATTERN_LEAST_ONE_NUMBER,
  PATTERN_LEAST_ONE_SMALL_LETTER,
  PATTERN_LEAST_ONE_UPPER_LETTER,
} from 'src/constants/regex';
import { disableSpace } from 'src/helpers';
import {
  useForgotPasswordMutation,
  useLazyCheckEmailParallelExistQuery,
  useResetPasswordMutation,
  useVerifyForgotPasswordMutation,
} from 'src/store/slices/user/api';
import { TypeRole } from 'src/store/slices/user/types';
import ButtonContained from '../Buttons/ButtonContained';
import InputField from '../Inputs';
import { ToastMessage } from '../Toast';
import Verification from '../Verification';
import CountdownTimer from './CountdownTimer';
import './styles/form-forgot.scss';
import { passwordPlaceholder } from 'src/constants';

const EmailForm = ({
  onSendEmail,
  isLoading,
  form,
  step,
}: {
  onSendEmail: (values: { email: string; role?: TypeRole }) => void;
  isLoading: boolean;
  form?: any;
  step?: number;
}) => {
  const { t } = useTranslation();
  const [isSameEmail, setIsSameEmail] = useState(true);
  const [checkEmail] = useLazyCheckEmailParallelExistQuery();
  const [currentEmail, setCurrentEmail] = useState('');

  const handleSubmit = async (values: { email: string }) => {
    try {
      const response = await checkEmail({
        email: values.email,
      }).unwrap();
      if (response.data.isParallelExist) {
        setIsSameEmail(true);
        setCurrentEmail(values.email);
      } else {
        onSendEmail({ email: values.email });
      }
    } catch (error) {
      console.error(error);
      onSendEmail({ email: values.email });
    }
  };

  const handleSelectRoleSubmit = (role: TypeRole) => {
    onSendEmail({ email: currentEmail, role });
  };

  useEffect(() => {
    if (isSameEmail) {
      setIsSameEmail(false);
    }
  }, [step]);

  return (
    <>
      {!isSameEmail ? (
        <>
          <p className="modal-title">{t('forgot.forgotPassword')}</p>
          <p className="modal-des">{t('forgot.enterYourEmail')}</p>
          <Form
            form={form}
            name="form-forgot"
            autoComplete="off"
            onFinish={handleSubmit}
            className="form-email flex flex-col justify-center items-center"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: t(MSG[C1004]) },
                {
                  type: 'email',
                  message: t(MSG[C1003]),
                },
                disableSpace(form, 'email'),
              ]}
            >
              <InputField
                widthFull
                className="!w-[275px]"
                placeholder={'Eg. johnsmith@sample.com'}
                name="email"
              />
            </Form.Item>
          </Form>
          <ButtonContained
            buttonType={'type1'}
            fullWidth
            loading={isLoading}
            className={`mt-[275px] max-sm:w-[272px] !w-[212px]`}
            onClick={() => {
              form.submit();
            }}
          >
            {t('forgot.sendCode')}
          </ButtonContained>
        </>
      ) : (
        <div className="flex flex-col justify-between min-h-[calc(100vh-100px)] md:min-h-[400px]">
          <div className="flex justify-center flex-col">
            <span className="modal-title">{t('forgot.sameEmailTitle')}</span>
            <span className="modal-des">{t('forgot.sameEmailSubtitle')}</span>
          </div>
          <div className="flex gap-[20px] flex-col items-center">
            <ButtonContained
              onClick={() => handleSelectRoleSubmit(TypeRole.FAN)}
              className={`max-sm:w-[272px] !w-[212px]`}
              buttonType={'type2'}
            >
              {t('forgot.fan')}
            </ButtonContained>
            <ButtonContained
              onClick={() => handleSelectRoleSubmit(TypeRole.ORGANIZER)}
              className={`max-sm:w-[272px] !w-[212px]`}
              buttonType={'type1'}
            >
              {t('forgot.organizer')}
            </ButtonContained>
          </div>
        </div>
      )}
    </>
  );
};

interface IVerificationForm {
  isError?: boolean;
  onChange: (code: string) => void;
  onResend: () => void;
  onSend: () => void;
  isLoading: boolean;
  isLoadingResend: boolean;
  email: string;
  code: string;
}

const VerificationForm = ({
  isError,
  onChange,
  onSend,
  onResend,
  isLoading,
  isLoadingResend,
  email,
  code,
}: IVerificationForm) => {
  const [targetDate, setTargetDate] = useState<number>(new Date().getTime());
  const [activeResent, setActiveResend] = useState(false);

  const { t } = useTranslation();

  function onResendCode() {
    setActiveResend(false);
    setTargetDate(new Date().getTime() + 20 * 1000);
    onResend();
  }

  return (
    <>
      <p className="modal-title">{t('forgot.verifyYourEmail')}</p>
      <p className="modal-des w-full md:w-[400px]">
        {t('forgot.enterThe6Digit', { email: email })}
      </p>
      <Verification className="input-verification" onChange={onChange} isError={isError} />

      <ButtonContained
        buttonType="type1"
        className="mb-[10px] mt-[315px] !w-[212px] max-sm:w-[272px]"
        fullWidth
        onClick={onSend}
        loading={isLoading}
        disabled={code?.length < 6}
      >
        {t('forgot.verifyCode')}
      </ButtonContained>
      <ButtonContained
        fullWidth
        onClick={onResendCode}
        buttonType="type2"
        className="btn-resend !w-[212px] flex max-sm:w-[272px]"
        disabled={!activeResent}
        loading={isLoadingResend}
      >
        <>
          {!activeResent ? (
            <span className="flex">
              <p className="mr-2">{t('forgot.resendIn')}</p>
              <CountdownTimer handleExpired={() => setActiveResend(true)} targetDate={targetDate} />
            </span>
          ) : (
            <>{t('forgot.resendCode')}</>
          )}
        </>
      </ButtonContained>
    </>
  );
};

const ResetForm = ({
  onReset,
  isLoading,
  form,
}: {
  onReset: (values: { password: string; confirmPassword: string }) => void;
  isLoading: boolean;
  form: any;
}) => {
  const { t } = useTranslation();
  return (
    <>
      <p className="modal-title">{t('forgot.createNewPassword')}</p>
      <p className="modal-des">{t('forgot.createAStrong')}</p>
      <Form
        form={form}
        name="form-forgot"
        autoComplete="off"
        onFinish={onReset}
        className="form-reset max-sm:w-[272px]"
      >
        <Form.Item
          key="password"
          name="password"
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
            label={t('forgot.newPassword')}
            type="password"
            inputType="type2"
          />
        </Form.Item>

        <Form.Item
          key="confirmPassword"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: t(MSG[C1079]) },
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
            label={t('forgot.confirmNewPassword')}
            type="password"
            inputType="type2"
          />
        </Form.Item>
      </Form>

      <ButtonContained
        className="max-sm:w-[212px] !w-[212px] mt-193px"
        buttonType="type1"
        fullWidth
        loading={isLoading}
        onClick={() => {
          form.submit();
        }}
      >
        {t('forgot.saveNewPassword')}
      </ButtonContained>
    </>
  );
};

const UpdateSuccess = ({ onSignIn }: { onSignIn: () => void }) => {
  const { t } = useTranslation();
  return (
    <>
      <p className="modal-title">{t('forgot.passwordUpdated')}</p>
      <p className="modal-des">{t('forgot.signInWithYour')}</p>
      <div className="check-box">
        <Icon component={VerificationIcon} className="icon-verification" />
      </div>
      <ButtonContained
        buttonType="type1"
        fullWidth
        onClick={onSignIn}
        className="max-sm:w-[272px] mt-[293px]"
      >
        {t('forgot.signIn')}
      </ButtonContained>
    </>
  );
};

const FormForgot = ({ roleSelect, onSignIn }: { roleSelect: TypeRole; onSignIn: () => void }) => {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [isErrorCode, setIsErrorCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formEmail] = Form.useForm();
  const [formReset] = Form.useForm();

  const [formData, setFormData] = useState<{
    email: string;
    code: string;
    role: TypeRole | null;
  }>({
    email: '',
    code: '',
    role: null,
  });

  const [sendCodeEmail, { isLoading: isLoadingResend }] = useForgotPasswordMutation();
  const [sendCodeVerify] = useVerifyForgotPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();
  // const [checkEmailExist] = useLazyCheckEmailExistedQuery();

  const { t } = useTranslation();

  const handleSendMail = async (values: { email: string; role?: string }) => {
    try {
      setIsLoading(true);
      const param: any = {
        email: values?.email,
      };
      if (values.role) {
        param.role = values.role;
      }

      await sendCodeEmail(param).unwrap();
      setFormData({ ...formData, ...param });
      ToastMessage.success(
        t('forgot.submitSuccess', {
          email: param.email,
        }),
      );
      setStep(2);
    } catch (error: any) {
      const { validator_errors } = error?.data || undefined;
      if (validator_errors) {
        formEmail.setFields([
          {
            name: 'email',
            errors: [t(MSG[validator_errors || C1001])],
          },
        ]);
        return;
      }
      ToastMessage.error(t(MSG[validator_errors || C1001]));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (code: string) => {
    setCode(code);
    setIsErrorCode(false);
  };

  const handleResendCode = async () => {
    try {
      await sendCodeEmail({ email: formData?.email, role: roleSelect }).unwrap();
      ToastMessage.success(t(MSG[C1086]));
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleSendCode = async () => {
    try {
      setIsLoading(true);
      const data: any = {
        email: formData?.email,
        code: code,
      };

      if (formData.role) {
        data.role = formData?.role;
      }

      await sendCodeVerify(data).unwrap();
      setFormData((prev) => ({ ...prev, code: code }));
      setStep(3);
      // ToastMessage.success(t(MSG[C1014]));
    } catch (error: any) {
      setIsErrorCode(true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (values: { password: string; confirmPassword: string }) => {
    try {
      setIsLoading(true);
      const data: any = {
        email: formData?.email,
        code,
      };

      if (formData.role) {
        data.role = formData?.role;
      }
      await resetPassword({ ...data, password: values?.password }).unwrap();
      setStep(4);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onSignIn && onSignIn();
    } else {
      setIsErrorCode(false);
      setStep(step - 1);
    }
  };

  const switchForm = (type: number) => {
    switch (type) {
      case 1:
        return <EmailForm form={formEmail} onSendEmail={handleSendMail} isLoading={isLoading} />;
      case 2:
        return (
          <VerificationForm
            isError={isErrorCode}
            isLoading={isLoading}
            isLoadingResend={isLoadingResend}
            email={formData?.email}
            code={code}
            onChange={handleChange}
            onResend={handleResendCode}
            onSend={handleSendCode}
          />
        );
      case 3:
        return <ResetForm form={formReset} onReset={handleResetPassword} isLoading={isLoading} />;
      case 4:
        return <UpdateSuccess onSignIn={onSignIn} />;
      default:
        return;
    }
  };

  const renderForm = useMemo(() => {
    return switchForm(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, code, isErrorCode, isLoading, isLoadingResend, step]);

  return (
    <div className="forgot-container">
      {step < 3 && (
        <button className="absolute top-0 left-0" onClick={handleBack}>
          <BackIcon />
        </button>
      )}
      <div className="forgot-container-form">{renderForm}</div>
    </div>
  );
};

export default FormForgot;
