import { QRCode } from 'antd';
import { SmallLogo } from 'src/assets/icons';
import './styles.scss';
import { useCountdown } from 'src/hooks/useCountdown';
import BigNumber from 'bignumber.js';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface QRCodeProps {
  link: string;
  className?: string;
  lastTime?: number;
  onTimeEnd?: () => void;
  isScan?: boolean;
  error?: boolean;
}
const minimumCountdown = -1713845681834;

const TicketQRCode = (props: QRCodeProps) => {
  const { link, className, lastTime, onTimeEnd, isScan, error } = props;
  const { t } = useTranslation();
  const [days, hours, minutes, seconds, countDown] = useCountdown(
    BigNumber((lastTime || 0) + Number(import.meta.env.VITE_QR_EXPIRED_TIME))
      .multipliedBy(1000)
      .toNumber(),
  );

  useEffect(() => {
    if (minutes <= 0 && seconds <= 0 && !isScan && countDown >= minimumCountdown) {
      onTimeEnd?.();
    }
  }, [minutes, seconds, isScan, countDown]);

  return (
    <div
      className={`pt-[20px] pb-[10px] gap-1 flex flex-col rounded-[10px] justify-center items-center ${className}`}
    >
      <div
        className={`relative w-[230px] ${isScan ? 'h-[258px]' : 'h-[278px]'} bg-[#FFDB00] ${isScan ? 'pt-[16px]' : 'pt-[10px]'} px-[16px]`}
      >
        {!isScan && (
          <div className="flex text-[16px] justify-center pb-[5px]">
            <span>
              {t('myTicket.qrExpired')} {minutes > 0 ? minutes : 0}:{seconds > 0 ? seconds : 0}
            </span>
          </div>
        )}

        {!isScan && error && (
          <div className="z-[10000] absolute top-[45%] w-[100%] right-[0] flex justify-center items-center">
            <div className="bg-[#656565] px-[20px] py-[14px] text-[#FFFFFF] rounded-[30px]">
              <span>{t('myTicket.refreshError')}</span>
            </div>
          </div>
        )}
        <div className="w-[200px] h-[200px] bg-white">
          <QRCode value={link || ''} size={200} className="border-0 m-auto" />
        </div>
        <SmallLogo className="mt-[8px] mx-auto" />
      </div>
    </div>
  );
};

export default TicketQRCode;
