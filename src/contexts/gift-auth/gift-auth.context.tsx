import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getAccessToken } from 'src/store/selectors/user';
import { useClientCheckUserAlreadyMutation } from 'src/store/slices/app/api';
import { setDefaultForm, setOpenSignIn } from 'src/store/slices/auth';
import { TypeForm } from 'src/store/slices/user/types';
import { createSafeContext } from '../safe-context/createSafeContext';
import { useHistory } from 'react-router-dom';
interface IGiftAuthContextValue {
  cb?: () => void;
  isRegister?: boolean;
  isLogin?: boolean;
}

interface IGiftAuthContextProps {
  children?: React.ReactNode;
}

export const [GiftAuthProvider, useGiftAuthContext] = createSafeContext<IGiftAuthContextValue>();

export const GiftAuth = ({ children }: IGiftAuthContextProps) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const accessToken = useAppSelector(getAccessToken);
  const [checkUserAlready] = useClientCheckUserAlreadyMutation();
  const history = useHistory();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParam = new URLSearchParams(window.location.search);
      const hasGiftingCode = searchParam.get('giftCode');
      if (hasGiftingCode) {
        checkAlreadyUser(hasGiftingCode);
      }
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      setIsLogin(true);
    }
  }, [accessToken]);

  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    const isGifting = url.get('giftCode');
    if (isLogin && !!isGifting?.length) {
      history.push(`/my-events`, { replace: true });
    }
  }, [isLogin]);

  const checkAlreadyUser = async (token: string) => {
    const { data } = await checkUserAlready({ token }).unwrap();
    if (!accessToken) {
      dispatch(setOpenSignIn(true));
    }

    if (data.isRegister) {
      dispatch(setDefaultForm(TypeForm.LOGIN));
    } else {
      dispatch(setDefaultForm(TypeForm.FAN_SIGNUP));
    }
    return data;
  };

  const valuesMemoized = useMemo(
    () => ({
      isRegister: false,
      isLogin: false,
    }),
    [],
  );

  return (
    <GiftAuthProvider value={valuesMemoized}>
      <>{children}</>
    </GiftAuthProvider>
  );
};
