import './styles.scss';
import StarMedal from 'src/assets/icons/campaigns/star-medal.png';
import SBTImage from 'src/assets/icons/campaigns/SBT-image.png';
import MereoLogo from 'src/assets/icons/campaigns/mereo-logo.png';
import { AchievementsResponse, EChallengeDifficulty } from 'src/store/slices/campaign/types';
import SilverTrophy from 'src/assets/icons/campaigns/trophy1.svg?react';
import GoldenTrophy from 'src/assets/icons/campaigns/trophy2.svg?react';
import BronzeTrophy from 'src/assets/icons/campaigns/trophy3.svg?react';
import SBT from 'src/assets/icons/campaigns/trophy3.svg?react';

interface Props {
  onClick: (data: AchievementsResponse) => void;
  data: AchievementsResponse;
}

const trophyMap = {
  [EChallengeDifficulty.SBT]: SBT,
  [EChallengeDifficulty.EASY]: BronzeTrophy,
  [EChallengeDifficulty.MEDIUM]: SilverTrophy,
  [EChallengeDifficulty.HARD]: GoldenTrophy,
};

const AchievementItem = ({ onClick, data }: Props) => {
  const Icon = trophyMap[data.challenge.difficulty]
    ? trophyMap[data.challenge.difficulty]
    : trophyMap[EChallengeDifficulty.EASY];

  return (
    <div
      onClick={() => onClick(data)}
      className={`achievement-item h-[171px] flex flex-col items-center justify-center gap-[10px] cursor-pointer relative ${data.challenge.difficulty === EChallengeDifficulty.SBT ? 'bg-blue6C' : 'bg-red1'}`}
    >
      <div className="absolute top-[5px] left-[5px]">
        <Icon />
      </div>
      <img src={data.challenge.difficulty === EChallengeDifficulty.SBT ? SBTImage : StarMedal} />
      <img src={MereoLogo} />
    </div>
  );
};

export default AchievementItem;
