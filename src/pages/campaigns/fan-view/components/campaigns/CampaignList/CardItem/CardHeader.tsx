import { Image } from 'antd';
import dayjs from 'dayjs';
import { CardEventImgDetail } from 'src/assets/icons';
import './styles.scss';
import { secondOfDay } from 'src/constants';
import { useTranslation } from 'react-i18next';
import OverflowTooltipV2 from 'src/components/OverflowTooltip/OverflowTooltipV2';
interface Props {
  avatarUrl: string;
  campaignName: string;
  description: string;
  endDate: string;
  startDate: string;
}

const secondOfHours = 3600;
const secondOfMinutes = 60;

const convertTime = (seconds: number) => {
  if (seconds > secondOfDay) {
    return Math.ceil(seconds / secondOfDay) + 'd';
  } else if (seconds > secondOfHours) {
    return Math.ceil(seconds / secondOfHours) + 'h';
  } else if (seconds > secondOfMinutes) {
    return Math.ceil(seconds / secondOfMinutes) + 'm';
  } else if (seconds > 0) {
    return '1m';
  }
  return 0;
};

export const getTimeText = (startDate: string, endDate: string, t: any) => {
  const startIn = dayjs(startDate).diff(dayjs(), 'second');
  const endIn = dayjs(endDate).diff(dayjs(), 'second');

  if (startIn > 0) {
    return t('beginIn') + ' ' + convertTime(startIn);
  } else if (endIn > 0) {
    return t('timeLeft') + ' ' + convertTime(endIn);
  } else {
    return t('ended') + ' ' + convertTime(-endIn) + ' ' + t('ago');
  }
};

const CardHeader = ({ avatarUrl, campaignName, description, endDate, startDate }: Props) => {
  const { t } = useTranslation('campaigns');
  return (
    <div className="flex text-white card-header gap-[10px] max-w-[100%]">
      <div className="flex items-center">
        <Image
          preview={false}
          width={30}
          height={30}
          src={avatarUrl}
          fallback={CardEventImgDetail}
        />
      </div>
      <div className="flex gap-[10px] grow max-w-[calc(100%-30px)]">
        <div className="flex flex-col w-[100%] grow max-w-[calc(100%-70px)]">
          <OverflowTooltipV2 className="w-[100%] truncate" title={campaignName}>
            <span className="uppercase break-all">{campaignName}</span>
          </OverflowTooltipV2>
          <span className="text-[10px] break-all ">{description}</span>
        </div>
        <div className=" items-end w-[70px]">
          <span className="text-[10px]">{getTimeText(startDate, endDate, t)}</span>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
