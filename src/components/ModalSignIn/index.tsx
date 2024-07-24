import { useEffect, useMemo, useState } from 'react';
import ModalComponent from 'src/components/Modals';
import { TypeForm, TypeRole } from 'src/store/slices/user/types';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WIDTH_FORM_MODAL, WIDTH_FORM_MODAL_2 } from 'src/constants';
import { useConnectModal } from '../ContextProvider/WalletContextProvider';
import FormForgot from './FormForgot';
import FormLogin from './FormLogin';
import FromSignUp from './FromSignUp';
import LoginSocial, { getIdFromPath } from './LoginSocial';
import VerificationSignUp from './VerificationSignUp';
import './styles/index.scss';
import { useLocation } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  roleDefault?: TypeRole;
  typeFormDefault?: TypeForm;
  onClose: () => void;
}

const ModalSignIn: React.FC<Props> = ({ isOpen, roleDefault, typeFormDefault, onClose }: Props) => {
  const [roleUser, setRoleUser] = useState(TypeRole?.FAN);
  const [typeForm, setTypeForm] = useState(TypeForm.LOGIN);
  const [oldForm, setOldForm] = useState<TypeForm | null>(null);
  const [currentEmail, setCurrentEmail] = useState('');
  const { setOpenConnect } = useConnectModal();
  const { account, disconnect } = useWallet();
  const location = useLocation();

  async function handleLoginWc() {
    if (account?.address) {
      try {
        await disconnect();
      } catch (err) {
        console.error(err);
      }
      setOpenConnect(true);
    } else {
      setOpenConnect(true);
    }
  }

  useEffect(() => {
    if (roleDefault && typeFormDefault) {
      setRoleUser(roleDefault);
      setTypeForm(typeFormDefault);
    }
  }, [roleDefault, typeFormDefault]);

  const handleBackToSelect = () => {
    onClose();
    // setTypeForm(TypeForm.SELECT);
  };

  const handleRedirectSignUp = () => {
    setTypeForm(TypeForm.SIGN_UP);
  };

  const handleBackToLogin = () => {
    setTypeForm(TypeForm.LOGIN);
  };

  const handleBackOtherSocial = () => {
    setTypeForm(oldForm || TypeForm.LOGIN);
  };

  const handleLoginOtherSocial = () => {
    setOldForm(typeForm);
    setTypeForm(TypeForm.SOCIALS);
  };

  const handleRedirectForgot = () => {
    setTypeForm(TypeForm.FORGOT);
  };

  const handleNextVerify = (email: string) => {
    setCurrentEmail(email);
    setTypeForm(TypeForm.VERIFICATION);
  };

  const withModal = useMemo(() => {
    if (
      typeForm === TypeForm.SOCIALS ||
      typeForm === TypeForm.FORGOT ||
      typeForm === TypeForm.VERIFICATION
    ) {
      return WIDTH_FORM_MODAL_2;
    } else {
      return WIDTH_FORM_MODAL;
    }
  }, [typeForm]);

  const switchForm = (type: TypeForm) => {
    switch (type) {
      // case TypeForm.SELECT:
      //   return (
      //     <SelectRole
      //       roleSelect={roleUser}
      //       onChangeRole={handleChangeRole}
      //       onContinue={handleSelectContinue}
      //       onClose={onClose}
      //     />
      //   );
      case TypeForm.LOGIN:
        return (
          <FormLogin
            eventId={getIdFromPath(location.pathname)}
            selectRole={roleUser}
            onBack={handleBackToSelect}
            onRedirectSignUp={handleRedirectSignUp}
            onLoginOtherSocial={handleLoginOtherSocial}
            onWalletConnect={handleLoginWc}
            onForgot={handleRedirectForgot}
            onRedirectVerify={handleNextVerify}
          />
        );
      case TypeForm.SIGN_UP:
      case TypeForm.FAN_SIGNUP:
        return (
          <FromSignUp
            selectRole={roleUser}
            onBack={handleBackToLogin}
            onToLogin={handleBackToLogin}
            onLoginOtherSocial={handleLoginOtherSocial}
            onWalletConnect={handleLoginWc}
            onNextVerify={handleNextVerify}
          />
        );
      case TypeForm.SOCIALS:
        return <LoginSocial onBack={handleBackOtherSocial} />;
      case TypeForm.VERIFICATION:
        return (
          <VerificationSignUp
            email={currentEmail}
            onBack={() => {
              onClose();
            }}
            selectRole={roleUser}
            isSignUp={true}
            isRedirectToWeb3Auth={true}
          />
        );
      case TypeForm.FORGOT:
        return <FormForgot onSignIn={handleBackToLogin} roleSelect={roleUser} />;
      // default:
      // return (
      //   <SelectRole
      //     roleSelect={roleUser}
      //     onChangeRole={handleChangeRole}
      //     onContinue={handleSelectContinue}
      //   />
      // );
    }
  };

  const renderModalFrom = useMemo(() => {
    return switchForm(typeForm);
  }, [typeForm, roleUser, account]);

  return (
    <ModalComponent
      open={isOpen}
      onCancel={() => {
        onClose();
        setTypeForm(TypeForm.LOGIN);
      }}
      centered
      zIndex={70}
      width={withModal}
      isClose={true}
      destroyOnClose
      className="relative"
      rootClassName={`${typeForm === TypeForm.SELECT ? 'sign-in' : ''}`}
    >
      {renderModalFrom}
    </ModalComponent>
  );
};

export default ModalSignIn;
