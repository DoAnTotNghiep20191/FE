import ModalComponent from '..';
import VerificationSignUp from '../../ModalSignIn/VerificationSignUp';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';

const VerifyEmailModal = () => {
  const userInfo = useAppSelector(getUserInfo);

  const open = userInfo?.status === 'pending' && !!userInfo?.email;

  return (
    <ModalComponent
      centered
      open={open}
      zIndex={70}
      width={684}
      isClose={false}
      destroyOnClose
      className="relative"
    >
      {open && (
        <VerificationSignUp
          open={open}
          email={userInfo?.email || ''}
          isSignUp={true}
          isRedirectToWeb3Auth={false}
        />
      )}
    </ModalComponent>
  );
};

export default VerifyEmailModal;
