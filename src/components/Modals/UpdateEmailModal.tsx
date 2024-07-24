import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { C1001, C1003, C1004, C1011, C1100, MSG } from 'src/constants/errorCode';
import { disableSpace } from 'src/helpers';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getIsLoading } from 'src/store/selectors/auth';
import { setIsLoading } from 'src/store/slices/auth';
import { useUpdateUserInfoMutation } from 'src/store/slices/profile/api';
import { useLazyCheckEmailExistedQuery } from 'src/store/slices/user/api';
import ModalComponent from '.';
import ButtonContained from '../Buttons/ButtonContained';
import InputField from '../Inputs';
import './styles/updateEmail.scss';
import { useEffect } from 'react';
import { useWeb3Auth } from 'src/web3Auth/Web3AuthProvider';
import { getUserInfo } from 'src/store/selectors/user';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { logout } from 'src/store/slices/user';
import { useHistory } from 'react-router-dom';
import { PATHS } from 'src/constants/paths';
import { baseQueryApi } from 'src/store/baseQueryApi';
import { useRudderStack } from 'src/rudderstack';
import { ToastMessage } from 'src/components/Toast';

interface IUpdateEmailModal {
  onClose?: () => void;
  isOpen: boolean;
}

const UpdateEmailModal = ({ onClose, isOpen }: IUpdateEmailModal) => {
  const [updateUserInfo] = useUpdateUserInfoMutation();
  const [checkEmailExist] = useLazyCheckEmailExistedQuery();
  const { web3Auth } = useWeb3Auth();
  const userInfo = useAppSelector(getUserInfo);
  const { disconnect } = useWallet();
  const history = useHistory();
  const { rudderAnalytics } = useRudderStack();

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(getIsLoading);

  const { t } = useTranslation();

  const handleLogOut = async () => {
    if (userInfo?.loginMethod === 'wallet') {
      await disconnect();
      localStorage.removeItem('AptosWalletName');
    } else {
      web3Auth?.logout();
    }
    dispatch(logout());
    history.replace(PATHS.events);
    dispatch(baseQueryApi.util.resetApiState());

    // logout rudder stack
    if (rudderAnalytics) {
      rudderAnalytics.identify('', { isLoggedIn: false });
      rudderAnalytics.reset();
    }
    // end logout rudder stack

    ToastMessage.success(t(MSG[C1100]));
  };
  const handleUpdateEmail = async (values: { email: string }) => {
    try {
      dispatch(setIsLoading(true));
      const res = await checkEmailExist({
        email: values?.email,
      }).unwrap();
      if (res?.data?.isExisted) {
        form.setFields([
          {
            name: 'email',
            errors: [t(MSG[C1011])],
          },
        ]);
        return;
      }
      await updateUserInfo({ email: values?.email }).unwrap();
      // await sendVerifyCode({
      //   email: values?.email,
      // }).unwrap();
      onClose && onClose();
      // ToastMessage.success('Update email successfully');
    } catch (err: any) {
      const validator_errors = err?.data?.validator_errors;
      if (validator_errors) {
        form.setFields([
          {
            name: 'email',
            errors: [t(MSG[validator_errors || C1001])],
          },
        ]);
        return;
      }
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
    }
  }, [isOpen]);

  return (
    <ModalComponent open={isOpen} isClose={false} centered>
      <div className="update-container">
        <p className="update-container-title text-black">{t('signIn.yourSignUpIsAlmost')}</p>
        <p className="update-container-des text-black">{t('signIn.yourDetailsWithHelp')}</p>

        <Form form={form} autoComplete="off" name="update-email" onFinish={handleUpdateEmail}>
          <Form.Item
            key="email"
            name="email"
            rules={[
              { required: true, message: t(MSG[C1004]) },
              {
                type: 'email',
                message: t(MSG[C1003]),
              },
              disableSpace(form, 'email'),
            ]}
            className="update-container-input"
          >
            <InputField
              widthFull
              placeholder={t('signIn.emailWalletPlaceholder')}
              label={t('signIn.emailWallet')}
              inputType="type2"
              name="email"
            />
          </Form.Item>
        </Form>

        <ButtonContained
          buttonType="type1"
          className="update-container-btn"
          loading={isLoading}
          onClick={() => {
            form.submit();
          }}
        >
          {t('signIn.continue')}
        </ButtonContained>
        <ButtonContained
          buttonType="type2"
          className="update-container-btn2"
          loading={isLoading}
          onClick={() => {
            handleLogOut();
          }}
        >
          {t('signIn.loginWithAnotherAccount')}
        </ButtonContained>
      </div>
    </ModalComponent>
  );
};

export default UpdateEmailModal;
