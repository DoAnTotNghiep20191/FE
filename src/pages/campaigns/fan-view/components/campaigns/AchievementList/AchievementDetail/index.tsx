import StarMedal from 'src/assets/icons/campaigns/large-star-medal.png';
import MereoLogo from 'src/assets/icons/campaigns/large-mereo-logo.png';
import SBTImage from 'src/assets/icons/campaigns/SBT-image.png';
import ArrowLeft from 'src/assets/icons/common/arrow-left.svg?react';
import { AchievementsResponse, EChallengeDifficulty } from 'src/store/slices/campaign/types';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import SilverTrophy from 'src/assets/icons/campaigns/silver-trophy-xl.svg?react';
import GoldenTrophy from 'src/assets/icons/campaigns/golden-trophy-xl.svg?react';
import BronzeTrophy from 'src/assets/icons/campaigns/bronze-trophy-xl.svg?react';
import SBT from 'src/assets/icons/campaigns/SBT-xl.svg?react';

import './styles.scss';
const trophyMap = {
  [EChallengeDifficulty.SBT]: SBT,
  [EChallengeDifficulty.EASY]: BronzeTrophy,
  [EChallengeDifficulty.MEDIUM]: SilverTrophy,
  [EChallengeDifficulty.HARD]: GoldenTrophy,
};

interface Props {
  data: AchievementsResponse;
  nextable: boolean;
  backable: boolean;
  onNextItem: () => void;
  onBackItem: () => void;
}
const AchievementDetail = ({ data, onNextItem, onBackItem, nextable, backable }: Props) => {
  const { t } = useTranslation('campaigns');
  const Icon = trophyMap[data.challenge.difficulty]
    ? trophyMap[data.challenge.difficulty]
    : trophyMap[EChallengeDifficulty.EASY];

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex gap-[20px]">
        <div className="flex items-center w-[20px]">
          {backable && <ArrowLeft onClick={onBackItem} className="cursor-pointer" />}
        </div>
        <div className="achievement-wrapper grow achievement-item aspect-[6/9] w-[100%]  p-[4px] rounded-[6px]">
          <div
            className={`w-[100%] h-[100%] flex flex-col items-center justify-center gap-[10px] rounded-[6px] relative ${data.challenge.difficulty === EChallengeDifficulty.SBT ? 'bg-blue6C' : 'bg-red1'}`}
          >
            <div className="absolute top-[10px] left-[10px]">
              <Icon />
            </div>
            <img
              src={data.challenge.difficulty === EChallengeDifficulty.SBT ? SBTImage : StarMedal}
            />
            <img src={MereoLogo} />
          </div>
        </div>
        <div className="flex items-center  w-[20px]">
          {nextable && <ArrowLeft onClick={onNextItem} className="rotate-180 cursor-pointer" />}
        </div>
      </div>
      <div className="flex flex-col items-start ml-[40px] gap-[20px]">
        {data.challenge.difficulty !== EChallengeDifficulty.SBT && (
          <div className="flex flex-col">
            <span className="uppercase text-[12px] text-[#5C5C5C] tracking-[2px]">
              {t('difficulty')}
            </span>
            <span className="text-[14px] text-[#5C5C5C]">{data?.challenge?.difficulty || ''}</span>
          </div>
        )}

        <div className="flex flex-col">
          <span className="uppercase text-[12px] text-[#5C5C5C] tracking-[2px]">
            {t('campaign')}
          </span>
          <span className="text-[14px] text-[#5C5C5C]">{data?.campaign?.name || ''}</span>
        </div>
        <div className="flex flex-col">
          <span className="uppercase text-[12px] text-[#5C5C5C] tracking-[2px]">
            {data.challenge.difficulty === EChallengeDifficulty.SBT
              ? t('campaigns:rank')
              : t('challenge')}
          </span>
          <span className="text-[14px] text-[#5C5C5C]">{data?.challenge?.type || ''}</span>
        </div>
        <div className="flex flex-col">
          <span className="uppercase text-[12px] text-[#5C5C5C] tracking-[2px]">
            {t('dateRedeemed')}
          </span>
          <span className="text-[14px] text-[#5C5C5C]">
            {dayjs(data.createdAt).format('DD/MM/YY')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AchievementDetail;
