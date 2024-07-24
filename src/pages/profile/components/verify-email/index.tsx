import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VerificationSignUp from 'src/components/ModalSignIn/VerificationSignUp';
import ModalComponent from 'src/components/Modals';
import { ToastMessage } from 'src/components/Toast';
import { C1001, MSG } from 'src/constants/errorCode';
import NotificationModal from 'src/pages/event-detail/components/NotificationModal';
import { useUpdateUserInfoMutation } from 'src/store/slices/profile/api';
import { TypeRole } from 'src/store/slices/user/types';
import './styles.scss';

interface IVerificationEmail {
  email: string;
  isOpen: boolean;
  selectRole: TypeRole;
  handleBack: () => void;
  onclose: () => void;
}

const VerificationEmail = ({ email, isOpen, selectRole, onclose }: IVerificationEmail) => {
  const { t } = useTranslation();
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [updateInfoEmail] = useUpdateUserInfoMutation();

  const handleVerifySuccess = async (email: string) => {
    try {
      await updateInfoEmail({ email: email }).unwrap();
      setVerifySuccess(true);
    } catch (err: any) {
      const validator_errors = err?.data?.validator_errors;
      ToastMessage.error(t(MSG[validator_errors || C1001]));
    }
  };

  return !verifySuccess ? (
    <ModalComponent open={isOpen} centered width={574} onCancel={onclose}>
      <div className="flex w-full verify-email-popup">
        <VerificationSignUp
          email={email}
          isSignUp={false}
          verifySuccess={handleVerifySuccess}
          selectRole={selectRole}
          onBack={onclose}
        />
      </div>
    </ModalComponent>
  ) : (
    <NotificationModal
      isOpen={isOpen}
      title={t('profile.emailUpdate')}
      description={t('profile.yourNewEmail', { email: email })}
      textButton="Close"
      onButton={onclose}
      onClose={onclose}
    />
  );
};

export default VerificationEmail;
