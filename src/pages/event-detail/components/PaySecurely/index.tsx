import { Divider } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { USDCIcon } from 'src/assets/icons';
import { APTCoin } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import SwitchField from 'src/components/Switch';
import { ToastMessage } from 'src/components/Toast';
import { PATHS } from 'src/constants/paths';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import './styles.scss';
import { SupportedToken } from '../..';

interface PaySecurelyProps {
  onPayStripe: () => void;
  onPayCrypto: (token: SupportedToken) => void;
  isLoadingStripe: boolean;
  isLoadingCrypto: boolean;
}

const PaySecurely = (props: PaySecurelyProps) => {
  const { onPayStripe, onPayCrypto } = props;

  const [agreeTerm, setAgreeTerm] = useState(false);
  const [selectedToken, setSelectedToken] = useState('');
  // const [agreeRefund, setAgreeRefund] = useState(false);

  const loginMethod = useAppSelector(getUserInfo)?.loginMethod;
  const { t } = useTranslation();

  const handCheckTerm = (e: boolean) => {
    setAgreeTerm(e);
  };
  // const handCheckRefund = (e: boolean) => {
  //   setAgreeRefund(e);
  // };

  const handlePayment = (paymentMethod: any, token?: SupportedToken) => {
    if (agreeTerm) {
      paymentMethod(token);
      if (token) {
        setSelectedToken(token);
      }
    } else {
      ToastMessage.error('Please accept the terms');
    }
  };

  return (
    <div className="pay-securely flex flex-col items-center justify-center mt-[20px]">
      <div className="text-[#121313] w-full flex flex-col items-center">
        <p className="text-[24px] font-normal text-center md:w-[460px] w-full">
          {t('purchaseTicket.paySecurely')}
        </p>
        <p className="text-[14px] font-normal md:w-[460px] w-full text-center">
          {t('purchaseTicket.reviewOurTermsAndConditions')}
        </p>
      </div>
      <div className="pt-[40px]">
        <div className="mb-[20px]">
          <SwitchField onChange={handCheckTerm} checked={agreeTerm}>
            <p className="term-note">
              {t('purchaseTicket.iAcceptThe')}{' '}
              <a
                href={`${import.meta.env.VITE_SITE_URI}${PATHS.Term}`}
                className="text-green underline underline-offset-4 hover:text-green/80 hover:underline hover:underline-offset-4"
                target="_blank"
                rel="noreferrer"
              >
                {t('purchaseTicket.termsOfUser')}
              </a>
            </p>
          </SwitchField>
        </div>
        {/* <div className="mb-[20px]"> //temporary hide this button
          <SwitchField onChange={handCheckRefund} checked={agreeRefund}>
            <p className="term-note">
              {t('purchaseTicket.iAcceptThe')}{' '}
              <a
                // href={`${process.env.VITE_SITE_URI}${PATHS.Term}`}
                className="text-green underline underline-offset-4 hover:text-green/80 hover:underline hover:underline-offset-4"
                target="_blank"
              >
                {t('purchaseTicket.refundPolicy')}
              </a>
            </p>
          </SwitchField>
        </div> */}
        <Divider className="divider" />
      </div>
      <div className="px-0 flex flex-col items-center">
        <ButtonContained
          className="md:w-[375px] w-[272px]"
          onClick={() => handlePayment(onPayStripe)}
          loading={props?.isLoadingStripe}
          // disabled={!agreeTerm || !agreeRefund}
          disabled={!agreeTerm}
          buttonType="type5"
        >
          {t('purchaseTicket.payWithStripe')}
        </ButtonContained>

        <ButtonContained
          className="md:w-[375px] w-[272px] relative mt-2"
          buttonType="type1"
          onClick={() => handlePayment(onPayCrypto, SupportedToken.USDC)}
          loading={props?.isLoadingCrypto && selectedToken === SupportedToken.USDC}
          // disabled={!agreeTerm || !agreeRefund || loginMethod !== 'wallet'}
          disabled={!agreeTerm || loginMethod !== 'wallet'}
        >
          <div className="flex absolute left-3">
            <img src={USDCIcon} alt="" />
          </div>
          <p className="text-[16px] text-black font-medium">{t('purchaseTicket.payWithUSDC')}</p>
        </ButtonContained>
        <ButtonContained
          className="md:w-[375px] w-[272px] relative mt-2"
          buttonType="type1"
          onClick={() => handlePayment(onPayCrypto, SupportedToken.APT)}
          loading={props?.isLoadingCrypto && selectedToken === SupportedToken.APT}
          // disabled={!agreeTerm || !agreeRefund || loginMethod !== 'wallet'}
          disabled={!agreeTerm || loginMethod !== 'wallet'}
        >
          <div className="flex absolute left-3">
            <img src={APTCoin} alt="" />
          </div>
          <p className="text-[16px] text-black font-medium">{t('purchaseTicket.payWithAPT')}</p>
        </ButtonContained>
      </div>
    </div>
  );
};

export default PaySecurely;
